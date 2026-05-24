/** 站点统一配置 —— 社交链接、个人信息等集中管理
 *  修改这里的值即可全局生效，无需逐个页面修改
 */

export const siteConfig = {
  // === 基本信息 ===
  author: "前端探险家",
  title: "ASTRO BLOG",
  subtitle: "探索代码与思想的无限宇宙",
  description: "一个前端开发者的星际日志。记录技术探索、设计思考与生活观察。",
  siteUrl: "https://astro-blog.example.com", // 部署后替换为实际域名

  // === 作者信息 ===
  authorBio:
    "热爱技术，沉迷于创造优美的数字体验。\n目前专注于 React 生态、TypeScript 和 CloudBase 云开发。相信好的代码就像好的文章——简洁、有力、令人愉悦。",
  authorRole: "Full-Stack Developer",
  authorAvatar: "", // 留空则使用 Font Awesome 图标

  // === 社交链接（部署前请替换为你的实际链接） ===
  social: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@example.com",
  },

  // === 统计信息（可自定义） ===
  stats: {
    commits: "1.2k+",
    projects: "8",
    techStacks: "6",
  },

  // === 导航 ===
  navLinks: [
    { to: "/", label: "首页", icon: "fa-solid fa-house" },
    { to: "/blog", label: "文章", icon: "fa-solid fa-newspaper" },
    { to: "/ai", label: "AI 舱", icon: "fa-solid fa-robot" },
    { to: "/about", label: "关于", icon: "fa-solid fa-user-astronaut" },
  ],

  // === 管理后台默认密钥（部署后请通过环境变量 ADMIN_KEY 修改） ===
  defaultAdminKey: import.meta.env.VITE_ADMIN_KEY as string || "blog-admin-key-2026",

  // === 站点标签 ===
  established: "2026",
} as const;

export default siteConfig;
