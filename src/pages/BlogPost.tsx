import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { callBlogApi } from "../lib/cloudbase";
import fallbackPosts, { type BlogPost as BlogPostData } from "../data/posts";
import TableOfContents from "../components/TableOfContents";


const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostData | undefined>(() =>
    fallbackPosts.find((p) => p.id === id)
  );
  const [prevPost, setPrevPost] = useState<BlogPostData | undefined>(undefined);
  const [nextPost, setNextPost] = useState<BlogPostData | undefined>(undefined);
  const [allPosts, setAllPosts] = useState<BlogPostData[]>(fallbackPosts);

  // 从云端加载文章数据
  useEffect(() => {
    const loadPost = async () => {
      try {
        // 先加载列表以获取上下篇
        const listRes = await callBlogApi("list", { pageSize: 100 });
        if (listRes.success && Array.isArray(listRes.data)) {
          const posts = listRes.data as BlogPostData[];
          setAllPosts(posts);
        }

        // 加载当前文章（含完整内容）
        const res = await callBlogApi("get", { id });
        if (res.success && res.data) {
          setPost(res.data as BlogPostData);
        }
      } catch {
        console.log("使用本地数据（云端不可用）");
        setPost(fallbackPosts.find((p) => p.id === id));
        setAllPosts(fallbackPosts);
      }
    };
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ASTRO BLOG`;
    } else {
      document.title = "文章不存在 | ASTRO BLOG";
    }
  }, [post]);

  // 计算上下篇
  useEffect(() => {
    const index = allPosts.findIndex((p) => p.id === id);
    setPrevPost(index > 0 ? allPosts[index - 1] : undefined);
    setNextPost(index < allPosts.length - 1 ? allPosts[index + 1] : undefined);
  }, [allPosts, id]);

  if (!post) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="diagonal-stripe absolute inset-0" />
        </div>
        <div className="relative text-center">
          <i className="fa-solid fa-meteor text-6xl text-neon/30 mb-6 block animate-float"></i>
          <h1 className="font-orbitron text-3xl text-white mb-4">404</h1>
          <p className="font-mono text-gray-500 mb-8">
            这颗星球似乎不存在...
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-neon/30 px-5 py-2.5 font-mono text-sm text-neon hover:bg-neon/10 transition-all"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  // 为 react-markdown 中的标题分配与 parseHeadings 一致的 ID（基于文本 slug）
  const headingTextRef = useRef<string[]>([]);

  // 切换文章时重置
  useEffect(() => {
    headingTextRef.current = [];
  }, [post?.id]);

  const getHeadingId = useCallback((text: string) => {
    const slug = text
      .toLowerCase()
      .replace(/[\s\n\r]+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug;
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="diagonal-stripe absolute inset-0" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyberpink/3 blur-[100px] animate-float" />
        <div
          className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-electric/3 blur-[80px] animate-float"
          style={{ animationDelay: "3s" }}
        />
        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-cyberpink/20" />
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-electric/20" />
      </div>

      {/* Table of Contents - Sidebar */}
      <TableOfContents content={post.content} />

      <article className="relative mx-auto max-w-3xl px-6 py-20">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-gray-600 hover:text-neon transition-colors mb-8 group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          返回文章列表
        </Link>

        {/* Header */}
        <header className="mb-12 opacity-0 animate-slide-up">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-cyberpink/15 bg-cyberpink/5 px-2.5 py-0.5 font-mono text-[10px] text-cyberpink/70 tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 font-mono text-xs text-gray-600 tracking-wider">
            <span>
              <i className="fa-solid fa-calendar text-cyberpink/40 mr-1.5"></i>
              {post.date}
            </span>
            <span>
              <i className="fa-solid fa-clock text-electric/40 mr-1.5"></i>
              {post.readTime || "5 分钟"}
            </span>
          </div>
          <div className="mt-6 h-[1px] bg-gradient-to-r from-cyberpink/30 via-electric/30 to-transparent" />
        </header>

        {/* Content */}
        <div className="article-content font-mono text-sm leading-relaxed prose-invert opacity-0 animate-fade-in anim-delay-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => {
                const text = Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : '').join('') : '';
                return (
                  <h2 id={getHeadingId(text)} className="article-content-h2" {...props}>{children}</h2>
                );
              },
              h3: ({ children, ...props }) => {
                const text = Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : '').join('') : '';
                return (
                  <h3 id={getHeadingId(text)} className="article-content-h3" {...props}>{children}</h3>
                );
              },
              p: ({ children, ...props }) => (
                <p className="article-content-p" {...props}>{children}</p>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="text-cyan bg-deepblue/30 px-1 rounded" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children, ...props }) => (
                <pre className="article-content-pre" {...props}>{children}</pre>
              ),
              strong: ({ children, ...props }) => (
                <strong className="text-white" {...props}>{children}</strong>
              ),
              em: ({ children, ...props }) => (
                <em className="text-gray-300" {...props}>{children}</em>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote className="border-l-2 border-neon/40 pl-4 my-4 font-mono text-sm text-gray-400 italic" {...props}>
                  {children}
                </blockquote>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc list-inside space-y-1 my-3" {...props}>{children}</ul>
              ),
              li: ({ children, ...props }) => (
                <li className="text-gray-400" {...props}>{children}</li>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-16 pt-8 border-t border-navy/30 grid grid-cols-2 gap-4 opacity-0 animate-fade-in anim-delay-5">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.id}`}
              className="group flex flex-col gap-1 rounded-lg border border-navy/30 p-4 hover:border-neon/30 hover:bg-neon/5 transition-all text-left"
            >
              <span className="font-mono text-[10px] text-gray-600 tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-arrow-left text-[8px]"></i>
                上一篇
              </span>
              <span className="font-mono text-xs text-gray-400 group-hover:text-neon transition-colors line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.id}`}
              className="group flex flex-col gap-1 items-end rounded-lg border border-navy/30 p-4 hover:border-cyan/30 hover:bg-cyan/5 transition-all text-right"
            >
              <span className="font-mono text-[10px] text-gray-600 tracking-wider flex items-center gap-1">
                下一篇
                <i className="fa-solid fa-arrow-right text-[8px]"></i>
              </span>
              <span className="font-mono text-xs text-gray-400 group-hover:text-cyan transition-colors line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Footer tools */}
        <div className="mt-8 pt-6 border-t border-navy/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-navy/40 px-5 py-2.5 font-mono text-xs text-gray-400 hover:border-neon/30 hover:text-neon transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
              全部文章
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 font-mono text-xs text-gray-600 hover:text-cyan transition-colors"
            >
              <i className="fa-solid fa-arrow-up"></i>
              回到顶部
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
