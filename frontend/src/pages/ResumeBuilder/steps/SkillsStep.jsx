export default function SkillsStep({ skills, setSkills }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Skills</h2>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="skills">Technical Skills &amp; Competencies</label>
        <textarea
          id="skills"
          className="w-full bg-muted border border-border rounded-xl px-4 py-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
          value={skills}
          onChange={e => setSkills(e.target.value)}
          placeholder={'**Languages:** JavaScript, Python, Java\n**Frameworks:** React, Node.js, Express\n**Tools:** Git, Docker, AWS'}
        />
        <p className="text-xs text-muted-foreground mt-2">Format exactly as you want it to appear (Markdown supported).</p>
      </div>
    </div>
  )
}
