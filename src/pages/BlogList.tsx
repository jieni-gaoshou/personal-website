import { Link } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import { callBlogApi } from "../lib/cloudbase";
import fallbackPosts, { type BlogPost } from "../data/posts";

const CACHE_KEY = "blog_list_cache";
const CACHE_TS_KEY = "blog_list_cache_ts";
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

const BlogList = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("全部");
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    // 初始化时从缓存恢复（避免首次空白）
    try {
      const ts = sessionStorage.getItem(CACHE_TS_KEY);
      if (ts && Date.now() - Number(ts) < CACHE_TTL) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) return JSON.parse(cached) as BlogPost[];
      }
    } catch { /* ignore */ }
    return fallbackPosts;
  });
  const [apiTags, setApiTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 从云端加载文章列表
  const loadPosts = useCallback(async () => {
    try {
      const res = await callBlogApi("list", { pageSize: 100 });
      if (res.success && Array.isArray(res.data) && (res.data as BlogPost[]).length > 0) {
        const data = res.data as BlogPost[];
        setPosts(data);
        // 缓存到 sessionStorage
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
          sessionStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch { /* ignore */ }
      }
    } catch {
      console.log("使用本地/缓存数据（云端不可用）");
    }
    setLoading(false);
  }, []);

  // 加载标签列表
  const loadTags = useCallback(async () => {
    try {
      const res = await callBlogApi("tags");
      if (res.success && Array.isArray(res.data)) {
        setApiTags(res.data as string[]);
      }
    } catch {
      // 忽略
    }
  }, []);

  useEffect(() => {
    document.title = "文章列表 | ASTRO BLOG";
    loadPosts();
    loadTags();
  }, [loadPosts, loadTags]);

  // 提取所有标签（云端+本地合并）
  const allTags = useMemo(() => {
    const tagSet = new Set<string>(apiTags);
    posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    const sorted = Array.from(tagSet).filter((t) => t !== "全部");
    return ["全部", ...sorted];
  }, [posts, apiTags]);

  // 筛选文章
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchTag = activeTag === "全部" || (post.tags || []).includes(activeTag);
      const matchSearch =
        search.trim() === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        (post.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchTag && matchSearch;
    });
  }, [posts, activeTag, search]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="diagonal-stripe absolute inset-0" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyberpink/5 blur-[80px] animate-float" />
        <div
          className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-electric/5 blur-[100px] animate-float"
          style={{ animationDelay: "3s" }}
        />
        {/* Cyberpunk grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(255, 0, 110, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-12 text-center opacity-0 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyberpink/20 bg-cyberpink/5 px-4 py-1.5 font-mono text-xs text-cyberpink mb-6">
            <i className="fa-solid fa-newspaper text-[10px]"></i>
            <span className="tracking-widest">ALL POSTS</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">
              {loading ? "..." : posts.length} 篇
            </span>
          </div>
          <h1 className="font-orbitron text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-white">文章</span>
            <span className="text-cyberpink neon-text">列表</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-gray-500">
            <i className="fa-solid fa-quote-left text-cyberpink/40 mr-2"></i>
            每一篇文章，都是向宇宙发出的一束光
            <i className="fa-solid fa-quote-right text-cyberpink/40 ml-2"></i>
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-10 space-y-5 opacity-0 animate-fade-in anim-delay-2">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm"></i>
            <input
              type="text"
              placeholder="搜索文章..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-navy/40 bg-navy/40 backdrop-blur-md px-10 py-2.5 font-mono text-sm text-gray-300 placeholder-gray-600 outline-none transition-all focus:border-neon/40 focus:shadow-lg focus:shadow-neon/5"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-neon transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`tag-pill ${activeTag === tag ? "active" : ""}`}
              >
                {tag === "全部" && <i className="fa-solid fa-grid-2 text-[9px] mr-0.5"></i>}
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card flex flex-col md:flex-row gap-6 p-6 animate-pulse">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-neon/10" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-navy/60" />
                  <div className="h-4 w-full rounded bg-navy/40" />
                  <div className="h-4 w-1/2 rounded bg-navy/40" />
                  <div className="flex gap-4">
                    <div className="h-3 w-16 rounded bg-navy/30" />
                    <div className="h-3 w-12 rounded bg-navy/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 opacity-0 animate-fade-in">
            <i className="fa-solid fa-meteor text-5xl text-neon/20 mb-4 block"></i>
            <p className="font-mono text-gray-500">没有找到匹配的文章</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveTag("全部");
              }}
              className="mt-4 text-neon font-mono text-sm hover:underline"
            >
              清除筛选
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group glass-card neon-border flex flex-col md:flex-row gap-6 p-6 opacity-0 animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${0.3 + (index % 8) * 0.08}s` }}
              >
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                {/* Icon */}
                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-neon/10 text-neon group-hover:bg-neon group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <i className={`${post.icon || "fa-solid fa-feather"} text-xl`}></i>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="font-orbitron text-lg font-semibold text-white group-hover:text-neon transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-gray-500 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 font-mono text-[10px] text-gray-600 tracking-wider">
                    <span>
                      <i className="fa-solid fa-calendar text-neon/40 mr-1.5"></i>
                      {post.date}
                    </span>
                    <span>
                      <i className="fa-solid fa-clock text-cyan/40 mr-1.5"></i>
                      {post.readTime || "5 分钟"}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <i className="fa-solid fa-tag text-neon/30 text-[9px]"></i>
                      {(post.tags || []).join(" · ")}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center text-gray-600 group-hover:text-neon transition-all duration-300 group-hover:translate-x-1">
                  <i className="fa-solid fa-chevron-right text-lg"></i>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Post count */}
        {filteredPosts.length > 0 && (
          <p className="mt-8 text-center font-mono text-xs text-gray-700 tracking-wider opacity-0 animate-fade-in anim-delay-6">
            共 {filteredPosts.length} 篇文章
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
