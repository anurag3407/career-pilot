import { useEffect, useRef, useState } from "react";

/**
 * Parses a stat string like "10K+", "95%", "2.5x", "50K+"
 * Returns { numeric: number, suffix: string }
 */
function parseStat(value) {
  if (value === undefined || value === null) return { numeric: null, suffix: "" };
  const strValue = String(value);
  const match = strValue.match(/^([\d.]+)([A-Za-z%+x]*)$/);
  if (!match) return { numeric: null, suffix: strValue };
  return { numeric: parseFloat(match[1]), suffix: match[2] };
}

/**
 * Easing function: ease-out cubic for natural deceleration
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * AnimatedCounter
 * Props:
 *   value (string|number) — the stat string, e.g. "10K+", "95%", "2.5x"
 *   duration (number)      — animation duration in ms, default 2000
 */
export default function AnimatedCounter({ value, duration = 2000 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const rafId = useRef(null);
  const hasAnimatedRef = useRef(false);

  const { numeric, suffix } = parseStat(value);

  // Reset animation state when the target value changes
  useEffect(() => {
    hasAnimatedRef.current = false;
    setDisplay("0");
  }, [value]);

  useEffect(() => {
    if (numeric === null || hasAnimatedRef.current) {
      if (numeric === null) setDisplay(String(value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const startTime = performance.now();
          const isDecimal = numeric % 1 !== 0;
          const safeDuration = Math.max(duration, 1);

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / safeDuration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = easedProgress * numeric;

            setDisplay(
              isDecimal ? current.toFixed(1) : Math.floor(current).toString()
            );

            if (progress < 1) {
              rafId.current = requestAnimationFrame(step);
            } else {
              setDisplay(isDecimal ? numeric.toFixed(1) : numeric.toString());
            }
          }

          rafId.current = requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [numeric, duration, value]);


  if (numeric === null) return <span ref={ref}>{String(value)}</span>;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
