import { Mail, Github, Linkedin, MousePointerClick } from "lucide-react";

export default function PortfolioContactInteractionAnalytics() {
  const analytics = {
    contactClicks: 124,
    emailClicks: 68,
    githubClicks: 42,
    linkedinClicks: 57,
    topMethod: "Email",
    growth: "+18%",
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MousePointerClick className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Portfolio Contact Interaction Analytics
        </h2>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Contact Clicks</p>
          <p className="text-2xl font-black">{analytics.contactClicks}</p>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <Mail className="w-4 h-4 mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">Email Clicks</p>
          <p className="text-2xl font-black">{analytics.emailClicks}</p>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <Github className="w-4 h-4 mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">GitHub</p>
          <p className="text-2xl font-black">{analytics.githubClicks}</p>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <Linkedin className="w-4 h-4 mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">LinkedIn</p>
          <p className="text-2xl font-black">{analytics.linkedinClicks}</p>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Top Method</p>
          <p className="font-bold">{analytics.topMethod}</p>
        </div>

        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Growth</p>
          <p className="text-2xl font-black text-emerald-500">
            {analytics.growth}
          </p>
        </div>
      </div>
    </div>
  );
}