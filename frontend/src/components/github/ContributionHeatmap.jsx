import { useMemo, useState } from 'react'

const WEEKS = 52
const DAYS = 7
const CELL_SIZE = 12
const CELL_GAP = 3
const LABEL_WIDTH = 32
const MONTH_LABEL_HEIGHT = 22

const LEVEL_COLORS = {
  0: 'var(--heatmap-level-0, #161b22)',
  1: 'var(--heatmap-level-1, #0e4429)',
  2: 'var(--heatmap-level-2, #006d32)',
  3: 'var(--heatmap-level-3, #26a641)',
  4: 'var(--heatmap-level-4, #39d353)',
}

function formatDate(dateString) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getMonthLabel(dateString) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
  })
}

function buildGrid(data) {
  const normalizedData = Array.isArray(data) ? data : []
  const cells = []

  for (let week = 0; week < WEEKS; week += 1) {
    for (let day = 0; day < DAYS; day += 1) {
      const index = week * DAYS + day
      const item = normalizedData[index] || {}

      cells.push({
        week,
        day,
        date: item.date || '',
        count: Number.isFinite(item.count) ? item.count : 0,
        level: Math.min(Math.max(Number(item.level) || 0, 0), 4),
      })
    }
  }

  return cells
}

function getMonthLabels(cells) {
  const labels = []
  let lastMonth = ''

  cells
    .filter((cell) => cell.day === 0 && cell.date)
    .forEach((cell) => {
      const month = getMonthLabel(cell.date)

      if (month && month !== lastMonth) {
        labels.push({
          month,
          week: cell.week,
        })
        lastMonth = month
      }
    })

  return labels
}

export default function ContributionHeatmap({ data = [], className = '' }) {
  const [tooltip, setTooltip] = useState(null)

  const cells = useMemo(() => buildGrid(data), [data])
  const monthLabels = useMemo(() => getMonthLabels(cells), [cells])

  const gridWidth = WEEKS * (CELL_SIZE + CELL_GAP)
  const gridHeight = DAYS * (CELL_SIZE + CELL_GAP)
  const svgWidth = LABEL_WIDTH + gridWidth
  const svgHeight = MONTH_LABEL_HEIGHT + gridHeight

  return (
    <div
      className={`relative overflow-x-auto rounded-xl border border-border bg-card p-4 ${className}`}
      style={{
        '--heatmap-level-0': 'var(--muted, #161b22)',
        '--heatmap-level-1': '#0e4429',
        '--heatmap-level-2': '#006d32',
        '--heatmap-level-3': '#26a641',
        '--heatmap-level-4': '#39d353',
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-label="GitHub contribution heatmap calendar"
      >
        {monthLabels.map(({ month, week }) => (
          <text
            key={`${month}-${week}`}
            x={LABEL_WIDTH + week * (CELL_SIZE + CELL_GAP)}
            y={14}
            className="fill-muted-foreground text-[10px]"
          >
            {month}
          </text>
        ))}

        {['Mon', 'Wed', 'Fri'].map((label, index) => (
          <text
            key={label}
            x={0}
            y={MONTH_LABEL_HEIGHT + (index * 2 + 1) * (CELL_SIZE + CELL_GAP) + 9}
            className="fill-muted-foreground text-[10px]"
          >
            {label}
          </text>
        ))}

        {cells.map((cell) => {
          const x = LABEL_WIDTH + cell.week * (CELL_SIZE + CELL_GAP)
          const y = MONTH_LABEL_HEIGHT + cell.day * (CELL_SIZE + CELL_GAP)

          return (
            <rect
              key={`${cell.week}-${cell.day}-${cell.date}`}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              fill={LEVEL_COLORS[cell.level]}
              tabIndex={0}
              aria-label={`${cell.count} commits on ${formatDate(cell.date)}`}
              onMouseEnter={() =>
                setTooltip({
                  x,
                  y,
                  text: `${cell.count} commits on ${formatDate(cell.date)}`,
                })
              }
              onMouseLeave={() => setTooltip(null)}
              onFocus={() =>
                setTooltip({
                  x,
                  y,
                  text: `${cell.count} commits on ${formatDate(cell.date)}`,
                })
              }
              onBlur={() => setTooltip(null)}
            />
          )
        })}
      </svg>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
          style={{
            left: tooltip.x + LABEL_WIDTH,
            top: tooltip.y,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}