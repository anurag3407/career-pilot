import { Target } from 'lucide-react';
import AIReasoningTooltip from '../ui/AIReasoningTooltip';
import { getJobMatchReasoning, hasJobMatchData } from '../../utils/jobMatchReasoning';

export default function JobMatchBadge({ job }) {
  if (!hasJobMatchData(job)) return null;

  const { title, reason, details, score } = getJobMatchReasoning(job);

  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <Target className="h-3 w-3" aria-hidden="true" />
      {score != null ? `${score}% match` : 'AI match'}
      <span
        className="inline-flex"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key !== 'Escape') e.stopPropagation()
        }}
      >
        <AIReasoningTooltip title={title} reason={reason} details={details} />
      </span>
    </span>
  );
}
