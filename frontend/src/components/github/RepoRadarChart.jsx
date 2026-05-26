import { useMemo, useState } from 'react'

const AXES = [
  { key: 'activity', label: 'Activity' },
  { key: 'community', label: 'Community' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'ciCd', label: 'CI/CD' },
  { key: 'popularity', label: 'Popularity' },
]

const VIEWBOX_SIZE = 420
const CENTER = VIEWBOX_SIZE / 2
const OUTER_RADIUS = 145
// The rings just help give the chart some scale.
const INNER_STEPS = [0.2, 0.4, 0.6, 0.8, 1]

const DEFAULT_REPOS = [
  {
    name: 'Repository A',
    color: '#3b82f6',
    values: {
      activity: 72,
      community: 64,
      codeQuality: 78,
      documentation: 58,
      ciCd: 70,
      popularity: 66,
    },
  },
  {
    name: 'Repository B',
    color: '#f97316',
    values: {
      activity: 58,
      community: 75,
      codeQuality: 62,
      documentation: 81,
      ciCd: 52,
      popularity: 74,
    },
  },
]

function clampScore(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  if (parsed <= 1) {
    return Math.min(Math.max(parsed * 100, 0), 100)
  }

  return Math.min(Math.max(parsed, 0), 100)
}

function getPoint(angle, radius) {
  // Turn an angle and radius into an SVG point.
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER - Math.sin(angle) * radius,
  }
}

function buildPolygonPoints(values) {
  // One point per axis, based on the repo's scores.
  return AXES.map((axis, index) => {
    const angle = Math.PI / 2 - (index * (Math.PI * 2)) / AXES.length
    const radius = (values[index] / 100) * OUTER_RADIUS
    return getPoint(angle, radius)
  })
}

function pointsToString(points) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
}

function polygonPath(radius) {
  const points = AXES.map((axis, index) => {
    const angle = Math.PI / 2 - (index * (Math.PI * 2)) / AXES.length
    return getPoint(angle, radius)
  })

  return pointsToString(points)
}

function formatMetricValue(value) {
  return `${value.toFixed(1)} / 100`
}

function normalizeRepo(repo, index) {
  const fallback = DEFAULT_REPOS[index] || DEFAULT_REPOS[0]
  const source = repo || fallback

  return {
    name: source.name || fallback.name,
    color: source.color || fallback.color,
    values: AXES.map((axis) => clampScore(source.values?.[axis.key] ?? 0)),
  }
}

