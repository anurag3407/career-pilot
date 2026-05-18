import { useRef, useEffect } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";
import { useTheme } from "../../context/ThemeContext";

export default function Globe({ className }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let phi = 0;
    let width = 0;

    if (!canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const isDark = theme === "dark";

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.3,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: isDark ? 6 : 4,
      baseColor: isDark ? [0.15, 0.15, 0.15] : [0.9, 0.9, 0.9],
      markerColor: [0, 0.75, 1], // primary color #00BFFF
      glowColor: isDark ? [0.15, 0.15, 0.2] : [0.95, 0.95, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.04 },
        { location: [35.6762, 139.6503], size: 0.04 },
        { location: [28.6139, 77.209], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.03 },
        { location: [1.3521, 103.8198], size: 0.03 },
        { location: [55.7558, 37.6173], size: 0.03 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={cn("", className)}
    />
  );
}
