import { useState, useEffect } from "react";

interface GuestbookEntry {
  id: string;
  author: string;
  content: string;
  date: string;
}

const STORAGE_KEY = "blog_guestbook";

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEntries(JSON.parse(stored) as GuestbookEntry[]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setLoading(true);
    const newEntry: GuestbookEntry = {
      id: `g-${Date.now()}`,
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setTimeout(() => {
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setContent("");
      setLoading(false);
    }, 300);
  };

  return (
    <div className="mt-16 pt-8 border-t border-[var(--border-color)]">
      <h3 className="font-orbitron text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <i className="fa-solid fa-book-open text-[var(--accent-primary)]"></i>
        留言板 <span className="text-[var(--text-muted)] font-mono text-xs">({entries.length})</span>
      </h3>

      {/* Guestbook form */}
      <form onSubmit={handleSubmit} className="mb-8 glass-card p-4 rounded-xl">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的昵称"
          className="w-full mb-3 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="有什么想说的..."
          rows={2}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
        />
        <button
          type="submit"
          disabled={loading || !author.trim() || !content.trim()}
          className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white font-mono text-sm hover:opacity-80 transition-all disabled:opacity-40"
        >
          {loading ? "发送中..." : "留言"}
        </button>
      </form>

      {/* Entries list */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {entries.length === 0 ? (
          <p className="text-[var(--text-muted)] font-mono text-sm text-center py-8">
            还没有留言，写下第一条吧！
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="glass-card p-4 rounded-xl animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] flex items-center justify-center">
                  <i className="fa-solid fa-feather text-xs"></i>
                </div>
                <div>
                  <div className="font-mono text-sm text-[var(--text-primary)]">{entry.author}</div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">{entry.date}</div>
                </div>
              </div>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed ml-11">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}