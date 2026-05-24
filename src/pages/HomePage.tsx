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
        {/* Cyberpunk scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyberpink/40 to-transparent animate-scan-line" />
        </div>
        {/* Floating orbs with animation */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-neon/5 blur-[100px] animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-electric/5 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plasma/10 blur-[80px] animate-drift" style={{ animationDelay: "4s" }} />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 110, 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyberpink/20" />
        <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-electric/20" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-electric/20" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyberpink/20" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-36">
        <div className="grid gap-12 md:grid-cols-12 items-center">
          {/* Left: Text */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyberpink/30 bg-cyberpink/5 px-4 py-1.5 font-mono text-xs text-cyberpink mb-8 opacity-0 animate-fade-in">
              <i className="fa-solid fa-satellite text-[10px] animate-pulse"></i>
              <span className="tracking-widest">EST. 2026 · ON AIR</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cybergreen animate-pulse" />
            </div>

            <h1 className="font-orbitron text-5xl font-black leading-tight md:text-7xl tracking-tight">
              <span className="block text-white opacity-0 animate-slide-right">
                探索
              </span>
              <span className="block hero-gradient opacity-0 animate-slide-right anim-delay-1">
                代码与思想
              </span>
              <GlitchText className="block text-cyberpink animate-flicker opacity-0 animate-slide-right anim-delay-2" enableGlitch={true}>
                的无限宇宙
              </GlitchText>
            </h1>

            {/* Typing effect */}
            <div className="mt-6 font-mono text-sm text-gray-400 opacity-0 animate-fade-in anim-delay-3 h-6">
              <i className="fa-solid fa-terminal text-cyberpink/50 mr-2"></i>
              <span className="text-cybergreen">{displayText}</span>
              <span className="typewriter-cursor" />
            </div>

            <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-gray-500 opacity-0 animate-fade-in anim-delay-3">
              {siteConfig.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 opacity-0 animate-slide-up anim-delay-4">
              <MagneticButton>
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-3 rounded-lg bg-cyberpink px-6 py-3 font-mono text-sm font-bold text-white shadow-cyberpink/25 transition-all hover:bg-cyberpink/90 hover:shadow-cyberpink/40 hover:scale-105 active:scale-95 animate-pulse-glow"
                >
                  阅读文章
                  <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>
              </MagneticButton>
              <RippleButton variant="secondary">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 px-6 py-3 font-mono text-sm text-electric transition-all hover:text-cyberpink"
                >
                  了解更多
                  <i className="fa-solid fa-user-astronaut text-xs"></i>
                </Link>
              </RippleButton>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8 opacity-0 animate-fade-in anim-delay-5">
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-cyberpink neon-text">{posts.length}+</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">篇文章</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-electric neon-text-cyan">{siteConfig.stats.commits}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">次提交</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-cybergreen">{siteConfig.stats.projects}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1 tracking-wider">个项目</div>
              </div>
              <div className="text-center">
                <div className="font-orbitron text-2xl font-bold text-cyberyellow">{siteConfig.stats.techStacks}</div>
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
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyberpink/30 to-transparent" />
          <h2 className="font-orbitron text-lg font-bold tracking-widest text-white whitespace-nowrap">
            <i className="fa-solid fa-star text-cyberpink mr-2 animate-pulse"></i>
            精选文章
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyberpink/30 to-transparent" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group opacity-0 animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <GlassCard3D className="h-full p-6 flex flex-col animate-pulse-glow">
                <HolographicEffect intensity="low">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyberpink/10 text-cyberpink group-hover:bg-cyberpink group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <i className={`${post.icon} text-xl`}></i>
                  </div>
                  <h3 className="font-orbitron text-base font-semibold text-white group-hover:text-cyberpink transition-colors mb-3">
                    {post.title}
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-gray-500 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[10px] text-gray-600 tracking-wider">
                      {post.date}
                    </span>
                    <span className="font-mono text-[10px] text-electric/70">
                      {post.readTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[9px] text-cyberpink/50 tracking-wider">
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
            className="inline-flex items-center gap-2 font-mono text-sm text-cyberpink hover:text-electric transition-colors group"
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
