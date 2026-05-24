import { useEffect, useRef } from "react";

const GlitchText = ({
  children,
  className = "",
  enableGlitch = true,
}: {
  children: React.ReactNode;
  className?: string;
  enableGlitch?: boolean;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enableGlitch || !textRef.current) return;

    const el = textRef.current;

    // Randomly trigger glitch
    const triggerGlitch = () => {
      el.classList.add("glitching");
      setTimeout(() => el.classList.remove("glitching"), 200);
    };

    // Random interval between 2-5 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {};
  }, [enableGlitch]);

  return (
    <span ref={textRef} className={`glitch-text ${className}`} data-text={children}>
      {children}
    </span>
  );
};

export default GlitchText;