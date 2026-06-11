import { useEffect, useRef } from "react";

export default function GlobalTunnel() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const RINGS = 16;
    const SPEED = 0.003;

    function drawBlob(cx, cy, r, phase, alpha, lw) {
      const PTS = 80;
      ctx.beginPath();
      for (let i = 0; i <= PTS; i++) {
        const angle = (i / PTS) * Math.PI * 2;
        const wobble =
          1
          + 0.08 * Math.sin(2 * angle + phase * 1.0)
          + 0.06 * Math.sin(3 * angle - phase * 0.7)
          + 0.04 * Math.sin(5 * angle + phase * 1.3)
          + 0.03 * Math.sin(7 * angle - phase * 0.5);
        const rx = r * wobble;
        const ry = r * 0.92 * wobble;
        const x  = cx + rx * Math.cos(angle);
        const y  = cy + ry * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(80, 130, 210, ${alpha})`;
      ctx.lineWidth   = lw;
      ctx.shadowColor = `rgba(60, 110, 200, ${alpha * 0.55})`;
      ctx.shadowBlur  = lw > 1.5 ? 6 : 3;
      ctx.stroke();
    }

    const draw = () => {
      tRef.current += SPEED;
      const t = tRef.current;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, W, H);

      // Subtle dot grid
      ctx.fillStyle = "rgba(99,102,241,0.06)";
      const step = 40;
      for (let gx = step / 2; gx < W; gx += step)
        for (let gy = step / 2; gy < H; gy += step) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

      const cx   = W / 2;
      const cy   = H / 2;
      const maxR = Math.min(W, H) * 0.68;

      for (let i = 0; i < RINGS; i++) {
        const raw      = ((i / RINGS) + t) % 1;
        const r        = raw * maxR;
        const nearness = raw;
        const alpha    = 0.06 + nearness * 0.28;
        const lw       = 0.4  + nearness * 2.4;
        const phase    = t * (1 + i * 0.15) + i * 0.8;
        const rotOff   = (i % 2 === 0 ? 1 : -1) * t * 0.18;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotOff);
        ctx.translate(-cx, -cy);
        drawBlob(cx, cy, r, phase, alpha, lw);
        ctx.restore();
      }

      // Vignette
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.72);
      vg.addColorStop(0,    "rgba(5,5,10,0)");
      vg.addColorStop(0.45, "rgba(5,5,10,0.1)");
      vg.addColorStop(1,    "rgba(5,5,10,0.88)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}