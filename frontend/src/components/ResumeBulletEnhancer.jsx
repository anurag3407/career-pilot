import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function ResumeBulletEnhancer() {
  const [bullet, setBullet] = useState("");
  const [enhanced, setEnhanced] = useState("");

  const enhanceBullet = () => {
    if (!bullet.trim()) return;

    // Mock AI enhancement
    setEnhanced(
      `Improved: ${bullet} → Enhanced with stronger action verbs, measurable impact, and a professional tone.`
    );
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black text-foreground">
          AI Resume Bullet Point Enhancer
        </h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Improve your resume points with stronger action words,
        achievements, and professional wording.
      </p>

      {/* Input */}
      <textarea
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
        placeholder="Example: Worked on a website project using React"
        className="w-full p-4 rounded-xl border border-border bg-background outline-none min-h-[120px]"
      />

      {/* Button */}
      <button
        onClick={enhanceBullet}
        className="mt-4 flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
      >
        <Sparkles className="w-4 h-4" />
        Enhance with AI
      </button>

      {/* Result */}
      {enhanced && (
        <div className="mt-5 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-bold">
              Improved Resume Bullet
            </h3>
          </div>

          <p className="text-sm text-foreground">
            {enhanced}
          </p>
        </div>
      )}

      {/* Suggestions */}
      <div className="mt-5">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          AI Suggestions
        </h4>

        <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
          <li>Use action verbs like Developed, Built, Optimized</li>
          <li>Add measurable achievements and numbers</li>
          <li>Highlight your individual contribution</li>
          <li>Keep sentences concise and professional</li>
        </ul>
      </div>
    </div>
  );
}