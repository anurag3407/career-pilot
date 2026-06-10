import { useState, useRef, useEffect, memo } from "react";

const LazyTemplateFrame = ({
  children,
  placeholderHeight = 640,
  rootMargin = "300px",
  threshold = 0.01,
  skeleton = null,
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const loadTimestamp = performance.now();

        console.log(
          "%c[LazyTemplateFrame] Template Loaded",
          "color:#22c55e;font-weight:bold"
        );

        console.log({
          loadTime: `${loadTimestamp.toFixed(2)} ms`,
          rootMargin,
          threshold,
        });

        setIsVisible(true);

        observer.unobserve(node);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={containerRef}>
      {isVisible ? (
        children
      ) : (
        skeleton || (
          <div
            style={{
              minHeight: placeholderHeight,
            }}
            className="
              flex
              items-center
              justify-center
              rounded-2xl
              border
              border-border
              bg-card
              animate-pulse
            "
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  border-4
                  border-cyan-500
                  border-t-transparent
                  animate-spin
                "
              />
              <div className="text-muted-foreground text-sm font-medium">
                Preparing Template Preview...
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default memo(LazyTemplateFrame);