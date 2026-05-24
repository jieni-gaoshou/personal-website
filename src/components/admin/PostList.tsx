/** 文章列表 — AdminPage 子组件 */

interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  icon: string;
}

interface PostListProps {
  posts: BlogPost[];
  loading: boolean;
  selectedPost: BlogPost | null;
  isEditing: boolean;
  onNewPost: () => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onSelectPost: (post: BlogPost) => void;
}

const PostList = ({
  posts,
  loading,
  selectedPost,
  isEditing,
  onNewPost,
  onEditPost,
  onDeletePost,
  onSelectPost,
}: PostListProps) => {
  if (loading && posts.length === 0) {
    return (
      <div className="lg:col-span-3 text-center py-20">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-neon/40"></i>
        <p className="mt-4 font-mono text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="lg:col-span-3 text-center py-20">
        <i className="fa-solid fa-inbox text-4xl text-gray-700 mb-3 block"></i>
        <p className="font-mono text-sm text-gray-500 mb-4">还没有文章</p>
        <button
          onClick={onNewPost}
          className="inline-flex items-center gap-2 rounded-lg bg-neon px-5 py-2.5 font-mono text-sm text-white hover:bg-neon/80 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          写第一篇文章
        </button>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-3">
      {posts.map((post) => (
        <div
          key={post._id || post.id}
          className={`glass-card rounded-lg p-4 transition-all cursor-pointer ${
            selectedPost?.id === post.id && !isEditing
              ? "border-neon/50 bg-neon/5"
              : "border-navy/30 hover:border-neon/20"
          }`}
          onClick={() => {
            if (!isEditing) onSelectPost(post);
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-sm font-semibold text-white truncate">{post.title}</h3>
              <p className="mt-0.5 font-mono text-[10px] text-gray-600">
                <span className="text-neon/50">{post.id}</span>
                <span className="mx-2">·</span>
                {post.date}
                <span className="mx-2">·</span>
                {post.tags?.join(" / ")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                className="rounded-lg border border-cyan/20 px-3 py-1.5 font-mono text-[10px] text-cyan hover:bg-cyan/10 transition-all"
              >
                <i className="fa-solid fa-pen mr-1"></i>编辑
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
                className="rounded-lg border border-neon/20 px-3 py-1.5 font-mono text-[10px] text-neon/60 hover:bg-neon/10 transition-all"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
