import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save, Cpu } from 'lucide-react'
import { notificationApi, aiApi } from '../services/api'
import { encryptKey, decryptKey } from '../utils/encryption'
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

  // AI Settings State
  const [aiProvider, setAiProvider] = useState('')
  const [aiKey, setAiKey] = useState('')
  const [aiModel, setAiModel] = useState('')
  const [aiModelsList, setAiModelsList] = useState([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingAiSettings, setLoadingAiSettings] = useState(true)
  const [savingAi, setSavingAi] = useState(false)

  useEffect(() => {
    loadPreferences()
    loadAiSettings()
  }, [])

  useEffect(() => {
    if (aiProvider === 'openrouter') {
      loadAiModels()
    } else {
      setAiModelsList([])
    }
  }, [aiProvider])

  const loadAiSettings = async () => {
    try {
      const aiConfigStr = localStorage.getItem('aiConfig')
      if (aiConfigStr) {
        const config = JSON.parse(aiConfigStr)
        setAiProvider(config.provider || '')
        setAiModel(config.model || '')
        setAiKey(decryptKey(config.apiKey) || '')
      } else {
        const openRouterKey = localStorage.getItem('openRouterApiKey')
        if (openRouterKey) {
          setAiProvider('openrouter')
          setAiKey(decryptKey(openRouterKey) || '')
        }
      }
    } catch (error) {
      console.error('Failed to parse AI config', error)
    } finally {
      setLoadingAiSettings(false)
    }
  }

  const loadAiModels = async () => {
    setLoadingModels(true)
    try {
      const res = await aiApi.getModels('openrouter')
      if (res.success) {
        setAiModelsList(res.models)
      }
    } catch (error) {
      toast.error('Failed to load OpenRouter models')
    } finally {
      setLoadingModels(false)
    }
  }

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

  const handleSaveAiSettings = async () => {
    setSavingAi(true)
    try {
      const aiConfig = {
        provider: aiProvider,
        apiKey: encryptKey(aiKey),
        model: aiModel
      }
      localStorage.setItem('aiConfig', JSON.stringify(aiConfig))

      // Keep legacy key updated if using OpenRouter
      if (aiProvider === 'openrouter' && aiKey) {
        localStorage.setItem('openRouterApiKey', encryptKey(aiKey))
      } else if (!aiKey) {
        localStorage.removeItem('openRouterApiKey')
      }

      toast.success('AI Configuration saved locally!')
    } catch (error) {
      toast.error('Failed to save AI Configuration')
    } finally {
      setSavingAi(false)
    }
  }

  const Toggle = ({ value, onChange }) => (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${value ? 'bg-indigo-500' : 'bg-neutral-700'
        }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'
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

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6 mt-8">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pink-400" />
              AI Configuration (Bring Your Own Key)
            </h2>
            <p className="text-neutral-400 text-sm mb-4">
              Override the default server AI by providing your own API credentials. Your keys are stored in localstorage.
            </p>

            {loadingAiSettings ? (
              <p className="text-neutral-500 text-sm">Loading settings...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => {
                      setAiProvider(e.target.value)
                      if (e.target.value !== 'openrouter') {
                        setAiModel('')
                      }
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Server Default (Gemini)</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="openrouter">OpenRouter (100+ Models)</option>
                    <option value="groq">Groq</option>
                  </select>
                </div>

                {aiProvider && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">API Key</label>
                    <input
                      type="password"
                      value={aiKey}
                      onChange={(e) => setAiKey(e.target.value)}
                      placeholder={`Enter your ${aiProvider} API key`}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {aiProvider === 'openrouter' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Model Selection</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      disabled={loadingModels}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Default (gpt-4o-mini)</option>
                      {aiModelsList.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    {loadingModels && <p className="text-xs text-neutral-500 mt-1">Loading OpenRouter models...</p>}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleSaveAiSettings}
              variant="outline"
              loading={savingAi}
              className="w-full flex items-center justify-center gap-2 mt-4 text-white border-neutral-700 hover:bg-neutral-800"
            >
              <Save className="w-4 h-4" />
              Save AI Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}