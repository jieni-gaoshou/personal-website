import { callAiApi } from "./cloudbase";

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIResult {
  success: boolean;
  content?: string;
  error?: string;
  usage?: { total_tokens: number };
  model?: string;
}

// ========== 公开能力 ==========

/** 游客聊天：通过云函数调用 AI */
export async function chatWithAI(messages: AIMessage[]): Promise<AIResult> {
  try {
    const res = await callAiApi("chat", { messages });
    if (res.success && res.content) return res;
    return { success: false, error: res.error || "AI 服务暂不可用" };
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || JSON.stringify(e),
    };
  }
}

// ========== 管理后台写作助手 ==========

/** 根据主题生成完整文章 */
export async function aiWrite(topic: string, context?: string): Promise<AIResult> {
  try {
    const res = await callAiApi("write", { topic, context });
    if (res.success && res.content) return res;
    return { success: false, error: res.error || "写作助手暂不可用" };
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || JSON.stringify(e),
    };
  }
}

export async function aiPolish(content: string): Promise<AIResult> {
  try {
    const res = await callAiApi("polish", { content });
    if (res.success && res.content) return res;
    return { success: false, error: res.error || "润色服务暂不可用" };
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || JSON.stringify(e),
    };
  }
}

export async function aiOutline(topic: string): Promise<AIResult> {
  try {
    const res = await callAiApi("outline", { topic });
    if (res.success && res.content) return res;
    return { success: false, error: res.error || "大纲生成暂不可用" };
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || JSON.stringify(e),
    };
  }
}

export async function aiExcerpt(content: string): Promise<AIResult> {
  try {
    const res = await callAiApi("excerpt", { content });
    if (res.success && res.content) return res;
    return { success: false, error: res.error || "摘要生成暂不可用" };
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || JSON.stringify(e),
    };
  }
}