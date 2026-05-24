import { useState, useEffect } from "react";

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}

interface CommentsProps {
  postId: string;
}

const STORAGE_KEY = "blog_comments";

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allComments = JSON.parse(stored) as Comment[];
      setComments(allComments.filter((c) => c.postId === postId));
    }
  }, [postId]);

  const saveComments = (newComments: Comment[]) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allComments = stored ? JSON.parse(stored) as Comment[] : [];
    const filtered = allComments.filter((c) => c.postId !== postId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, ...newComments]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setLoading(true);
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setTimeout(() => {
      const updated = [newComment, ...comments];
      setComments(updated);
      saveComments(updated);
      setContent("");
      setLoading(false);
    }, 300);
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
      <h3 className="font-orbitron text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <i className="fa-solid fa-comments text-[var(--accent-primary)]"></i>
        评论 <span className="text-[var(--text-muted)] font-mono text-xs">({comments.length})</span>
      </h3>

      {/* Comment form */}
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
          placeholder="写下你的评论..."
          rows={3}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
        />
        <button
          type="submit"
          disabled={loading || !author.trim() || !content.trim()}
          className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white font-mono text-sm hover:opacity-80 transition-all disabled:opacity-40"
        >
          {loading ? "发送中..." : "发表评论"}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-[var(--text-muted)] font-mono text-sm text-center py-8">
            还没有评论，来抢先发言吧！
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="glass-card p-4 rounded-xl animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center">
                  <i className="fa-solid fa-user text-xs"></i>
                </div>
                <div>
                  <div className="font-mono text-sm text-[var(--text-primary)]">{comment.author}</div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">{comment.date}</div>
                </div>
              </div>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed ml-11">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}