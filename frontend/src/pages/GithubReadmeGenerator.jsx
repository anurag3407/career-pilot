import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Sparkles, Copy, Download, Check, Loader2,
  FileCode2, Layout, Palette, GraduationCap, Rocket,
  RefreshCw, Wand2, AlertCircle, Server, Brain, Heart,
  Briefcase, Gamepad2, Eye, Code2, BookOpen, Clock,
  Trash2, ChevronDown, Star, GitFork, MapPin, Building2,
  Users, ExternalLink, Zap, Info, X, History
} from 'lucide-react';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
const TEMPLATES = [
  { id: 'minimal', name: 'Minimal Clean', icon: FileCode2, description: 'Concise, no fluff, just essentials.', color: 'from-slate-500 to-slate-700', tag: 'Popular' },
  { id: 'developer', name: 'Developer Pro', icon: Layout, description: 'Stats, badges, trophies — the full package.', color: 'from-blue-500 to-indigo-600', tag: 'Popular' },
  { id: 'creative', name: 'Creative Portfolio', icon: Palette, description: 'Bold visuals, banners, personality.', color: 'from-purple-500 to-pink-600', tag: null },
  { id: 'academic', name: 'Academic / Research', icon: GraduationCap, description: 'Publications, citations, formal tone.', color: 'from-emerald-500 to-teal-600', tag: null },
  { id: 'startup', name: 'Startup Founder', icon: Rocket, description: 'Products, metrics, impact-driven.', color: 'from-orange-500 to-red-600', tag: null },
  { id: 'devops', name: 'DevOps / SRE', icon: Server, description: 'Terminal vibes, infra badges, status.', color: 'from-cyan-500 to-blue-700', tag: null },
  { id: 'datascience', name: 'Data Scientist / ML', icon: Brain, description: 'Notebooks, models, Kaggle ranks.', color: 'from-violet-500 to-purple-700', tag: null },
  { id: 'opensource', name: 'Open Source Hero', icon: Heart, description: 'Community, contributions, streaks.', color: 'from-green-500 to-emerald-700', tag: null },
  { id: 'freelancer', name: 'Freelancer / Consultant', icon: Briefcase, description: 'Services, testimonials, availability.', color: 'from-amber-500 to-orange-600', tag: null },
  { id: 'gamer', name: 'Gamer / Streamer', icon: Gamepad2, description: 'Quest logs, achievements, fun.', color: 'from-fuchsia-500 to-pink-700', tag: null },
];

// ---------------------------------------------------------------------------
// History helpers (localStorage)
// ---------------------------------------------------------------------------
const HISTORY_KEY = 'readme_gen_history';
const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
};
const saveHistory = (entries) => {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 10))); } catch { /* noop */ }
};

// ---------------------------------------------------------------------------
// Auth headers
// ---------------------------------------------------------------------------
async function getAuthHeaders() {
  const session = window.Clerk?.session;
  if (!session) {
    if (import.meta.env.DEV) return { Authorization: 'Bearer mock-dev-token', 'Content-Type': 'application/json' };
    throw new Error('Not authenticated');
  }
  const token = await session.getToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  try {
    const aiConfig = useAIConfigStore.getState().getActiveConfig();
    if (aiConfig) {
      if (aiConfig.provider) headers['X-AI-Provider'] = aiConfig.provider;
      if (aiConfig.apiKey) headers['X-AI-Key'] = aiConfig.apiKey;
      if (aiConfig.model) headers['X-AI-Model'] = aiConfig.model;
      if (aiConfig.baseUrl) headers['X-AI-Base-Url'] = aiConfig.baseUrl;
    }
  } catch { /* noop */ }
  try {
    const { useGithubConfigStore } = await import('../stores/useGithubConfigStore');
    const ghState = useGithubConfigStore.getState();
    const pat = ghState.getDecryptedToken();
    if (pat) headers['X-GitHub-Token'] = pat;
  } catch { /* noop */ }
  return headers;
}

