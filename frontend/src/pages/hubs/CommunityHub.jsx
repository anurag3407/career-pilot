import { Users, MessageSquare, FileText, Mail, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'

export default function CommunityHub() {
  return (
    <HubLayout
      icon={Users}
      title="Community & Network"
      description="Share career insights, ask for resume feedback in topic channels, message peers directly, and join fellowship challenges."
      color="primary"
      suite="04 Presence & Network"
      breadcrumb="Community"
      actions={
        <Link
          to="/community"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Open community <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <ToolCard
        to="/community?view=posts"
        icon={FileText}
        title="Community Feed"
        description="Browse and publish career posts, interview takeaways, and portfolio showcases."
        color="primary"
      />
      <ToolCard
        to="/community?view=channels"
        icon={MessageSquare}
        title="Chat Channels"
        description="Participate in real-time topic channels with fellow engineers and job seekers."
        color="secondary"
      />
      <ToolCard
        to="/community?view=dms"
        icon={Mail}
        title="Direct Messages"
        description="Connect one-on-one with peers for mock interviews, referrals, and project feedback."
        color="emerald"
      />
      <ToolCard
        to="/fellowship"
        icon={Award}
        title="Fellowship Challenges"
        description="Collaborate on scoped engineering challenges, submit proposals, and build proof of work."
        color="amber"
      />
    </HubLayout>
  )
}
