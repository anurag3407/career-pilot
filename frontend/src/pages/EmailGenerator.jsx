import React, { useState } from 'react';
import { Mail, Briefcase, FileText, Sparkles, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { enhanceApi } from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const EmailGenerator = () => {
  const [formData, setFormData] = useState({ resume: '', jobDesc: '', tone: 'Professional' });
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
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Email Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Craft the Perfect Pitch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate highly converting, personalized job application emails tailored to your resume.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-border mb-10"
        >
          <div className="bg-indigo-600 p-4 text-white font-semibold flex items-center gap-2">
            <Sparkles size={20} /> Let AI craft your perfect pitch
          </div>
          <form onSubmit={handleGenerate} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <FileText size={16} className="text-primary" />
                  Paste Your Resume / Summary
                </label>
                <textarea
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm h-48 resize-none text-foreground placeholder:text-muted-foreground"
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
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm h-48 resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Paste the job requirements and responsibilities here..."
                  required
                  value={formData.jobDesc}
                  onChange={(e) => setFormData({ ...formData, jobDesc: e.target.value })}
                />
              </div>
            </div>

            <div className="max-w-xs mx-auto md:mx-0">
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
              className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </motion.div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <Skeleton className="h-8 w-64 bg-foreground/10" />
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <Skeleton className="h-6 w-48 mb-4 bg-foreground/10" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full bg-foreground/10" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl bg-foreground/10" />
              ))}
            </div>
          </div>
        ) : results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">Your AI Generated Options</h2>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 shadow-sm">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> High-Converting Subject Lines
              </h3>
              <ul className="space-y-3">
                {results.subjectLines.map((subject, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-background p-3 rounded-lg shadow-sm border border-border">
                    <span className="shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                    <span className="text-foreground font-medium">{subject}</span>
                    <button
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

            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-xl">Email Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.variants.map((variant, idx) => (
                  <div key={idx} className="bg-background p-6 rounded-2xl shadow-sm border border-border flex flex-col h-full hover:border-primary/50 transition-all">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                      <span className="font-bold text-foreground">Option {idx + 1}</span>
                      <button
                        onClick={() => copyToClipboard(variant, `body-${idx}`)}
                        className="text-sm flex items-center gap-1 text-primary hover:text-primary/80 font-semibold"
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
    </div>
  );
};

export default EmailGenerator;
