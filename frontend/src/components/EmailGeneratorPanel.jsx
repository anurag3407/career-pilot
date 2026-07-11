import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, FileText, Briefcase, Sparkles, Copy, Check } from 'lucide-react'
import { enhanceApi } from '../services/api'
import { SkeletonList } from './ui/Skeleton'
import toast from 'react-hot-toast'

export default function EmailGeneratorPanel({ companyName, jobTitle, onClose }) {
  const [formData, setFormData] = useState({ 
    resume: '', 
    jobDesc: `Applying for ${jobTitle || 'a role'} at ${companyName || 'your company'}\n\n`, 
    tone: 'Professional' 
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await enhanceApi.generateEmail(formData);
      setResults(response);
    } catch (error) {
      console.error("Error generating emails:", error);
      toast.error("Failed to generate emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Sidebar Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-2xl h-full bg-background border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">Draft Email</h3>
                <p className="text-xs text-muted-foreground">{companyName ? `${jobTitle} at ${companyName}` : 'AI Email Generator'}</p>
              </div>
            </div>
            <button type="button"
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {!results ? (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="bg-indigo-600 p-4 text-white font-semibold flex items-center gap-2 rounded-xl mb-6 shadow-sm">
                  <Sparkles size={20} /> Let AI craft your perfect pitch
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <FileText size={16} className="text-primary" />
                    Paste Your Resume / Summary
                  </label>
                  <textarea
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm h-32 resize-none text-foreground placeholder:text-muted-foreground"
                    placeholder="Paste your experience, skills, or full resume text here..."
                    required
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Briefcase size={16} className="text-primary" />
                    Job Description
                  </label>
                  <textarea
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm h-32 resize-none text-foreground placeholder:text-muted-foreground"
                    placeholder="Paste the job requirements and responsibilities here..."
                    required
                    value={formData.jobDesc}
                    onChange={(e) => setFormData({ ...formData, jobDesc: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select Email Tone</label>
                  <select
                    className="w-full p-3 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  >
                    <option value="Professional & Formal">Professional & Formal</option>
                    <option value="Enthusiastic & Passionate">Enthusiastic & Passionate</option>
                    <option value="Direct & Concise">Direct & Concise</option>
                    <option value="Creative & Unique">Creative & Unique</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      Crafting Magic...
                    </span>
                  ) : (
                    <><Sparkles size={20} /> Generate Emails</>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-xl font-bold text-foreground">Your AI Generated Options</h2>
                  <button type="button" onClick={() => setResults(null)} className="text-sm text-primary font-semibold hover:underline">
                    Edit Details
                  </button>
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm">
                    <Sparkles size={16} className="text-primary" /> High-Converting Subject Lines
                  </h3>
                  <ul className="space-y-3">
                    {results.subjectLines.map((subject, idx) => (
                      <li key={idx} className="flex items-center gap-3 bg-background p-3 rounded-lg shadow-sm border border-border">
                        <span className="shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                        <span className="text-foreground font-medium text-sm">{subject}</span>
                        <button type="button"
                          onClick={() => copyToClipboard(subject, `subj-${idx}`)}
                          className="ml-auto text-muted-foreground hover:text-primary transition p-1"
                          title="Copy"
                        >
                          {copiedIndex === `subj-${idx}` ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-foreground text-lg">Email Variants</h3>
                  <div className="grid gap-6">
                    {results.variants.map((variant, idx) => (
                      <div key={idx} className="bg-background p-5 rounded-2xl shadow-sm border border-border flex flex-col h-full hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                          <span className="font-bold text-foreground text-sm">Option {idx + 1}</span>
                          <button type="button"
                            onClick={() => copyToClipboard(variant, `body-${idx}`)}
                            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-semibold"
                          >
                            {copiedIndex === `body-${idx}` ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                          </button>
                        </div>
                        <div className="text-muted-foreground whitespace-pre-wrap flex-grow text-sm leading-relaxed">
                          {variant}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
