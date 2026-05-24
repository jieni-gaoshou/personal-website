const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({});
const db = app.database();
const _ = db.command;

const ADMIN_KEY = process.env.ADMIN_KEY || "blog-admin-key-2026";

function checkAdmin(event) {
  return event.adminKey === ADMIN_KEY;
}

// 列出所有文章（公开）
async function listPosts(event) {
  const { page = 1, pageSize = 50, tag } = event;
  const skip = (page - 1) * pageSize;

  let query = db.collection("blog_posts");

  if (tag && tag !== "全部") {
    query = query.where({ tags: _.in([tag]) });
  }

  const result = await query
    .orderBy("date", "desc")
    .skip(skip)
    .limit(pageSize)
    .field({
      content: false, // 列表不返回完整内容，节省流量
    })
    .get();

  const countResult = await db.collection("blog_posts").count();

  return {
    success: true,
    data: result.data,
    total: countResult.total,
    page,
    pageSize,
  };
}

// 获取单篇文章（公开）
async function getPost(event) {
  const { id } = event;
  if (!id) return { success: false, error: "缺少文章 ID" };

  const result = await db
    .collection("blog_posts")
    .where({ id })
    .limit(1)
    .get();

  if (!result.data || result.data.length === 0) {
    return { success: false, error: "文章不存在" };
  }

  return { success: true, data: result.data[0] };
}

// 保存文章（创建或更新，需管理员权限）
async function savePost(event) {
  if (!checkAdmin(event)) {
    return { success: false, error: "权限不足" };
  }

  const { post } = event;
  if (!post || !post.id || !post.title || !post.content) {
    return { success: false, error: "文章信息不完整（id/title/content 必填）" };
  }

  const existing = await db
    .collection("blog_posts")
    .where({ id: post.id })
    .limit(1)
    .get();

  const doc = {
    ...post,
    updatedAt: new Date().toISOString(),
  };

  if (!doc.createdAt && (!existing.data || existing.data.length === 0)) {
    doc.createdAt = new Date().toISOString();
    doc.date = doc.date || new Date().toISOString().slice(0, 10);
    doc.readTime = doc.readTime || "5 分钟";
    doc.tags = doc.tags || ["随笔"];
    doc.icon = doc.icon || "fa-solid fa-feather";
  }

  if (existing.data && existing.data.length > 0) {
    // 更新
    await db
      .collection("blog_posts")
      .where({ id: post.id })
      .update(doc);
    return { success: true, action: "updated", data: doc };
  } else {
    // 创建
    const result = await db.collection("blog_posts").add(doc);
    return { success: true, action: "created", data: { ...doc, _id: result._id } };
  }
}

// 删除文章（需管理员权限）
async function deletePost(event) {
  if (!checkAdmin(event)) {
    return { success: false, error: "权限不足" };
  }

  const { id } = event;
  if (!id) return { success: false, error: "缺少文章 ID" };

  await db.collection("blog_posts").where({ id }).remove();
  return { success: true, message: "文章已删除" };
}

// 验证管理员密钥（登录用）
async function verifyAdmin(event) {
  return {
    success: checkAdmin(event),
    message: checkAdmin(event) ? "验证成功" : "密钥错误",
  };
}

// 获取所有标签（公开）
async function getAllTags() {
  const result = await db
    .collection("blog_posts")
    .field({ tags: true })
    .get();

  const tagSet = new Set();
  (result.data || []).forEach((post) => {
    (post.tags || []).forEach((t) => tagSet.add(t));
  });

  return {
    success: true,
    data: ["全部", ...Array.from(tagSet)],
  };
}

// 种子数据
async function seedPosts(event) {
  if (!checkAdmin(event)) {
    return { success: false, error: "权限不足" };
  }

  const existing = await db.collection("blog_posts").count();
  if (existing.total > 0) {
    return { success: false, error: "数据库已有数据，请先清空再导入" };
  }

  const seedData = event.posts || [];
  if (seedData.length === 0) {
    return { success: false, error: "没有提供种子数据" };
  }

  for (const post of seedData) {
    await db.collection("blog_posts").add({
      ...post,
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return { success: true, message: `成功导入 ${seedData.length} 篇文章` };
}

// ========== 主入口 ==========
exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case "list":
        return await listPosts(event);
      case "get":
        return await getPost(event);
      case "save":
        return await savePost(event);
      case "delete":
        return await deletePost(event);
      case "verifyAdmin":
        return await verifyAdmin(event);
      case "tags":
        return await getAllTags();
      case "seed":
        return await seedPosts(event);
      default:
        return {
          success: false,
          error: `未知操作: ${action}`,
          availableActions: [
            "list",
            "get",
            "save",
            "delete",
            "verifyAdmin",
            "tags",
            "seed",
          ],
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "服务器内部错误",
    };
  }
};
