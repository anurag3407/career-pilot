import { motion as Motion } from 'framer-motion';
import { AlertTriangle, Info, Lightbulb } from 'lucide-react';

const PRIORITY_CONFIG = {
  High: {
    icon: AlertTriangle,
    className: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  Medium: {
    icon: Info,
    className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  },
  Low: {
    icon: Lightbulb,
    className: 'text-green-400 bg-green-500/10 border-green-500/30',
  },
};

export default function ImprovementTips({ tips }) {
  if (!tips?.length) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Improvement Tips
      </h3>
      <ol className="space-y-4">
        {tips.map((tip, index) => {
          const config = PRIORITY_CONFIG[tip.priority] || PRIORITY_CONFIG.Medium;
          const TipIcon = config.icon;

          return (
            <Motion.li
              key={`${tip.text}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex gap-4"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <TipIcon className={`w-4 h-4 ${config.className.split(' ')[0]}`} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${config.className}`}
                  >
                    {tip.priority}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{tip.text}</p>
              </div>
            </Motion.li>
          );
        })}
      </ol>
    </Motion.div>
  );
}
