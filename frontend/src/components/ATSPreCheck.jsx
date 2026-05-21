import React from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function ATSPreCheck({ file }) {
  if (!file) return null

  const warnings = []

  // PDF validation
  if (file.type !== 'application/pdf') {
    warnings.push('Only PDF files are supported.')
  }

  // File size validation
  if (file.size > 5 * 1024 * 1024) {
    warnings.push('File size exceeds 5MB.')
  }

  // Basic text extraction validation
  if (file.size < 1000) {
    warnings.push('Resume content may be too small for proper ATS parsing.')
  }

  // Font compatibility warning
  warnings.push('Avoid decorative fonts for better ATS compatibility.')

  return (
    <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold text-yellow-300">
          ATS Pre-Check
        </h3>
      </div>

      <div className="space-y-2">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm text-neutral-300"
          >
            <CheckCircle className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
            <span>{warning}</span>
          </div>
        ))}
      </div>
    </div>
  )
}