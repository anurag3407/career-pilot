/**
 * SkillBar — horizontal level indicator for a skill.
 * Uses the skill's `level` string (e.g. 'Expert', 'Advanced') and maps to a fill %.
 *
 * @param {object} props
 * @param {string} props.name   Skill name
 * @param {string} props.level  Skill level — one of 'Expert', 'Advanced', 'Intermediate', 'Beginner'
 * @param {string} props.accent Accent color
 * @param {string} props.track  Background color of the unfilled bar
 * @param {string} props.fontSize Font size for the skill name
 */
const LEVEL_FILL = {
  Expert: 1.0,
  Advanced: 0.8,
  Intermediate: 0.6,
  Beginner: 0.4,
  Novice: 0.25,
  '': 0.7,
}

export default function SkillBar({
  name,
  level,
  accent = '#0f766e',
  track = '#e2e8f0',
  fontSize = '9pt',
}) {
  const fill = LEVEL_FILL[level] ?? 0.7
  return (
    <div style={{ marginBottom: '1.5mm' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize,
          marginBottom: '0.5mm',
          color: '#0f172a',
        }}
      >
        <span style={{ fontWeight: 500 }}>{name}</span>
        {level && (
          <span style={{ color: '#94a3b8', fontWeight: 300 }}>{level}</span>
        )}
      </div>
      <div
        style={{
          height: '1.6mm',
          background: track,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: '100%',
            background: accent,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}
