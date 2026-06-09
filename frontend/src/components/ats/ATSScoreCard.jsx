import React from 'react';
import { Card } from '@/components/ui/glassCard';
import { cn } from '@/lib/utils';

/**
 * ATSScoreCard – displays the overall ATS score and a short summary.
 * Props:
 *   score: number (0‑100)
 *   suggestions: string[] – brief improvement items
 */
export const ATSScoreCard = ({ score = 0, suggestions = [] }) => {
  const scoreColor =
    score >= 80 ? 'bg-primary' : score >= 50 ? 'bg-yellow-500' : 'bg-destructive';

  return (
    <Card className="premium-card p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold gradient-text">ATS Compatibility</h2>
      <div className={cn('text-4xl font-bold', scoreColor, 'text-primary-foreground rounded-full w-24 h-24 flex items-center justify-center')}> {score}% </div>
      <ul className="list-disc list-inside space-y-1 text-sm">
        {suggestions.length > 0 ? (
          suggestions.map((s, i) => <li key={i}>{s}</li>)
        ) : (
          <li>No suggestions – your resume looks great!</li>
        )}
      </ul>
    </Card>
  );
};

export default ATSScoreCard;
