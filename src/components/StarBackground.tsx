import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const MAX_LINE_DIST = 100;
const CELL_SIZE = 100; // 空间网格单元大小 = 最大连线距离

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    // 空间哈希网格: key -> 该格子内的星星索引数组
    const grid: Map<number, number[]> = new Map();
    let cols = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    // 预分配的 Float32Array 缓冲区（避免每帧 new）
    let starX: Float32Array = new Float32Array(0);
    let starY: Float32Array = new Float32Array(0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / CELL_SIZE) + 1;
      initStars();
    };

    const initStars = () => {
      // 移动端减少星星数量
      const density = canvas.width < 768 ? 5000 : 3000;
      const count = Math.floor((canvas.width * canvas.height) / density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
      // 预分配缓冲区（仅当星星数量变化时重新分配）
      if (starX.length !== count) {
        starX = new Float32Array(count);
        starY = new Float32Array(count);
      }
      buildGrid();
    };

    /** 构建空间哈希网格，加速近邻搜索 O(k) 代替 O(n²) */
    const buildGrid = () => {
      grid.clear();
      for (let i = 0; i < stars.length; i++) {
        const col = Math.floor(stars[i].x / CELL_SIZE);
        const row = Math.floor(stars[i].y / CELL_SIZE);
        const key = row * cols + col;
        const list = grid.get(key);
        if (list) list.push(i);
        else grid.set(key, [i]);
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const parallaxX = (mouseX / canvas.width - 0.5) * 30;
      const parallaxY = (mouseY / canvas.height - 0.5) * 30;

      // 复用预分配的 Float32Array 缓冲区（避免每帧 GC）
      for (let i = 0; i < stars.length; i++) {
        starX[i] = stars[i].x + parallaxX * stars[i].z;
        starY[i] = stars[i].y + parallaxY * stars[i].z;
      }

      // 绘制星星
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        if (alpha < 0.05) continue; // 太暗跳过

        const x = starX[i];
        const y = starY[i];

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
        const hue = star.z > 0.6 ? 270 : 240;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${alpha * 0.4})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      // 空间哈希加速的连线绘制
      ctx.strokeStyle = "rgba(139, 92, 246, 0.03)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      let lineCount = 0;

      for (let i = 0; i < stars.length; i++) {
        if (stars[i].z <= 0.5) continue;

        const col = Math.floor(stars[i].x / CELL_SIZE);
        const row = Math.floor(stars[i].y / CELL_SIZE);
        const ix = starX[i];
        const iy = starY[i];

        // 只检查 3x3 邻域内的星星
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const key = (row + dr) * cols + (col + dc);
            const neighbors = grid.get(key);
            if (!neighbors) continue;

            for (const j of neighbors) {
              if (j <= i || stars[j].z <= 0.5) continue;

              const dx = ix - starX[j];
              const dy = iy - starY[j];
              // 用平方比较避免 sqrt
              const distSq = dx * dx + dy * dy;
              if (distSq < MAX_LINE_DIST * MAX_LINE_DIST) {
                ctx.moveTo(ix, iy);
                ctx.lineTo(starX[j], starY[j]);
                lineCount++;
              }
            }
          }
        }
      }
      if (lineCount > 0) ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    // Pause animation when tab is hidden (save GPU/battery)
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
};

export default StarBackground;
