import { motion as Motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ATSChecker({ atsScore, atsChecks }) {
  if (!atsChecks?.length) return null;

  const passed = atsChecks.filter((c) => c.passed);
  const failed = atsChecks.filter((c) => !c.passed);
  const pct = Math.round((atsScore / 25) * 100);

  const barColor =
    atsScore >= 20 ? 'bg-green-500' : atsScore >= 12 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-5"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground">ATS Friendliness</h3>
          <span className="text-sm font-semibold text-foreground">
            {atsScore} / 25
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <Motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          How well your resume can be parsed by Applicant Tracking Systems
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Passed ({passed.length})
          </h4>
          <ul className="space-y-2">
            {passed.map((check, i) => (
              <Motion.li
                key={check.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{check.label}</span>
              </Motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Needs Improvement ({failed.length})
          </h4>
          {failed.length === 0 ? (
            <p className="text-sm text-muted-foreground">All ATS checks passed.</p>
          ) : (
            <ul className="space-y-3">
              {failed.map((check, i) => (
                <Motion.li
                  key={check.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm"
                >
                  <div className="flex items-start gap-2 text-foreground">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{check.label}</span>
                  </div>
                  {check.suggestion && (
                    <p className="text-muted-foreground text-xs mt-1 ml-6">{check.suggestion}</p>
                  )}
                </Motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
