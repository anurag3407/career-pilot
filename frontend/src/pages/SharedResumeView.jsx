import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { resumeData as d1Resumes } from '../services/d1Data';
import { normalizeResumeData } from '../context/ResumeContext';
import { markdownToStructured } from '../utils/resumeParser';
import { resumeDocumentToHtml } from '../utils/resumeHtml';

const SECTIONS = ['summary', 'experience', 'education', 'skills', 'projects'];

export default function SharedResumeView() {
  const { shareToken } = useParams();
  const [resume, setResume] = useState(null);
  const [source, setSource] = useState(null); // 'd1' | 'express'
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ section: 'summary', text: '', authorEmail: '', authorName: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // D1 is the primary source: public share links are served by the gateway
  // worker, so this page works in a Cloudflare-only deployment. The Express
  // collaboration endpoint remains a fallback for older links/comments.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payload = await d1Resumes.getByShareToken(shareToken);
        const record = payload?.data || payload?.resume;
        if (!record) throw new Error('not found');
        if (!cancelled) {
          setResume(record);
          setSource('d1');
        }
        return;
      } catch {
        // fall through to Express
      }

      try {
        const response = await fetch(`/api/collaboration/shared/${shareToken}`);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Invalid or expired link');
        }
        const data = await response.json();
        if (!cancelled) {
          setResume(data.resume);
          setSource('express');
        }
      } catch {
        if (!cancelled) {
          setError('This share link is invalid or has been disabled.');
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [shareToken]);

  // Comments still live on the optional Express backend.
  useEffect(() => {
    if (source !== 'express') return undefined;
    let cancelled = false;
    fetch(`/api/collaboration/shared/${shareToken}/comments`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [shareToken, source]);

  const structured = useMemo(() => {
    if (!resume) return null;
    if (resume.structuredData) return normalizeResumeData(resume.structuredData);
    const text = resume.enhancedText || resume.originalText || resume.enhancedContent || resume.rawText || '';
    return normalizeResumeData(markdownToStructured(text, resume.title || resume.name));
  }, [resume]);

  const html = useMemo(() => (structured ? resumeDocumentToHtml(structured) : ''), [structured]);

  const submitComment = async () => {
    if (!form.text || !form.authorEmail) return;
    try {
      const response = await fetch(`/api/collaboration/shared/${shareToken}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data, ...prev]);
        setForm((f) => ({ ...f, text: '' }));
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      }
    } catch {
      /* comment posting is best-effort */
    }
  };

  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!resume) return <div className="p-8 text-center">Loading...</div>;

  const hasComments = source === 'express';

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {structured?.personal?.name || resume.title || 'Shared resume'}
            </h1>
            <p className="text-xs text-muted-foreground">
              Shared resume · read-only
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            ATS-friendly layout
          </span>
        </div>

        <div className={`grid grid-cols-1 gap-6 ${hasComments ? 'lg:grid-cols-3' : ''}`}>
          <div className={hasComments ? 'lg:col-span-2' : ''}>
            <iframe
              title="Shared resume"
              srcDoc={html}
              sandbox=""
              className="w-full min-h-[75vh] rounded-xl border border-border bg-white shadow-sm"
            />
          </div>

          {hasComments && (
            <div className="flex flex-col gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <h2 className="font-semibold mb-3 text-foreground">Leave Feedback</h2>
                <input
                  className="w-full border border-border rounded p-2 text-sm mb-2 bg-background"
                  placeholder="Your name"
                  aria-label="Your name"
                  value={form.authorName}
                  onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                />
                <input
                  className="w-full border border-border rounded p-2 text-sm mb-2 bg-background"
                  placeholder="Your email *"
                  aria-label="Your email"
                  value={form.authorEmail}
                  onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
                />
                <select
                  className="w-full border border-border rounded p-2 text-sm mb-2 bg-background"
                  aria-label="Resume section"
                  value={form.section}
                  onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <textarea
                  className="w-full border border-border rounded p-2 text-sm mb-2 bg-background"
                  rows={3}
                  placeholder="Your comment..."
                  aria-label="Your comment"
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={submitComment}
                  className="w-full bg-primary text-primary-foreground rounded py-2 text-sm font-medium hover:bg-primary/90 transition"
                >
                  {submitted ? 'Submitted!' : 'Submit Feedback'}
                </button>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 overflow-y-auto max-h-[50vh]">
                <h2 className="font-semibold mb-2 text-foreground">All Comments ({comments.length})</h2>
                {comments.length === 0 && <p className="text-sm text-muted-foreground">No feedback yet.</p>}
                {comments.map((c, index) => (
                  <div
                    key={c._id || index}
                    className={`mb-3 p-2 rounded border border-border text-sm ${c.resolved ? 'opacity-50 bg-emerald-500/5' : ''}`}
                  >
                    <span className="font-medium">{c.authorName || c.authorEmail}</span>
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-1 rounded">{c.section}</span>
                    {c.resolved && <span className="ml-2 text-xs text-emerald-600">resolved</span>}
                    <p className="mt-1 text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
