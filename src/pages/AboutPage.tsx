import { useEffect, useState } from "react";
import posts from "../data/posts";
import { siteConfig } from "../lib/siteConfig";
import { callBlogApi } from "../lib/cloudbase";

const AboutPage = () => {
  const [postCount, setPostCount] = useState(posts.length);

  useEffect(() => {
    document.title = "关于我 | ASTRO BLOG";
  }, []);

  // 动态获取实际文章数（云端优先）
  useEffect(() => {
    (async () => {
      try {
        const res = await callBlogApi("list", { pageSize: 1 });
        if (res.success && typeof res.total === "number") {
          setPostCount(res.total);
        }
      } catch {
        // 回退到本地数据
      }
    })();
  }, []);

  const skills = [
    { name: "React / Vue", level: 95, icon: "fa-brands fa-react" },
    { name: "TypeScript", level: 90, icon: "fa-solid fa-code" },
    { name: "Tailwind / CSS", level: 88, icon: "fa-solid fa-wind" },
    { name: "Node.js / API", level: 85, icon: "fa-brands fa-node-js" },
    { name: "CloudBase", level: 80, icon: "fa-solid fa-cloud" },
    { name: "Python / AI", level: 75, icon: "fa-brands fa-python" },
  ];

  const milestones = [
    {
      year: "2026",
      title: "博客启航",
      desc: "在数字宇宙中建立自己的星际基站，开始记录技术与生活。",
      icon: "fa-solid fa-rocket",
      color: "neon",
    },
    {
      year: "2025",
      title: "全栈进阶",
      desc: "深入 CloudBase 云开发，掌握从前端到部署的完整链路。",
      icon: "fa-solid fa-layer-group",
      color: "cyan",
    },
    {
      year: "2024",
      title: "React 深耕",
      desc: "系统学习 React 生态，参与开源项目，输出技术文章。",
      icon: "fa-brands fa-react",
      color: "deepblue",
    },
    {
      year: "2023",
      title: "前端入门",
      desc: "从 HTML/CSS 到 JavaScript，正式踏入前端开发的世界。",
      icon: "fa-solid fa-code",
      color: "gray",
    },
  ];

  const stats = [
    { label: "文章发布", value: postCount, icon: "fa-solid fa-newspaper" },
    { label: "代码提交", value: "1.2k+", icon: "fa-solid fa-code-commit" },
    { label: "开源项目", value: "8", icon: "fa-solid fa-cube" },
    { label: "技术栈", value: skills.length, icon: "fa-solid fa-layer-group" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="diagonal-stripe absolute inset-0" />
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyberpink/5 blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-electric/3 blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyberpink/20" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-electric/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-electric/20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyberpink/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center opacity-0 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/5 px-4 py-1.5 font-mono text-xs text-electric mb-6">
            <i className="fa-solid fa-user-astronaut text-[10px]"></i>
            <span className="tracking-widest">ABOUT ME</span>
          </div>
          <h1 className="font-orbitron text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-white">关于</span>
            <span className="text-cyberpink neon-text">我</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-gray-500">
            一个热爱技术、热爱生活的开发者
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-5">
          {/* Avatar & Intro */}
          <div className="md:col-span-2 opacity-0 animate-slide-right">
            <div className="glass-card p-8 text-center animate-pulse-glow">
              {/* Avatar */}
              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyberpink/20 via-plasma/20 to-electric/20 border-2 border-cyberpink/20 relative group">
                <i className="fa-solid fa-user-astronaut text-5xl text-cyberpink/60 group-hover:scale-110 transition-transform duration-500"></i>
                {/* Orbit ring */}
                <div className="absolute inset-0 rounded-full border border-cyberpink/10 animate-spin" style={{ animationDuration: "8s" }} />
                {/* Glow pulse */}
                <div className="absolute inset-0 rounded-full bg-cyberpink/10 animate-ping" style={{ animationDuration: "2s" }} />
              </div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-2">
                {siteConfig.author}
              </h2>
              <p className="font-mono text-xs text-electric mb-5">
                {siteConfig.authorRole}
              </p>
              <p className="font-mono text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                {siteConfig.authorBio}
              </p>

              {/* Stats grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-cyberpink/20 bg-cyberpink/5 p-3 hover:border-cyberpink/40 transition-colors"
                  >
                    <div className="font-orbitron text-lg font-bold text-cyberpink">
                      {stat.value}
                    </div>
                    <div className="font-mono text-[9px] text-gray-600 mt-0.5 tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-6 flex justify-center gap-4">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy/40 text-gray-500 hover:border-cyberpink/40 hover:text-cyberpink hover:shadow-lg hover:shadow-cyberpink/10 transition-all hover:-translate-y-0.5"
                  aria-label="GitHub"
                >
                  <i className="fa-brands fa-github text-lg"></i>
                </a>
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy/40 text-gray-500 hover:border-electric/40 hover:text-electric hover:shadow-lg hover:shadow-electric/10 transition-all hover:-translate-y-0.5"
                  aria-label="Twitter"
                >
                  <i className="fa-brands fa-x-twitter text-lg"></i>
                </a>
                <a
                  href={siteConfig.social.email}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy/40 text-gray-500 hover:border-cyberpink/40 hover:text-cyberpink hover:shadow-lg hover:shadow-cyberpink/10 transition-all hover:-translate-y-0.5"
                  aria-label="Email"
                >
                  <i className="fa-solid fa-envelope text-lg"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Skills & Timeline */}
          <div className="md:col-span-3 opacity-0 animate-slide-up anim-delay-2 space-y-6">
            {/* Skills */}
            <div className="glass-card p-8">
              <h3 className="font-orbitron text-lg font-bold text-white mb-8 flex items-center gap-3">
                <i className="fa-solid fa-bolt text-neon animate-pulse-neon"></i>
                技能图谱
              </h3>
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="opacity-0 animate-slide-right"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-gray-300 flex items-center gap-2">
                        <i className={`${skill.icon} text-neon/50 text-xs`}></i>
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs text-cyan/70">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-navy/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neon to-cyan transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.level}%`,
                          boxShadow: "0 0 10px rgba(139,92,246,0.3)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card p-8">
              <h3 className="font-orbitron text-lg font-bold text-white mb-8 flex items-center gap-3">
                <i className="fa-solid fa-timeline text-cyan"></i>
                成长之路
              </h3>
              <div className="relative pl-8 border-l border-navy/50 space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="relative group">
                    <div
                      className={`absolute -left-[33px] flex h-4 w-4 items-center justify-center rounded-full bg-${milestone.color === "gray" ? "[#555]" : milestone.color} ${
                        milestone.color === "neon" ? "neon-text" : milestone.color === "cyan" ? "neon-text-cyan" : ""
                      }`}
                      style={{
                        backgroundColor:
                          milestone.color === "neon"
                            ? "#8B5CF6"
                            : milestone.color === "cyan"
                            ? "#6366F1"
                            : milestone.color === "deepblue"
                            ? "#312E81"
                            : "#555",
                      }}
                    />
                    <div className="glass-card p-4 opacity-80 hover:opacity-100 transition-all hover:-translate-y-0.5">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-orbitron text-xs text-neon">
                          {milestone.year}
                        </span>
                        <span className="font-mono text-sm text-white">
                          {milestone.title}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-gray-500">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
