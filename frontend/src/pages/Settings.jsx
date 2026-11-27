import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Mail,
  MessageSquare,
  FileText,
  Save,
  Sparkles,
  Github,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { notificationApi, subscriptionApi } from '../services/api'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import { SkeletonList } from '../components/ui/Skeleton'
import AIProviderSetup from '../components/settings/AIProviderSetup'
import GithubTokenCard from '../components/settings/GithubTokenCard'

const tabs = [
  { id: 'ai-providers', label: 'AI Providers', icon: Sparkles },
  { id: 'integrations', label: 'Integrations', icon: Github },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ai-providers')
  const [preferences, setPreferences] = useState({
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  })
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [prefRes, subRes] = await Promise.all([
        notificationApi.getPreferences().catch(() => null),
        subscriptionApi.getMySubscription().catch(() => null),
      ])
      if (prefRes?.preferences) setPreferences(prefRes.preferences)
      if (subRes?.plan) setSubscription(subRes)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await notificationApi.updatePreferences(preferences)
      toast.success('Preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ value, onChange, label }) => (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
        value ? 'bg-primary' : 'bg-muted border border-border'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-background shadow transition-all ${
          value ? 'left-6' : 'left-0.5'
        }`}
      />
    </button>
  )

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-6">
            <div className="space-y-2 mb-8">
              <div className="h-9 w-1/3 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="space-y-6 rounded-xl border border-border bg-card p-6">
              <div className="h-5 w-1/4 animate-pulse rounded-lg bg-muted" />
              <SkeletonList count={3} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlanName = subscription?.plan?.name || 'Free Starter (BYOK)'

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <header className="mb-6 border-b border-border pb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85">
            Workspace settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage AI provider keys, GitHub integrations, notification channels, and your CareerPilot plan.
          </p>
        </header>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Settings sections"
          className="mb-7 flex flex-wrap gap-1 rounded-xl border border-border bg-muted/50 p-1 w-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border border-border bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6 rounded-xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                  Email Notifications
                </h2>

                <div className="flex items-center justify-between border-b border-border py-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Job Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified when new roles match your saved alerts</p>
                    </div>
                  </div>
                  <Toggle
                    label="Toggle Job Alerts"
                    value={preferences.jobAlerts}
                    onChange={(val) => setPreferences({ ...preferences, jobAlerts: val })}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-border py-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Direct Messages</p>
                      <p className="text-xs text-muted-foreground">Receive alerts for community direct messages</p>
                    </div>
                  </div>
                  <Toggle
                    label="Toggle Direct Messages"
                    value={preferences.directMessages}
                    onChange={(val) => setPreferences({ ...preferences, directMessages: val })}
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Fellowship Updates</p>
                      <p className="text-xs text-muted-foreground">Updates when challenge proposals change status</p>
                    </div>
                  </div>
                  <Toggle
                    label="Toggle Fellowship Updates"
                    value={preferences.proposalUpdates}
                    onChange={(val) => setPreferences({ ...preferences, proposalUpdates: val })}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  loading={saving}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save Preferences
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai-providers' && (
            <motion.div
              key="ai-providers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AIProviderSetup />
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  GitHub Integration
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connect GitHub to power the GitHub Suite (Resume import, Portfolio builder, README generator, and Repo Visualizer) with higher API limits.
                </p>
              </div>
              <GithubTokenCard />
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 space-y-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Current subscription
                  </p>
                  <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                    {currentPlanName}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bring your own AI keys for free, or upgrade for managed models, higher job-tracking capacity, and automated alerts.
                  </p>
                </div>
                <Link
                  to="/pricing"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  Compare plans <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
