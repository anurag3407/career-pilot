import { useState } from 'react'
import { Languages, Loader2, Copy, Check, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { enhanceApi } from '../../services/api'

/**
 * ResumeTranslator — translates the current resume into a target language.
 *
 * Wraps `POST /enhance/translate`. Output preserves formatting, section
 * headers, dates (localized), and proper-noun technical terms.
 *
 * Props:
 *   resumeText — current resume text (markdown or plain)
 *   onTranslated(text) — optional callback when the user accepts the translation
 */
const LANGUAGES = [
  { code: 'es',    label: 'Spanish' },
  { code: 'fr',    label: 'French' },
  { code: 'de',    label: 'German' },
  { code: 'it',    label: 'Italian' },
  { code: 'pt',    label: 'Portuguese' },
  { code: 'zh',    label: 'Mandarin Chinese' },
  { code: 'ja',    label: 'Japanese' },
  { code: 'ko',    label: 'Korean' },
  { code: 'hi',    label: 'Hindi' },
  { code: 'ar',    label: 'Arabic' },
  { code: 'ru',    label: 'Russian' },
  { code: 'nl',    label: 'Dutch' },
  { code: 'pl',    label: 'Polish' },
  { code: 'tr',    label: 'Turkish' },
  { code: 'sv',    label: 'Swedish' },
  { code: 'da',    label: 'Danish' },
  { code: 'no',    label: 'Norwegian' },
  { code: 'fi',    label: 'Finnish' },
  { code: 'el',    label: 'Greek' },
  { code: 'cs',    label: 'Czech' },
  { code: 'ro',    label: 'Romanian' },
  { code: 'hu',    label: 'Hungarian' },
  { code: 'th',    label: 'Thai' },
  { code: 'vi',    label: 'Vietnamese' },
  { code: 'id',    label: 'Indonesian' },
  { code: 'ms',    label: 'Malay' },
  { code: 'tl',    label: 'Filipino' },
  { code: 'uk',    label: 'Ukrainian' },
  { code: 'he',    label: 'Hebrew' },
  { code: 'bn',    label: 'Bengali' },
]

export default function ResumeTranslator({ resumeText, onTranslated }) {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState('es')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { translatedText, targetLanguage }
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!resumeText || !resumeText.trim()) {
      toast.error('No resume text to translate')
      return
    }
    setLoading(true)
    setResult(null)
    const toastId = toast.loading(`Translating to ${LANGUAGES.find(l => l.code === target)?.label || target}…`)
    try {
      const res = await enhanceApi.translateResume(resumeText, target)
      const text = res?.data?.translatedText || res?.translatedText
      if (!text) {
        toast.error('Empty response', { id: toastId })
        return
      }
      setResult({ translatedText: text, targetLanguage: target })
      toast.success('Translation ready', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Translation failed', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.translatedText)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Copy failed')
    }
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.translatedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume_${result.targetLanguage}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-sky-500"
      >
        <Languages className="w-4 h-4" />
        Translate Resume
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.label}>{l.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Translating…
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5" />
                  Translate
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-background hover:bg-muted text-foreground"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-background hover:bg-muted text-foreground"
                >
                  <Download className="w-3 h-3" />
                  .txt
                </button>
                {onTranslated && (
                  <button
                    type="button"
                    onClick={() => onTranslated(result.translatedText)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Check className="w-3 h-3" />
                    Replace current resume text
                  </button>
                )}
              </div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground bg-muted/50 p-3 rounded-lg border border-border">
                {result.translatedText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
