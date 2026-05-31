import { useEffect, useState } from "react";

const colorMap = {
  primary: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-400",
  error: "bg-red-500",
};

const sizeMap = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
};

/**
 * Reusable ProgressBar component
 * @param {number} value - Progress value (0-100), null for indeterminate
 * @param {'primary'|'success'|'warning'|'error'} color - Color preset
 * @param {'sm'|'md'|'lg'} size - Bar height
 * @param {string|boolean} label - Optional label text
 * @param {boolean} animated - Enable stripe animation
 */
const ProgressBar = ({
  value = 0,
  color = "primary",
  size = "md",
  label = false,
  animated = false,
}) => {
  const [width, setWidth] = useState(0);
  const isIndeterminate = value === null || value === undefined;

  useEffect(() => {
    if (!isIndeterminate) {
      const clamped = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
      const timer = setTimeout(() => setWidth(clamped), 50);
      return () => clearTimeout(timer);
    }
  }, [value, isIndeterminate]);

  const barColor = colorMap[color] || colorMap.primary;
  const barHeight = sizeMap[size] || sizeMap.md;

  return (
    <div className="w-full">
      {label && !isIndeterminate && (
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
          <span>{typeof label === "string" ? label : "Progress"}</span>
          <span>{width}%</span>
        </div>
      )}

      <div
        className={`w-full ${barHeight} bg-gray-200 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : width}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === "string" ? label : "Progress bar"}
      >
        {isIndeterminate ? (
          <>
            <div
              className={`${barHeight} ${barColor} rounded-full w-1/3`}
              style={{ animation: "indeterminate 1.5s infinite ease-in-out" }}
            />
            <style>{`
              @keyframes indeterminate {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(400%);
                }
              }
            `}</style>
          </>
        ) : (
          <div
            className={`
              ${barHeight} ${barColor} rounded-full
              transition-all duration-700 ease-in-out
              ${animated ? "progress-stripes" : ""}
            `}
            style={{ width: `${width}%` }}
          />
        )}
      </div>

      {animated && (
        <style>{`
          .progress-stripes {
            background-image: repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.15) 0px,
              rgba(255, 255, 255, 0.15) 10px,
              transparent 10px,
              transparent 20px
            );
            animation: stripes 1s linear infinite;
          }

          @keyframes stripes {
            from {
              background-position: 0 0;
            }
            to {
              background-position: 40px 0;
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default ProgressBar;