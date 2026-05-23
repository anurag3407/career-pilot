import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save } from 'lucide-react'
import { notificationApi } from '../services/api'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import { SkeletonList } from '../components/ui/Skeleton'

export default function Settings() {
  const [preferences, setPreferences] = useState({
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const data = await notificationApi.getPreferences()
      setPreferences(data.preferences)
    } catch (error) {
      toast.error('Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await notificationApi.updatePreferences(preferences)
      toast.success('Preferences saved!')
    } catch (error) {
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
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full transition-all ${
        value ? 'left-7' : 'left-1'
      }`} />
    </button>
  )

  if (loading) return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Header Skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-9 bg-muted rounded-lg w-1/3 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-2/3 animate-pulse" />
          </div>

          {/* Settings Skeleton */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
            <div className="h-5 bg-muted rounded-lg w-1/4 animate-pulse" />
            <SkeletonList count={3} />
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your email notification preferences</p>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Email Notifications
            </h2>

            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-medium">Job Alerts</p>
                  <p className="text-muted-foreground text-sm">Get notified when new jobs match your alerts</p>
                </div>
              </div>
              <Toggle
                value={preferences.jobAlerts}
                onChange={(val) => setPreferences({ ...preferences, jobAlerts: val })}
                label="Toggle Job Alerts"
              />
            </div>

            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-foreground font-medium">Direct Messages</p>
                  <p className="text-muted-foreground text-sm">Get notified when you receive a DM</p>
                </div>
              </div>
              <Toggle
                value={preferences.directMessages}
                onChange={(val) => setPreferences({ ...preferences, directMessages: val })}
                label="Toggle Direct Messages"
              />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-foreground font-medium">Proposal Updates</p>
                  <p className="text-muted-foreground text-sm">Get notified on fellowship proposal changes</p>
                </div>
              </div>
              <Toggle
                value={preferences.proposalUpdates}
                onChange={(val) => setPreferences({ ...preferences, proposalUpdates: val })}
                label="Toggle Proposal Updates"
              />
            </div>

            <Button
              onClick={handleSave}
              loading={saving}
              variant="gradient"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}