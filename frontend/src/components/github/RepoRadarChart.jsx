import { useMemo, useState } from "react";

const METRICS = [
  "Activity",
  "Community",
  "Code Quality",
  "Documentation",
  "CI/CD",
  "Popularity",
];

const DEFAULT_REPO_A = {
  name: "Repo A",
  color: "#3B82F6",
  metrics: {
    Activity: 90,
    Community: 70,
    "Code Quality": 85,
    Documentation: 80,
    "CI/CD": 60,
    Popularity: 75,
  },
};

const DEFAULT_REPO_B = {
  name: "Repo B",
  color: "#A855F7",
  metrics: {
    Activity: 60,
    Community: 92,
    "Code Quality": 72,
    Documentation: 95,
    "CI/CD": 88,
    Popularity: 84,
  },
};

const SIZE = 500;
const CENTER = SIZE / 2;
const MAX_RADIUS = 170;

function polarToCartesian(angle, radius) {
  const radians = (angle - 90) * (Math.PI / 180);

  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

export default function RepoRadarChart({
  repoA = DEFAULT_REPO_A,
  repoB = DEFAULT_REPO_B,
}) {
  const [tooltip, setTooltip] = useState(null);

  const levels = 5;

  const axisPoints = useMemo(() => {
    return METRICS.map((metric, index) => {
      const angle = (360 / METRICS.length) * index;
      return {
        metric,
        angle,
        point: polarToCartesian(angle, MAX_RADIUS),
      };
    });
  }, []);

  const buildPolygon = (repo) => {
    return METRICS.map((metric, index) => {
      const value = repo.metrics[metric] || 0;
      const radius = (value / 100) * MAX_RADIUS;
      const angle = (360 / METRICS.length) * index;

      const { x, y } = polarToCartesian(angle, radius);

      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-2xl"
        role="img"
        aria-label="Repository comparison radar chart"
      >
        <title>Repository comparison radar chart</title>

        {/* Grid rings */}
        {Array.from({ length: levels }).map((_, level) => {
          const radius = ((level + 1) / levels) * MAX_RADIUS;

          const points = METRICS.map((_, index) => {
            const angle = (360 / METRICS.length) * index;
            const { x, y } = polarToCartesian(angle, radius);
            return `${x},${y}`;
          }).join(" ");

          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {axisPoints.map(({ metric, point }) => (
          <g key={metric}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={point.x}
              y2={point.y}
              stroke="#9CA3AF"
            />

            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              className="fill-current text-xs"
            >
              {metric}
            </text>
          </g>
        ))}

        {/* Repo A */}
        <polygon
          points={buildPolygon(repoA)}
          fill={repoA.color}
          fillOpacity="0.25"
          stroke={repoA.color}
          strokeWidth="3"
        />

        {/* Repo B */}
        <polygon
          points={buildPolygon(repoB)}
          fill={repoB.color}
          fillOpacity="0.25"
          stroke={repoB.color}
          strokeWidth="3"
        />
      </svg>

      {/* Legend */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: repoA.color }}
          />
          <span>{repoA.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: repoB.color }}
          />
          <span>{repoB.name}</span>
        </div>
      </div>
    </div>
  );
}