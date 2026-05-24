const https = require("https");

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_BASE = "https://api.minimax.chat/v1/text/chatcompletion_v2";

function httpRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on("error", reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function callMiniMax(messages, options = {}) {
  const body = {
    model: options.model || "MiniMax-M2.5",
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens || 2048,
    stream: false,
  };

  const url = new URL(MINIMAX_BASE);
  const result = await httpRequest(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MINIMAX_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
    body
  );

  if (result.status !== 200) {
    return { success: false, error: `MiniMax API error: ${result.status}`, detail: result.data };
  }

  const choice = result.data.choices?.[0];
  if (!choice?.message?.content) {
    return { success: false, error: "MiniMax returned empty response" };
  }

  return {
    success: true,
    content: choice.message.content,
    usage: result.data.usage,
    model: result.data.model,
  };
}

// ============ 公开聊天（游客使用，有系统 prompt 约束）============
const VISITOR_SYSTEM_PROMPT = `你是"星际驿站"博客的 AI 助手，名字叫"星语"。你生活在一艘名为"星际驿站"的飞船上。
性格特点：温暖、幽默、有点宅属性，喜欢用科幻和代码梗。
回复风格：简洁亲切，3-5句为宜，像朋友聊天而非客服。可以用 emoji 但不能过度。
你了解这个博客的主人是一位喜欢 Retro-Futuristic 风格的全栈开发者，兴趣爱好包括 React、AI、科幻、写作。
如果被问到不了解的内容，诚实说不知道并岔开话题到博客或编程上。`;

// ============ 写作助手（管理员使用）============
const WRITER_SYSTEM_PROMPT = `你是一位资深技术写作专家，擅长撰写技术博客文章。你的风格：
- 清晰、有深度、有趣味
- 善用比喻让复杂概念通俗易懂
- 适当引用名言和代码示例
- 中文为主，英文术语保留原文
- 段落结构分明，适合 Markdown 排版
当你生成文章时，要包含完整的 Markdown 格式，有标题、分段、代码块、引用等。`;

exports.main = async (event) => {
  const { action, messages, prompt, topic, context, content } = event;

  try {
    switch (action) {
      // 游客聊天
      case "chat": {
        if (!Array.isArray(messages) || messages.length === 0) {
          return { success: false, error: "消息不能为空" };
        }
        const chatMessages = [
          { role: "system", content: VISITOR_SYSTEM_PROMPT },
          ...messages,
        ];
        return await callMiniMax(chatMessages, { temperature: 0.8, max_tokens: 1024 });
      }

      // 写作：根据主题生成文章
      case "write": {
        if (!topic) {
          return { success: false, error: "请提供文章主题" };
        }
        const writeMessages = [
          { role: "system", content: WRITER_SYSTEM_PROMPT },
          { role: "user", content: `请帮我写一篇技术博客文章，主题是：${topic}。${context ? `\n背景/要求：${context}` : ""}\n\n要求：完整 Markdown 格式，包含标题、摘要引入、正文分段、至少一个代码示例、一句名言引用、总结。1500-3000字。` },
        ];
        return await callMiniMax(writeMessages, { temperature: 0.7, max_tokens: 4096 });
      }

      // 润色：改进已有内容
      case "polish": {
        if (!content) {
          return { success: false, error: "请提供需要润色的内容" };
        }
        const polishMessages = [
          { role: "system", content: WRITER_SYSTEM_PROMPT },
          { role: "user", content: `请润色改进以下博客文章内容，保持原意但让表达更流畅、更有感染力。直接返回润色后的 Markdown：\n\n---\n${content}\n---` },
        ];
        return await callMiniMax(polishMessages, { temperature: 0.5, max_tokens: 4096 });
      }

      // 生成大纲
      case "outline": {
        if (!topic) {
          return { success: false, error: "请提供文章主题" };
        }
        const outlineMessages = [
          { role: "system", content: WRITER_SYSTEM_PROMPT },
          { role: "user", content: `请为博客文章"${topic}"生成一个详细的大纲，包含：标题建议（2-3个）、摘要方向、3-5个核心小标题及其关键内容点。直接用 Markdown 格式输出。` },
        ];
        return await callMiniMax(outlineMessages, { temperature: 0.7, max_tokens: 2048 });
      }

      // 生成摘要
      case "excerpt": {
        if (!content) {
          return { success: false, error: "请提供文章内容" };
        }
        const excerptMessages = [
          { role: "system", content: "你是一位编辑，擅长写吸引人的文章摘要。" },
          { role: "user", content: `请为以下文章写一段 120 字以内的中文摘要，要吸引人点击阅读：\n\n${content.slice(0, 3000)}` },
        ];
        return await callMiniMax(excerptMessages, { temperature: 0.7, max_tokens: 300 });
      }

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (err) {
    console.error("ai-api error:", err);
    return { success: false, error: err.message || "AI 服务内部错误" };
  }
};
