import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'

export default function TextToResume() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConvert = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to convert')
      return
    }

    try {
      setIsLoading(true)
      const response = await resumeApi.createFromText(text, jobRole)
      toast.success('Resume created successfully!')
      navigate(`/enhance/${response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to convert text to resume')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Text to Resume
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste any unformatted text—from an old resume, a LinkedIn profile, or a list of accomplishments—and let our AI structure it into a professional resume.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">
                Target Job Role (Optional)
              </label>
              <input 
                type="text" 
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground" 
                value={jobRole} 
                onChange={e => setJobRole(e.target.value)} 
                placeholder="e.g. Senior Frontend Developer" 
              />
              <p className="text-xs text-muted-foreground mt-2">
                Providing a target role helps the AI highlight the most relevant experience.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80 flex items-center justify-between">
                <span>Raw Text Content</span>
                <span className="text-xs font-normal text-muted-foreground">{text.length} characters</span>
              </label>
              <textarea 
                className="w-full bg-muted border border-border rounded-xl px-4 py-4 min-h-[300px] focus:ring-2 focus:ring-primary/50 transition-all outline-none font-mono text-sm resize-y text-foreground" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="Paste your unformatted resume content, LinkedIn about section, or job history here..." 
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleConvert}
                disabled={isLoading || !text.trim()}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Convert to Resume <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
