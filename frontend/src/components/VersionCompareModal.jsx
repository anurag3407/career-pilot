import React, { useState, useEffect } from 'react'
import { X, GitCommit, ArrowRight, BookOpen } from 'lucide-react'
import { diffLines } from '../utils/diff'
import { motion, AnimatePresence } from 'framer-motion'

export default function VersionCompareModal({ isOpen, onClose, versions, initialLeftVersion, initialRightVersion }) {
  const [leftVersionId, setLeftVersionId] = useState('')
  const [rightVersionId, setRightVersionId] = useState('')
  const [diffResult, setDiffResult] = useState([])
  const [viewMode, setViewMode] = useState('split') // 'split' or 'unified'

  useEffect(() => {
    if (initialLeftVersion) setLeftVersionId(initialLeftVersion.id)
    if (initialRightVersion) setRightVersionId(initialRightVersion.id)
  }, [initialLeftVersion, initialRightVersion])

  const leftVersion = versions.find(v => v.id === leftVersionId)
  const rightVersion = versions.find(v => v.id === rightVersionId)

  useEffect(() => {
    const leftText = leftVersion ? (leftVersion.enhancedText || leftVersion.originalText) : ''
    const rightText = rightVersion ? (rightVersion.enhancedText || rightVersion.originalText) : ''
    
    if (leftText || rightText) {
      const diffs = diffLines(leftText, rightText)
      setDiffResult(diffs)
    } else {
      setDiffResult([])
    }
  }, [leftVersion, rightVersion])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-filter backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl h-[85vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden glass"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Compare Resume Versions</h2>
              <p className="text-xs text-muted-foreground">Select two versions to inspect exact modifications</p>
            </div>
          </div>
          <button type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdowns Selector */}
        <div className="p-4 bg-muted/30 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Base:</span>
              <select
                value={leftVersionId}
                onChange={(e) => setLeftVersionId(e.target.value)}
                className="px-3 py-1.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>
                    v{v.versionNumber} - {v.title || `Version ${v.versionNumber}`}
                  </option>
                ))}
              </select>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Compare:</span>
              <select
                value={rightVersionId}
                onChange={(e) => setRightVersionId(e.target.value)}
                className="px-3 py-1.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>
                    v{v.versionNumber} - {v.title || `Version ${v.versionNumber}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center bg-card border border-border rounded-xl p-0.5">
            <button type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'split' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Split View
            </button>
            <button type="button"
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'unified' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unified View
            </button>
          </div>
        </div>

        {/* Comparison Viewer Body */}
        <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed bg-card/45">
          {viewMode === 'unified' ? (
            <div className="space-y-0.5 select-text">
              {diffResult.map((line, idx) => {
                let bgClass = 'text-foreground'
                let sign = ' '
                if (line.type === 'added') {
                  bgClass = 'bg-green-500/10 text-green-400 border-l-2 border-green-500 pl-1'
                  sign = '+'
                } else if (line.type === 'removed') {
                  bgClass = 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-1 line-through'
                  sign = '-'
                }
                return (
                  <div key={idx} className={`flex py-0.5 px-2 rounded ${bgClass}`}>
                    <span className="w-8 text-right pr-3 select-none text-muted-foreground/60">{idx + 1}</span>
                    <span className="w-4 select-none font-bold text-center mr-2">{sign}</span>
                    <span className="whitespace-pre-wrap">{line.value || ' '}</span>
                  </div>
                )
              })}
              {diffResult.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <GitCommit className="w-12 h-12 mb-3 opacity-50 animate-bounce" />
                  <p>No content differences detected between selected versions.</p>
                </div>
              )}
            </div>
          ) : (
            /* Split View Side-by-side */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Left Column (Base) */}
              <div className="flex flex-col border border-border rounded-2xl bg-muted/20 overflow-hidden h-full">
                <div className="px-4 py-2 border-b border-border bg-muted/40 font-sans font-bold text-muted-foreground flex justify-between">
                  <span>Base (v{leftVersion?.versionNumber})</span>
                  {leftVersion?.atsScore && <span className="text-xs text-primary">ATS: {leftVersion.atsScore}</span>}
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-0.5">
                  {diffResult
                    .filter(line => line.type !== 'added')
                    .map((line, idx) => {
                      const bgClass = line.type === 'removed' ? 'bg-red-500/15 text-red-400 pl-1 border-l-2 border-red-500' : 'text-foreground/80'
                      return (
                        <div key={idx} className={`flex py-0.5 px-2 rounded ${bgClass}`}>
                          <span className="w-6 text-right pr-2 select-none text-muted-foreground/50">{idx + 1}</span>
                          <span className="whitespace-pre-wrap">{line.value || ' '}</span>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Right Column (Compare) */}
              <div className="flex flex-col border border-border rounded-2xl bg-muted/20 overflow-hidden h-full">
                <div className="px-4 py-2 border-b border-border bg-muted/40 font-sans font-bold text-muted-foreground flex justify-between">
                  <span>Compare (v{rightVersion?.versionNumber})</span>
                  {rightVersion?.atsScore && <span className="text-xs text-green-400 font-semibold">ATS: {rightVersion.atsScore}</span>}
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-0.5">
                  {diffResult
                    .filter(line => line.type !== 'removed')
                    .map((line, idx) => {
                      const bgClass = line.type === 'added' ? 'bg-green-500/15 text-green-400 pl-1 border-l-2 border-green-500' : 'text-foreground/80'
                      return (
                        <div key={idx} className={`flex py-0.5 px-2 rounded ${bgClass}`}>
                          <span className="w-6 text-right pr-2 select-none text-muted-foreground/50">{idx + 1}</span>
                          <span className="whitespace-pre-wrap">{line.value || ' '}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
