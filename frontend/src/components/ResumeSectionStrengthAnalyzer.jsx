import { useState, useEffect } from "react";
import { FileText, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { resumeApi } from "../services/api";

export default function ResumeSectionStrengthAnalyzer({ resume }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [overallScore, setOverallScore] = useState(null);

  useEffect(() => {
    if (!resume) return;
    
    const fetchScore = async () => {
      setLoading(true);
      setError("");
      try {
        const text = resume.enhancedText || resume.originalText;
        const res = await resumeApi.score(text, resume.jobRole || 'Software Engineer');
        
        if (res?.data?.sections) {
          const formattedSections = Object.entries(res.data.sections).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            score: value.score,
            suggestion: value.feedback
          }));
          setSections(formattedSections);
          setOverallScore(res.data.overallScore);
        }
      } catch (err) {
        console.error("Error scoring resume:", err);
        setError("Failed to analyze resume strength.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchScore();
  }, [resume]);

  if (!resume) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-black">
            Resume Section Strength Analyzer
          </h2>
        </div>
        <div className="p-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 text-center">
          <FileText className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
          <p className="text-sm font-bold text-foreground mb-1">Upload a Resume</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
            Upload your resume to get an AI-powered section strength analysis.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-black">
            Resume Section Strength Analyzer
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold">Analyzing resume sections with AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-black">
            Resume Section Strength Analyzer
          </h2>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-bold">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Resume Section Strength Analyzer
        </h2>
        {overallScore !== null && (
          <span className="ml-auto px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
            Overall Score: {overallScore}%
          </span>
        )}
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