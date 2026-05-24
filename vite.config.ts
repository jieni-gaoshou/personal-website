import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 使用相对路径，解决静态托管部署时的资源加载问题
  server: {
    host: "127.0.0.1",
    proxy: {
      "/__auth": {
        target: "https://envId-appid.tcloudbaseapp.com/",
        changeOrigin: true,
      },
    },
    allowedHosts: true,
  },
  build: {
    // 目标现代浏览器，减少 polyfill 体积
    target: "es2022",
    // CSS 代码分割
    cssCodeSplit: true,
    // chunk 大小警告阈值 (KB)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 精细的代码分割策略
        manualChunks(id) {
          // React 核心库单独打包（变化少，缓存久）
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@cloudbase/js-sdk")) {
            return "vendor-cloudbase";
          }
          if (id.includes("node_modules/react-markdown") || id.includes("node_modules/remark-gfm") || id.includes("node_modules/rehype-sanitize")) {
            return "vendor-markdown";
          }
          // 博客数据独立 chunk
          if (id.includes("/src/data/posts")) {
            return "data-posts";
          }
        },
        // 资源命名规范（利于缓存）
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    // 启用 minify（默认 esbuild，比 terser 快 20-40 倍）
    minify: "esbuild",
    // 减少 sourcemap 体积
    sourcemap: false,
  },
  // CSS 处理优化
  css: {
    devSourcemap: false,
  },
});
