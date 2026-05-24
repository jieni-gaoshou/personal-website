import { useRef, useState, useCallback } from "react";

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

const RippleButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
}: RippleButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);

      // Clean up ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.();
    },
    [onClick]
  );

  const isPrimary = variant === "primary";

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-lg font-mono text-sm font-bold transition-all duration-300 ${
        isPrimary
          ? "bg-neon px-6 py-3 text-white shadow-lg shadow-neon/25 hover:bg-neon/90 hover:shadow-neon/40 hover:scale-105 active:scale-95"
          : "border border-navy/50 px-6 py-3 text-gray-400 hover:border-neon/40 hover:text-neon hover:shadow-lg hover:shadow-neon/10 active:scale-95"
      } ${className}`}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {children}
    </button>
  );
};

export default RippleButton;