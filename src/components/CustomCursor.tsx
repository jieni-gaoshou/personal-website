import { useEffect, useRef, useCallback } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, input, select, textarea, [role='button'], .tag-pill";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });

  const animate = useCallback(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

    cursor.style.left = `${posRef.current.x}px`;
    cursor.style.top = `${posRef.current.y}px`;
    dot.style.left = `${targetRef.current.x}px`;
    dot.style.top = `${targetRef.current.y}px`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // 检测是否为触屏设备，触屏设备不需要自定义光标
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const handleMouse = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    // 事件委托——不用 MutationObserver，性能好很多
    const handlePointerOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        cursor.classList.add("hover");
      }
    };

    const handlePointerOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        cursor.classList.remove("hover");
      }
    };

    // JS 成功加载后隐藏默认光标（安全降级）
    document.documentElement.classList.add("custom-cursor-active");

    window.addEventListener("mousemove", handleMouse, { passive: true });
    document.addEventListener("mouseover", handlePointerOver, { passive: true });
    document.addEventListener("mouseout", handlePointerOut, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handlePointerOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden sm:block" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot hidden sm:block" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
