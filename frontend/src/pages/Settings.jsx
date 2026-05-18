import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save } from 'lucide-react'
import { notificationApi } from '../services/api'
import Button from '../components/Button'
import toast from 'react-hot-toast'

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

const Toggle = ({ value, onChange }) => (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
        value ? 'bg-indigo-500' : 'bg-neutral-700'
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
        value ? 'left-7' : 'left-1'
      }`} />
    </button>
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-neutral-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-neutral-400 mb-8">Manage your email notification preferences</p>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              Email Notifications
            </h2>

            {/* Job Alerts */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white font-medium">Job Alerts</p>
                  <p className="text-neutral-400 text-sm">Get notified when new jobs match your alerts</p>
                </div>
              </div>
              <Toggle
                value={preferences.jobAlerts}
                onChange={(val) => setPreferences({ ...preferences, jobAlerts: val })}
              />
            </div>

            {/* Direct Messages */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Direct Messages</p>
                  <p className="text-neutral-400 text-sm">Get notified when you receive a DM</p>
                </div>
              </div>
              <Toggle
                value={preferences.directMessages}
                onChange={(val) => setPreferences({ ...preferences, directMessages: val })}
              />
            </div>

            {/* Proposal Updates */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Proposal Updates</p>
                  <p className="text-neutral-400 text-sm">Get notified on fellowship proposal changes</p>
                </div>
              </div>
              <Toggle
                value={preferences.proposalUpdates}
                onChange={(val) => setPreferences({ ...preferences, proposalUpdates: val })}
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