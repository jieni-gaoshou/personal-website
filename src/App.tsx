import { lazy, Suspense, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
// 首页首屏关键路径——立即加载
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StarBackground from "./components/StarBackground";
import CustomCursor from "./components/CustomCursor";
import ReadingProgress from "./components/ReadingProgress";
import ScrollToTop from "./components/ScrollToTop";
import ParticleField from "./components/ParticleField";

// 非首屏页面——按需懒加载
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AIChat = lazy(() => import("./pages/AIChat"));

/** 页面加载时的闪烁骨架屏 */
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-sm text-gray-600">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neon/50" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan/50" style={{ animationDelay: "0.15s" }} />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neon/30" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}

// 键盘快捷键提示 Toast
function KeyboardToast({ shortcut, label, onClose }: { shortcut: string; label: string; onClose: () => void }) {
  return (
    <div className="keyboard-toast" onClick={onClose}>
      <span className="text-neon font-bold">{shortcut}</span>
      <span className="ml-2 text-gray-400">→ {label}</span>
    </div>
  );
}

function App() {
  const [toast, setToast] = useState<{ shortcut: string; label: string } | null>(null);

  // 键盘快捷键：G + H/B/A 导航
  useEffect(() => {
    let gPressed = false;
    let timer: ReturnType<typeof setTimeout>;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!gPressed) {
          gPressed = true;
          timer = setTimeout(() => { gPressed = false; }, 1000);
        }
      } else if (gPressed) {
        const routes: Record<string, string> = { h: "首页", b: "博客", a: "关于" };
        const path = routes[e.key.toLowerCase()];
        if (path) {
          window.location.hash = path === "首页" ? "#/" : path === "博客" ? "#/blog" : "#/about";
          setToast({ shortcut: `G + ${e.key.toUpperCase()}`, label: path });
          gPressed = false;
          clearTimeout(timer);
          setTimeout(() => setToast(null), 2000);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ThemeProvider>
    <Router>
      <div className="relative flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] theme-transition">
        <StarBackground />
        <ParticleField />
        <CustomCursor />
        <ReadingProgress />
        <Navbar />
        <main className="relative z-10 grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/ai" element={<AIChat />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
        {/* Vignette and Toast */}
        <div className="vignette" />
        {toast && <KeyboardToast shortcut={toast.shortcut} label={toast.label} onClose={() => setToast(null)} />}
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
