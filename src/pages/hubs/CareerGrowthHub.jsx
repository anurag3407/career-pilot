import { GraduationCap, Mic, Mail, Globe, Award, TrendingUp } from 'lucide-react'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'

export default function CareerGrowthHub() {
  return (
    <HubLayout
      icon={GraduationCap}
      title="Career Growth"
      description="Level up your skills, practice mock interviews, automate professional emails, and optimize your LinkedIn presence."
      color="primary"
      breadcrumb="Career Growth"
    >
      <ToolCard
        to="/interview-prep"
        icon={Mic}
        title="AI Interview Prep"
        description="Practice answering mock interview questions and receive instant AI grading and tips."
        badge="Audio AI"
        color="primary"
      />
      <ToolCard
        to="/career-path"
        icon={TrendingUp}
        title="AI Career Trajectory"
        description="Forecast your industry growth pathway, map required skill milestones, and estimate salary progression."
        badge="New AI"
        color="indigo-500"
      />
      <ToolCard
        to="/fellowship"
        icon={GraduationCap}
        title="Developer Fellowship"
        description="Join peer groups to work on open-source projects, complete challenges, and earn credentials."
        color="secondary"
      />
      <ToolCard
        to="/email-generator"
        icon={Mail}
        title="AI Email Generator"
        description="Draft professional cold emails, application follow-ups, and negotiation letters."
        color="emerald-500"
      />
      <ToolCard
        to="/linkedin-optimizer"
        icon={Globe}
        title="LinkedIn Optimizer"
        description="Optimize your LinkedIn headline, bio, and descriptions with high-impact keywords."
        badge="AI"
        color="primary"
      />

      {/* Dynamic premium tips section */}
      {(() => {
        const premiumTips = [
          {
            id: 'trajectory',
            tool: 'AI Career Trajectory',
            tip: 'Forecast your career timeline and map required skill milestones.'
          },
          {
            id: 'interview',
            tool: 'AI Interview Prep',
            tip: 'Practice your elevator pitch and answer mock interviews with instant AI grading.'
          },
          {
            id: 'email',
            tool: 'AI Email Generator',
            tip: 'Draft high-impact cold emails and follow-ups to stand out in the inbox.'
          },
          {
            id: 'linkedin',
            tool: 'LinkedIn Optimizer',
            tip: 'Ensure your profile is fully search-optimized before sending connection requests.'
          }
        ]

        return premiumTips.length > 0 ? (
          <div className="col-span-full mt-8 p-6 rounded-2xl bg-card border border-border shadow-md">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500 animate-bounce" />
              Growth Roadmap Guidance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumTips.map((tipItem) => (
                <div 
                  key={tipItem.id} 
                  className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5 hover:border-primary/30 transition shadow-sm"
                >
                  <h4 className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">{tipItem.tool}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tipItem.tip}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null
      })()}
    </HubLayout>
  )
}
