import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Linkedin,
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  ArrowRight,
  Loader2,
  FileText,
  Sparkles
} from 'lucide-react'
import { resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'

export default function LinkedInDashboard() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState(null)

  const normalizeUrl = (raw) => {
    let trimmed = raw.trim()
    // If user just typed a slug like "john-doe", build the full URL
    if (trimmed && !trimmed.includes('linkedin.com') && !trimmed.includes('/')) {
      return `https://www.linkedin.com/in/${trimmed}`
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`
    }
    return trimmed
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    const normalized = normalizeUrl(url)
    if (!normalized.includes('linkedin.com/in/')) {
      return toast.error('Please enter a valid LinkedIn profile URL (linkedin.com/in/...) or a profile slug')
    }

    try {
      setIsLoading(true)
      setPreview(null)
      setProfile(null)
      const response = await resumeApi.previewLinkedIn(normalized)
      setPreview(response.preview)
      setProfile(response.profile)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch LinkedIn profile. Make sure the URL is correct.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!profile) return

    try {
      setIsImporting(true)
      const normalized = normalizeUrl(url)
      const response = await resumeApi.importLinkedIn(normalized, profile)
      toast.success('LinkedIn profile imported as resume!')
      navigate(`/resume/${response.data._id || response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to import LinkedIn profile')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0077b5]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00a0dc]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#0077b5]/10 dark:bg-[#0077b5]/20 rounded-2xl mb-6 ring-1 ring-border shadow-lg">
            <Linkedin className="w-10 h-10 text-[#0077b5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight mb-4">
            LinkedIn to Resume
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly convert your LinkedIn profile into a professional resume — experience, education, and skills included.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="relative max-w-xl mx-auto mb-12"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter LinkedIn URL or profile slug..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-card/50 backdrop-blur-xl border border-border rounded-full text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0077b5]/50 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="absolute right-2 px-6 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#005885] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            e.g. <span className="text-foreground/70">https://linkedin.com/in/john-doe</span> or just <span className="text-foreground/70">john-doe</span>
          </p>
        </motion.form>

        <AnimatePresence mode="wait">
          {preview && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Profile Header */}
              <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar with initial */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0077b5] to-[#00a0dc] flex items-center justify-center shadow-xl border-4 border-background shrink-0">
                  <span className="text-white font-bold text-5xl">
                    {preview.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-1">{preview.name}</h2>
                  {preview.headline && (
                    <p className="text-[#0077b5] font-medium text-lg mb-3">{preview.headline}</p>
                  )}
                  {preview.location && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" /> {preview.location}
                    </span>
                  )}

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                    {preview.experienceCount > 0 && (
                      <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground text-sm">
                        <Briefcase className="w-3.5 h-3.5" />
                        {preview.experienceCount} Experience{preview.experienceCount !== 1 && 's'}
                      </span>
                    )}
                    {preview.educationCount > 0 && (
                      <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground text-sm">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {preview.educationCount} Education
                      </span>
                    )}
                    {preview.skills?.length > 0 && (
                      <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground text-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        {preview.skills.length} Skills
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-background/30 space-y-8">
                {/* About / Summary */}
                {preview.about && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#0077b5]" /> About
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{preview.about}</p>
                  </div>
                )}

                {/* Experience */}
                {profile?.experience?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" /> Experience
                    </h3>
                    <div className="space-y-4">
                      {profile.experience.map((exp, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-border bg-card hover:border-[#0077b5]/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold">{exp.title}</h4>
                            {exp.duration && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded whitespace-nowrap ml-3">
                                {exp.duration}
                              </span>
                            )}
                          </div>
                          {exp.company && (
                            <p className="text-sm text-[#0077b5] mb-2">{exp.company}</p>
                          )}
                          {exp.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {profile?.education?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-violet-400" /> Education
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.education.map((edu, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-border bg-card hover:border-[#0077b5]/30 transition-colors"
                        >
                          {edu.degree && (
                            <h4 className="font-semibold mb-1">{edu.degree}</h4>
                          )}
                          {edu.school && (
                            <p className="text-sm text-[#0077b5]">{edu.school}</p>
                          )}
                          {edu.duration && (
                            <p className="text-xs text-muted-foreground mt-1">{edu.duration}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {preview.skills?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {preview.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="px-8 py-3 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#005885] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#0077b5]/25 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Importing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" /> Import as Resume <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
