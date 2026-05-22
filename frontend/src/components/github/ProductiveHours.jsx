import { useMemo, useState } from 'react'
import { Clock, CalendarDays, TrendingUp } from 'lucide-react'

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMESTAMP_KEYS = [
  'timestamp',
  'committedAt',
  'committedDate',
  'authoredAt',
  'authoredDate',
  'createdAt',
  'date',
]
const NESTED_KEYS = ['commits', 'timestamps', 'commitTimestamps', 'items', 'data']
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function getTimeZoneLabel() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local timezone'
}

function formatHour(hour) {
  const normalizedHour = ((hour % 24) + 24) % 24
  const period = normalizedHour >= 12 ? 'PM' : 'AM'
  const displayHour = normalizedHour % 12 || 12

  return `${displayHour} ${period}`
}

function formatHourRange(startHour, endHour) {
  return `${formatHour(startHour)} - ${formatHour((endHour + 1) % 24)}`
}

function formatCommitCount(count) {
  return `${count} ${count === 1 ? 'commit' : 'commits'}`
}

function parseLocalDate(timestamp) {
  if (typeof timestamp !== 'string') {
    const date = new Date(timestamp)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (DATE_ONLY_PATTERN.test(timestamp)) {
    return null
  }

  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? null : date
}

function getWeight(item) {
  const value = item?.count ?? item?.commits ?? item?.total

  if (value === undefined || value === null) {
    return 1
  }

  const count = Number(value)
  return Number.isFinite(count) && count >= 0 ? count : 1
}

function collectTimestampEntries(value, entries = [], inheritedWeight = 1) {
  if (!value) {
    return entries
  }

  if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
    entries.push({ timestamp: value, weight: inheritedWeight })
    return entries
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectTimestampEntries(item, entries, inheritedWeight))
    return entries
  }

  if (typeof value !== 'object') {
    return entries
  }

  const itemWeight = getWeight(value)
  const hasNestedData = NESTED_KEYS.some((key) => Array.isArray(value[key]) && value[key].length > 0)

  if (!hasNestedData) {
    TIMESTAMP_KEYS.forEach((key) => {
      if (value[key]) {
        entries.push({ timestamp: value[key], weight: itemWeight })
      }
    })
  }

  NESTED_KEYS.forEach((key) => {
    if (Array.isArray(value[key])) {
      value[key].forEach((item) => collectTimestampEntries(item, entries, itemWeight))
    }
  })

  return entries
}

function getPeakWindows(hourlyData) {
  const windows = hourlyData
    .map((hour) => {
      const nextHour = hourlyData[(hour.hour + 1) % 24]

      return {
        startHour: hour.hour,
        endHour: nextHour.hour,
        count: hour.count + nextHour.count,
        peakCount: Math.max(hour.count, nextHour.count),
      }
    })
    .filter((window) => window.count > 0)

  if (windows.length === 0) {
    return []
  }

  return windows
    .sort((a, b) => b.count - a.count || b.peakCount - a.peakCount)
    .slice(0, 3)
}

function hasUsableTimestampEntries(value) {
  return collectTimestampEntries(value).some(({ timestamp, weight }) => weight > 0 && parseLocalDate(timestamp))
}

function getProductivitySource(sources) {
  return sources.find((source) => hasUsableTimestampEntries(source)) || []
}

function buildProductivityData(rawData) {
  const entries = collectTimestampEntries(rawData)
  const hourlyCounts = Array(24).fill(0)
  const dayCounts = Array(7).fill(0)
  let totalCommits = 0

  entries.forEach(({ timestamp, weight }) => {
    const date = parseLocalDate(timestamp)

    if (!date) {
      return
    }

    hourlyCounts[date.getHours()] += weight
    dayCounts[date.getDay()] += weight
    totalCommits += weight
  })

  const maxHourlyCount = Math.max(...hourlyCounts, 0)
  const maxDayCount = Math.max(...dayCounts, 0)
  const hourlyData = hourlyCounts.map((count, hour) => ({
    hour,
    count,
    label: formatHour(hour),
    isPeak: count > 0 && count === maxHourlyCount,
  }))
  const dayData = dayCounts.map((count, day) => ({
    day,
    label: DAYS[day],
    count,
    percentage: maxDayCount > 0 ? (count / maxDayCount) * 100 : 0,
    isPeak: count > 0 && count === maxDayCount,
  }))

  return {
    dayData,
    hourlyData,
    maxHourlyCount,
    peakHour: hourlyData.find((hour) => hour.isPeak),
    peakWindows: getPeakWindows(hourlyData),
    totalCommits,
  }
}

function getPolarPoint(center, radius, hour) {
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2

  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }
}

