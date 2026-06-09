import React from 'react';
import { Target } from 'lucide-react';

export default function MatchScoreBadge({ score }) {
  if (score === null || score === undefined) return null;

  let badgeColor = '';
  let label = '';

  if (score <= 40) {
    badgeColor = 'bg-red-500/20 text-red-500 border-red-500/30';
    label = 'Low Match';
  } else if (score <= 70) {
    badgeColor = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    label = 'Partial Match';
  } else {
    badgeColor = 'bg-green-500/20 text-green-500 border-green-500/30';
    label = 'Strong Match';
  }

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeColor}`}
      title="Based on your resume"
    >
      <Target className="w-3.5 h-3.5" />
      <span>{score}% {label}</span>
    </div>
  );
}
