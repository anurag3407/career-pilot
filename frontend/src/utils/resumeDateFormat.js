/**
 * Human-readable date formatting for resumes.
 *
 * The builder stores dates as `YYYY-MM` (HTML month inputs). Templates and
 * exports should render them the way recruiters expect — "Jan 2024" — so a
 * resume never ships with a raw `2024-01` string in it.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2024-03" → "Mar 2024". Anything that isn't YYYY-MM is returned unchanged. */
export function formatMonth(value) {
  if (!value) return ''
  const raw = String(value).trim()
  const iso = raw.match(/^(\d{4})-(\d{1,2})$/)
  if (!iso) return raw
  const month = Number(iso[2])
  if (month < 1 || month > 12) return iso[1]
  return `${MONTHS[month - 1]} ${iso[1]}`
}

/** "2022-01", "2024-06" → "Jan 2022 – Jun 2024" (or "Jan 2022 – Present"). */
export function formatPeriod(startDate, endDate, current = false) {
  const start = formatMonth(startDate)
  const end = current ? 'Present' : formatMonth(endDate)
  if (start && end) return `${start} – ${end}`
  return start || end || ''
}
