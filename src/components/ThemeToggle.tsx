import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all overflow-hidden"
      aria-label="切换主题"
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
          theme === "dark" ? "left-1 bg-[var(--cyberpink)]" : "left-7 bg-[var(--electric)]"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <i className={`fa-solid fa-moon text-[8px] ${theme === "dark" ? "text-[var(--text-muted)]" : "text-transparent"}`} />
        <i className={`fa-solid fa-sun text-[8px] ${theme === "light" ? "text-[var(--text-muted)]" : "text-transparent"}`} />
      </div>
    </button>
  );
}