import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SECTIONS = ['summary', 'experience', 'education', 'skills', 'projects'];

export default function SharedResumeView() {
  const { shareToken } = useParams();
  const [resume, setResume] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ section: 'summary', text: '', authorEmail: '', authorName: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/collaboration/shared/${shareToken}`)
      .then(async r => {
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          throw new Error(errData.error || 'Invalid or expired link');
        }
        return r.json();
      })
      .then(data => setResume(data.resume))
      .catch(e => setError(e.message));

    fetch(`/api/collaboration/shared/${shareToken}/comments`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setComments(data))
      .catch(() => {});
  }, [shareToken]);

  const submitComment = async () => {
    if (!form.text || !form.authorEmail) return;
    try {
      const response = await fetch(`/api/collaboration/shared/${shareToken}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data, ...prev]);
        setForm(f => ({ ...f, text: '' }));
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!resume) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{resume.name || 'Resume'}</h1>
        <pre className="whitespace-pre-wrap text-sm text-gray-700">{resume.enhancedContent || resume.rawText}</pre>
      </div>
      <div className="col-span-1 flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Leave Feedback</h2>
          <input className="w-full border rounded p-2 text-sm mb-2" placeholder="Your name"
            value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} />
          <input className="w-full border rounded p-2 text-sm mb-2" placeholder="Your email *"
            value={form.authorEmail} onChange={e => setForm(f => ({ ...f, authorEmail: e.target.value }))} />
          <select className="w-full border rounded p-2 text-sm mb-2"
            value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
            {SECTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <textarea className="w-full border rounded p-2 text-sm mb-2" rows={3} placeholder="Your comment..."
            value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />
          <button type="button" onClick={submitComment}
            className="w-full bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700 transition">
            {submitted ? '✓ Submitted!' : 'Submit Feedback'}
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-y-auto max-h-[50vh]">
          <h2 className="font-semibold mb-2">All Comments ({comments.length})</h2>
          {comments.length === 0 && <p className="text-sm text-gray-400">No feedback yet.</p>}
          {comments.map(c => (
            <div key={c._id} className={`mb-3 p-2 rounded border text-sm ${c.resolved ? 'opacity-50 bg-green-50' : ''}`}>
              <span className="font-medium">{c.authorName || c.authorEmail}</span>
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1 rounded">{c.section}</span>
              {c.resolved && <span className="ml-2 text-xs text-green-600">✓ resolved</span>}
              <p className="mt-1 text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
