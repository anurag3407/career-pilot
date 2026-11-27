import { CheckCircle2, FileText, Globe, Mic, Target } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * CareerReadinessChecklistDashboard: renders checklist progress from real
 * props so no hardcoded sample state is shown.
 */
export default function CareerReadinessChecklistDashboard({
  hasResume = false,
  hasPortfolio = false,
  hasTargetRoles = false,
  hasInterview = false,
  hasApplied = false,
}) {
  const checklist = [
    { label: "Resume created", status: hasResume, icon: FileText, to: "/hub/resume" },
    { label: "Target roles set", status: hasTargetRoles, icon: Target, to: "/career-profile" },
    { label: "Portfolio published", status: hasPortfolio, icon: Globe, to: "/hub/portfolio" },
    { label: "Interview practiced", status: hasInterview, icon: Mic, to: "/mock-interview/practice" },
    { label: "Application submitted", status: hasApplied, icon: CheckCircle2, to: "/job-tracker" },
  ];

  const completed = checklist.filter((item) => item.status).length;
  const readinessScore = Math.round((completed / checklist.length) * 100);

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">
            Career readiness
          </h2>
        </div>
        <span className="font-mono text-sm font-semibold tabular-nums text-primary">
          {readinessScore}%
        </span>
      </div>

      <div className="space-y-2.5">
        {checklist.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background/50 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>

              {item.status ? (
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-foreground font-semibold">
                  Complete
                </span>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/45 font-medium">
                  Pending
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
