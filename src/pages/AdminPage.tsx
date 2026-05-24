import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callBlogApi } from "../lib/cloudbase";
import { aiWrite, aiPolish, aiOutline, aiExcerpt } from "../lib/ai";
import PostEditor from "../components/admin/PostEditor";
import PostList from "../components/admin/PostList";
import AiPanel from "../components/admin/AiPanel";

interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = "blog_admin_key";

const AdminPage = () => {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formId, setFormId] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formReadTime, setFormReadTime] = useState("5 分钟");
  const [formTags, setFormTags] = useState("");
  const [formIcon, setFormIcon] = useState("fa-solid fa-feather");

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ===== Auth =====
  const handleLogin = async () => {
    if (!adminKey.trim()) return;
    setLoading(true);
    try {
      const res = await callBlogApi("verifyAdmin", { adminKey: adminKey.trim() });
      if (res.success) {
        sessionStorage.setItem(STORAGE_KEY, adminKey.trim());
        setIsLoggedIn(true);
        showMsg("success", "验证成功，欢迎回来！");
      } else {
        showMsg("error", "密钥错误，请重试");
      }
    } catch {
      showMsg("error", "网络错误，请检查云函数是否已部署");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
    setIsLoggedIn(false);
    setSelectedPost(null);
    setIsEditing(false);
    navigate("/admin");
  };

  // ===== Posts CRUD =====
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callBlogApi("list", { pageSize: 100 });
      if (res.success && Array.isArray(res.data)) {
        setPosts(res.data as BlogPost[]);
      }
    } catch {
      showMsg("error", "加载文章列表失败");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.title = isLoggedIn ? "后台管理 | ASTRO BLOG" : "管理员登录 | ASTRO BLOG";
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) loadPosts();
  }, [isLoggedIn, loadPosts]);

  const handleNewPost = () => {
    const today = new Date().toISOString().slice(0, 10);
    setSelectedPost(null);
    setFormTitle("");
    setFormId("");
    setFormExcerpt("");
    setFormContent("");
    setFormDate(today);
    setFormReadTime("5 分钟");
    setFormTags("");
    setFormIcon("fa-solid fa-feather");
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormTitle(post.title);
    setFormId(post.id);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormDate(post.date);
    setFormReadTime(post.readTime);
    setFormTags(post.tags.join(", "));
    setFormIcon(post.icon);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formId.trim() || !formContent.trim()) {
      showMsg("error", "标题、ID 和内容为必填项");
      return;
    }
    const id = formId.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const post: BlogPost = {
      id,
      title: formTitle.trim(),
      excerpt: formExcerpt.trim() || formContent.trim().slice(0, 120).replace(/\n/g, " "),
      content: formContent.trim(),
      date: formDate,
      readTime: formReadTime || "5 分钟",
      tags: formTags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      icon: formIcon || "fa-solid fa-feather",
    };
    setLoading(true);
    try {
      const res = await callBlogApi("save", { post, adminKey });
      if (res.success) {
        showMsg("success", res.action === "created" ? "文章创建成功！" : "文章更新成功！");
        setIsEditing(false);
        setSelectedPost(null);
        loadPosts();
      } else {
        showMsg("error", res.error || "保存失败");
      }
    } catch {
      showMsg("error", "保存失败，请检查网络连接");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`确定要删除文章 "${id}" 吗？此操作不可恢复。`)) return;
    setLoading(true);
    try {
      const res = await callBlogApi("delete", { id, adminKey });
      if (res.success) {
        showMsg("success", "文章已删除");
        if (selectedPost?.id === id) {
          setSelectedPost(null);
          setIsEditing(false);
        }
        loadPosts();
      } else {
        showMsg("error", res.error || "删除失败");
      }
    } catch {
      showMsg("error", "删除失败，请检查网络连接");
    }
    setLoading(false);
  };

  const handleSeed = async () => {
    if (!window.confirm("导入种子数据将清空现有内容并导入预设的10篇文章。确定继续？")) return;
    setLoading(true);
    try {
      const { default: seedPosts } = await import("../data/posts");
      const res = await callBlogApi("seed", { posts: seedPosts, adminKey });
      if (res.success) {
        showMsg("success", res.message || "导入成功");
        loadPosts();
      } else {
        showMsg("error", res.error || "导入失败");
      }
    } catch {
      showMsg("error", "导入失败");
    }
    setLoading(false);
  };

  // ===== AI Actions =====
  const handleAiAction = async (action: "write" | "polish" | "outline" | "excerpt") => {
    if ((action === "polish" || action === "excerpt") && !formContent.trim()) {
      showMsg("error", "请先在编辑器中输入内容");
      return;
    }
    if ((action === "write" || action === "outline") && !aiTopic.trim()) {
      showMsg("error", "请输入文章主题");
      return;
    }
    const labels: Record<string, string> = {
      write: "正在生成文章...", polish: "正在润色...",
      outline: "正在生成大纲...", excerpt: "正在生成摘要...",
    };
    setAiLoading(labels[action]);
    setAiOutput("");
    try {
      let result;
      switch (action) {
        case "write": result = await aiWrite(aiTopic, formExcerpt); break;
        case "polish": result = await aiPolish(formContent); break;
        case "outline": result = await aiOutline(aiTopic); break;
        case "excerpt": result = await aiExcerpt(formContent); break;
        default: return;
      }
      if (result.success && result.content) {
        if (action === "excerpt") {
          setFormExcerpt(result.content.replace(/\n/g, " ").slice(0, 200));
          showMsg("success", "摘要已生成到摘要栏");
        } else {
          setAiOutput(result.content);
          if (action === "polish") showMsg("success", "润色完成，请查看结果并决定是否应用");
        }
      } else {
        showMsg("error", result.error || "AI 生成失败");
      }
    } catch {
      showMsg("error", "AI 服务调用失败");
    }
    setAiLoading("");
  };

  const applyAiContent = (target: "content" | "outline" | "all") => {
    if (!aiOutput) return;
    switch (target) {
      case "content":
        setFormContent(aiOutput);
        break;
      case "outline":
        setFormContent((prev) => prev + "\n\n" + aiOutput);
        break;
      case "all": {
        const titleMatch = aiOutput.match(/^#\s+(.+)/m);
        if (titleMatch && !formTitle) setFormTitle(titleMatch[1]);
        const excerptMatch = aiOutput.match(/摘要[：:]\s*(.+)/);
        if (excerptMatch && !formExcerpt) setFormExcerpt(excerptMatch[1].slice(0, 200));
        setFormContent(aiOutput);
        break;
      }
    }
    showMsg("success", "已应用到编辑器");
  };

  // ========== 未登录：登录界面 ==========
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="diagonal-stripe absolute inset-0" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-neon/5 blur-[80px] animate-float" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-navy/40 bg-navy/30 backdrop-blur-xl p-8 shadow-2xl shadow-neon/5">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon/10 text-neon">
                <i className="fa-solid fa-lock text-2xl"></i>
              </div>
              <h1 className="font-orbitron text-2xl font-black text-white">后台管理</h1>
              <p className="mt-2 font-mono text-xs text-gray-500">请输入管理员密钥以继续</p>
            </div>
            <input
              type="password"
              placeholder="管理员密钥"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="mb-4 w-full rounded-lg border border-navy/40 bg-navy/60 px-4 py-3 font-mono text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-neon/40 focus:shadow-lg focus:shadow-neon/5"
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={loading || !adminKey.trim()}
              className="w-full rounded-lg bg-neon py-3 font-mono text-sm font-semibold text-white transition-all hover:bg-neon/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  验证中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-key"></i>
                  进入后台
                </span>
              )}
            </button>
            <Link to="/" className="mt-4 block text-center font-mono text-xs text-gray-600 hover:text-cyan transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i>返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========== 已登录：管理界面 ==========
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="diagonal-stripe absolute inset-0" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-neon/5 blur-[80px] animate-float" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-orbitron text-2xl font-black text-white">
              <i className="fa-solid fa-gear text-neon mr-3"></i>后台管理
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-600">管理博客文章 · 共 {posts.length} 篇</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewPost}
              className="flex items-center gap-2 rounded-lg bg-neon px-4 py-2 font-mono text-sm text-white hover:bg-neon/80 transition-all"
            >
              <i className="fa-solid fa-plus"></i>写文章
            </button>
            <button
              onClick={handleSeed}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-cyan/30 px-4 py-2 font-mono text-xs text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>导入数据
            </button>
            <Link to="/blog" className="flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-neon transition-colors">
              <i className="fa-solid fa-eye"></i>预览
            </Link>
            <button onClick={handleLogout} className="font-mono text-xs text-gray-600 hover:text-neon transition-colors">
              <i className="fa-solid fa-right-from-bracket"></i>退出
            </button>
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs transition-all ${
                showAiPanel ? "border-purple-400/50 bg-purple-500/10 text-purple-300" : "border-purple-500/20 text-purple-400/60 hover:bg-purple-500/5"
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>AI 助手
            </button>
          </div>

          {/* AI Panel */}
          <AiPanel
            show={showAiPanel}
            aiTopic={aiTopic}
            setAiTopic={setAiTopic}
            aiLoading={aiLoading}
            aiOutput={aiOutput}
            formContent={formContent}
            onAction={handleAiAction}
            onApply={applyAiContent}
            onClose={() => setShowAiPanel(false)}
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 font-mono text-sm ${
              message.type === "success" ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-neon/30 bg-neon/10 text-neon"
            }`}
          >
            <i className={`fa-solid fa-${message.type === "success" ? "check-circle" : "exclamation-circle"} mr-2`}></i>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Post Editor */}
          {isEditing && (
            <PostEditor
              formTitle={formTitle} setFormTitle={setFormTitle}
              formId={formId} setFormId={setFormId}
              formExcerpt={formExcerpt} setFormExcerpt={setFormExcerpt}
              formContent={formContent} setFormContent={setFormContent}
              formDate={formDate} setFormDate={setFormDate}
              formReadTime={formReadTime} setFormReadTime={setFormReadTime}
              formTags={formTags} setFormTags={setFormTags}
              formIcon={formIcon} setFormIcon={setFormIcon}
              selectedPost={selectedPost}
              loading={loading}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              onDelete={handleDelete}
            />
          )}

          {/* Post List */}
          <PostList
            posts={posts}
            loading={loading}
            selectedPost={selectedPost}
            isEditing={isEditing}
            onNewPost={handleNewPost}
            onEditPost={handleEditPost}
            onDeletePost={handleDelete}
            onSelectPost={setSelectedPost}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
