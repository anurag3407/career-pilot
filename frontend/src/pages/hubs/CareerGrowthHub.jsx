import { GraduationCap, Mic, Mail, Linkedin, Sparkles, Award } from 'lucide-react'
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
        to="/fellowship"
        icon={GraduationCap}
        title="Developer Fellowship"
        description="Join peer groups to work on open-source projects, complete challenges, and earn credentials."
        color="secondary"
      />
      <ToolCard
        to="/skill-gap"
        icon={Sparkles}
        title="Skill Gap Analyzer"
        description="Identify gaps in your skill set against target job requirements."
        badge="AI"
        color="emerald-500"
      />
      <ToolCard
        to="/career-path"
        icon={GraduationCap}
        title="Career Trajectory"
        description="Map out potential future career steps and the skills needed to reach them."
        color="primary"
      />

      {/* Static premium tips section */}
      <div className="col-span-full mt-8 p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Growth Roadmap
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Combine these tools to maximize your success: Start by practicing your elevator pitch in <strong>AI Interview Prep</strong>, draft your networking messages using the <strong>Email Generator</strong>, and make sure your <strong>LinkedIn profile</strong> is fully optimized before reaching out to hiring managers.
        </p>
      </div>
    </HubLayout>
  )
}
