import { useEffect, useRef } from "react";

interface HolographicEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const HolographicEffect = ({ children, className = "", intensity = "medium" }: HolographicEffectProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Scanline effect
    const scanline = document.createElement("div");
    scanline.className = "holographic-scanline";
    overlay.appendChild(scanline);

    return () => {
      scanline.remove();
    };
  }, []);

  const intensityClass = {
    low: "holo-low",
    medium: "holo-medium",
    high: "holo-high",
  }[intensity];

  return (
    <div ref={overlayRef} className={`holographic-container ${intensityClass} ${className}`}>
      <div className="holographic-bg" />
      <div className="holographic-noise" />
      {children}
    </div>
  );
};

export default HolographicEffect;