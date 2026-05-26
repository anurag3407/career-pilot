import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CopyButton({ text, size = 16, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (!text) return
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      toast.success('Copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
      toast.error('Copy failed')
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      title="Copy"
      className={`inline-flex items-center justify-center p-1 rounded-md hover:bg-muted/60 transition ${className}`}
      type="button"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}
