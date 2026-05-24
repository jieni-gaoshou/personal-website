import cloudbase from "@cloudbase/js-sdk";

const ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID as string || "";

// 懒初始化：避免模块 import 时 cloudbase.init() 抛错导致整页崩溃
let _app: ReturnType<typeof cloudbase.init> | null = null;
let _authPromise: Promise<void> | null = null;

export function getApp() {
  if (!_app) {
    _app = cloudbase.init({ env: ENV_ID, region: "ap-shanghai" });
  }
  return _app;
}

/** 确保已登录（匿名），否则无法调用云函数 */
export async function ensureAuth() {
  if (!_authPromise) {
    _authPromise = (async () => {
      const app = getApp();
      const auth = app.auth();
      try {
        const state = await auth.getLoginState();
        if (!state) {
          await auth.signInAnonymously();
        }
      } catch {
        // 未登录就匿名登录
        await auth.signInAnonymously();
      }
    })().catch((err) => {
      // 清除缓存以便重试
      _authPromise = null;
      throw err;
    });
  }
  await _authPromise;
}

/**
 * 调用云函数 blog-api
 */
export async function callBlogApi(action: string, params: Record<string, unknown> = {}) {
  await ensureAuth();
  const result = await getApp().callFunction({
    name: "blog-api",
    data: { action, ...params },
  });
  return result.result as {
    success: boolean;
    data?: unknown;
    error?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    action?: string;
    message?: string;
  };
}

/**
 * 调用云函数 ai-api（含错误处理，返回结构化结果）
 */
export async function callAiApi(action: string, params: Record<string, unknown> = {}): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    await ensureAuth();
    const result = await getApp().callFunction({
      name: "ai-api",
      data: { action, ...params },
    });
    return result.result as { success: boolean; content?: string; error?: string };
  } catch (e: unknown) {
    // CloudBase SDK 抛出的错误可能是对象
    const err = e as Record<string, unknown>;
    return {
      success: false,
      error: (err?.message as string) || (err?.code as string) || JSON.stringify(e),
    };
  }
}

export default getApp;
