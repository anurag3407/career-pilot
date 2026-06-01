import { useEffect, useRef, useCallback } from "react";

function parseStat(value) {
  if (value === undefined || value === null) return { numeric: null, suffix: "" };
  const strValue = String(value);
  const match = strValue.match(/^([\d.]+)([A-Za-z%+x]*)$/);
  if (!match) return { numeric: null, suffix: strValue };
  return { numeric: parseFloat(match[1]), suffix: match[2] };
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({ value, duration = 2000 }) {
  const spanRef = useRef(null);
  const rafId = useRef(null);

  const { numeric, suffix } = parseStat(value);

  const setText = useCallback((text) => {
    if (spanRef.current) {
      spanRef.current.textContent = text;
    }
  }, []);

  useEffect(() => {
    if (numeric === null) {
      setText(String(value));
      return;
    }

    setText("0");

    if (rafId.current) cancelAnimationFrame(rafId.current);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          const startTime = performance.now();
          const isDecimal = numeric % 1 !== 0;
          const safeDuration = Math.max(duration, 1);

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / safeDuration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = easedProgress * numeric;

            setText(
              `${isDecimal ? current.toFixed(1) : Math.floor(current).toString()}${suffix}`
            );

            if (progress < 1) {
              rafId.current = requestAnimationFrame(step);
            } else {
              setText(`${isDecimal ? numeric.toFixed(1) : numeric.toString()}${suffix}`);
            }
          }

          rafId.current = requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (spanRef.current) observer.observe(spanRef.current);

    return () => {
      observer.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [numeric, duration, value, suffix, setText]);

  return <span ref={spanRef} />;
}