function ProductiveHoursChart({ hourlyData, maxHourlyCount, onHover, activeHour }) {
  const size = 440
  const labelPadding = 58
  const center = size / 2
  const innerRadius = 58
  const maxRadius = 184

  return (
    <svg
      viewBox={`${-labelPadding} ${-labelPadding} ${size + labelPadding * 2} ${size + labelPadding * 2}`}
      className="mx-auto h-[560px] w-full max-w-[860px]"
      role="img"
      aria-label="Clock-style polar chart showing commit counts by local hour"
    >
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <circle
          key={scale}
          cx={center}
          cy={center}
          r={innerRadius + (maxRadius - innerRadius) * scale}
          className="fill-none stroke-border"
          strokeWidth="1"
        />
      ))}

      {HOURS.map((hour) => {
        const outer = getPolarPoint(center, maxRadius + 9, hour)
        const inner = getPolarPoint(center, innerRadius - 10, hour)

        return (
          <line
            key={hour}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            className="stroke-border/60"
            strokeWidth={hour % 6 === 0 ? 1.5 : 0.75}
          />
        )
      })}

      {hourlyData.map(({ hour, count, isPeak }) => {
        const radius = maxHourlyCount > 0 ? innerRadius + (count / maxHourlyCount) * (maxRadius - innerRadius) : innerRadius
        const start = getPolarPoint(center, innerRadius, hour - 0.45)
        const end = getPolarPoint(center, innerRadius, hour + 0.45)
        const outerEnd = getPolarPoint(center, radius, hour + 0.45)
        const outerStart = getPolarPoint(center, radius, hour - 0.45)
        const path = [
          `M ${start.x} ${start.y}`,
          `L ${outerStart.x} ${outerStart.y}`,
          `A ${radius} ${radius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
          `L ${end.x} ${end.y}`,
          `A ${innerRadius} ${innerRadius} 0 0 0 ${start.x} ${start.y}`,
          'Z',
        ].join(' ')

        return (
          <path
            key={hour}
            d={path}
            tabIndex={0}
            role="listitem"
            aria-label={`${formatCommitCount(count)} around ${formatHour(hour)}`}
            className={`cursor-pointer transition-opacity ${
              isPeak ? 'fill-emerald-500 opacity-95' : activeHour === hour ? 'fill-primary opacity-90' : 'fill-primary/55 hover:opacity-80'
            }`}
            onMouseEnter={() => onHover(hour)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(hour)}
            onBlur={() => onHover(null)}
          />
        )
      })}

      {[0, 6, 12, 18].map((hour) => {
        const point = getPolarPoint(center, maxRadius + 24, hour)

        return (
          <text
            key={hour}
            x={point.x}
            y={point.y + 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-semibold"
          >
            {formatHour(hour)}
          </text>
        )
      })}

      <circle cx={center} cy={center} r={innerRadius - 4} className="fill-card stroke-border" strokeWidth="1" />
      <text x={center} y={center - 2} textAnchor="middle" className="fill-foreground text-sm font-bold">
        24h
      </text>
      <text x={center} y={center + 13} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        local
      </text>
    </svg>
  )
}

export default function ProductiveHours({ data = [], commits = [], heatmapData = [], timeZone, className = '' }) {
  const [activeHour, setActiveHour] = useState(null)
  const sourceData = useMemo(() => getProductivitySource([data, commits, heatmapData]), [data, commits, heatmapData])
  const timeZoneLabel = timeZone || getTimeZoneLabel()
  const { dayData, hourlyData, maxHourlyCount, peakHour, peakWindows, totalCommits } = useMemo(
    () => buildProductivityData(sourceData),
    [sourceData],
  )
  const activeHourData = activeHour === null ? peakHour : hourlyData[activeHour]

  if (totalCommits === 0) {
    return (
      <div className={`rounded-xl border border-dashed border-border bg-card/60 p-6 text-center ${className}`}>
        <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h3 className="text-base font-bold text-foreground">No productivity data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Commit timestamps are required to calculate local productive hours.
        </p>
      </div>
    )
  }

  return (
    <section className={`rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}>
      <div className="mb-5 flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
            <Clock className="h-5 w-5 text-primary" />
            Most Productive Hours
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {formatCommitCount(totalCommits)} converted to {timeZoneLabel}.
          </p>
        </div>

        {peakHour && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-600">Peak hour</span>
            <span className="font-bold text-foreground">
              {peakHour.label} - {formatCommitCount(peakHour.count)}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="relative overflow-hidden rounded-lg bg-muted/30 p-6">
          <ProductiveHoursChart
            hourlyData={hourlyData}
            maxHourlyCount={maxHourlyCount}
            activeHour={activeHour}
            onHover={setActiveHour}
          />

          {activeHourData && (
            <div className="absolute bottom-3 left-3 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
              <span className="block font-bold">{activeHourData.label}</span>
              <span className="text-muted-foreground">{formatCommitCount(activeHourData.count)}</span>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Day-of-week breakdown
            </h3>
            <div className="space-y-2">
              {dayData.map((day) => (
                <div key={day.label} className="grid grid-cols-[36px_minmax(0,1fr)_44px] items-center gap-3 text-sm">
                  <span className={`font-semibold ${day.isPeak ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    {day.label}
                  </span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${day.isPeak ? 'bg-emerald-500' : 'bg-primary/70'}`}
                      style={{ width: `${Math.max(day.percentage, day.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                  <span className="text-right font-bold text-foreground">{day.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Peak productivity windows
            </h3>
            <div className="space-y-2">
              {peakWindows.map((window) => (
                <div
                  key={`${window.startHour}-${window.endHour}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-foreground">{formatHourRange(window.startHour, window.endHour)}</span>
                  <span className="text-muted-foreground">{formatCommitCount(window.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
