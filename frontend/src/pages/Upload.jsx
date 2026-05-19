import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { uploadApi, resumeApi } from '../services/api'
import DropZone from '../components/DropZone'
import { FileText, Upload as UploadIcon, CheckCircle, Target, BarChart3, Zap } from 'lucide-react'

export default function Upload() {
  const navigate = useNavigate()

  const [_file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleFileSelect = async (selectedFile) => {
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

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Upload Your Resume</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
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
          <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">ATS Score</p>
              <p className="text-muted-foreground text-xs">Get your compatibility score</p>
            </div>
          </div>
          <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">Detailed Analysis</p>
              <p className="text-muted-foreground text-xs">See what to improve</p>
            </div>
          </div>
          <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">AI Enhancement</p>
              <p className="text-muted-foreground text-xs">One-click optimization</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        {!uploadComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-background/50 border border-border p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Select PDF File</h2>
                <p className="text-sm text-muted-foreground">We'll extract and analyze your resume automatically</p>
              </div>
            </div>

            <DropZone
              onFileSelect={handleFileSelect}
              disabled={loading}
              maxSizeMB={5}
              multiple={false}
            />

            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-border rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-primary rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-medium">Processing your resume...</p>
                  <p className="text-muted-foreground text-sm">Extracting text and preparing analysis</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-background/50 border border-green-500/30 p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Resume Uploaded Successfully!</h2>
            <p className="text-muted-foreground mb-4">Redirecting to ATS analysis...</p>
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

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-foreground font-bold">1</div>
              <h4 className="text-foreground font-medium mb-1">Upload Resume</h4>
              <p className="text-muted-foreground text-sm">Upload your PDF resume file</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-foreground font-bold">2</div>
              <h4 className="text-foreground font-medium mb-1">Get ATS Score</h4>
              <p className="text-muted-foreground text-sm">See how your resume scores for your target job</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-foreground font-bold">3</div>
              <h4 className="text-foreground font-medium mb-1">Improve with AI</h4>
              <p className="text-muted-foreground text-sm">One-click AI enhancement based on analysis</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
