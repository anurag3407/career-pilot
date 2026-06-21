import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, Github, Linkedin, Pencil, Save, X,
  FileText, Mic, Heart, MessageSquare, Calendar,
  Plus, ExternalLink, Camera, Loader2, Briefcase,
  GraduationCap, Phone, Cake, Star
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { userProfileApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { SkeletonProfile } from '../components/ui/Skeleton'
import AnalysisSkeleton from '../components/github/AnalysisSkeleton'
import { SkeletonList } from '../components/ui/Skeleton'
import { getGithubUsername } from '../utils/github'
import { uploadAvatar } from '../utils/avatarUpload'

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
  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarProgress, setAvatarProgress] = useState(0)
  const avatarInputRef = useRef(null)
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    jobRole: '',
    skills: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    // New personal-info fields
    phone: '',
    headline: '',
    dateOfBirth: '',
    gender: '',
    company: '',
    yearsOfExperience: '',
    collegeStudent: false,
    openToWork: false,
    languages: '',
    resumeHeadline: '',
  })

  useEffect(() => {
    if (targetUid) fetchAll()
  }, [targetUid])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [profileResult, statsResult, activityResult] = await Promise.allSettled([
        isOwnProfile ? userProfileApi.getMyProfile() : userProfileApi.getProfile(targetUid),
        isOwnProfile ? userProfileApi.getMyStats() : userProfileApi.getStats(targetUid),
        isOwnProfile ? userProfileApi.getMyActivity() : userProfileApi.getActivity(targetUid),
      ])

      if (profileResult.status === 'rejected') {
        throw profileResult.reason
      }

      const profileRes = profileResult.value
      const statsRes = statsResult.status === 'fulfilled' ? statsResult.value : { stats: { resumesCreated: 0, interviewsDone: 0 } }
      const activityRes = activityResult.status === 'fulfilled' ? activityResult.value : { activity: [] }

      setProfile(profileRes.profile)
      setStats(statsRes.stats)
      setActivity(activityRes.activity)

      if (statsResult.status === 'rejected') {
        console.warn('Profile stats fetch failed:', statsResult.reason)
      }

      if (activityResult.status === 'rejected') {
        console.warn('Profile activity fetch failed:', activityResult.reason)
      }
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
      // New personal-info fields
      phone: profile?.phone || '',
      headline: profile?.headline || '',
      dateOfBirth: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().slice(0, 10)
        : '',
      gender: profile?.gender || '',
      company: profile?.company || '',
      yearsOfExperience:
        profile?.yearsOfExperience != null ? String(profile.yearsOfExperience) : '',
      collegeStudent: !!profile?.collegeStudent,
      openToWork: !!profile?.openToWork,
      languages: (profile?.languages || []).join(', '),
      resumeHeadline: profile?.resumeHeadline || '',
    })
    setEditing(true)
  }

  const cancelEdit = () => setEditing(false)

  // ─── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarPick = () => avatarInputRef.current?.click()

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    // Always reset the input so the same file can be picked again
    e.target.value = ''
    if (!file) return

    setAvatarUploading(true)
    setAvatarProgress(0)
    const toastId = toast.loading('Uploading avatar…')
    try {
      const url = await uploadAvatar(file, user?.uid, (pct) => setAvatarProgress(pct))
      // Persist the URL on the profile
      const res = await userProfileApi.setMyAvatar(url)
      setProfile(res.profile)
      toast.success('Avatar updated', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar', { id: toastId })
    } finally {
      setAvatarUploading(false)
      setAvatarProgress(0)
    }
  }

  const handleAvatarRemove = async () => {
    setAvatarUploading(true)
    const toastId = toast.loading('Removing avatar…')
    try {
      const res = await userProfileApi.deleteMyAvatar()
      setProfile(res.profile)
      toast.success('Avatar removed', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Failed to remove avatar', { id: toastId })
    } finally {
      setAvatarUploading(false)
    }
  }
  const isValidWebsite = (url) => {
  if (!url) return true;

  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

const isValidLinkedIn = (url) => {
  if (!url) return true;

  return /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i.test(url);
};

const isValidGithub = (username) => {
  if (!username) return true;

  return /^[a-zA-Z0-9-]+$/.test(username);
};

  const saveEdit = async () => {
    const githubUsername = getGithubUsername(form.github)

    if (!isValidWebsite(form.website.trim())) {
      toast.error("Please enter a valid website URL")
      return
    }

    if (!isValidLinkedIn(form.linkedin.trim())) {
      toast.error("Please enter a valid LinkedIn profile URL")
      return
    }

    if (!isValidGithub(githubUsername)) {
      toast.error("Invalid GitHub username")
      return
    }

    // Validate yearsOfExperience if provided
    const yoeRaw = form.yearsOfExperience.trim()
    let yearsOfExperience = undefined
    if (yoeRaw !== '') {
      const n = Number(yoeRaw)
      if (!Number.isInteger(n) || n < 0 || n > 80) {
        toast.error('Years of experience must be a whole number between 0 and 80')
        return
      }
      yearsOfExperience = n
    }

    setSaving(true)

    try {
      const res = await userProfileApi.updateMyProfile({
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        jobRole: form.jobRole.trim(),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        location: form.location.trim(),
        website: form.website.trim(),
        github: githubUsername,
        linkedin: form.linkedin.trim(),
        // New personal-info fields
        phone: form.phone.trim(),
        headline: form.headline.trim(),
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || '',
        company: form.company.trim(),
        yearsOfExperience,
        collegeStudent: form.collegeStudent,
        openToWork: form.openToWork,
        languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
        resumeHeadline: form.resumeHeadline.trim(),
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
    return <SkeletonProfile />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
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
            className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
             <div className="relative flex-shrink-0 group">
  <div className="w-20 h-20 rounded-3xl overflow-hidden border border-sky-200 bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center shadow-sm">
    {profile?.avatarUrl ? (
      <img
        src={profile.avatarUrl}
        alt={displayName || "Profile Avatar"}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-3xl font-bold bg-gradient-to-br from-sky-500 to-cyan-500 bg-clip-text text-transparent">
        {initials}
      </span>
    )}
  </div>

  {/* Upload progress overlay */}
  {avatarUploading && (
    <div className="absolute inset-0 rounded-3xl bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center">
      <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
      {avatarProgress > 0 && (
        <span className="text-[10px] font-medium text-sky-600 mt-0.5">{avatarProgress}%</span>
      )}
    </div>
  )}

  {/* Avatar controls — only on own profile */}
  {isOwnProfile && !avatarUploading && (
    <div className="absolute -bottom-1 -right-1 flex gap-1">
      <button
        type="button"
        onClick={handleAvatarPick}
        title="Upload photo"
        className="w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-md ring-2 ring-background transition-colors"
      >
        <Camera className="w-3.5 h-3.5" />
      </button>
      {profile?.avatarUrl && (
        <button
          type="button"
          onClick={handleAvatarRemove}
          title="Remove photo"
          className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md ring-2 ring-background transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )}

  {/* Hidden file input */}
  <input
    ref={avatarInputRef}
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif"
    onChange={handleAvatarChange}
    className="hidden"
  />
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                      {profile?.openToWork && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium">
                          <Briefcase className="w-3 h-3" />
                          Open to work
                        </span>
                      )}
                      {profile?.collegeStudent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
                          <GraduationCap className="w-3 h-3" />
                          Student
                        </span>
                      )}
                    </div>
                    {(profile?.jobRole || profile?.headline) && (
                      <p className="text-sky-400 font-medium mt-0.5">
                        {profile?.headline || profile.jobRole}
                      </p>
                    )}
                    {profile?.company && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                        {profile.company}
                      </p>
                    )}
                    {profile?.location && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
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
                 <label className="block text-sm font-medium text-foreground mb-1.5">
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
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 resize-none transition-all duration-200"
                  />
                  <p className="text-xs text-sky-200/60 mt-1 text-right">
                    {form.bio.length}/500
                  </p>
                </div>
              ) : profile?.bio ? (
                <p className="text-foreground text-sm leading-relaxed">{profile.bio}</p>
              ) : isOwnProfile ? (
                <p className="text-muted-foreground text-sm italic">
                  No bio yet — click Edit Profile to add one.
                </p>
              ) : null}
            </div>

            {/* Edit extra fields */}
            {editing && (
              <>
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

              {/* New personal-info fields */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Personal Info
                </p>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Input
                    label="Headline"
                    name="headline"
                    value={form.headline}
                    maxLength={120}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, headline: e.target.value }))
                    }
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    maxLength={30}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 555 0100"
                  />
                  <Input
                    label="Company"
                    name="company"
                    value={form.company}
                    maxLength={100}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    placeholder="Current employer"
                  />
                  <Input
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="80"
                    value={form.yearsOfExperience}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))
                    }
                    placeholder="e.g. 5"
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, gender: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Languages (comma-separated)"
                    name="languages"
                    value={form.languages}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, languages: e.target.value }))
                    }
                    placeholder="e.g. English, Hindi"
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Resume Headline
                    </label>
                    <textarea
                      value={form.resumeHeadline}
                      maxLength={300}
                      rows={2}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, resumeHeadline: e.target.value }))
                      }
                      placeholder="Short tagline for your resume"
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Toggles */}
                  <label className="flex items-center gap-3 cursor-pointer select-none sm:col-span-2 mt-1">
                    <input
                      type="checkbox"
                      checked={form.openToWork}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, openToWork: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-border text-sky-500 focus:ring-sky-500/50"
                    />
                    <span className="text-sm text-foreground flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      Open to work
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.collegeStudent}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, collegeStudent: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-border text-sky-500 focus:ring-sky-500/50"
                    />
                    <span className="text-sm text-foreground flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      College student
                    </span>
                  </label>
                </div>
              </div>
              </>
            )}

            {/* External links (view mode) */}
            {!editing &&
              (profile?.website || profile?.github || profile?.linkedin) && (
                <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-border">
                  {profile.website && (
                    <a
                      href={externalHref(profile.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-sky-400 transition-colors"
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
                      className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
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
                      className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <AnalysisSkeleton />
            </motion.div>
          )}
          </motion.div>

          {/* Personal info (view mode) */}
          {!editing && (profile?.resumeHeadline || profile?.phone ||
            profile?.dateOfBirth || profile?.gender ||
            profile?.yearsOfExperience != null ||
            profile?.languages?.length > 0) && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6"
            >
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                About
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {profile?.resumeHeadline && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-foreground leading-relaxed">
                      {profile.resumeHeadline}
                    </p>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}
                {profile?.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cake className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Born:</span>
                    <span className="text-foreground">{formatDate(profile.dateOfBirth)}</span>
                  </div>
                )}
                {profile?.gender && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="text-foreground capitalize">
                      {profile.gender === 'prefer-not-to-say' ? 'Prefer not to say' : profile.gender}
                    </span>
                  </div>
                )}
                {profile?.yearsOfExperience != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="text-foreground">
                      {profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                )}
              </div>
              {profile?.languages?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-muted/60 border border-border text-foreground rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Skills */}
          {!editing && profile?.skills?.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6"
            >
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {!editing && (
             <> 

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-sky-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 p-5 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/5 via-cyan-200/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.resumesCreated}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Resumes Created</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-sky-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 p-5 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-300/5 via-cyan-200/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Mic className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.interviewsDone}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Interviews Done</p>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Activity
              </h2>
              {isOwnProfile && (
                <Link
                  to="/community"
                  className="text-sky-400 hover:text-sky-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Go to Community
                </Link>
              )}
            </div>

            {activity.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300 text-center py-12">
                <MessageSquare className="w-12 h-12 text-sky-500/40 mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">No posts yet</h3>
                {isOwnProfile && (
                  <>
                    <p className="text-muted-foreground text-sm mb-4">
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
              <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="divide-y divide-border">
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      {item.title && (
                        <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                      )}
                      {item.content && (
                        <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">
                          {item.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {item.category && (
                          <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-300 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="w-3 h-3" />
                          {item.likeCount}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          {item.commentCount}
                        </span>
                        {item.createdAt && (
                          <span className="text-muted-foreground">
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
          </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
