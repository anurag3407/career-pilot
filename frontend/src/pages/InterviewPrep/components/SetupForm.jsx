import { Sparkles, Globe, Link as LinkIcon, FileUp, Loader2, FileText, X, AlertCircle, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button';
import BodyLanguageTips from '../../../components/BodyLanguageTips';
import { SUPPORTED_LANGUAGES } from '../../../constants/languages';

const INDUSTRIES = [
  { value: 'software_engineering', label: 'Software Engineering' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'consulting', label: 'Consulting' }
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' }
];

const INTERVIEW_MODES = [
  { value: 'behavioral', label: 'Behavioral', desc: 'Soft-skill & STAR-method questions' },
  { value: 'technical', label: 'Technical', desc: 'Domain knowledge & reasoning' },
  { value: 'coding', label: 'Coding', desc: 'Live code with test cases' },
  { value: 'mixed', label: 'Mixed', desc: 'Behavioral + technical blend' }
];

const CODING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' }
];

export default function SetupForm({
  formData,
  setFormData,
  handleStartInterview,
  loading,
  error,
  jdMode,
  setJdMode,
  jdInput,
  setJdInput,
  jdLoading,
  jdError,
  jdSummary,
  setJdSummary,
  parseJd,
  selectedResumeId,
  handleResumeSelect,
  savedResumes,
  resumeFile,
  resumeInputRef,
  handleResumeUpload,
  resumeLoading,
  removeResume,
  resumeError,
  resumeText
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Interview Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Interview Prep</h1>
          <p className="text-lg text-muted-foreground">Practice with AI interviewer, get complete feedback at the end</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-8 rounded-3xl glass glow border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <form onSubmit={handleStartInterview} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Job Role *</label>
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="w-full px-4 py-3 bg-card/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                >
                  {INDUSTRIES.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Experience Level *</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                >
                  {EXPERIENCE_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERVIEW_MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mode: m.value })}
                      className={
                        'text-left p-3 rounded-xl border transition-colors ' +
                        (formData.mode === m.value
                          ? 'bg-primary/15 border-primary/50 text-foreground'
                          : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/30')
                      }
                    >
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-xs mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.mode === 'coding' && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Coding Language
                  </label>
                  <select
                    value={formData.codingLanguage}
                    onChange={(e) => setFormData({ ...formData, codingLanguage: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                  >
                    {CODING_LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Language
                  </span>
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                {formData.language !== 'en' && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Non-English uses backend transcription via your AI provider.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Target Company <span className="text-muted-foreground/60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g., Google, Stripe, Airbnb"
                  className="w-full px-4 py-3 bg-card/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Pulls from the curated company question bank when available.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Number of Questions</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-card rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="w-12 text-center text-lg font-semibold text-primary">{formData.questionCount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Choose between 2 to 20 questions for your interview</p>
              </div>

              {/* Job Description (paste or URL) */}
              <div className="border-2 border-dashed border-blue-500/20 rounded-2xl p-6 bg-blue-500/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold text-base">Job Description <span className="text-xs text-muted-foreground font-normal">(optional)</span></h3>
                      <p className="text-xs text-muted-foreground">Personalize questions to a specific role.</p>
                    </div>
                  </div>
                  {jdSummary && (
                    <button
                      type="button"
                      onClick={() => { setJdSummary(null); setJdInput(''); }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {!jdSummary && (
                  <>
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      {['none', 'paste', 'url'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setJdMode(m)}
                          className={
                            'px-3 py-1 rounded-full transition-colors ' +
                            (jdMode === m
                              ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                              : 'bg-muted/30 border border-border text-muted-foreground hover:border-blue-500/30')
                          }
                        >
                          {m === 'none' ? 'Skip' : m === 'paste' ? 'Paste Text' : 'From URL'}
                        </button>
                      ))}
                    </div>

                    {jdMode !== 'none' && (
                      <>
                        <textarea
                          value={jdInput}
                          onChange={(e) => setJdInput(e.target.value)}
                          placeholder={jdMode === 'url' ? 'https://job-boards.example.com/job/...' : 'Paste the job description text here...'}
                          rows={jdMode === 'url' ? 2 : 5}
                          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                        {jdError && <p className="text-xs text-red-400 mt-1.5">{jdError}</p>}
                        <button
                          type="button"
                          onClick={parseJd}
                          disabled={jdLoading || !jdInput.trim()}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600"
                        >
                          {jdLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          {jdLoading ? 'Parsing…' : 'Parse & Use'}
                        </button>
                      </>
                    )}
                  </>
                )}

                {jdSummary && (
                  <div className="text-xs text-blue-200 space-y-1">
                    <div><span className="text-muted-foreground">Detected role: </span>{jdSummary.role || '—'}</div>
                    {jdSummary.company && <div><span className="text-muted-foreground">Company: </span>{jdSummary.company}</div>}
                    <div><span className="text-muted-foreground">Text length: </span>{jdSummary.jdText.length} characters</div>
                  </div>
                )}
              </div>

              {/* Resume Upload Section */}
              <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 bg-primary/5 transition-colors relative group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg">Resume Context (Optional)</h3>
                    <p className="text-sm text-muted-foreground">Select or upload a resume to get personalized questions.</p>
                  </div>
                </div>

                <div className="mb-4">
                  <select
                    value={selectedResumeId}
                    onChange={handleResumeSelect}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    <option value="none">-- No Resume --</option>
                    {savedResumes.map(r => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.title || r.jobRole || 'Saved Resume'}
                      </option>
                    ))}
                    <option value="upload">+ Upload New PDF</option>
                  </select>
                </div>

                {selectedResumeId === 'upload' && !resumeFile ? (
                  <div className="relative mt-2 cursor-pointer hover:bg-primary/10 rounded-xl transition-colors">
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={resumeLoading}
                    />
                    <div className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-card border border-border group-hover:border-primary/50 transition-colors shadow-sm">
                      {resumeLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-sm font-semibold text-muted-foreground">Extracting text...</span>
                        </>
                      ) : (
                        <>
                          <FileUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload resume</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : resumeFile ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-sm text-emerald-400 font-medium">{resumeFile.name}</p>
                        {/* Progress bar showing extraction complete */}
                        <div className="mt-1.5 h-1.5 bg-card rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeResume}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-3"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : null}

                {resumeError && (
                  <p className="text-xs text-red-400 mt-2">{resumeError}</p>
                )}

                {resumeText && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                    <Sparkles className="w-3 h-3" />
                    <span>~40% of questions will be personalized based on your resume</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Body language coaching tip */}
              <BodyLanguageTips currentQuestionIndex={0} />

              <Button type="submit" disabled={loading} variant="primary" className="w-full !py-4 !text-lg !rounded-xl flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                {loading ? 'Generating Questions...' : `Start Interview (${formData.questionCount} Questions)`}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Questions will be read aloud • Your answers are recorded • Complete feedback at the end
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
