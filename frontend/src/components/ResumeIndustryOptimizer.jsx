import { useState } from "react";
import { Briefcase, Sparkles, Target } from "lucide-react";

const industryData = {
  Software: {
    keywords: ["React", "Node.js", "System Design"],
    advice: "Highlight projects, technical skills, and open-source contributions.",
  },
  DataScience: {
    keywords: ["Python", "Machine Learning", "Statistics"],
    advice: "Showcase datasets, AI models, and analytical experience.",
  },
  Marketing: {
    keywords: ["SEO", "Analytics", "Brand Strategy"],
    advice: "Focus on campaigns, communication skills, and measurable results.",
  },
};

export default function ResumeIndustryOptimizer() {
  const [industry, setIndustry] = useState("Software");

  const data = industryData[industry];

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Industry-Specific Resume Optimization
        </h2>
      </div>

      <select
        className="w-full p-3 rounded-xl border border-border mb-5"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      >
        <option value="Software">Software Engineering</option>
        <option value="DataScience">Data Science & AI</option>
        <option value="Marketing">Marketing</option>
      </select>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-bold">
              Recommended Keywords
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.keywords.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-bold">
              Resume Advice
            </h3>
          </div>

          <p className="text-muted-foreground">
            {data.advice}
          </p>
        </div>
      </div>
    </div>
  );
}