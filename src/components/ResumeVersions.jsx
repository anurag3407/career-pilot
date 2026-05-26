import React, { useState, useEffect } from 'react'
import { FileText, Plus, CheckCircle, RotateCcw, Trash2, Edit2, GitPullRequest, Bookmark, Sparkles, Tag, X } from 'lucide-react'
import { resumeApi } from '../services/api'
import toast from 'react-hot-toast'
import VersionCompareModal from './VersionCompareModal'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResumeVersions({ 
  resumeId, 
  currentOriginalText, 
  currentEnhancedText, 
  currentJobRole, 
  currentAtsScore,
  onRestore 
}) {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Snapshot Form state
  const [showSnapshotForm, setShowSnapshotForm] = useState(false)
  const [snapshotTitle, setSnapshotTitle] = useState('')
  const [snapshotRole, setSnapshotRole] = useState(currentJobRole || '')
  const [snapshotTags, setSnapshotTags] = useState('')
  const [savingSnapshot, setSavingSnapshot] = useState(false)

  // Edit version metadata state
  const [editingVersion, setEditingVersion] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editTags, setEditTags] = useState('')
  const [updatingMetadata, setUpdatingMetadata] = useState(false)

  // Comparison Modal state
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareLeft, setCompareLeft] = useState(null)
  const [compareRight, setCompareRight] = useState(null)

  useEffect(() => {
    fetchVersions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  const fetchVersions = async () => {
    try {
      setLoading(true)
      const res = await resumeApi.getVersions(resumeId)
      setVersions(res.data || [])
    } catch (err) {
      toast.error('Failed to load version history')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSnapshot = async (e) => {
    e.preventDefault()
    if (!currentOriginalText) {
      toast.error('No resume content available to snapshot')
      return
    }

    try {
      setSavingSnapshot(true)
      const tagsArray = snapshotTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const payload = {
        title: snapshotTitle.trim() || undefined,
        originalText: currentOriginalText,
        enhancedText: currentEnhancedText || null,
        jobRole: snapshotRole.trim() || null,
        atsScore: currentAtsScore !== undefined && currentAtsScore !== null ? currentAtsScore : null,
        tags: tagsArray
      }

      const res = await resumeApi.createVersion(resumeId, payload)
      setVersions(prev => [res.data, ...prev])
      toast.success('Snapshot created successfully!')
      
      // Reset form
      setSnapshotTitle('')
      setSnapshotTags('')
      setShowSnapshotForm(false)
    } catch (err) {
      toast.error('Failed to save snapshot version')
    } finally {
      setSavingSnapshot(false)
    }
  }

  const handleRestore = async (version) => {
    const confirm = window.confirm(`Are you sure you want to restore the resume to Version ${version.versionNumber} ("${version.title}")? This will update your active resume.`)
    if (!confirm) return

    try {
      toast.loading('Restoring resume version...', { id: 'restore' })
      const res = await resumeApi.restoreVersion(resumeId, version.id)
      toast.success('Resume restored successfully!', { id: 'restore' })
      if (onRestore) {
        onRestore(res.data)
      }
    } catch (err) {
      toast.error('Failed to restore resume version', { id: 'restore' })
    }
  }

  const handleDelete = async (version) => {
    if (versions.length === 1) {
      toast.error('Cannot delete the only remaining version of the resume')
      return
    }
    const confirm = window.confirm(`Are you sure you want to delete Version ${version.versionNumber} ("${version.title}")? This action cannot be undone.`)
    if (!confirm) return

    try {
      await resumeApi.deleteVersion(resumeId, version.id)
      setVersions(prev => prev.filter(v => v.id !== version.id))
      toast.success('Version deleted')
    } catch (err) {
      toast.error('Failed to delete version')
    }
  }

  const startEdit = (version) => {
    setEditingVersion(version)
    setEditTitle(version.title || '')
    setEditRole(version.jobRole || '')
    setEditTags(version.tags ? version.tags.join(', ') : '')
  }

  const handleUpdateMetadata = async (e) => {
    e.preventDefault()
    try {
      setUpdatingMetadata(true)
      const tagsArray = editTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const payload = {
        title: editTitle.trim() || `Version ${editingVersion.versionNumber}`,
        jobRole: editRole.trim() || null,
        tags: tagsArray
      }

      const res = await resumeApi.updateVersion(resumeId, editingVersion.id, payload)
      setVersions(prev => prev.map(v => v.id === editingVersion.id ? res.data : v))
      toast.success('Version details updated')
      setEditingVersion(null)
    } catch (err) {
      toast.error('Failed to update version details')
    } finally {
      setUpdatingMetadata(false)
    }
  }

  const triggerCompare = (targetVersion) => {
    setCompareLeft(targetVersion)
    // Find next oldest version as fallback, or the same if single
    const index = versions.findIndex(v => v.id === targetVersion.id)
    const fallbackRight = versions[index + 1] || versions[0]
    setCompareRight(fallbackRight)
    setCompareOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Resume Version Manager</h3>
          <p className="text-xs text-muted-foreground">Restore snapshots or review content changes over time</p>
        </div>
        <button
          onClick={() => {
            setSnapshotRole(currentJobRole || '')
            setShowSnapshotForm(true)
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Snapshot
        </button>
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : versions.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground bg-card/10">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-55" />
          <p className="text-sm">No saved resume versions found.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-border/80 pl-6 ml-4 space-y-8 py-2">
          {versions.map((version, idx) => {
            const isActive = currentOriginalText === version.originalText && currentEnhancedText === version.enhancedText
            return (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group"
              >
                {/* Timeline Dot Indicator */}
                <span className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  isActive ? 'bg-primary border-primary shadow-glow' : 'bg-background border-border group-hover:border-primary'
                } transition-all-300`} />

                {/* Timeline Card */}
                <div className="bg-card/40 border border-border/80 hover:border-primary/30 p-5 rounded-2xl transition-all-300 relative shadow-sm hover:shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          v{version.versionNumber}
                        </span>
                        <h4 className="font-bold text-foreground">{version.title || `Version ${version.versionNumber}`}</h4>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>{formatDate(version.createdAt)}</span>
                        {version.jobRole && (
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                            {version.jobRole}
                          </span>
                        )}
                        {(version.atsScore !== null && version.atsScore !== undefined) && (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            ATS Score: {version.atsScore}
                          </span>
                        )}
                      </div>

                      {/* Version Tags */}
                      {version.tags && version.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {version.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timeline Card Action Buttons */}
                    <div className="flex items-center gap-1.5 sm:self-start">
                      <button
                        onClick={() => triggerCompare(version)}
                        title="Compare with another version"
                        className="p-2 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                      >
                        <GitPullRequest className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEdit(version)}
                        title="Edit label & tags"
                        className="p-2 rounded-xl bg-muted/40 hover:bg-yellow-500/15 text-muted-foreground hover:text-yellow-400 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRestore(version)}
                        disabled={isActive}
                        title={isActive ? "Current active version" : "Restore this version"}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                            : 'bg-primary/10 hover:bg-primary/25 text-primary'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handleDelete(version)}
                        title="Delete this version"
                        className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/25 text-destructive transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Snapshot Dialog Popup */}
      <AnimatePresence>
        {showSnapshotForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSnapshotForm(false)}
              className="absolute inset-0 bg-background/80 backdrop-filter backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 glass"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-foreground">Create Resume Snapshot</h4>
                <button onClick={() => setShowSnapshotForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSnapshot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Version Title/Label</label>
                  <input
                    type="text"
                    value={snapshotTitle}
                    onChange={(e) => setSnapshotTitle(e.target.value)}
                    placeholder="e.g. Optimized for Fullstack Dev"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Job Role</label>
                  <input
                    type="text"
                    value={snapshotRole}
                    onChange={(e) => setSnapshotRole(e.target.value)}
                    placeholder="e.g. Senior Node JS Developer"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={snapshotTags}
                    onChange={(e) => setSnapshotTags(e.target.value)}
                    placeholder="e.g. Fullstack, Node, Backend"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSnapshotForm(false)}
                    className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSnapshot}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {savingSnapshot ? 'Saving...' : 'Save Snapshot'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Metadata Dialog Popup */}
      <AnimatePresence>
        {editingVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingVersion(null)}
              className="absolute inset-0 bg-background/80 backdrop-filter backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 glass"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-foreground">Edit Version Details (v{editingVersion.versionNumber})</h4>
                <button onClick={() => setEditingVersion(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateMetadata} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Version Title/Label</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Version 2 - Updated Projects"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Job Role</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="e.g. backend, node, active"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingVersion(null)}
                    className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingMetadata}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {updatingMetadata ? 'Updating...' : 'Update Details'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      {compareOpen && (
        <VersionCompareModal
          isOpen={compareOpen}
          onClose={() => setCompareOpen(false)}
          versions={versions}
          initialLeftVersion={compareLeft}
          initialRightVersion={compareRight}
        />
      )}
    </div>
  )
}
