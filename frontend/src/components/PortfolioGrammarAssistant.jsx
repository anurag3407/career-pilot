import React from "react";
import {
  SpellCheck,
  MessageSquareWarning,
  BadgeCheck,
  PenTool,
  TrendingUp,
} from "lucide-react";

const grammarData = {
  score: 88,
  grammar: [
    "Replace 'I done many projects' with 'I have completed many projects'.",
    "Avoid repeated words and improve sentence structure.",
  ],
  clarity: [
    "Add measurable achievements in project descriptions.",
    "Use concise and impactful sentences.",
  ],
  tone: [
    "Maintain a professional and confident writing style.",
    "Avoid casual phrases and use industry-specific terminology.",
  ],
  spelling: [
    "No major spelling mistakes detected.",
  ],
};

const PortfolioGrammarAssistant = () => {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <PenTool className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black text-foreground">
          Portfolio Grammar & Writing Assistant
        </h2>
      </div>

      {/* Quality Score */}
      <div className="mb-6 p-4 rounded-xl border border-border">
        <p className="text-sm text-muted-foreground">
          Content Quality Score
        </p>
        <p className="text-4xl font-black text-emerald-500">
          {grammarData.score}%
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <SpellCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Grammar Suggestions</h3>
          </div>

          <ul className="text-sm text-muted-foreground space-y-2">
            {grammarData.grammar.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>


        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareWarning className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold">Clarity Improvements</h3>
          </div>

          <ul className="text-sm text-muted-foreground space-y-2">
            {grammarData.clarity.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>


        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold">Professional Tone</h3>
          </div>

          <ul className="text-sm text-muted-foreground space-y-2">
            {grammarData.tone.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>


        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold">Spelling Check</h3>
          </div>

          <ul className="text-sm text-muted-foreground space-y-2">
            {grammarData.spelling.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default PortfolioGrammarAssistant;