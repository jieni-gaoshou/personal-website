/** 文章编辑器 — AdminPage 子组件 */

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

interface PostEditorProps {
  formTitle: string;
  setFormTitle: (v: string) => void;
  formId: string;
  setFormId: (v: string) => void;
  formExcerpt: string;
  setFormExcerpt: (v: string) => void;
  formContent: string;
  setFormContent: (v: string) => void;
  formDate: string;
  setFormDate: (v: string) => void;
  formReadTime: string;
  setFormReadTime: (v: string) => void;
  formTags: string;
  setFormTags: (v: string) => void;
  formIcon: string;
  setFormIcon: (v: string) => void;
  selectedPost: BlogPost | null;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const PostEditor = ({
  formTitle, setFormTitle,
  formId, setFormId,
  formExcerpt, setFormExcerpt,
  formContent, setFormContent,
  formDate, setFormDate,
  formReadTime, setFormReadTime,
  formTags, setFormTags,
  formIcon, setFormIcon,
  selectedPost,
  loading,
  onSave,
  onCancel,
  onDelete,
}: PostEditorProps) => {
  return (
    <div className="glass-card neon-border rounded-xl p-6 lg:col-span-3 opacity-0 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-semibold text-white">
          <i className="fa-solid fa-pen-to-square text-neon mr-2"></i>
          {selectedPost ? "编辑文章" : "新建文章"}
        </h2>
        <button
          onClick={onCancel}
          className="font-mono text-xs text-gray-500 hover:text-neon transition-colors"
        >
          <i className="fa-solid fa-xmark mr-1"></i>
          关闭
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 基本信息 */}
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">文章ID <span className="text-neon">*</span></label>
            <input
              type="text"
              placeholder="my-article-slug"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              disabled={!!selectedPost}
              className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40 disabled:opacity-50"
            />
            <p className="mt-0.5 font-mono text-[9px] text-gray-700">URL 标识符，创建后不可修改</p>
          </div>
          <div>
            <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">标题 <span className="text-neon">*</span></label>
            <input
              type="text"
              placeholder="文章标题"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">摘要</label>
            <input
              type="text"
              placeholder="简短描述（留空则自动截取内容）"
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">日期</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white outline-none focus:border-neon/40"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">阅读时长</label>
              <input
                type="text"
                placeholder="5 分钟"
                value={formReadTime}
                onChange={(e) => setFormReadTime(e.target.value)}
                className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">标签（逗号分隔）</label>
            <input
              type="text"
              placeholder="前端, React, 技术"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">图标（Font Awesome）</label>
            <input
              type="text"
              placeholder="fa-solid fa-rocket"
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40"
            />
            <p className="mt-0.5 font-mono text-[9px] text-gray-700">
              可用图标: rocket, brain, react, cloud, paint-brush, mug-hot, book-open 等
            </p>
          </div>
        </div>

        {/* 内容编辑 */}
        <div className="flex flex-col">
          <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">
            内容（Markdown）<span className="text-neon">*</span>
          </label>
          <textarea
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="写点什么呢..."
            rows={22}
            className="w-full flex-1 rounded-lg border border-navy/40 bg-navy/60 px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-neon/40 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-neon px-6 py-2.5 font-mono text-sm text-white hover:bg-neon/80 transition-all disabled:opacity-40"
        >
          {loading ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <i className="fa-solid fa-floppy-disk"></i>
          )}
          {loading ? "保存中..." : "保存文章"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-navy/40 px-4 py-2 font-mono text-xs text-gray-400 hover:border-gray-500 transition-all"
        >
          取消
        </button>
        {selectedPost && (
          <button
            onClick={() => onDelete(selectedPost.id)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-neon/20 px-4 py-2 font-mono text-xs text-neon/60 hover:bg-neon/10 hover:text-neon transition-all"
          >
            <i className="fa-solid fa-trash"></i>
            删除
          </button>
        )}
      </div>
    </div>
  );
};

export default PostEditor;
