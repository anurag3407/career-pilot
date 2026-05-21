import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, FileText, Save, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { notificationApi } from '../services/api'
import Button from '../components/Button'
import toast from 'react-hot-toast'

export default function Settings() {
  const { t, i18n } = useTranslation()
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
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
        value ? 'bg-indigo-500' : 'bg-neutral-700'
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
        value ? (i18n.dir() === 'rtl' ? 'right-7' : 'left-7') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')
      }`} />
    </button>
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-neutral-400">{t('dashboard.loading')}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-neutral-400 mb-8">{t('settings.subtitle')}</p>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              {t('settings.emailNotifications')}
            </h2>

            {/* Job Alerts */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('settings.jobAlerts')}</p>
                  <p className="text-neutral-400 text-sm">{t('settings.jobAlertsSub')}</p>
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
                <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('settings.directMessages')}</p>
                  <p className="text-neutral-400 text-sm">{t('settings.directMessagesSub')}</p>
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
          </div>
        </motion.div>
      </div>
    </div>
  )
}