// ---------------------------------------------------------------------------
// Simple Markdown → HTML (lightweight, no deps)
// ---------------------------------------------------------------------------
function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px;margin:4px 0" />')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--primary);text-decoration:underline">$1</a>')
    // headers
    .replace(/^######\s(.+)$/gm, '<h6 style="font-size:0.8rem;font-weight:700;margin:8px 0 4px">$1</h6>')
    .replace(/^#####\s(.+)$/gm, '<h5 style="font-size:0.85rem;font-weight:700;margin:8px 0 4px">$1</h5>')
    .replace(/^####\s(.+)$/gm, '<h4 style="font-size:0.9rem;font-weight:700;margin:10px 0 4px">$1</h4>')
    .replace(/^###\s(.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;margin:12px 0 6px">$1</h3>')
    .replace(/^##\s(.+)$/gm, '<h2 style="font-size:1.2rem;font-weight:800;margin:16px 0 8px">$1</h2>')
    .replace(/^#\s(.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:900;margin:20px 0 10px">$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // code blocks
    .replace(/```[\s\S]*?```/g, (m) => `<pre style="background:var(--muted);padding:12px;border-radius:8px;overflow-x:auto;font-size:0.8rem;margin:8px 0"><code>${m.replace(/```\w*\n?/g, '').replace(/```/g, '')}</code></pre>`)
    // inline code
    .replace(/`([^`]+)`/g, '<code style="background:var(--muted);padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>')
    // hr
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0" />')
    // blockquote
    .replace(/^&gt;\s(.+)$/gm, '<blockquote style="border-left:3px solid var(--primary);padding-left:12px;color:var(--muted-foreground);margin:8px 0">$1</blockquote>')
    // unordered list
    .replace(/^[-*]\s(.+)$/gm, '<li style="margin-left:16px;list-style:disc;margin-bottom:2px">$1</li>')
    // line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function GithubReadmeGenerator() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('developer');
  const [customInstructions, setCustomInstructions] = useState('');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // preview | code | setup
  const [history, setHistory] = useState(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const outputRef = useRef(null);

  const cleanUsername = username.trim().replace(/^.*github\.com\//, '').replace(/^@/, '');

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!username.trim()) { setError('Enter a GitHub username or URL'); return; }
    setFetchingProfile(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/readme-generator/fetch-profile`, {
        method: 'POST', headers,
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch profile');
      setProfile(data.profile);
      toast.success(`Loaded @${data.profile.username}'s profile`);
    } catch (err) { setError(err.message); }
    finally { setFetchingProfile(false); }
  }, [username]);

  // Generate
  const generateReadme = useCallback(async () => {
    if (!profile) { setError('Fetch a GitHub profile first'); return; }
    if (!selectedTemplate) { setError('Select a template'); return; }
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/readme-generator/generate`, {
        method: 'POST', headers,
        body: JSON.stringify({ username: username.trim(), templateId: selectedTemplate, customInstructions: customInstructions.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');
      setReadme(data.readme);
      setActiveTab('preview');
      toast.success('README generated!');
      // Save to history
      const entry = { id: Date.now(), username: cleanUsername, template: selectedTemplate, timestamp: new Date().toISOString(), readme: data.readme };
      const updated = [entry, ...history].slice(0, 10);
      setHistory(updated);
      saveHistory(updated);
      // Scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) { setError(err.message); toast.error(err.message); }
    finally { setLoading(false); }
  }, [username, selectedTemplate, customInstructions, profile, history, cleanUsername]);

  // Actions
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(readme);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  const downloadReadme = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'README.md'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded README.md');
  };
  const clearHistory = () => { setHistory([]); saveHistory([]); toast.success('History cleared'); };
  const loadFromHistory = (entry) => {
    setReadme(entry.readme);
    setUsername(entry.username);
    setSelectedTemplate(entry.template);
    setActiveTab('preview');
    setShowHistory(false);
    toast.success('Loaded from history');
  };

  const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);
  const lineCount = readme ? readme.split('\n').length : 0;
  const wordCount = readme ? readme.split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Github className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">README Generator</span>
            <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary sm:block">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${showHistory ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <History className="h-3.5 w-3.5" /> History
              {history.length > 0 && <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-[10px] font-bold text-primary">{history.length}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-sm font-semibold">Generation History</span>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">No generations yet. Your history will appear here.</p>
              ) : (
                <div className="divide-y divide-border">
                  {history.map((h) => (
                    <button key={h.id} onClick={() => loadFromHistory(h)}
                      className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-muted/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        {(() => { const T = TEMPLATES.find(t => t.id === h.template); return T ? <T.icon className="h-4 w-4 text-primary" /> : <FileCode2 className="h-4 w-4 text-primary" />; })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">@{h.username} · {TEMPLATES.find(t => t.id === h.template)?.name || h.template}</p>
                        <p className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* ─── LEFT: Configuration Panel ─── */}
          <div className="space-y-5">
            {/* GitHub Input */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Github className="h-3.5 w-3.5" /> GitHub Profile
              </label>
              <div className="flex gap-2">
                <input
                  type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchProfile()}
                  placeholder="username or github.com/username"
                  className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button onClick={fetchProfile} disabled={fetchingProfile}
                  className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-all hover:opacity-90 disabled:opacity-50">
                  {fetchingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                  Fetch
                </button>
              </div>

              {/* Profile card */}
              <AnimatePresence>
                {profile && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-4 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <img src={profile.avatar_url} alt={profile.name} className="h-12 w-12 rounded-full border-2 border-border" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">@{profile.username}</p>
                        {profile.bio && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{profile.bio}</p>}
                      </div>
                    </div>
                    {/* Stats row */}
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        { icon: FileCode2, label: 'Repos', value: profile.public_repos },
                        { icon: Users, label: 'Followers', value: profile.followers },
                        { icon: Star, label: 'Stars', value: profile.totalStars },
                        { icon: GitFork, label: 'Langs', value: profile.topLanguages?.length || 0 },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">
                          <p className="text-xs font-bold">{s.value}</p>
                          <p className="text-[9px] text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Languages */}
                    {profile.topLanguages?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {profile.topLanguages.slice(0, 6).map((lang) => (
                          <span key={lang} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{lang}</span>
                        ))}
                      </div>
                    )}
                    {/* Top repos */}
                    {profile.topRepositories?.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Repos</p>
                        {profile.topRepositories.slice(0, 3).map((repo) => (
                          <div key={repo.name} className="flex items-center gap-2 text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            <span className="font-medium truncate">{repo.name}</span>
                            <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                              <Star className="h-3 w-3" />{repo.stars}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Template Selection */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <button onClick={() => setShowTemplates(!showTemplates)} className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Layout className="h-3.5 w-3.5" /> Template
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showTemplates && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {TEMPLATES.map((t) => (
                        <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                          className={`group relative rounded-xl border p-3 text-left transition-all ${
                            selectedTemplate === t.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-primary/30 hover:bg-muted/30'
                          }`}>
                          <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${t.color} text-white`}>
                            <t.icon className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-[11px] font-bold leading-tight">{t.name}</p>
                          <p className="mt-0.5 text-[9px] leading-tight text-muted-foreground line-clamp-2">{t.description}</p>
                          {t.tag && <span className="absolute right-2 top-2 rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold text-primary">{t.tag}</span>}
                          {selectedTemplate === t.id && (
                            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Instructions */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Wand2 className="h-3.5 w-3.5" /> Custom Instructions
                <span className="text-[9px] font-normal normal-case tracking-normal text-muted-foreground/60">(optional)</span>
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Highlight my open source work, add a 'Currently building' section, mention my tech blog..."
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {/* Quick suggestions */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Add a hiring badge', 'Include my blog link', 'Show GitHub stats card', 'Add visitor counter'].map((s) => (
                  <button key={s} onClick={() => setCustomInstructions(prev => prev ? `${prev}, ${s.toLowerCase()}` : s)}
                    className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReadme}
              disabled={!profile || loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-foreground py-4 text-sm font-bold text-background shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" /> Generate README</>
              )}
            </button>
            {!profile && (
              <p className="text-center text-[11px] text-muted-foreground">Fetch a GitHub profile above to get started</p>
            )}
          </div>

          {/* ─── RIGHT: Output Panel ─── */}
          <div ref={outputRef}>
            {!readme && !loading ? (
              /* Empty state */
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <FileCode2 className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="mt-5 text-sm font-semibold text-muted-foreground">Your README will appear here</p>
                <p className="mt-1.5 max-w-xs text-center text-xs text-muted-foreground/70">
                  Fetch a GitHub profile, pick a template, and hit generate. Your AI-crafted README.md will show up with a live preview.
                </p>
                <div className="mt-6 flex items-center gap-6 text-[10px] text-muted-foreground/50">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Live Preview</span>
                  <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> Raw Markdown</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Setup Guide</span>
                </div>
              </div>
            ) : loading ? (
              /* Loading state */
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-2xl border border-border bg-card">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <p className="mt-6 text-sm font-semibold">Crafting your README...</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {selectedTemplateData?.name} style for @{cleanUsername}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            ) : (
              /* Output */
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3 py-2">
                  {/* Tabs */}
                  <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
                    {[
                      { id: 'preview', icon: Eye, label: 'Preview' },
                      { id: 'code', icon: Code2, label: 'Markdown' },
                      { id: 'setup', icon: BookOpen, label: 'Setup' },
                    ].map((tab) => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                          activeTab === tab.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}>
                        <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="hidden text-[10px] text-muted-foreground sm:block">{lineCount} lines · {wordCount} words</span>
                    <div className="h-4 w-px bg-border" />
                    <button onClick={copyToClipboard} title="Copy"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={downloadReadme} title="Download"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={generateReadme} title="Regenerate" disabled={loading}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tab content */}
                <div className="max-h-[600px] overflow-auto">
                  {activeTab === 'preview' && (
                    <div className="p-6 prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(readme) }} />
                  )}
                  {activeTab === 'code' && (
                    <pre className="p-6 text-[13px] leading-relaxed font-mono whitespace-pre-wrap text-foreground/90">{readme}</pre>
                  )}
                  {activeTab === 'setup' && (
                    <div className="p-6">
                      <h3 className="mb-1 text-base font-bold">Deploy your README</h3>
                      <p className="mb-6 text-sm text-muted-foreground">Follow these steps to add your new README to GitHub.</p>
                      <div className="space-y-5">
                        {[
                          { step: 1, title: `Create repository "${cleanUsername}"`, desc: `Go to github.com/new → name it exactly "${cleanUsername}" (your username). GitHub detects this as a special profile repo.`, action: { label: 'Open GitHub → New Repo', href: `https://github.com/new?name=${cleanUsername}` } },
                          { step: 2, title: 'Add README.md', desc: 'In the new repo, click "creating a new file" → name it README.md → paste the generated content.' },
                          { step: 3, title: 'Commit changes', desc: 'Write a commit message like "Add profile README" and click "Commit new file".' },
                          { step: 4, title: 'View your profile', desc: `Visit github.com/${cleanUsername} — your new README appears at the top of your profile page!`, action: { label: 'View Profile', href: `https://github.com/${cleanUsername}` } },
                        ].map((s) => (
                          <div key={s.step} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{s.step}</span>
                              {s.step < 4 && <div className="mt-1 h-full w-px bg-border" />}
                            </div>
                            <div className="pb-2">
                              <p className="text-sm font-semibold">{s.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                              {s.action && (
                                <a href={s.action.href} target="_blank" rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">
                                  <ExternalLink className="h-3 w-3" /> {s.action.label}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Pro tip */}
                      <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          <p className="font-semibold text-foreground">Pro tip</p>
                          <p className="mt-1">You can regenerate anytime with a different template. The badges and stats cards in your README update automatically as your GitHub activity changes — no manual updates needed.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom action bar */}
                <div className="flex items-center gap-3 border-t border-border bg-muted/20 px-4 py-3">
                  <button onClick={copyToClipboard}
                    className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button onClick={downloadReadme}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-bold transition-colors hover:bg-muted">
                    <Download className="h-3.5 w-3.5" /> Download .md
                  </button>
                  <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Layout className="h-3 w-3" /> {selectedTemplateData?.name}</span>
                    <span>·</span>
                    <span>@{cleanUsername}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
