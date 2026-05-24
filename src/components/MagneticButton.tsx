import { useRef, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({ children, onClick, className = "" }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const buttonPosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
    };

    const animate = () => {
      const dx = mouseRef.current.x * 0.3;
      const dy = mouseRef.current.y * 0.3;
      buttonPosRef.current.x += (dx - buttonPosRef.current.x) * 0.15;
      buttonPosRef.current.y += (dy - buttonPosRef.current.y) * 0.15;
      button.style.transform = `translate(${buttonPosRef.current.x}px, ${buttonPosRef.current.y}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    button.addEventListener("mousemove", handleMouseMove as EventListener);
    button.addEventListener("mouseleave", handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove as EventListener);
      button.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <button ref={buttonRef} onClick={onClick} className={`magnetic-button ${className}`}>
      {children}
    </button>
  );
};

export default MagneticButton;