import { FileText, TrendingUp } from "lucide-react";

export default function ResumeSectionStrengthAnalyzer() {
  const sections = [
    {
      name: "Education",
      score: 90,
      suggestion: "Strong section with relevant academic details.",
    },
    {
      name: "Skills",
      score: 75,
      suggestion: "Add more industry-relevant technical skills.",
    },
    {
      name: "Projects",
      score: 85,
      suggestion: "Include measurable outcomes and achievements.",
    },
    {
      name: "Experience",
      score: 60,
      suggestion: "Add internship or volunteer experience.",
    },
  ];

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Resume Section Strength Analyzer
        </h2>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.name}
            className="p-4 rounded-xl border border-border"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-bold">{section.name}</span>
              </div>

              <span
                className={`font-black ${
                  section.score >= 80
                    ? "text-emerald-500"
                    : section.score >= 65
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {section.score}%
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${section.score}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {section.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}