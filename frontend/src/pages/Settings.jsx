import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { notificationApi } from '../services/api'
import { Bell, Mail, MessageSquare, FileText, Save, Cpu } from 'lucide-react'
import { notificationApi, aiApi } from '../services/api'
import { encryptKey, decryptKey } from '../utils/encryption'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save, Cpu, Sparkles } from 'lucide-react'
import { notificationApi } from '../services/api'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import { SkeletonList } from '../components/ui/Skeleton'
import AIProviderSetup from '../components/settings/AIProviderSetup'

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai-providers', label: 'AI Providers', icon: Sparkles },
]

export default function Settings() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('ai-providers')
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
      toast.error(t('settings.failedToLoad'))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await notificationApi.updatePreferences(preferences)
      toast.success(t('settings.preferencesSaved'))
    } catch (error) {
      toast.error(t('settings.failedToSave'))
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ value, onChange }) => (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${value ? 'bg-indigo-500' : 'bg-muted'
        }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
        value ? (i18n.dir() === 'rtl' ? 'right-7' : 'left-7') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')
      }`} />
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'
        }`} />
    </button>
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-neutral-400">{t('dashboard.loading')}</p>
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="space-y-2 mb-8">
            <div className="h-9 bg-muted rounded-lg w-1/3 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-2/3 animate-pulse" />
          </div>
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-neutral-400 mb-8">{t('settings.subtitle')}</p>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your email notification preferences</p>

          <div className="relative overflow-hidden p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              {t('settings.emailNotifications')}
            </h2>

            {/* Job Alerts */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('settings.jobAlerts')}</p>
                  <p className="text-neutral-400 text-sm">{t('settings.jobAlertsSub')}</p>
                  <p className="text-foreground font-medium">Job Alerts</p>
                  <p className="text-muted-foreground text-sm">Get notified when new jobs match your alerts</p>
                </div>
              </div>
              <Toggle
                value={preferences.jobAlerts}
                onChange={(val) => setPreferences({ ...preferences, jobAlerts: val })}
              />
            </div>

            {/* Direct Messages */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('settings.directMessages')}</p>
                  <p className="text-neutral-400 text-sm">{t('settings.directMessagesSub')}</p>
                  <p className="text-foreground font-medium">Direct Messages</p>
                  <p className="text-muted-foreground text-sm">Get notified when you receive a DM</p>
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
                <FileText className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('settings.proposalUpdates')}</p>
                  <p className="text-neutral-400 text-sm">{t('settings.proposalUpdatesSub')}</p>
                  <p className="text-foreground font-medium">Proposal Updates</p>
                  <p className="text-muted-foreground text-sm">Get notified on fellowship proposal changes</p>
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
              {saving ? t('settings.saving') : t('settings.savePreferences')}
            </Button>
          </div>

          {/* Language Settings Card */}
          <div className="mt-8 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              {t('settings.languageSettings')}
            </h2>
            <p className="text-neutral-400 text-sm -mt-2">
              {t('settings.chooseLanguage')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
                { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
                { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
                { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' }
              ].map((lang) => {
                const isSelected = i18n.language === lang.code || 
                  (lang.code === 'en' && !i18n.language) || 
                  (lang.code === 'en' && i18n.language?.startsWith('en'));
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      toast.success(t('settings.languageSaved'));
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5'
                        : 'bg-neutral-800/30 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate leading-tight">{lang.native}</p>
                      <p className="text-xs text-neutral-500 truncate leading-none mt-1">{lang.name}</p>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>
          <div className="relative overflow-hidden p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 space-y-6 mt-8">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pink-400" />
              AI Configuration (Bring Your Own Key)
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Override the default server AI by providing your own API credentials. Your keys are stored in localstorage.
            </p>

            {loadingAiSettings ? (
              <p className="text-muted-foreground text-sm">Loading settings...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => {
                      setAiProvider(e.target.value)
                      if (e.target.value !== 'openrouter') {
                        setAiModel('')
                      }
                    }}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Server Default (Gemini)</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="openrouter">OpenRouter (100+ Models)</option>
                    <option value="groq">Groq</option>
                  </select>
                </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage notifications and AI provider configuration</p>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border mb-8 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative overflow-hidden p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-400" />
                    Email Notifications
                  </h2>

                  {/* Job Alerts */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-foreground font-medium">Job Alerts</p>
                        <p className="text-muted-foreground text-sm">Get notified when new jobs match your alerts</p>
                      </div>
                    </div>
                    <Toggle
                      value={preferences.jobAlerts}
                      onChange={(val) => setPreferences({ ...preferences, jobAlerts: val })}
                    />
                  </div>

                  {/* Direct Messages */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-foreground font-medium">Direct Messages</p>
                        <p className="text-muted-foreground text-sm">Get notified when you receive a DM</p>
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
                        <p className="text-foreground font-medium">Proposal Updates</p>
                        <p className="text-muted-foreground text-sm">Get notified on fellowship proposal changes</p>
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
            )}

            {/* AI PROVIDERS TAB */}
            {activeTab === 'ai-providers' && (
              <motion.div
                key="ai-providers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <AIProviderSetup />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}