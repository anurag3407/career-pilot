import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'

export default function ReviewStep({
  personal,
  education,
  experience,
  projects,
  skills,
  sectionOrder,
  onDragEnd,
  saveVersion,
  atsScore,
  recommendedCertifications,
  recommendedSkills,
  sectionSuggestions,
  missingKeywords,
  achievementScore,
  achievementSuggestions,
  resumeScore,
  recommendedSections,
  resumeVersions,
  restoreVersion,
  profileScore,
  profileIssues,
  impactScores,
  readabilityScore,
  claritySuggestions,
  toneScore,
  toneSuggestions,
  activeConsistencyWarnings,
  goalProgress,
  careerGoals,
  generateMarkdown,
}) {
  return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Preview &amp; Generate</h2>

            <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
              <h3 className="font-semibold mb-3">Reorder Sections</h3>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections" type="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {sectionOrder.map((section, index) => (
                        <Draggable key={section} draggableId={section} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg"
                            >
                              <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <span className="capitalize font-medium">{section}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="flex justify-end mb-4">
  <button
    onClick={saveVersion}
    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
  >
    Save Version
  </button>
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">

  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Skill Gap Analysis
    </h3>

    <div className="mt-2">
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      atsScore >= 80
        ? "bg-green-500/20 text-green-500"
        : atsScore >= 60
        ? "bg-yellow-500/20 text-yellow-500"
        : "bg-red-500/20 text-red-500"
    }`}
  >
    {atsScore >= 80
      ? "Strong Match"
      : atsScore >= 60
      ? "Moderate Gap"
      : "High Skill Gap"}
  </span>
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">

  <h3 className="font-semibold mb-3">
    Smart Certification Recommendations
  </h3>

  {recommendedCertifications.length > 0 ? (
    <div className="flex flex-wrap gap-2">

      {recommendedCertifications.map(cert => (
        <span
          key={cert}
          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm"
        >
          {cert}
        </span>
      ))}

    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Add skills and target role to receive certification recommendations.
    </p>
  )}

</div>

    <span className="text-primary font-bold">
      {atsScore}% Match
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all duration-500"
      style={{ width: `${atsScore}%` }}
    />
  </div>

  {recommendedSkills.length > 0 && (
  <div className="mt-4">
    <h4 className="font-medium mb-2">
      Recommended Skills to Learn
    </h4>

    <div className="flex flex-wrap gap-2">
      {recommendedSkills.map(skill => (
        <span
          key={skill}
          className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

{sectionSuggestions.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-3">
      Resume Section Reordering Suggestions
    </h3>

    <ul className="list-disc list-inside text-sm text-muted-foreground">
      {sectionSuggestions.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

  <div className="mt-4">
    <h4 className="font-medium mb-2">
      Missing Skills
    </h4>

    <div className="flex flex-wrap gap-2">
      {missingKeywords.map(skill => (
        <span
          key={skill}
          className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Achievement Impact Score
    </h3>

    <span className="text-primary font-bold">
      {achievementScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all"
      style={{ width: `${achievementScore}%` }}
    />
  </div>

  {achievementSuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Improvement Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {achievementSuggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</div>
<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <h3 className="font-semibold mb-3">
    Section Completion Status
  </h3>

  <div className="space-y-2">
    <div>{personal.name && personal.email ? "✅" : "❌"} Personal Info</div>
    <div>{education.some(e => e.school) ? "✅" : "❌"} Education</div>
    <div>{experience.some(e => e.title) ? "✅" : "❌"} Experience</div>
    <div>{projects.some(p => p.name) ? "✅" : "❌"} Projects</div>
    <div>{skills.trim() ? "✅" : "❌"} Skills</div>
  </div>
</div>
            <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Improvement Progress
    </h3>

    <span className="text-primary font-bold">
      {resumeScore}%
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all duration-500"
      style={{ width: `${resumeScore}%` }}
    />
  </div>

  <div className="mt-4 flex flex-wrap gap-2">
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 20
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Personal Info
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 40
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Education
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 60
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Experience
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 80
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Projects
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 100
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Skills
  </span>
</div>

  <p className="mt-2 text-sm text-muted-foreground">
    Complete more sections to improve your resume score.
  </p>
</div>
            {recommendedSections.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-2">
      Recommended Sections
    </h3>

    <div className="flex flex-wrap gap-2">
      {recommendedSections.map(section => (
        <span
          key={section}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
        >
          {section}
        </span>
      ))}
    </div>
  </div>
)}

{resumeVersions.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-3">
      Resume Version History
    </h3>

    <div className="space-y-2">
      {resumeVersions.map(version => (
        <div
          key={version.id}
          className="flex justify-between items-center p-2 rounded-lg bg-background"
        >
          <span className="text-sm">
            {version.timestamp}
          </span>

          <button
            onClick={() => restoreVersion(version)}
            className="text-primary text-sm font-medium"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  </div>
)}

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Portfolio Social Profile Score
    </h3>

    <span className="text-primary font-bold">
      {profileScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{ width: `${profileScore}%` }}
    />
  </div>

  {profileIssues.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Optimization Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {profileIssues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="mt-4 flex flex-wrap gap-2">

  {personal.linkedin && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      LinkedIn Added
    </span>
  )}

  {personal.github && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      GitHub Added
    </span>
  )}

  {personal.portfolio && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      Portfolio Added
    </span>
  )}

</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <h3 className="font-semibold mb-4">
    Resume Content Impact Score
  </h3>

  {Object.entries(impactScores).map(
    ([section, score]) => (
      <div key={section} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="capitalize">
            {section}
          </span>

          <span className="font-medium">
            {score}/100
          </span>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${score}%`
            }}
          />
        </div>
      </div>
    )
  )}
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Readability Score
    </h3>

    <span className="text-primary font-bold">
      {readabilityScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all"
      style={{ width: `${readabilityScore}%` }}
    />
  </div>

  {claritySuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {claritySuggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Language Tone Analyzer
    </h3>

    <span className="text-primary font-bold">
      {toneScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{ width: `${toneScore}%` }}
    />
  </div>

  {toneSuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Professional Tone Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {toneSuggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  )}
</div>

{activeConsistencyWarnings.some(
  item => item.type === "duplicate"
) && (
  <div className="mb-6 p-4 rounded-xl border border-yellow-500 bg-yellow-500/10">
    <h3 className="font-semibold mb-3">
      Duplicate Information Detector
    </h3>

    <ul className="space-y-2">
      {activeConsistencyWarnings
        .filter(
          item => item.type === "duplicate"
        )
        .map((item, index) => (
          <li
            key={index}
            className="text-sm text-yellow-400"
          >
            • {item.message}
          </li>
        ))}
    </ul>
  </div>
)}

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Career Goal Progress Tracker
    </h3>

    <span className="text-primary font-bold">
      {goalProgress}%
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{
        width: `${goalProgress}%`
      }}
    />
  </div>

  <div className="mt-4 space-y-2">
    {careerGoals.map((goal, index) => (
      <div key={index}>
        {goal.completed ? "✅" : "⭕"} {goal.title}
      </div>
    ))}
  </div>
</div>

<div className="bg-background border border-border rounded-xl p-6 h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
  {generateMarkdown()}
</div>
          </div>
  )
}
