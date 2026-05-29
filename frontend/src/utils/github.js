export const getGithubUsername = (github) => {
  if (!github || typeof github !== 'string') return ''

  const trimmed = github.trim()
  if (!trimmed) return ''

  const match = trimmed.match(/github\.com\/([^/?#]+)/i)
  return (match?.[1] || trimmed.replace(/^@/, '')).replace(/\/$/, '')
}
