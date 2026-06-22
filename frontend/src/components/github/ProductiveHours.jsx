import { useMemo, useState } from 'react'
import { CalendarDays, Clock, TimerReset, TrendingUp } from 'lucide-react'

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

function hasUsableTimestampEntries(value) {
  return collectTimestampEntries(value).some(({ timestamp, weight }) => weight > 0 && parseLocalDate(timestamp))
}

function getProductivitySource(sources) {
  return sources.find((source) => hasUsableTimestampEntries(source)) || []
}

function getPeakWindows(hourlyData) {
  return hourlyData
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
    .sort((a, b) => b.count - a.count || b.peakCount - a.peakCount)
    .slice(0, 3)
}

function buildProductivityData(rawData) {
  const entries = collectTimestampEntries(rawData)
  const hourlyCounts = Array(24).fill(0)
  const dayCounts = Array(7).fill(0)
  let totalCommits = 0

  entries.forEach(({ timestamp, weight }) => {
    const date = parseLocalDate(timestamp)

    if (!date || weight === 0) {
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
    count,
    label: DAYS[day],
    percentage: maxDayCount > 0 ? (count / maxDayCount) * 100 : 0,
    isPeak: count > 0 && count === maxDayCount,
  }))
  const topHours = hourlyData
    .filter((hour) => hour.count > 0)
    .sort((a, b) => b.count - a.count || a.hour - b.hour)
    .slice(0, 4)

  return {
    dayData,
    hourlyData,
    maxHourlyCount,
    maxDayCount,
    peakDay: dayData.find((day) => day.isPeak),
    peakHour: hourlyData.find((hour) => hour.isPeak),
    peakWindows: getPeakWindows(hourlyData),
    topHours,
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

function StatTile({ icon, label, value }) {
  const Icon = icon

  return (
    <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-foreground">{value}</div>
    </div>
  )
}

function ProductiveHoursChart({ hourlyData, maxHourlyCount, onHover, activeHour }) {
  const size = 360
  const labelPadding = 44
  const center = size / 2
  const innerRadius = 54
  const maxRadius = 148

  return (
    <svg
      viewBox={`${-labelPadding} ${-labelPadding} ${size + labelPadding * 2} ${size + labelPadding * 2}`}
      className="mx-auto h-[390px] w-full max-w-[520px]"
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
        const outer = getPolarPoint(center, maxRadius + 8, hour)
        const inner = getPolarPoint(center, innerRadius - 10, hour)

        return (
          <line
            key={hour}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            className="stroke-border/70"
            strokeWidth={hour % 6 === 0 ? 1.5 : 0.75}
          />
        )
      })}

      {hourlyData.map(({ hour, count, isPeak }) => {
        const radius = maxHourlyCount > 0 ? innerRadius + (count / maxHourlyCount) * (maxRadius - innerRadius) : innerRadius
        const start = getPolarPoint(center, innerRadius, hour - 0.42)
        const end = getPolarPoint(center, innerRadius, hour + 0.42)
        const outerEnd = getPolarPoint(center, radius, hour + 0.42)
        const outerStart = getPolarPoint(center, radius, hour - 0.42)
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
            className={`cursor-pointer transition-all duration-150 ${
              isPeak
                ? 'fill-emerald-500 opacity-95 drop-shadow-sm'
                : activeHour === hour
                  ? 'fill-primary opacity-90'
                  : 'fill-sky-400/70 hover:fill-primary/80'
            }`}
            onMouseEnter={() => onHover(hour)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(hour)}
            onBlur={() => onHover(null)}
          />
        )
      })}

      {[0, 6, 12, 18].map((hour) => {
        const point = getPolarPoint(center, maxRadius + 26, hour)

        return (
          <text
            key={hour}
            x={point.x}
            y={point.y + 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px] font-bold"
          >
            {formatHour(hour)}
          </text>
        )
      })}

      <circle cx={center} cy={center} r={innerRadius - 6} className="fill-card stroke-border" strokeWidth="1.25" />
      <text x={center} y={center - 5} textAnchor="middle" className="fill-foreground text-lg font-black">
        24h
      </text>
      <text x={center} y={center + 15} textAnchor="middle" className="fill-muted-foreground text-[11px] font-semibold">
        local time
      </text>
    </svg>
  )
}

export default function ProductiveHours({ data = [], commits = [], heatmapData = [], timeZone, className = '' }) {
  const [activeHour, setActiveHour] = useState(null)
  const sourceData = useMemo(() => getProductivitySource([data, commits, heatmapData]), [data, commits, heatmapData])
  const timeZoneLabel = timeZone || getTimeZoneLabel()
  const {
    dayData,
    hourlyData,
    maxDayCount,
    maxHourlyCount,
    peakDay,
    peakHour,
    peakWindows,
    topHours,
    totalCommits,
  } = useMemo(() => buildProductivityData(sourceData), [sourceData])
  const activeHourData = activeHour === null ? peakHour : hourlyData[activeHour]

  if (totalCommits === 0) {
    return (
      <section className={`rounded-xl border border-dashed border-border bg-card p-8 text-center ${className}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground">No productive hours yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Commit timestamps with hour-level detail are needed to build the local-time productivity chart.
        </p>
      </section>
    )
  }

  return (
    <section className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>
      <div className="border-b border-border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Most Productive Hours
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Local-time commit activity from {formatCommitCount(totalCommits)} in {timeZoneLabel}.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
            <StatTile icon={TrendingUp} label="Peak hour" value={`${peakHour.label} - ${formatCommitCount(peakHour.count)}`} />
            <StatTile icon={CalendarDays} label="Peak day" value={`${peakDay.label} - ${formatCommitCount(peakDay.count)}`} />
            <StatTile icon={TimerReset} label="Timezone" value={timeZoneLabel} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(420px,1fr)_minmax(340px,0.85fr)]">
        <div className="relative rounded-lg border border-border bg-muted/20 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
            <span>Commit count per hour</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Activity
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Peak
              </span>
            </div>
          </div>

          <ProductiveHoursChart
            hourlyData={hourlyData}
            maxHourlyCount={maxHourlyCount}
            activeHour={activeHour}
            onHover={setActiveHour}
          />

          {activeHourData && (
            <div className="absolute bottom-4 left-4 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
              <span className="block font-bold">{activeHourData.label}</span>
              <span className="text-muted-foreground">{formatCommitCount(activeHourData.count)}</span>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-background/70 p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">Top active hours</h3>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {topHours.map((hour, index) => (
                <div
                  key={hour.hour}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    index === 0 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted/40 text-foreground'
                  }`}
                >
                  <span className="font-bold">{hour.label}</span>
                  <span className="text-muted-foreground">{formatCommitCount(hour.count)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Day-of-week breakdown
            </h3>
            <div className="space-y-2.5">
              {dayData.map((day) => (
                <div key={day.label} className="grid grid-cols-[38px_minmax(0,1fr)_48px] items-center gap-3 text-sm">
                  <span className={`font-semibold ${day.isPeak ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    {day.label}
                  </span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${day.isPeak ? 'bg-emerald-500' : 'bg-sky-400'}`}
                      style={{ width: `${Math.max(day.percentage, day.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="text-right font-bold text-foreground">
                    {maxDayCount > 0 ? day.count : 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Peak productivity windows
            </h3>
            <div className="space-y-2">
              {peakWindows.map((window) => (
                <div
                  key={`${window.startHour}-${window.endHour}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
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
