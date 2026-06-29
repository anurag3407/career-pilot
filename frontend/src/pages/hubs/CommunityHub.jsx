import { Users, MessageSquare, FileText, Mail, ArrowRight } from 'lucide-react'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import { Link } from 'react-router-dom'

export default function CommunityHub() {
  return (
    <HubLayout
      icon={Users}
      title="Community Hub"
      description="Connect with other developers, share career insights, participate in live discussion channels, and expand your professional network."
      color="primary"
      breadcrumb="Community Hub"
    >
      <ToolCard
        to="/community?view=posts"
        icon={FileText}
        title="Community Feed"
        description="Browse, write, and engage with professional posts and articles published by community members."
        color="primary"
      />
      <ToolCard
        to="/community?view=channels"
        icon={MessageSquare}
        title="Chat Channels"
        description="Participate in real-time developer group chat channels organized by topic."
        color="secondary"
      />
      <ToolCard
        to="/community?view=dms"
        icon={Mail}
        title="Direct Messages"
        description="Initiate and manage one-on-one direct message conversations with peers."
        color="emerald-500"
      />

      {/* Community overview card */}
      <div className="col-span-full mt-6 p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1.5 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Engage with the Community
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            Building a strong network is one of the most effective ways to accelerate your career. Join conversations, ask for resume feedback, and stay connected with fellow job seekers.
          </p>
        </div>
        <Link
          to="/community"
          className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Go to Community Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </HubLayout>
  )
}
