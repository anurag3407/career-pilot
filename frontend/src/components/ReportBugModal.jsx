import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Bug } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReportBugModal({ isOpen, onClose, invalidPath }) {
  const [reportBody, setReportBody] = useState('')

  useEffect(() => {
    if (!isOpen) return

    setReportBody(
      `Invalid URL: ${invalidPath}\n\nPlease describe what you were expecting to find and any additional details that would help us fix this broken link.`
    )
  }, [isOpen, invalidPath])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await navigator.clipboard.writeText(reportBody)
      toast.success('Bug report copied to clipboard!')
      onClose()
    } catch (error) {
      toast.error('Unable to copy report to clipboard. Please try again.')
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0c0c0c] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#00ffaa]/10 p-3 text-[#00ffaa]">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Report broken link</h2>
              <p className="text-sm text-neutral-400">The invalid URL is prefilled so your report is ready to share.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close report modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-300">Invalid URL</label>
            <div className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-[#00ffaa] font-mono break-words">
              {invalidPath}
            </div>
          </div>

          <div>
            <label htmlFor="bug-report" className="mb-2 block text-sm font-semibold text-neutral-300">
              Report details
            </label>
            <textarea
              id="bug-report"
              value={reportBody}
              onChange={(event) => setReportBody(event.target.value)}
              rows={7}
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#00ffaa] focus:ring-2 focus:ring-[#00ffaa]/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-[#111111] px-5 py-3 text-sm text-neutral-200 transition hover:border-[#00ffaa] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#00ffaa] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#00e699]"
            >
              Copy report
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
