import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Globe, Lock, Save, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../Button'
import Input from '../Input'
import { portfolioApi } from '../../services/api'
import { cn } from '../../lib/utils'

const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const getInitialSettings = (portfolio = {}) => ({
  slug: portfolio.slug || '',
  visibility: portfolio.visibility || 'public',
  passwordProtected: Boolean(portfolio.passwordProtected),
  password: '',
  customCss: portfolio.customCss || '',
  customHeadTags: portfolio.customHeadTags || '',
})

export default function PortfolioSettings({
  portfolio = {},
  existingSlugs = [],
  onSave,
  onDelete,
  onChange,
  onSlugAvailabilityCheck,
}) {
  const [settings, setSettings] = useState(() => getInitialSettings(portfolio))
  const [slugStatus, setSlugStatus] = useState({ state: 'idle', message: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const currentSlug = portfolio.slug || ''

  const slugError = useMemo(() => {
    if (!settings.slug.trim()) return 'Portfolio slug is required.'
    if (!SLUG_PATTERN.test(settings.slug)) {
      return 'Use lowercase letters, numbers, and hyphens. Start and end with a letter or number.'
    }
    return ''
  }, [settings.slug])

  const passwordError = useMemo(() => {
    if (!settings.passwordProtected) return ''
    if (portfolio.passwordProtected) return ''
    if (!settings.password.trim()) return 'Set a password before enabling protection.'
    return ''
  }, [portfolio.passwordProtected, settings.password, settings.passwordProtected])

  const hasSlugCollision = slugStatus.state === 'taken'
  const canSave = !slugError && !passwordError && !hasSlugCollision && slugStatus.state !== 'checking'

  useEffect(() => {
    const next = getInitialSettings(portfolio)
    setSettings(next)
    setSlugStatus({ state: 'idle', message: '' })
    setConfirmText('')
  }, [portfolio])

  useEffect(() => {
    onChange?.(settings)
  }, [settings, onChange])

  useEffect(() => {
    const slug = settings.slug

    if (slugError) {
      setSlugStatus({ state: 'invalid', message: slugError })
      return
    }

    if (slug === currentSlug) {
      setSlugStatus({ state: 'available', message: 'Current slug.' })
      return
    }

    const localCollision = existingSlugs
      .filter(Boolean)
      .map((item) => item.toLowerCase())
      .includes(slug.toLowerCase())

    if (localCollision) {
      setSlugStatus({ state: 'taken', message: 'This slug is already used by another portfolio.' })
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setSlugStatus({ state: 'checking', message: 'Checking availability...' })

      try {
        const result = onSlugAvailabilityCheck
          ? await onSlugAvailabilityCheck(slug, currentSlug)
          : await portfolioApi.checkSlug(slug, currentSlug)

        if (cancelled) return

        const available = result.available ?? result.data?.available ?? false
        setSlugStatus({
          state: available ? 'available' : 'taken',
          message: available ? 'Slug is available.' : 'This slug is already taken.',
        })
      } catch (err) {
        if (cancelled) return
        setSlugStatus({
          state: 'warning',
          message: err.message || 'Could not check availability. Save will still validate on the server.',
        })
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [currentSlug, existingSlugs, onSlugAvailabilityCheck, settings.slug, slugError])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSlugChange = (event) => {
    updateSetting('slug', normalizeSlug(event.target.value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!settings.slug.trim()) {
      setSlugStatus({ state: 'invalid', message: 'Portfolio slug is required.' })
      return
    }

    if (!canSave) return

    const payload = {
      ...settings,
      password: settings.passwordProtected ? settings.password : '',
    }

    try {
      setSaving(true)
      if (onSave) {
        await onSave(payload)
      } else {
        await portfolioApi.updateSettings(currentSlug || settings.slug, payload)
      }
      toast.success('Portfolio settings saved')
    } catch (err) {
      toast.error(err.message || 'Failed to save portfolio settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirmText !== settings.slug || deleting) return

    try {
      setDeleting(true)
      if (onDelete) {
        await onDelete(portfolio)
      } else {
        await portfolioApi.delete(settings.slug)
      }
      toast.success('Portfolio deleted')
      setConfirmText('')
    } catch (err) {
      toast.error(err.message || 'Failed to delete portfolio')
    } finally {
      setDeleting(false)
    }
  }

  const statusClassName = {
    available: 'text-emerald-600',
    checking: 'text-muted-foreground',
    invalid: 'text-destructive',
    taken: 'text-destructive',
    warning: 'text-amber-600',
    idle: 'text-muted-foreground',
  }[slugStatus.state]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-foreground">Portfolio Configuration</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage publishing, access, and advanced embed settings.
            </p>
          </div>
          <Button type="submit" size="sm" loading={saving} disabled={!canSave || saving}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <Input
              label="Portfolio slug"
              name="portfolio-slug"
              value={settings.slug}
              onChange={handleSlugChange}
              placeholder="my-portfolio"
              required
              error={slugError || (hasSlugCollision ? slugStatus.message : '')}
            />
            {slugStatus.message && !slugError && !hasSlugCollision && (
              <p className={cn('mt-[-1rem] mb-6 flex items-center gap-2 text-sm font-bold', statusClassName)}>
                {slugStatus.state === 'available' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {slugStatus.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-foreground opacity-70">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/30 p-1.5">
              {[
                { value: 'public', label: 'Public', icon: Globe },
                { value: 'private', label: 'Private', icon: Lock },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateSetting('visibility', value)}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-colors',
                    settings.visibility === value
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-2xl border border-border bg-muted/20 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-black text-foreground">Password protection</span>
              <span className="block text-sm text-muted-foreground">Require a password before visitors can view this portfolio.</span>
            </span>
            <span
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors',
                settings.passwordProtected ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            >
              <input
                type="checkbox"
                checked={settings.passwordProtected}
                onChange={(event) => updateSetting('passwordProtected', event.target.checked)}
                className="sr-only"
              />
              <span
                className={cn(
                  'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  settings.passwordProtected ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </span>
          </label>

          {settings.passwordProtected && (
            <div className="mt-4">
              <Input
                label="Portfolio password"
                name="portfolio-password"
                type="password"
                value={settings.password}
                onChange={(event) => updateSetting('password', event.target.value)}
                placeholder="Set or replace password"
                error={passwordError}
              />
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-black text-foreground">Advanced</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add custom styling and trusted head tags for analytics or verification.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-foreground opacity-70">
              Custom CSS
            </span>
            <textarea
              value={settings.customCss}
              onChange={(event) => updateSetting('customCss', event.target.value)}
              placeholder=".hero-title { letter-spacing: 0; }"
              rows={10}
              className="min-h-[220px] w-full resize-y rounded-2xl border border-border bg-muted/30 px-5 py-3.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-foreground opacity-70">
              Custom head tags
            </span>
            <textarea
              value={settings.customHeadTags}
              onChange={(event) => updateSetting('customHeadTags', event.target.value)}
              placeholder='<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>'
              rows={10}
              className="min-h-[220px] w-full resize-y rounded-2xl border border-border bg-muted/30 px-5 py-3.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleting a portfolio is permanent. Type the slug to confirm.
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={settings.slug || 'portfolio-slug'}
                aria-label="Confirm portfolio slug"
                className="min-w-0 flex-1 rounded-2xl border border-destructive/30 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={deleting}
                disabled={confirmText !== settings.slug || deleting}
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>
    </form>
  )
}

export { normalizeSlug }
