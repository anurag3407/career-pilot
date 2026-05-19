import { useEffect, useRef, useState } from "react";

/**
 * Parses a stat string like "10K+", "95%", "2.5x", "50K+"
 * Returns { numeric: number, suffix: string }
 */
function parseStat(value) {
  const match = value.match(/^([\d.]+)([A-Za-z%+x]*)$/);
  if (!match) return { numeric: null, suffix: value };
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
 *   value (string)  — the stat string, e.g. "10K+", "95%", "2.5x"
 *   duration (number) — animation duration in ms, default 2000
 */
export default function AnimatedCounter({ value, duration = 2000 }) {
  const [display, setDisplay] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  const { numeric, suffix } = parseStat(value);

  useEffect(() => {
    if (numeric === null) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const isDecimal = numeric % 1 !== 0;

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = easedProgress * numeric;

            setDisplay(
              isDecimal ? current.toFixed(1) : Math.floor(current).toString()
            );

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplay(isDecimal ? numeric.toFixed(1) : numeric.toString());
            }
          }

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numeric, duration, hasAnimated, value]);

  if (numeric === null) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
