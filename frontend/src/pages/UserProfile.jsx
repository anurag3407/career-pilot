import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, Github, Linkedin, Pencil, Save, X,
  FileText, Mic, Heart, MessageSquare, Calendar,
  Plus, ExternalLink
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { userProfileApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import AnalysisSkeleton from '../components/github/AnalysisSkeleton'
import { SkeletonList } from '../components/ui/Skeleton'

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

  const targetUid = paramUid || user?.uid
  const isOwnProfile = !paramUid || paramUid === user?.uid

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ resumesCreated: 0, interviewsDone: 0 })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  // When true the GitHub repository analysis skeleton will show
  const [isRepoAnalyzing, setIsRepoAnalyzing] = useState(false)
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

  useEffect(() => {
    if (targetUid) fetchAll()
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
      toast.success('Profile updated')
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
      <div className="min-h-screen bg-background">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Profile Header Skeleton */}
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted rounded-lg w-1/2 animate-pulse" />
                  <div className="h-4 bg-muted rounded-lg w-1/3 animate-pulse" />
                  <div className="h-4 bg-muted rounded-lg w-1/4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg bg-card border border-border p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Activity Skeleton */}
            <SkeletonList count={3} />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Header */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="mb-0">
                    <Input
                      label="Display Name"
                      name="displayName"
                      value={form.displayName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, displayName: e.target.value }))
                      }
                      placeholder="Your name"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                    {profile?.jobRole && (
                      <p className="text-indigo-400 font-medium mt-0.5">{profile.jobRole}</p>
                    )}
                    {profile?.location && (
                      <p className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {profile.location}
                      </p>
                    )}
                  </>
                )}
              </div>

              {isOwnProfile && (
                <div className="flex items-center gap-2 self-start">
                  {editing ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={cancelEdit}
                        disabled={saving}
                        className="!py-2 !px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="primary"
                        onClick={saveEdit}
                        loading={saving}
                        className="!py-2 !px-4 text-sm"
                      >
                        <Save className="w-4 h-4 mr-1.5" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={startEdit}
                      className="!py-2 !px-4 text-sm"
                    >
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mt-5">
              {editing ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bio: e.target.value }))
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Tell others about yourself..."
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all duration-200"
                  />
                  <p className="text-xs text-zinc-600 mt-1 text-right">
                    {form.bio.length}/500
                  </p>
                </div>
              ) : profile?.bio ? (
                <p className="text-zinc-300 text-sm leading-relaxed">{profile.bio}</p>
              ) : isOwnProfile ? (
                <p className="text-zinc-600 text-sm italic">
                  No bio yet — click Edit Profile to add one.
                </p>
              ) : null}
            </div>

            {/* Edit extra fields */}
            {editing && (
              <div className="mt-4 grid sm:grid-cols-2 gap-x-4">
                <Input
                  label="Job Role"
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
                  placeholder="e.g. San Francisco, CA"
                />
                <Input
                  label="Skills (comma-separated)"
                  name="skills"
                  value={form.skills}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, skills: e.target.value }))
                  }
                  placeholder="e.g. React, Node.js, Python"
                />
                <Input
                  label="Website"
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
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            )}

            {/* External links (view mode) */}
            {!editing &&
              (profile?.website || profile?.github || profile?.linkedin) && (
                <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-zinc-800">
                  {profile.website && (
                    <a
                      href={externalHref(profile.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      {profile.github}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={externalHref(profile.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

          {/* Repository analysis (loading) - render skeleton when analysis is in progress */}
          {isRepoAnalyzing && (
            <motion.div variants={itemVariants} className="mt-6">
              <AnalysisSkeleton />
            </motion.div>
          )}
          </motion.div>

          {/* Skills */}
          {!editing && profile?.skills?.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6"
            >
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 text-center">
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.resumesCreated}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Resumes Created</p>
            </div>
            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 text-center">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Mic className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.interviewsDone}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Interviews Done</p>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-zinc-500" />
                Activity
              </h2>
              {isOwnProfile && (
                <Link
                  to="/community"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Go to Community
                </Link>
              )}
            </div>

            {activity.length === 0 ? (
              <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center py-12">
                <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <h3 className="font-medium text-white mb-1">No posts yet</h3>
                {isOwnProfile && (
                  <>
                    <p className="text-zinc-500 text-sm mb-4">
                      Share posts in the community to see them here
                    </p>
                    <Link to="/community">
                      <Button variant="primary" className="text-sm">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create a Post
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
                <div className="divide-y divide-zinc-800">
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-zinc-800/50 transition-colors"
                    >
                      {item.title && (
                        <h4 className="font-medium text-white text-sm">{item.title}</h4>
                      )}
                      {item.content && (
                        <p className="text-zinc-500 text-sm mt-0.5 line-clamp-2">
                          {item.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {item.category && (
                          <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-zinc-600">
                          <Heart className="w-3 h-3" />
                          {item.likeCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-600">
                          <MessageSquare className="w-3 h-3" />
                          {item.commentCount}
                        </span>
                        {item.createdAt && (
                          <span className="text-xs text-zinc-600">
                            {formatDate(item.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
