import { useEffect, useState } from "react";
import { parseHeadings, type HeadingItem } from "../lib/parseHeadings";

const TableOfContents = ({ content }: { content: string }) => {
  const [items, setItems] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setItems(parseHeadings(content));
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    // Observe article headings - use slug-based IDs to match parseHeadings
    const article = document.querySelector(".article-content");
    if (article) {
      const headings = article.querySelectorAll("h2, h3");
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || "";
          const slug = text.toLowerCase().replace(/[\s\n\r]+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "");
          heading.id = slug;
        }
        observer.observe(heading);
      });
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length < 2) return null;

  return (
    <nav className="hidden xl:block fixed right-[max(2rem,calc((100vw-1200px)/2-200px))] top-32 max-w-[180px] opacity-0 animate-fade-in anim-delay-3">
      <div className="glass-card p-4">
        <h4 className="font-orbitron text-xs text-cyan tracking-widest mb-3 flex items-center gap-2">
          <i className="fa-solid fa-list-ul text-[10px]"></i>
          目录
        </h4>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left font-mono text-xs transition-all duration-200 truncate ${
                  item.level === 3 ? "pl-3" : ""
                } ${
                  activeId === item.id
                    ? "text-neon font-medium"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                style={{
                  borderLeft:
                    activeId === item.id
                      ? "2px solid #8B5CF6"
                      : "2px solid transparent",
                  paddingLeft: item.level === 3 ? "16px" : "4px",
                }}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
