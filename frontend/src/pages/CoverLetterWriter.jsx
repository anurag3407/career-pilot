import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, Sparkles, Loader2, Copy, Check, Linkedin, Mic, FileText, ChevronDown } from 'lucide-react';

const tones = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'enthusiastic', label: 'Enthusiastic', emoji: '🚀' },
];

const tabs = [
  { id: 'coverLetter', label: 'Cover Letter', icon: FileText },
  { id: 'linkedinMessage', label: 'LinkedIn Message', icon: Linkedin },
  { id: 'elevatorPitch', label: 'Elevator Pitch', icon: Mic },
];

export default function CoverLetterWriter() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('coverLetter');
  const [copiedField, setCopiedField] = useState(null);

  const handleGenerate = async () => {
    if (!resumeText.trim()) return setError('Please paste your resume text');
    if (!jobDescription.trim()) return setError('Please paste the job description');

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { auth } = await import('../config/firebase');
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';

      const response = await fetch(`${API_BASE}/cover-letter/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, companyName, tone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      setResult(data.data);
      setActiveTab('coverLetter');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (field) => {
    if (!result?.[field]) return;
    await navigator.clipboard.writeText(result[field]);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getActiveContent = () => {
    if (!result) return '';
    return result[activeTab] || '';
  };

  return (
    <div className="page-container py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            <FileSignature className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cover Letter & Outreach Writer</h1>
            <p className="text-muted-foreground text-sm">AI-crafted cover letters, LinkedIn messages, and elevator pitches</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
          <div className="premium-card p-5">
            <label className="block text-sm font-semibold text-foreground mb-2">Your Resume Text *</label>
            <textarea
              id="cover-letter-resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
            />
          </div>

          <div className="premium-card p-5">
            <label className="block text-sm font-semibold text-foreground mb-2">Job Description *</label>
            <textarea
              id="cover-letter-jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
            />
          </div>

          <div className="premium-card p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                <input
                  id="cover-letter-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Tone</label>
                <div className="flex gap-2">
                  {tones.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tone === t.id
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'bg-muted/50 border-border text-muted-foreground hover:border-primary/20'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-3">{error}</motion.p>
            )}

            <button
              id="cover-letter-generate-btn"
              onClick={handleGenerate}
              disabled={loading}
              className="mt-5 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate All Content'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="premium-card p-5 sticky top-8">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-card text-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                  <FileSignature className="w-7 h-7 text-white animate-pulse" />
                </div>
                <p className="text-muted-foreground font-medium text-sm">Crafting your personalized content...</p>
                <div className="mt-4 w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #ec4899, #f43f5e)' }}
                    initial={{ width: '0%' }} animate={{ width: '80%' }} transition={{ duration: 6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ) : result ? (
              <div>
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => handleCopy(activeTab)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    {copiedField === activeTab ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === activeTab ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-muted/30 border border-border min-h-[300px]">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-[inherit] leading-relaxed">
                    {getActiveContent()}
                  </pre>
                </div>

                <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded-md bg-muted">Tone: {result.tone}</span>
                  <span className="px-2 py-1 rounded-md bg-muted">Company: {result.company}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <FileSignature className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Your generated content will appear here</p>
                <p className="text-muted-foreground text-xs mt-1">Fill in your resume and job description, then click Generate</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
