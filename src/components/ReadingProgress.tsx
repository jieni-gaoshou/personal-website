import { useEffect, useState } from "react";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[100] h-[2px] w-full pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-neon via-cyan to-neon transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow:
            "0 0 8px rgba(139,92,246,0.5), 0 0 20px rgba(139,92,246,0.2)",
        }}
      />
    </div>
  );
};

export default ReadingProgress;
