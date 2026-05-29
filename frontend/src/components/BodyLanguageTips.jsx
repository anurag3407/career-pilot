import { useState, useEffect } from 'react';
import { Eye, User, Hand } from 'lucide-react';

const TIPS = [
  {
    icon: <Eye className="w-5 h-5 text-cyan-400" />,
    title: 'Eye Contact',
    tip: 'Look directly into the camera lens — not at your own face on screen. This creates the impression of natural eye contact with your interviewer.',
  },
  {
    icon: <User className="w-5 h-5 text-cyan-400" />,
    title: 'Posture',
    tip: 'Sit up straight with your shoulders back. Good posture signals confidence and keeps you looking engaged throughout the interview.',
  },
  {
    icon: <Hand className="w-5 h-5 text-cyan-400" />,
    title: 'Hand Gestures',
    tip: 'Keep your hands relaxed and visible. Gentle gestures while speaking feel natural — but avoid fidgeting, as it can be distracting.',
  },
];

export default function BodyLanguageTips({ currentQuestionIndex }) {
  const [dismissed, setDismissed] = useState(false);

  // Every time the question changes, un-dismiss so the new tip is visible.
  useEffect(() => {
    setDismissed(false);
  }, [currentQuestionIndex]);

  // Nothing to render once the user has acknowledged the tip.
  if (dismissed) return null;

  // Rotate through the tips array using modulo so the index never goes out of bounds.
  const tip = TIPS[currentQuestionIndex % TIPS.length];

  return (
    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
      <div className="flex items-start justify-between gap-3">
        {/* Icon + text */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0" aria-label={tip.title}>
            {tip.icon}
          </div>
          <div>
            <p className="text-xs text-cyan-400 uppercase tracking-wide font-medium mb-1">
              Body Language Tip · {tip.title}
            </p>
            <p className="text-foreground text-sm leading-relaxed">{tip.tip}</p>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
