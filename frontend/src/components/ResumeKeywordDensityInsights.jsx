import { useState } from "react";
import { Search, AlertTriangle, CheckCircle } from "lucide-react";

export default function ResumeKeywordDensityInsights() {
  const [text, setText] = useState("");

  const keywords = [
    "javascript",
    "react",
    "node",
    "python",
    "java",
    "sql",
    "aws",
    "docker",
  ];

  const getKeywordCount = (keyword) => {
    const matches = text.toLowerCase().match(new RegExp(keyword, "g"));
    return matches ? matches.length : 0;
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <Search className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Resume Keyword Density Insights
        </h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume content here..."
        className="w-full h-40 p-4 rounded-xl border border-border bg-background resize-none mb-6"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {keywords.map((keyword) => {
          const count = getKeywordCount(keyword);

          return (
            <div
              key={keyword}
              className="p-4 rounded-xl border border-border flex justify-between items-center"
            >
              <div>
                <p className="font-bold capitalize">{keyword}</p>
                <p className="text-xs text-muted-foreground">
                  Frequency: {count}
                </p>
              </div>

              {count === 0 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-border">
        <p className="text-sm font-bold mb-1">
          ATS Optimization Tip
        </p>
        <p className="text-xs text-muted-foreground">
          Maintain balanced keyword usage. Include important skills naturally
          throughout your resume instead of repeating them excessively.
        </p>
      </div>
    </div>
  );
}
