import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Target, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1)
  const [jobRole, setJobRole] = useState('')
  const navigate = useNavigate()

  const handleNext = () => setStep((s) => s + 1)
  
  const handleUploadResume = () => {
    onComplete()
    navigate('/upload')
  }

  const handleComplete = () => {
    // Optionally save job role to profile here
    onComplete()
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden relative"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: `${((step - 1) / 3) * 100}%` }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black mb-3">Welcome to CareerPilot!</h2>
                <p className="text-muted-foreground font-medium mb-8">
                  Let's get you set up so you can start landing your dream job with AI-powered insights.
                </p>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full font-bold py-3" onClick={handleNext}>
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <button onClick={handleSkip} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black mb-3">Set your target role</h2>
                <p className="text-muted-foreground font-medium mb-6">
                  What kind of position are you looking for? We'll use this to tailor your experience.
                </p>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, Product Manager..."
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all mb-8 font-medium"
                  autoFocus
                />
                <div className="space-y-3">
                  <Button variant="primary" className="w-full font-bold py-3" onClick={handleNext}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-black mb-3">You're ready!</h2>
                <p className="text-muted-foreground font-medium mb-8">
                  The best place to start is by uploading your existing resume. Our AI will analyze it and provide instant feedback.
                </p>
                
                <div className="bg-muted/50 rounded-2xl p-4 text-left mb-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold">AI Resume Enhancement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold">Smart Job Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold">Mock Interviews</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="primary" className="w-full font-bold py-3 shadow-lg shadow-primary/25" onClick={handleUploadResume}>
                    Upload your resume <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <button onClick={handleComplete} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
