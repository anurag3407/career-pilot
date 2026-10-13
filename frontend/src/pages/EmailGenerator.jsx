import React, { useState } from 'react';
import { Mail, Loader2, Copy, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { enhanceApi } from '../services/api';

const TONES = ['Professional', 'Confident', 'Friendly', 'Concise'];

export default function EmailGenerator() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume.trim()) {
      toast.error('Paste your resume text first.');
      return;
    }
    if (!jobDesc.trim()) {
      toast.error('Paste the job description you are responding to.');
      return;
    }

    setLoading(true);
    setResult(null);
    setCopiedIndex(null);

    try {
      const response = await enhanceApi.generateEmail({ resume, jobDesc, tone });

      // The endpoint returns { success, subjectLines, variants } at the top level.
      if (response?.success && Array.isArray(response.variants)) {
        setResult({
          subjectLines: Array.isArray(response.subjectLines) ? response.subjectLines : [],
          variants: response.variants,
        });
      } else {
        throw new Error('The email service returned an unexpected response.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not generate the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (index) => {
    const subject = result?.subjectLines?.[index];
    const body = result?.variants?.[index];
    if (!body) return;

    const asText = [subject ? `Subject: ${subject}` : null, body].filter(Boolean).join('\n\n');

    try {
      await navigator.clipboard.writeText(asText);
      setCopiedIndex(index);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Could not access the clipboard.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Mail className="w-4 h-4" />
            AI drafting assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Email Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Draft an application, follow-up, or negotiation email grounded in your actual
            resume and the role you're targeting.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-background/60 border border-border space-y-5"
        >
          <div>
            <label htmlFor="email-resume" className="block text-sm font-medium text-foreground mb-2">
              Your resume
            </label>
            <textarea
              id="email-resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={8}
              placeholder="Paste the full text of your resume…"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none resize-y"
            />
          </div>

          <div>
            <label htmlFor="email-job" className="block text-sm font-medium text-foreground mb-2">
              Job description
            </label>
            <textarea
              id="email-job"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={8}
              placeholder="Paste the job description…"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none resize-y"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-foreground mb-2">Tone</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Email tone">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tone === t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    tone === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate email'}
          </button>
        </form>

        {result && result.variants.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-background/60 border border-border"
            aria-live="polite"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {result.variants.length} draft{result.variants.length === 1 ? '' : 's'}
            </h2>

            <div className="space-y-5">
              {result.variants.map((body, index) => (
                <article key={index} className="p-5 rounded-xl border border-border bg-card/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    {result.subjectLines?.[index] ? (
                      <h3 className="font-semibold text-foreground">
                        {result.subjectLines[index]}
                      </h3>
                    ) : (
                      <h3 className="font-semibold text-foreground">Variant {index + 1}</h3>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(index)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:border-primary/50 transition"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-sm text-foreground font-sans">
                    {body}
                  </pre>
                </article>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Review every claim before sending — these drafts are starting points, not final answers.</p>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}