export default function RepoRadarChart({ repos = DEFAULT_REPOS, className = '' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // to keep the chart steady even if the caller only passes one repo.
  const normalizedRepos = useMemo(
    () => [normalizeRepo(repos[0], 0), normalizeRepo(repos[1], 1)],
    [repos],
  )

  const gridPolygons = useMemo(
    () => INNER_STEPS.map((step) => polygonPath(OUTER_RADIUS * step)),
    [],
  )

  const repoPolygons = useMemo(
    () => normalizedRepos.map((repo) => buildPolygonPoints(repo.values)),
    [normalizedRepos],
  )

  const axisPoints = useMemo(() => {
    return AXES.map((axis, index) => {
      const angle = Math.PI / 2 - (index * (Math.PI * 2)) / AXES.length
      const point = getPoint(angle, OUTER_RADIUS + 20)

      return {
        ...axis,
        ...point,
        angle,
      }
    })
  }, [])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 ${className}`}
      style={{
        '--repo-radar-grid': 'rgba(148, 163, 184, 0.18)',
        '--repo-radar-label': 'var(--muted-foreground, #94a3b8)',
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Repository Radar Comparison</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Compare two repositories across activity, quality, and adoption signals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {normalizedRepos.map((repo) => (
            <div key={repo.name} className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: repo.color }} />
              <span>{repo.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          role="img"
          aria-label="Radar chart comparing two repositories across activity, community, code quality, documentation, CI/CD, and popularity"
          className="h-auto w-full min-w-[320px]"
        >
          <defs>
            {/* Soft fills make the overlap easier to read. */}
            {normalizedRepos.map((repo) => (
              <linearGradient key={repo.name} id={`repo-radar-fill-${repo.name.replace(/\s+/g, '-').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={repo.color} stopOpacity="0.36" />
                <stop offset="100%" stopColor={repo.color} stopOpacity="0.08" />
              </linearGradient>
            ))}
            <filter id="repo-radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g>
            {/* Rings and spokes give the chart its frame. */}
            {gridPolygons.map((polygon, index) => (
              <polygon
                key={polygon}
                points={polygon}
                fill="none"
                stroke="var(--repo-radar-grid)"
                strokeWidth="1"
                strokeDasharray={index === gridPolygons.length - 1 ? '0' : '4 4'}
              />
            ))}

            {AXES.map((axis, index) => {
              const angle = Math.PI / 2 - (index * (Math.PI * 2)) / AXES.length
              const endpoint = getPoint(angle, OUTER_RADIUS)

              return (
                <g key={axis.key}>
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={endpoint.x}
                    y2={endpoint.y}
                    stroke="var(--repo-radar-grid)"
                    strokeWidth="1"
                  />
                  <text
                    x={axisPoints[index].x}
                    y={axisPoints[index].y}
                    textAnchor={axisPoints[index].x > CENTER + 5 ? 'start' : axisPoints[index].x < CENTER - 5 ? 'end' : 'middle'}
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[11px] font-medium"
                  >
                    {axis.label}
                  </text>
                </g>
              )
            })}

            {normalizedRepos.map((repo, repoIndex) => {
              const polygon = repoPolygons[repoIndex]
              const gradientId = `repo-radar-fill-${repo.name.replace(/\s+/g, '-').toLowerCase()}`

              return (
                <g key={repo.name}>
                  {/* The filled shape shows the repo's overall profile. */}
                  <polygon
                    points={pointsToString(polygon)}
                    fill={`url(#${gradientId})`}
                    stroke={repo.color}
                    strokeWidth="2.5"
                    filter="url(#repo-radar-glow)"
                    style={{ mixBlendMode: 'screen' }}
                  />

                  {polygon.map((point, pointIndex) => {
                    const axis = AXES[pointIndex]
                    const value = repo.values[pointIndex]

                    return (
                      <circle
                        key={`${repo.name}-${axis.key}`}
                        cx={point.x}
                        cy={point.y}
                        r={hoveredPoint?.repoName === repo.name && hoveredPoint?.axisKey === axis.key ? 6 : 4}
                        fill={repo.color}
                        stroke="var(--background)"
                        strokeWidth="2"
                        tabIndex={0}
                        role="button"
                        aria-label={`${repo.name} ${axis.label}: ${formatMetricValue(value)}`}
                        onMouseEnter={() =>
                          setHoveredPoint({
                            repoName: repo.name,
                            axisKey: axis.key,
                            axisLabel: axis.label,
                            repoColor: repo.color,
                            value,
                            x: point.x,
                            y: point.y,
                          })
                        }
                        onFocus={() =>
                          setHoveredPoint({
                            repoName: repo.name,
                            axisKey: axis.key,
                            axisLabel: axis.label,
                            repoColor: repo.color,
                            value,
                            x: point.x,
                            y: point.y,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                        onBlur={() => setHoveredPoint(null)}
                      />
                    )
                  })}
                </g>
              )
            })}
          </g>
        </svg>

        {hoveredPoint && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
            style={{
              left: `${(hoveredPoint.x / VIEWBOX_SIZE) * 100}%`,
              top: `${(hoveredPoint.y / VIEWBOX_SIZE) * 100}%`,
            }}
          >
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hoveredPoint.repoColor }} />
              <span>{hoveredPoint.repoName}</span>
            </div>
            <div className="mt-1 text-muted-foreground">
              {hoveredPoint.axisLabel}: {formatMetricValue(hoveredPoint.value)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}