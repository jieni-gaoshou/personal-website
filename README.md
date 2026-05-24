# ASTRO BLOG

一个复古未来主义风格的技术博客，基于 React + Vite + Tailwind CSS 构建。

![Star Background](https://img.shields.io/badge/retro--futuristic-blog-8B5CF6?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 特性

- 复古未来主义（Retro-Futuristic）视觉风格
- 流畅的 Framer Motion 动画效果
- 响应式设计，支持深色模式
- 文章目录自动生成
- AI 聊天助手集成
- 管理后台支持文章 CRUD

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **样式**: Tailwind CSS + DaisyUI
- **动画**: Framer Motion
- **路由**: React Router 6 (HashRouter)
- **后端**: 腾讯云开发 CloudBase
- **MarkDown**: react-markdown + remark-gfm

## 开始使用

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_CLOUDBASE_ENV_ID=your-env-id
VITE_ADMIN_KEY=your-secure-admin-key
VITE_SITE_URL=https://your-domain.com
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 路由结构

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/blog` | 文章列表 |
| `/blog/:id` | 文章详情 |
| `/about` | 关于页面 |
| `/ai` | AI 聊天 |
| `/admin` | 管理后台 |

## 键盘快捷键

| 快捷键 | 跳转 |
|--------|------|
| `G + H` | 首页 |
| `G + B` | 博客列表 |
| `G + A` | 关于页面 |

## 项目结构

```
src/
├── components/       # 可复用组件
│   ├── admin/        # 管理后台组件
│   └── ...
├── pages/            # 页面组件
├── data/             # 静态数据
├── lib/              # 工具函数
│   ├── cloudbase.ts  # 云开发初始化
│   ├── ai.ts         # AI 服务
│   └── siteConfig.ts # 站点配置
├── App.tsx           # 应用入口
└── main.tsx          # 渲染入口
```

## 云开发配置

本项目使用腾讯云开发 CloudBase 作为后端服务。需要配置：

1. 在 [腾讯云开发控制台](https://tcb.cloud.tencent.com/) 创建环境
2. 获取环境 ID 并填入 `.env`
3. 创建 `blog-api` 和 `ai-api` 云函数

## License

MIT License - see [LICENSE](LICENSE)