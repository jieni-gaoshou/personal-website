/** AI 写作助手面板 — AdminPage 子组件 */

interface AiPanelProps {
  show: boolean;
  aiTopic: string;
  setAiTopic: (v: string) => void;
  aiLoading: string;
  aiOutput: string;
  formContent: string;
  onAction: (action: "write" | "polish" | "outline" | "excerpt") => void;
  onApply: (target: "content" | "outline" | "all") => void;
  onClose: () => void;
}

const AiPanel = ({
  show,
  aiTopic,
  setAiTopic,
  aiLoading,
  aiOutput,
  onAction,
  onApply,
}: AiPanelProps) => {
  if (!show) return null;

  return (
    <div className="glass-card rounded-xl border border-purple-500/20 bg-purple-500/3 p-5 mb-6 opacity-0 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-sm font-semibold text-purple-300">
          <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
          AI 写作助手
        </h2>
        <span className="font-mono text-[10px] text-gray-600">Powered by AI</span>
      </div>

      {/* Topic Input + Quick Actions */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-mono text-[10px] text-gray-500 tracking-wider mb-1">文章主题</label>
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="例如：React 19 新特性、远程工作心得..."
            className="w-full rounded-lg border border-navy/40 bg-navy/60 px-3 py-2 font-mono text-sm text-white placeholder-gray-600 outline-none focus:border-purple-400/40"
          />
        </div>
        <button
          onClick={() => onAction("write")}
          disabled={!!aiLoading}
          className="flex items-center gap-2 rounded-lg bg-purple-500/20 border border-purple-400/30 px-4 py-2 font-mono text-xs text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-40"
        >
          <i className="fa-solid fa-file-lines"></i>
          生成文章
        </button>
        <button
          onClick={() => onAction("outline")}
          disabled={!!aiLoading}
          className="flex items-center gap-2 rounded-lg border border-purple-400/20 px-4 py-2 font-mono text-xs text-purple-400/60 hover:bg-purple-500/10 transition-all disabled:opacity-40"
        >
          <i className="fa-solid fa-list-ol"></i>
          生成大纲
        </button>
        <button
          onClick={() => onAction("polish")}
          disabled={!!aiLoading}
          className="flex items-center gap-2 rounded-lg border border-purple-400/20 px-4 py-2 font-mono text-xs text-purple-400/60 hover:bg-purple-500/10 transition-all disabled:opacity-40"
        >
          <i className="fa-solid fa-sparkles"></i>
          润色内容
        </button>
        <button
          onClick={() => onAction("excerpt")}
          disabled={!!aiLoading}
          className="flex items-center gap-2 rounded-lg border border-purple-400/20 px-4 py-2 font-mono text-xs text-purple-400/60 hover:bg-purple-500/10 transition-all disabled:opacity-40"
        >
          <i className="fa-solid fa-text-height"></i>
          写摘要
        </button>
      </div>

      {/* Loading */}
      {aiLoading && (
        <div className="flex items-center gap-3 py-3 mb-3">
          <i className="fa-solid fa-spinner animate-spin text-purple-400"></i>
          <span className="font-mono text-sm text-purple-300">{aiLoading}</span>
        </div>
      )}

      {/* AI Output */}
      {aiOutput && (
        <div className="rounded-xl border border-purple-400/20 bg-navy/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-gray-500">AI 生成结果</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApply("all")}
                className="rounded-lg border border-purple-400/20 px-3 py-1 font-mono text-[10px] text-purple-300 hover:bg-purple-500/10 transition-all"
              >
                <i className="fa-solid fa-arrow-down mr-1"></i>
                全部填充
              </button>
              <button
                onClick={() => onApply("content")}
                className="rounded-lg border border-purple-400/20 px-3 py-1 font-mono text-[10px] text-purple-400/60 hover:bg-purple-500/10 transition-all"
              >
                <i className="fa-solid fa-arrow-down mr-1"></i>
                仅内容
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(aiOutput); }}
                className="rounded-lg border border-navy/40 px-3 py-1 font-mono text-[10px] text-gray-500 hover:text-gray-300 transition-all"
              >
                <i className="fa-solid fa-copy"></i>
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto rounded-lg bg-navy/60 p-4 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
            {aiOutput}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPanel;
