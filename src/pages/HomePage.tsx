import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import posts from "../data/posts";
import { siteConfig } from "../lib/siteConfig";
import GlitchText from "../components/GlitchText";
import RippleButton from "../components/RippleButton";
import MagneticButton from "../components/MagneticButton";
import GlassCard3D from "../components/GlassCard3D";
import HolographicEffect from "../components/HolographicEffect";

const typingTexts = [
  "探索代码与思想的无限宇宙",
  "在数据洪流中保持追问",
  "记录每一次灵感的闪光",
];

const HomePage = () => {
  const featuredPosts = posts.slice(0, 3);
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  // Page title
  useEffect(() => {
    document.title = "ASTRO BLOG — 星际博客 | Retro-Futuristic 技术博客";
  }, []);

  // Typing effect
  useEffect(() => {
    const currentText = typingTexts[typingIndex];
    let timeout: number;

    if (!isDeleting && charIndex < currentText.length) {
      timeout = window.setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 80);
    } else if (!isDeleting && charIndex >= currentText.length) {
      timeout = window.setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = window.setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 40);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTypingIndex((typingIndex + 1) % typingTexts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, typingIndex]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="diagonal-stripe absolute inset-0" />
        {/* Floating orbs with animation */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-neon/5 blur-[100px] animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan/5 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deepblue/10 blur-[80px] animate-float" style={{ animationDelay: "4s" }} />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-36">
        <div className="grid gap-12 md:grid-cols-12 items-center">
          {/* Left: Text */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-4 py-1.5 font-mono text-xs text-neon mb-8 opacity-0 animate-fade-in">
              <i className="fa-solid fa-satellite text-[10px] animate-pulse-neon"></i>
              <span className="tracking-widest">EST. 2026 · ON AIR</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>

            <h1 className="font-orbitron text-5xl font-black leading-tight md:text-7xl tracking-tight">
              <span className="block text-white opacity-0 animate-slide-right">
                探索
              </span>
              <span className="block hero-gradient opacity-0 animate-slide-right anim-delay-1">
                代码与思想
              </span>
              <GlitchText className="block text-cyan neon-text-cyan opacity-0 animate-slide-right anim-delay-2">
                的无限宇宙
              </GlitchText>
            </h1>

            {/* Typing effect */}
            <div className="mt-6 font-mono text-sm text-gray-400 opacity-0 animate-fade-in anim-delay-3 h-6">
              <i className="fa-solid fa-terminal text-neon/50 mr-2"></i>
              <span>{displayText}</span>
              <span className="typewriter-cursor" />
            </div>

            <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-gray-500 opacity-0 animate-fade-in anim-delay-3">
              {siteConfig.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 opacity-0 animate-slide-up anim-delay-4">
              <MagneticButton>
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-3 rounded-lg bg-neon px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-neon/25 transition-all hover:bg-neon/90 hover:shadow-neon/40 hover:scale-105 active:scale-95"
                >
                  阅读文章
                  <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>
              </MagneticButton>
              <RippleButton variant="secondary">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 px-6 py-3 font-mono text-sm text-gray-400 transition-all hover:text-neon"
                >
                  了解更多
                  <i className="fa-solid fa-user-astronaut text-xs"></i>
                </Link>
              </RippleButton>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8 opacity-0 animate-fade-in anim-delay-5">
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-neon neon-text">{posts.length}+</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">篇文章</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-cyan neon-text-cyan">{siteConfig.stats.commits}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">次提交</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-white">{siteConfig.stats.projects}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">个项目</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-purple-300/70">{siteConfig.stats.techStacks}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">技术栈</div>
              </div>
            </div>
          </div>

          {/* Right: Decorative Code Block */}
          <div className="hidden md:block md:col-span-5 opacity-0 animate-slide-up anim-delay-3">
            <div className="glass-card p-6 font-mono text-xs relative overflow-hidden group">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-neon"></span>
                <span className="h-3 w-3 rounded-full bg-cyan"></span>
                <span className="h-3 w-3 rounded-full bg-gray-600"></span>
              </div>
              <div className="space-y-1 text-gray-400">
                <p>
                  <span className="text-neon">const</span>{" "}
                  <span className="text-cyan">blog</span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-white">{'{'}</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan">name</span>:
                  <span className="text-green-400">&apos;ASTRO BLOG&apos;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-cyan">author</span>:
                  <span className="text-green-400">&apos;前端探险家&apos;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-cyan">techStack</span>:
                  <span className="text-white">{'['}</span>
                  <span className="text-green-400">&apos;React&apos;</span>,
                  <span className="text-green-400">&apos;CloudBase&apos;</span>,
                  <span className="text-green-400">&apos;Tailwind&apos;</span>
                  <span className="text-white">{']'}</span>,
                </p>
                <p className="pl-4">
                  <span className="text-cyan">mission</span>:
                  <span className="text-green-400">
                    &apos;探索代码与思想的无限宇宙&apos;
                  </span>,
                </p>
                <p>
                  <span className="text-white">{'}'}</span>;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
          <h2 className="font-orbitron text-lg font-bold tracking-widest text-white whitespace-nowrap">
            <i className="fa-solid fa-star text-neon mr-2 animate-glow"></i>
            精选文章
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group opacity-0 animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <GlassCard3D className="h-full p-6 flex flex-col">
                <HolographicEffect intensity="low">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon group-hover:bg-neon group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <i className={`${post.icon} text-xl`}></i>
                  </div>
                  <h3 className="font-orbitron text-base font-semibold text-white group-hover:text-neon transition-colors mb-3">
                    {post.title}
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-gray-500 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[10px] text-gray-600 tracking-wider">
                      {post.date}
                    </span>
                    <span className="font-mono text-[10px] text-cyan/70">
                      {post.readTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[9px] text-neon/50 tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </HolographicEffect>
              </GlassCard3D>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center opacity-0 animate-fade-in anim-delay-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-neon hover:text-cyan transition-colors group"
          >
            查看全部文章
            <i className="fa-solid fa-angles-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
