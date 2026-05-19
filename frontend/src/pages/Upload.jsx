import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { uploadApi, resumeApi } from '../services/api'
import FileUpload from '../components/FileUpload'
import Button from '../components/Button'
import { FileText, Upload as UploadIcon, CheckCircle, Target, BarChart3, Zap, Linkedin, ArrowRight, User, Briefcase, GraduationCap } from 'lucide-react'

// Configuration for file size validation
const FILE_SIZE_CONFIG = {
  maxSizeMB: parseInt(import.meta.env.VITE_MAX_SIZE_MB || '5'),
  get maxSizeBytes() {
    return this.maxSizeMB * 1024 * 1024
  }
}

export default function Upload() {
  const navigate = useNavigate()

  const [_file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [linkedinPreview, setLinkedinPreview] = useState(null)
  const [linkedinProfile, setLinkedinProfile] = useState(null)
  const [importing, setImporting] = useState(false)

  /**
   * Validates file size before upload
   * @param {File} file - The file to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateFileSize = (file) => {
    if (file.size > FILE_SIZE_CONFIG.maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.error(`File size (${fileSizeMB}MB) exceeds the maximum limit of ${FILE_SIZE_CONFIG.maxSizeMB}MB.`)
      return false
    }
    return true
  }

  const handleFileSelect = async (selectedFile) => {
    if (!validateFileSize(selectedFile)) {
      return
    }

    setFile(selectedFile)
    setLoading(true)

    try {
      // Upload and extract text
      const response = await uploadApi.uploadPdf(selectedFile)
      const extractedText = response.data.extractedText

      // Create resume automatically
      const resumeTitle = `Resume - ${new Date().toLocaleDateString()}`
      const resumeResponse = await resumeApi.create({
        originalText: extractedText,
        title: resumeTitle
      })

      setUploadComplete(true)
      toast.success('Resume uploaded successfully!')

      // Redirect to enhance page after a brief delay
      setTimeout(() => {
        navigate(`/enhance/${resumeResponse.data.id}`)
      }, 1500)

    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to upload resume'
      toast.error(message)
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const normalizeLinkedInUrl = (raw) => {
    let url = raw.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    return url
  }

  const handleLinkedinPreview = async () => {
    if (!linkedinUrl.trim()) return toast.error('Please enter a LinkedIn profile URL')
    const url = normalizeLinkedInUrl(linkedinUrl)
    if (!url.includes('linkedin.com/in/')) {
      return toast.error('Please enter a valid LinkedIn profile URL (linkedin.com/in/...)')
    }
    setLinkedinLoading(true)
    setLinkedinPreview(null)
    setLinkedinProfile(null)
    try {
      const res = await resumeApi.previewLinkedIn(url)
      setLinkedinPreview(res.preview)
      setLinkedinProfile(res.profile)
    } catch (err) {
      toast.error(err.message || 'Failed to load LinkedIn profile')
    } finally {
      setLinkedinLoading(false)
    }
  }

  const handleLinkedinImport = async () => {
    setImporting(true)
    try {
      const res = await resumeApi.importLinkedIn(normalizeLinkedInUrl(linkedinUrl), linkedinProfile)
      toast.success('LinkedIn profile imported!')
      navigate(`/enhance/${res.data.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to import profile')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-4">
            <UploadIcon className="w-4 h-4" />
            AI-Powered Resume Enhancement
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Upload Your Resume</h1>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Upload your PDF resume to get instant ATS score analysis and AI-powered improvements tailored to your target job role
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">ATS Score</p>
              <p className="text-neutral-500 text-xs">Get your compatibility score</p>
            </div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Detailed Analysis</p>
              <p className="text-neutral-500 text-xs">See what to improve</p>
            </div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">AI Enhancement</p>
              <p className="text-neutral-500 text-xs">One-click optimization</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        {!uploadComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Select PDF File</h2>
                <p className="text-sm text-neutral-500">We'll extract and analyze your resume automatically</p>
              </div>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={loading}
              maxSizeMB={FILE_SIZE_CONFIG.maxSizeMB}
            />
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-neutral-800 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Processing your resume...</p>
                  <p className="text-neutral-500 text-sm">Extracting text and preparing analysis</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-neutral-900/50 border border-green-500/30 p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Resume Uploaded Successfully!</h2>
            <p className="text-neutral-400 mb-4">Redirecting to ATS analysis...</p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* LinkedIn Import */}
        {!uploadComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 rounded-xl bg-neutral-900/50 border border-neutral-800 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Import from LinkedIn</h2>
                <p className="text-sm text-neutral-500">Paste your public LinkedIn profile URL to auto-fill your resume</p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => {
                  setLinkedinUrl(e.target.value)
                  setLinkedinPreview(null)
                  setLinkedinProfile(null)
                }}
                placeholder="https://linkedin.com/in/your-profile"
                className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 text-sm"
              />
              <Button
                variant="secondary"
                onClick={handleLinkedinPreview}
                loading={linkedinLoading}
                disabled={!linkedinUrl.trim() || linkedinLoading}
              >
                Preview
              </Button>
            </div>

            {/* Preview card */}
            {linkedinPreview && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/5 p-5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {linkedinPreview.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base">{linkedinPreview.name}</h3>
                    {linkedinPreview.headline && (
                      <p className="text-sky-400 text-sm mt-0.5">{linkedinPreview.headline}</p>
                    )}
                    {linkedinPreview.location && (
                      <p className="text-neutral-500 text-xs mt-0.5">{linkedinPreview.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-4">
                  {linkedinPreview.experienceCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-neutral-500" />
                      {linkedinPreview.experienceCount} experience {linkedinPreview.experienceCount === 1 ? 'entry' : 'entries'}
                    </span>
                  )}
                  {linkedinPreview.educationCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-neutral-500" />
                      {linkedinPreview.educationCount} education {linkedinPreview.educationCount === 1 ? 'entry' : 'entries'}
                    </span>
                  )}
                  {linkedinPreview.skills?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-neutral-500" />
                      {linkedinPreview.skills.length} skills
                    </span>
                  )}
                </div>

                {linkedinPreview.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {linkedinPreview.skills.slice(0, 8).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {linkedinPreview.skills.length > 8 && (
                      <span className="px-2.5 py-1 text-neutral-500 text-xs">
                        +{linkedinPreview.skills.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                <Button
                  variant="gradient"
                  onClick={handleLinkedinImport}
                  loading={importing}
                  className="w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-1.5" />
                  Import & Enhance with AI
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-white mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">1</div>
              <h4 className="text-white font-medium mb-1">Upload Resume</h4>
              <p className="text-neutral-500 text-sm">Upload your PDF resume file</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">2</div>
              <h4 className="text-white font-medium mb-1">Get ATS Score</h4>
              <p className="text-neutral-500 text-sm">See how your resume scores for your target job</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">3</div>
              <h4 className="text-white font-medium mb-1">Improve with AI</h4>
              <p className="text-neutral-500 text-sm">One-click AI enhancement based on analysis</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
