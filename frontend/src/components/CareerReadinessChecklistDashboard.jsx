import { CheckCircle2, FileText, Globe, Mic, Target } from "lucide-react";

export default function CareerReadinessChecklistDashboard() {
  const checklist = [
    { label: "Resume Completed", status: true, icon: FileText },
    { label: "Portfolio Ready", status: true, icon: Globe },
    { label: "Skill Assessment Completed", status: false, icon: Target },
    { label: "Interview Preparation", status: true, icon: Mic },
    { label: "Application Ready", status: false, icon: CheckCircle2 },
  ];

  const completed = checklist.filter((item) => item.status).length;
  const readinessScore = Math.round(
    (completed / checklist.length) * 100
  );

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Career Readiness Checklist
        </h2>
      </div>

      <div className="mb-6 p-5 rounded-xl border border-border">
        <p className="text-xs text-muted-foreground">
          Readiness Score
        </p>
        <p className="text-3xl font-black text-emerald-500">
          {readinessScore}%
        </p>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-4 rounded-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-semibold">{item.label}</span>
              </div>

              {item.status ? (
                <span className="text-emerald-500 font-bold">
                  Complete
                </span>
              ) : (
                <span className="text-amber-500 font-bold">
                  Pending
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}