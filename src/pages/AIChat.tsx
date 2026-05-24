import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithAI } from "../lib/ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `🛸 嘿，旅行者！欢迎来到**星际驿站**的 AI 舱。

我是**星语**，这艘飞船上的 AI 助手。平时帮船长写写代码、聊聊技术——但有人来访时，我最喜欢的就是和新朋友聊天！

你可以问我关于编程、技术、科幻、或者这个博客背后的故事。当然，闲聊也行，毕竟太空旅行挺寂寞的 😄

有什么想聊的吗？`,
  timestamp: Date.now(),
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "AI 舱 · 星语 | ASTRO BLOG";
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 构建上下文：最近 15 条消息
      const context = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .slice(-15)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatWithAI(context);
      if (res.success && res.content) {
        const aiMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: res.content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-err-${Date.now()}`,
            role: "assistant",
            content: `⚠️ 通讯故障：${res.error || "AI 舱暂时无法响应"}`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
      console.error("AI Chat error:", errMsg, e);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ 连接失败：${errMsg.slice(0, 200)}`,
          timestamp: Date.now(),
        },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  // 建议话题
  const suggestions = [
    "这个博客用了什么技术栈？",
    "推荐几本程序员必读的书",
    "讲一个编程冷笑话",
    "你对 AI 编程助手怎么看？",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="diagonal-stripe absolute inset-0" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-plasma/5 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-cyberpink/3 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyberpink/30 to-transparent animate-scan-line" />
        </div>
      </div>

      <div className="relative mx-auto flex h-[calc(100vh-5rem)] max-w-3xl flex-col px-4">
        {/* Header */}
        <div className="flex-shrink-0 py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyberpink/20 to-plasma/20 border border-cyberpink/20 relative">
            <i className="fa-solid fa-robot text-2xl text-cyberpink"></i>
            {/* Status indicator */}
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-cybergreen border-2 border-void animate-pulse" />
          </div>
          <h1 className="font-orbitron text-xl font-black text-white">
            AI 舱 · <span className="text-cyberpink">星语</span>
          </h1>
          <p className="mt-1 font-mono text-[10px] text-gray-600">
            星际驿站的 AI 助手 · 随时陪你聊聊
          </p>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-2">
          {/* 未开始时显示建议 */}
          {messages.length === 1 && messages[0].id === "welcome" && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 pb-4">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => sendMessage(), 50);
                  }}
                  className="rounded-full border border-cyberpink/20 bg-cyberpink/5 px-4 py-2 font-mono text-xs text-gray-400 hover:border-cyberpink/40 hover:text-cyberpink hover:bg-cyberpink/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs ${
                  msg.role === "assistant"
                    ? "bg-cyberpink/20 text-cyberpink border border-cyberpink/20"
                    : "bg-electric/20 text-electric border border-electric/20"
                }`}
              >
                <i className={`fa-solid ${msg.role === "assistant" ? "fa-robot" : "fa-user-astronaut"}`}></i>
              </div>

              {/* Bubble */}
              <div
                className={`group max-w-[75%] rounded-2xl px-4 py-3 font-mono text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-navy/40 border border-cyberpink/15 text-gray-200 rounded-tl-sm"
                    : "bg-cyberpink/10 border border-cyberpink/20 text-gray-200 rounded-tr-sm"
                } ${msg.id === "welcome" ? "animate-slide-up" : ""}`}
              >
                <div className="ai-message prose-sm prose-invert break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ children, ...props }) => (
                        <code className="bg-navy/60 px-1 rounded text-cyberpink text-xs" {...props}>
                          {children}
                        </code>
                      ),
                      strong: ({ children }) => <strong className="text-white">{children}</strong>,
                      em: ({ children }) => <em className="text-gray-300">{children}</em>,
                      del: ({ children }) => <del className="text-gray-500">{children}</del>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* 加载中 */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyberpink/20 text-cyberpink border border-cyberpink/20 text-xs">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-navy/40 border border-cyberpink/15 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyberpink/50 animate-pulse" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-cyberpink/50 animate-pulse" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-cyberpink/50 animate-pulse" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 输入区 */}
        <div className="flex-shrink-0 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-cyberpink/20 bg-navy/30 backdrop-blur-xl px-4 py-2 shadow-lg shadow-cyberpink/5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="输入消息，按 Enter 发送..."
              disabled={loading}
              className="flex-1 bg-transparent py-2 font-mono text-sm text-white placeholder-gray-600 outline-none"
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyberpink/20 text-cyberpink hover:bg-cyberpink hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className={`fa-solid ${loading ? "fa-spinner animate-spin" : "fa-paper-plane"}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AIChat;
