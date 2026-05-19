import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Copy,
  Download,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { twoFactorApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

// ── sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-sm text-neutral-400 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function StatusBadge({ enabled }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${enabled
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
        }
      `}
    >
      {enabled ? (
        <><CheckCircle2 className="w-3 h-3" /> Active</>
      ) : (
        <><ShieldOff className="w-3 h-3" /> Not enabled</>
      )}
    </span>
  )
}

function BackupCodeGrid({ codes, onCopy, onDownload }) {
  return (
    <div className="mt-4">
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
        <p className="text-xs text-amber-400 font-medium">
          Save these codes somewhere safe. Each code can only be used once.
          You won't be able to view them again.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {codes.map((code, i) => (
          <div
            key={i}
            className="px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-sm text-center text-white tracking-widest"
          >
            {code}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onCopy}>
          <Copy className="w-4 h-4" />
          Copy all
        </Button>
        <Button variant="secondary" size="sm" onClick={onDownload}>
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function SecuritySettings() {
  // 'disabled' | 'setup' | 'enabled'
  const [view, setView] = useState('disabled')
  const [loading, setLoading] = useState(true)

  // Setup flow
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [rawSecret, setRawSecret] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)

  // Enabled view
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(0)
  const [newCodes, setNewCodes] = useState([])
  const [showCodesFor, setShowCodesFor] = useState(null) // 'enable' | 'regenerate'

  // Disable confirmation
  const [disableOpen, setDisableOpen] = useState(false)
  const [disableToken, setDisableToken] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)

  // Regenerate confirmation
  const [regenOpen, setRegenOpen] = useState(false)
  const [regenToken, setRegenToken] = useState('')
  const [regenLoading, setRegenLoading] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const data = await twoFactorApi.getStatus()
      setView(data.enabled ? 'enabled' : 'disabled')
      setBackupCodesRemaining(data.backupCodesRemaining)
    } catch (error) {
      toast.error('Failed to load security settings')
    } finally {
      setLoading(false)
    }
  }

  // ── handlers ──

  const handleStartSetup = async () => {
    setSetupLoading(true)
    try {
      const data = await twoFactorApi.setup()
      setQrDataUrl(data.qrDataUrl)
      setRawSecret(data.secret)
      setSetupToken('')
      setView('setup')
    } catch (error) {
      toast.error(error.message || 'Failed to start setup')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleConfirmSetup = async (e) => {
    e.preventDefault()
    if (!setupToken.trim()) return

    setSetupLoading(true)
    try {
      const data = await twoFactorApi.enable(rawSecret, setupToken.trim())
      setNewCodes(data.backupCodes)
      setShowCodesFor('enable')
      setView('enabled')
      setBackupCodesRemaining(data.backupCodes.length)
      toast.success('Two-factor authentication enabled')
    } catch (error) {
      toast.error(error.message || 'Invalid code — please try again')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleDisable = async (e) => {
    e.preventDefault()
    if (!disableToken.trim()) return

    setDisableLoading(true)
    try {
      await twoFactorApi.disable(disableToken.trim())
      setView('disabled')
      setDisableOpen(false)
      setDisableToken('')
      setNewCodes([])
      setShowCodesFor(null)
      toast.success('Two-factor authentication disabled')
    } catch (error) {
      toast.error(error.message || 'Invalid code — please try again')
    } finally {
      setDisableLoading(false)
    }
  }

  const handleRegenerate = async (e) => {
    e.preventDefault()
    if (!regenToken.trim()) return

    setRegenLoading(true)
    try {
      const data = await twoFactorApi.regenerateBackupCodes(regenToken.trim())
      setNewCodes(data.backupCodes)
      setShowCodesFor('regenerate')
      setBackupCodesRemaining(data.backupCodes.length)
      setRegenOpen(false)
      setRegenToken('')
      toast.success('Backup codes regenerated')
    } catch (error) {
      toast.error(error.message || 'Invalid code — please try again')
    } finally {
      setRegenLoading(false)
    }
  }

  const handleCopyCodes = (codes) => {
    navigator.clipboard.writeText(codes.join('\n'))
    toast.success('Codes copied to clipboard')
  }

  const handleDownloadCodes = (codes) => {
    const blob = new Blob(
      [`careerpilot 2FA Backup Codes\n${'─'.repeat(30)}\n${codes.join('\n')}\n\nEach code can only be used once.`],
      { type: 'text/plain' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'careerpilot-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── render ──

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Account Security</h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Manage authentication and access settings for your account.
        </p>
      </div>

      {/* ── Two-Factor Authentication card ───────────────────────────────────── */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader
            icon={Shield}
            title="Two-Factor Authentication"
            description="Add a second layer of security to your account using an authenticator app."
          />
          <StatusBadge enabled={view === 'enabled'} />
        </div>

        {/* ── DISABLED state ─────────────────────────────────────────────────── */}
        {view === 'disabled' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: ShieldCheck, label: 'Stronger account security' },
                { icon: KeyRound, label: 'Protect against credential theft' },
                { icon: RefreshCw, label: 'Backup codes for recovery' }
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950 border border-neutral-800"
                >
                  <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-neutral-300">{label}</span>
                </div>
              ))}
            </div>

            <Button
              variant="gradient"
              loading={setupLoading}
              onClick={handleStartSetup}
            >
              <Shield className="w-4 h-4" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}

        {/* ── SETUP state ────────────────────────────────────────────────────── */}
        {view === 'setup' && (
          <form onSubmit={handleConfirmSetup}>
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    Install an authenticator app
                  </p>
                  <p className="text-xs text-neutral-400">
                    Use Google Authenticator, Authy, or any TOTP-compatible app.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="w-full">
                  <p className="text-sm font-medium text-white mb-3">
                    Scan this QR code
                  </p>
                  {qrDataUrl && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-white rounded-xl inline-block">
                        <img src={qrDataUrl} alt="2FA QR Code" className="w-40 h-40" />
                      </div>
                      <details className="w-full">
                        <summary className="text-xs text-neutral-500 cursor-pointer select-none hover:text-neutral-300 transition-colors">
                          Can't scan? Enter the key manually
                        </summary>
                        <p className="mt-2 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-300 break-all">
                          {rawSecret}
                        </p>
                      </details>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="w-full">
                  <p className="text-sm font-medium text-white mb-3">
                    Enter the 6-digit code to confirm
                  </p>
                  <Input
                    type="text"
                    name="setupToken"
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="font-mono tracking-widest text-center text-lg"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="gradient"
                  loading={setupLoading}
                  disabled={setupToken.length !== 6}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Confirm &amp; Enable
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setView('disabled')
                    setSetupToken('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ── ENABLED state ──────────────────────────────────────────────────── */}
        {view === 'enabled' && (
          <div className="space-y-4">
            {/* Backup codes just received (after enable or regenerate) */}
            {newCodes.length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <p className="text-sm font-semibold text-white mb-1">
                  {showCodesFor === 'enable' ? 'Your backup codes' : 'New backup codes'}
                </p>
                <BackupCodeGrid
                  codes={newCodes}
                  onCopy={() => handleCopyCodes(newCodes)}
                  onDownload={() => handleDownloadCodes(newCodes)}
                />
                <button
                  onClick={() => { setNewCodes([]); setShowCodesFor(null) }}
                  className="mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  I've saved these codes — dismiss
                </button>
              </div>
            )}

            {/* Backup codes remaining */}
            {newCodes.length === 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-neutral-400" />
                  <div>
                    <p className="text-sm text-white font-medium">Backup codes</p>
                    <p className="text-xs text-neutral-500">
                      {backupCodesRemaining} of 8 codes remaining
                    </p>
                  </div>
                </div>
                {backupCodesRemaining <= 2 && (
                  <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
                    Running low
                  </span>
                )}
              </div>
            )}

            {/* Regenerate backup codes */}
            <div className="rounded-xl border border-neutral-800 overflow-hidden">
              <button
                type="button"
                onClick={() => { setRegenOpen(v => !v); setDisableOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-neutral-950 hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-white">Regenerate backup codes</span>
                </div>
                {regenOpen
                  ? <ChevronUp className="w-4 h-4 text-neutral-500" />
                  : <ChevronDown className="w-4 h-4 text-neutral-500" />
                }
              </button>
              {regenOpen && (
                <form
                  onSubmit={handleRegenerate}
                  className="px-4 pb-4 pt-3 border-t border-neutral-800 bg-neutral-950 space-y-3"
                >
                  <p className="text-xs text-neutral-400">
                    This will invalidate your existing codes. Enter your current authenticator code to proceed.
                  </p>
                  <Input
                    type="text"
                    name="regenToken"
                    value={regenToken}
                    onChange={(e) => setRegenToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="font-mono tracking-widest text-center"
                    maxLength={6}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    loading={regenLoading}
                    disabled={regenToken.length !== 6}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate new codes
                  </Button>
                </form>
              )}
            </div>

            {/* Disable 2FA */}
            <div className="rounded-xl border border-red-500/20 overflow-hidden">
              <button
                type="button"
                onClick={() => { setDisableOpen(v => !v); setRegenOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-red-500/5 hover:bg-red-500/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldOff className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Disable two-factor authentication</span>
                </div>
                {disableOpen
                  ? <ChevronUp className="w-4 h-4 text-red-500/60" />
                  : <ChevronDown className="w-4 h-4 text-red-500/60" />
                }
              </button>
              {disableOpen && (
                <form
                  onSubmit={handleDisable}
                  className="px-4 pb-4 pt-3 border-t border-red-500/20 bg-red-500/5 space-y-3"
                >
                  <p className="text-xs text-red-400/80">
                    This will remove 2FA protection from your account. Enter your current authenticator code to confirm.
                  </p>
                  <Input
                    type="text"
                    name="disableToken"
                    value={disableToken}
                    onChange={(e) => setDisableToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="font-mono tracking-widest text-center"
                    maxLength={6}
                  />
                  <Button
                    type="submit"
                    variant="danger"
                    size="sm"
                    loading={disableLoading}
                    disabled={disableToken.length !== 6}
                  >
                    <ShieldOff className="w-4 h-4" />
                    Disable 2FA
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
