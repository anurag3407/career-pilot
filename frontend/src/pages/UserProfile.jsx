import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Globe, Github, Linkedin, Pencil, Save, X,
  FileText, Mic, Heart, MessageSquare, Calendar,
  Plus, ExternalLink, Briefcase, Bell, User, Sparkles,
  Settings, ArrowRight, ShieldCheck, Mail, AlertCircle, Upload
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userProfileApi, resumeApi, notificationApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-sky-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
]

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

export default function UserProfile() {
  const { uid: paramUid } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const targetUid = paramUid || user?.uid
  const isOwnProfile = !paramUid || paramUid === user?.uid

  const [activeTab, setActiveTab] = useState('workspace')
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ resumesCreated: 0, interviewsDone: 0 })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    jobRole: '',
    skills: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
  })

  // Tab-specific states
  const [recommendations, setRecommendations] = useState([])
  const [recsLoading, setRecsLoading] = useState(false)
  const [resumes, setResumes] = useState([])
  const [resumesLoading, setResumesLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  })
  const [prefLoading, setPrefLoading] = useState(false)
  const [savingPref, setSavingPref] = useState(false)

  useEffect(() => {
    if (targetUid) {
      fetchAll()
    }
  }, [targetUid])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [profileRes, statsRes, activityRes] = await Promise.all([
        isOwnProfile ? userProfileApi.getMyProfile() : userProfileApi.getProfile(targetUid),
        isOwnProfile ? userProfileApi.getMyStats() : userProfileApi.getStats(targetUid),
        isOwnProfile ? userProfileApi.getMyActivity() : userProfileApi.getActivity(targetUid),
      ])
      setProfile(profileRes.profile)
      setStats(statsRes.stats)
      setActivity(activityRes.activity)
    } catch (err) {
      toast.error('Failed to load profile')
      console.error('Profile fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'recommendations' && recommendations.length === 0) {
      fetchRecommendations()
    }
    if (tabId === 'resumes' && resumes.length === 0) {
      fetchResumes()
    }
    if (tabId === 'preferences') {
      fetchPreferences()
    }
  }

  const fetchRecommendations = async () => {
    setRecsLoading(true)
    try {
      const res = await userProfileApi.getMyRecommendations()
      setRecommendations(res.recommendations || [])
    } catch (err) {
      console.error('Failed to load recommendations:', err)
      toast.error('Could not load personalized job recommendations')
    } finally {
      setRecsLoading(false)
    }
  }

  const fetchResumes = async () => {
    setResumesLoading(true)
    try {
      const res = await resumeApi.getAll()
      setResumes(res.data || [])
    } catch (err) {
      console.error('Failed to load resumes:', err)
      toast.error('Could not load resumes')
    } finally {
      setResumesLoading(false)
    }
  }

  const fetchPreferences = async () => {
    setPrefLoading(true)
    try {
      const data = await notificationApi.getPreferences()
      setPreferences(data.preferences)
    } catch (err) {
      console.error('Failed to load preferences:', err)
      toast.error('Could not load preferences')
    } finally {
      setPrefLoading(false)
    }
  }

  const savePreferences = async () => {
    setSavingPref(true)
    try {
      await notificationApi.updatePreferences(preferences)
      toast.success('Notification preferences updated!')
    } catch (err) {
      console.error('Failed to save preferences:', err)
      toast.error('Failed to update preferences')
    } finally {
      setSavingPref(false)
    }
  }

  const startEdit = () => {
    setForm({
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      jobRole: profile?.jobRole || '',
      skills: (profile?.skills || []).join(', '),
      location: profile?.location || '',
      website: profile?.website || '',
      github: profile?.github || '',
      linkedin: profile?.linkedin || '',
    })
    setEditing(true)
  }

  const cancelEdit = () => setEditing(false)

  const saveEdit = async () => {
    setSaving(true)
    try {
      const res = await userProfileApi.updateMyProfile({
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        jobRole: form.jobRole.trim(),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        location: form.location.trim(),
        website: form.website.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
      })
      setProfile(res.profile)
      setEditing(false)
      toast.success('Profile updated successfully')
      
      // Refresh recommendations if they were already loaded since skills/role changed
      if (recommendations.length > 0) {
        fetchRecommendations()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User'
  const initials = displayName.charAt(0).toUpperCase()
  const avatarGradient =
    AVATAR_GRADIENTS[(displayName.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length]

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const externalHref = (url) =>
    url.startsWith('http') ? url : `https://${url}`

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-zinc-800 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // TABS mapping
  const TABS = [
    { id: 'workspace', label: 'Workspace', icon: User },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles, privateOnly: true },
    { id: 'resumes', label: 'Resume Hub', icon: FileText, privateOnly: true },
    { id: 'tracker', label: 'Career Tracker', icon: Briefcase },
    { id: 'preferences', label: 'Alert Preferences', icon: Bell, privateOnly: true },
  ]

  const visibleTabs = TABS.filter(t => !t.privateOnly || isOwnProfile)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Visual Background Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Cover / Profile Banner */}
          <div className="relative h-32 rounded-3xl bg-gradient-to-r from-indigo-950 via-zinc-900 to-purple-950 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
          </div>

          {/* Profile Overview Header Card */}
          <motion.div
            variants={itemVariants}
            className="relative -mt-20 rounded-3xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Initials Avatar */}
              <div
                className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0 shadow-xl border-4 border-black`}
              >
                <span className="text-4xl font-extrabold text-white">{initials}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">{displayName}</h1>
                    {profile?.jobRole && (
                      <p className="text-lg text-indigo-400 font-semibold mt-1">{profile.jobRole}</p>
                    )}
                    {profile?.location && (
                      <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-zinc-400 mt-2">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        {profile.location}
                      </p>
                    )}
                  </div>

                  {isOwnProfile && (
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="!py-2 !px-3 !rounded-xl"
                          >
                            <X className="w-4 h-4 text-zinc-400 hover:text-white" />
                          </Button>
                          <Button
                            variant="gradient"
                            onClick={saveEdit}
                            loading={saving}
                            className="!py-2.5 !px-5 text-xs font-bold"
                          >
                            <Save className="w-4 h-4 mr-1.5" />
                            Save Profile
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={startEdit}
                          className="!py-2.5 !px-5 text-xs font-bold border-zinc-800"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* External Social Profiles */}
                {!editing && (profile?.website || profile?.github || profile?.linkedin) && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-zinc-800/40">
                    {profile.website && (
                      <a
                        href={externalHref(profile.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={`https://github.com/${profile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        {profile.github}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={externalHref(profile.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Premium Tabbed Navigation Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm overflow-x-auto">
            {visibleTabs.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-indigo-500/10 border border-indigo-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30 border border-transparent'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 rounded-xl ring-1 ring-indigo-500/30 pointer-events-none"
                    />
                  )}
                </button>
              )
            })}
          </motion.div>

          {/* Workspace Content Panels with slide/fade animation */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'workspace' && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Bio and About info */}
                  <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest opacity-80 mb-3">About Me</h3>
                      {editing ? (
                        <div>
                          <textarea
                            value={form.bio}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, bio: e.target.value }))
                            }
                            maxLength={500}
                            rows={4}
                            placeholder="Tell employers about your career aspirations and goals..."
                            className="w-full px-5 py-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/70 resize-none transition-all duration-200"
                          />
                          <p className="text-xs text-zinc-500 mt-1.5 text-right font-medium">
                            {form.bio.length}/500
                          </p>
                        </div>
                      ) : profile?.bio ? (
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{profile.bio}</p>
                      ) : isOwnProfile ? (
                        <p className="text-zinc-500 text-sm italic">
                          Write a bio to share your professional story with the world. Click Edit Profile to begin.
                        </p>
                      ) : null}
                    </div>

                    {/* Form Fields for Profile Edit */}
                    {editing && (
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-4 pt-4 border-t border-zinc-800/40">
                        <Input
                          label="Job Role Title"
                          name="jobRole"
                          value={form.jobRole}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, jobRole: e.target.value }))
                          }
                          placeholder="e.g. Software Engineer"
                        />
                        <Input
                          label="Location"
                          name="location"
                          value={form.location}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                          }
                          placeholder="e.g. London, UK"
                        />
                        <Input
                          label="Skills (comma-separated)"
                          name="skills"
                          value={form.skills}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, skills: e.target.value }))
                          }
                          placeholder="e.g. React, Node.js, Mongoose"
                        />
                        <Input
                          label="Personal Website"
                          name="website"
                          value={form.website}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, website: e.target.value }))
                          }
                          placeholder="https://yoursite.com"
                        />
                        <Input
                          label="GitHub Username"
                          name="github"
                          value={form.github}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, github: e.target.value }))
                          }
                          placeholder="username"
                        />
                        <Input
                          label="LinkedIn URL"
                          name="linkedin"
                          value={form.linkedin}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, linkedin: e.target.value }))
                          }
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    )}
                  </div>

                  {/* Skills Grid */}
                  {!editing && profile?.skills?.length > 0 && (
                    <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest opacity-80 mb-4">Top Skills</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {profile.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/25 text-indigo-300 rounded-2xl text-xs font-bold transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Personalized Recommendations</h2>
                      <p className="text-zinc-400 text-xs mt-0.5">Custom career opportunities matched to your profile tags.</p>
                    </div>
                  </div>

                  {recsLoading ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 h-48" />
                      ))}
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 sm:p-12 text-center space-y-4">
                      <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
                      <h3 className="text-lg font-bold text-white">No Recommendations Yet</h3>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Add target Job Roles and Skills on your profile Workspace to unlock custom AI recommendation listings.
                      </p>
                      <Button onClick={() => setActiveTab('workspace')} variant="outline" className="text-xs !py-2.5 border-zinc-850">
                        Update Workspace
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {recommendations.map((job, idx) => {
                        const hasSalary = job.job_min_salary || job.job_max_salary
                        return (
                          <div
                            key={idx}
                            className="group flex flex-col justify-between rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 hover:border-indigo-500/30 transition-all-300"
                          >
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                {job.employer_logo ? (
                                  <img
                                    src={job.employer_logo}
                                    alt={job.employer_name}
                                    className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-zinc-800"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                                    {(job.employer_name || 'J').charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="text-base font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                                    {job.job_title}
                                  </h4>
                                  <p className="text-xs text-zinc-400 truncate mt-0.5">{job.employer_name}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {job.job_employment_type && (
                                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                                    {job.job_employment_type}
                                  </span>
                                )}
                                {job.job_city && (
                                  <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400 text-[10px] font-bold">
                                    {job.job_city}, {job.job_state || job.job_country}
                                  </span>
                                )}
                              </div>

                              <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                                {job.job_description || 'Click details to view the full job scope.'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-800/40">
                              <div>
                                {hasSalary ? (
                                  <p className="text-sm font-extrabold text-white">
                                    ${(job.job_min_salary || 0).toLocaleString()} - ${(job.job_max_salary || 0).toLocaleString()}
                                    <span className="text-[10px] text-zinc-500 font-normal">/yr</span>
                                  </p>
                                ) : (
                                  <span className="text-[10px] text-zinc-500 font-medium">Salary details unlisted</span>
                                )}
                              </div>
                              <a
                                href={job.job_apply_link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                              >
                                Apply Now
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'resumes' && (
                <motion.div
                  key="resumes"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Resume Hub</h2>
                        <p className="text-zinc-400 text-xs mt-0.5">Manage and enhance your AI-generated and uploaded CV documents.</p>
                      </div>
                    </div>

                    <Link to="/upload">
                      <Button variant="gradient" className="!py-2.5 !px-4 text-xs font-bold">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        New Resume
                      </Button>
                    </Link>
                  </div>

                  {resumesLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-5 h-20" />
                      ))}
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 sm:p-12 text-center space-y-4">
                      <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
                      <h3 className="text-lg font-bold text-white">No Resumes Found</h3>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto font-medium">
                        Upload your PDF resume to generate career scores and optimization insights.
                      </p>
                      <Link to="/upload">
                        <Button variant="outline" className="text-xs !py-2.5 border-zinc-850">
                          Upload Now
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{resume.title}</h4>
                              <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                                Updated {formatDate(resume.lastModified || resume.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Link to={`/enhance/${resume.id}`}>
                              <Button variant="outline" className="text-[11px] !py-2 !px-3 font-bold border-zinc-800">
                                Verify ATS & Suggestions
                              </Button>
                            </Link>
                            <Link to={`/resume/${resume.id}`}>
                              <Button variant="ghost" className="text-[11px] !py-2 !px-3 font-bold">
                                View PDF
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic CTA Box */}
                  <div className="rounded-3xl bg-gradient-to-br from-indigo-950/20 via-zinc-900/40 to-purple-950/20 border border-zinc-800/50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="font-bold text-white text-base flex items-center justify-center md:justify-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        AI-Powered Resume Optimization
                      </h3>
                      <p className="text-zinc-400 text-xs max-w-lg leading-relaxed font-medium">
                        Compare your resumes against industry-standard ATS algorithms and boost your job application response rate!
                      </p>
                    </div>
                    <Link to="/upload" className="w-full md:w-auto">
                      <Button variant="gradient" className="w-full md:w-auto text-xs !py-3">
                        <Upload className="w-4 h-4 mr-1.5" />
                        Upload & Score
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tracker' && (
                <motion.div
                  key="tracker"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-5 text-center shadow-sm">
                      <div className="w-10 h-10 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-sky-400 border border-sky-500/10">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-3xl font-extrabold text-white">{stats.resumesCreated}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">Resumes Created</p>
                    </div>

                    <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-5 text-center shadow-sm">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400 border border-indigo-500/10">
                        <Mic className="w-5 h-5" />
                      </div>
                      <p className="text-3xl font-extrabold text-white">{stats.interviewsDone}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">Interviews Done</p>
                    </div>
                  </div>

                  {/* Career Action CTA */}
                  {isOwnProfile && (
                    <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 space-y-4">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest opacity-80">Quick Navigators</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Link to="/interview-prep">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/80 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <Mic className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-xs text-white">Interactive AI Interview Prep</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                          </div>
                        </Link>

                        <Link to="/job-tracker">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/80 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-xs text-white">Visual Job Search Tracker</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Activity List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest opacity-80">Community Activity</h3>
                      {isOwnProfile && (
                        <Link to="/community" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1">
                          Go to Community
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    {activity.length === 0 ? (
                      <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 text-center space-y-3">
                        <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto" />
                        <h4 className="font-bold text-white text-sm">No Posts Published</h4>
                        <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                          Share thoughts or search queries in the community channels to log activities here.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/60 overflow-hidden divide-y divide-zinc-800/40">
                        {activity.map((item) => (
                          <div key={item.id} className="p-5 hover:bg-zinc-850/20 transition-colors">
                            {item.title && <h4 className="font-bold text-white text-sm">{item.title}</h4>}
                            {item.content && <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">{item.content}</p>}
                            <div className="flex items-center gap-4 mt-3">
                              {item.category && (
                                <span className="px-2 py-0.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
                                  {item.category}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold">
                                <Heart className="w-3.5 h-3.5 text-zinc-500" />
                                {item.likeCount} Likes
                              </span>
                              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold">
                                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                                {item.commentCount} Comments
                              </span>
                              {item.createdAt && (
                                <span className="text-[10px] text-zinc-650 ml-auto font-medium">
                                  {formatDate(item.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Alert Preferences</h2>
                      <p className="text-zinc-400 text-xs mt-0.5">Manage your system email configurations and alerts.</p>
                    </div>
                  </div>

                  {prefLoading ? (
                    <div className="animate-pulse rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 h-56" />
                  ) : (
                    <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 space-y-6">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest opacity-80 flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4 text-indigo-400" />
                        Email Configurations
                      </h3>

                      {/* Job Alerts */}
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800/40">
                        <div className="space-y-1">
                          <p className="text-white text-sm font-bold">Job Openings</p>
                          <p className="text-zinc-400 text-xs leading-relaxed font-medium">Get real-time updates when new postings match your targeted skills.</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={preferences.jobAlerts}
                          onClick={() => setPreferences({ ...preferences, jobAlerts: !preferences.jobAlerts })}
                          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                            preferences.jobAlerts ? 'bg-indigo-500/80 ring-1 ring-indigo-500' : 'bg-neutral-800'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.jobAlerts ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Direct Messages */}
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800/40">
                        <div className="space-y-1">
                          <p className="text-white text-sm font-bold">Direct Messaging</p>
                          <p className="text-zinc-400 text-xs leading-relaxed font-medium">Receive direct alerts upon receiving chats from other community builders.</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={preferences.directMessages}
                          onClick={() => setPreferences({ ...preferences, directMessages: !preferences.directMessages })}
                          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                            preferences.directMessages ? 'bg-indigo-500/80 ring-1 ring-indigo-500' : 'bg-neutral-800'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.directMessages ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Proposal Updates */}
                      <div className="flex items-center justify-between py-4">
                        <div className="space-y-1">
                          <p className="text-white text-sm font-bold">Fellowship & Proposals</p>
                          <p className="text-zinc-400 text-xs leading-relaxed font-medium">Track updates regarding your active project challenges and proposals.</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={preferences.proposalUpdates}
                          onClick={() => setPreferences({ ...preferences, proposalUpdates: !preferences.proposalUpdates })}
                          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                            preferences.proposalUpdates ? 'bg-indigo-500/80 ring-1 ring-indigo-500' : 'bg-neutral-800'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.proposalUpdates ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      <Button
                        onClick={savePreferences}
                        loading={savingPref}
                        variant="gradient"
                        className="w-full flex items-center justify-center gap-2 mt-6 !py-3.5"
                      >
                        <Save className="w-4 h-4" />
                        Save Preferences
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
