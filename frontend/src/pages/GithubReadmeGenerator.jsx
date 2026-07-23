import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Sparkles, Copy, Download, Check, Loader2,
  ArrowRight, ArrowLeft, FileCode2, Layout, Palette,
  GraduationCap, Rocket, RefreshCw, Wand2, AlertCircle
} from 'lucide-react';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// ---------------------------------------------------------------------------
// Template definitions (mirrors backend)
// ---------------------------------------------------------------------------
const TEMPLATES = [
  { id: 'minimal', name: 'Minimal Clean', icon: FileCode2, description: 'Clean, concise layout with essential info only.', color: 'from-slate-500 to-slate-700' },
  { id: 'developer', name: 'Developer Pro', icon: Layout, description: 'Full-featured developer profile with stats and badges.', color: 'from-blue-500 to-indigo-600' },
  { id: 'creative', name: 'Creative Portfolio', icon: Palette, description: 'Bold, visual-first layout with banners and personality.', color: 'from-purple-500 to-pink-600' },
  { id: 'academic', name: 'Academic / Research', icon: GraduationCap, description: 'Structured for researchers with publications and citations.', color: 'from-emerald-500 to-teal-600' },
  { id: 'startup', name: 'Startup Founder', icon: Rocket, description: 'Impact-driven layout highlighting products and metrics.', color: 'from-orange-500 to-red-600' },
];

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
const STEPS = ['input', 'template', 'generate', 'result'];

// ---------------------------------------------------------------------------
// Helper: get auth headers (simplified for this page)
// ---------------------------------------------------------------------------
async function getAuthHeaders() {
  const session = window.Clerk?.session;
  if (!session) {
    if (import.meta.env.DEV) {
      return { Authorization: 'Bearer mock-dev-token', 'Content-Type': 'application/json' };
    }
    throw new Error('Not authenticated');
  }
  const token = await session.getToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Inject AI provider config
  try {
    const aiConfig = useAIConfigStore.getState().getActiveConfig();
    if (aiConfig) {
      if (aiConfig.provider) headers['X-AI-Provider'] = aiConfig.provider;
      if (aiConfig.apiKey) headers['X-AI-Key'] = aiConfig.apiKey;
      if (aiConfig.model) headers['X-AI-Model'] = aiConfig.model;
      if (aiConfig.baseUrl) headers['X-AI-Base-Url'] = aiConfig.baseUrl;
    }
  } catch (e) { /* store not available */ }

  // Inject GitHub token
  try {
    const { useGithubConfigStore } = await import('../stores/useGithubConfigStore');
    const ghState = useGithubConfigStore.getState();
    const decryptedPat = ghState.getDecryptedToken();
    if (decryptedPat) headers['X-GitHub-Token'] = decryptedPat;
  } catch (e) { /* store not available */ }

  return headers;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function GithubReadmeGenerator() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Step 1: Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username or URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/readme-generator/fetch-profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch profile');
      }
      setProfile(data.profile);
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Step 3: Generate README
  const generateReadme = useCallback(async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/readme-generator/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username: username.trim(),
          templateId: selectedTemplate,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate README');
      }
      setReadme(data.readme);
      setStep(3);
      toast.success('README generated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [username, selectedTemplate, customInstructions]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(readme);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as file
  const downloadReadme = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('README.md downloaded!');
  };

  const cleanUsername = username.trim().replace(/^.*github\.com\//, '').replace(/^@/, '');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Github className="h-4 w-4" />
            GitHub README Generator
          </div>
          <h1 className="text-4xl font-black tracking-tighter md:text-5xl">
            Build a stunning{' '}
            <span className="text-primary">GitHub profile</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Enter your GitHub URL, pick a template, and let AI craft a professional README.md for your profile in seconds.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 md:w-12 ${i < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 0: Input */}
          {step === 0 && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-xl"
            >
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <label className="mb-2 block text-sm font-semibold">GitHub Username or Profile URL</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Github className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchProfile()}
                      placeholder="e.g. octocat or github.com/octocat"
                      className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    onClick={fetchProfile}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Fetch
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  We'll fetch your public repos, languages, and stats to build your README.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Template Selection */}
          {step === 1 && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Profile Preview */}
              {profile && (
                <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <img src={profile.avatar_url} alt={profile.name} className="h-14 w-14 rounded-full border-2 border-border" />
                  <div>
                    <p className="font-bold">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">@{profile.username} · {profile.public_repos} repos · {profile.followers} followers</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {profile.topLanguages.slice(0, 5).map((lang) => (
                        <span key={lang} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{lang}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setStep(0); setProfile(null); }}
                    className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change
                  </button>
                </div>
              )}

              <h2 className="mb-6 text-center text-xl font-bold">Choose a template</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`group relative rounded-xl border-2 p-5 text-left transition-all ${
                      selectedTemplate === t.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${t.color} text-white`}>
                      <t.icon className="h-5 w-5" />
                    </div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    {selectedTemplate === t.id && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom instructions */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">Custom instructions (optional)</label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Add a section about my open source contributions, mention my blog..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => { setStep(2); generateReadme(); }}
                  disabled={!selectedTemplate || loading}
                  className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" /> Generate README
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Generating */}
          {step === 2 && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-muted border-t-primary animate-spin" />
                <Wand2 className="absolute inset-0 m-auto h-8 w-8 text-primary" />
              </div>
              <p className="mt-6 text-lg font-semibold">Crafting your README...</p>
              <p className="mt-2 text-sm text-muted-foreground">
                AI is writing a {TEMPLATES.find(t => t.id === selectedTemplate)?.name} style README for @{cleanUsername}
              </p>
            </motion.div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Action bar */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy README'}
                </button>
                <button
                  onClick={downloadReadme}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" /> Download .md
                </button>
                <button
                  onClick={() => { setStep(1); setReadme(''); }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </button>
              </div>

              {/* README Preview */}
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                  <FileCode2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">README.md</span>
                  <span className="ml-auto text-xs text-muted-foreground">{readme.length} chars</span>
                </div>
                <pre className="max-h-[500px] overflow-auto p-6 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {readme}
                </pre>
              </div>

              {/* Setup Instructions */}
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Github className="h-5 w-5" /> How to use this README
                </h3>
                <ol className="space-y-4">
                  {[
                    { title: `Create a repository named "${cleanUsername}"`, desc: `Go to github.com/new and name the repository exactly "${cleanUsername}" (your username). GitHub will detect this as a special profile repository.` },
                    { title: 'Add the README.md file', desc: 'Copy the generated content above and paste it into the README.md file in your new repository.' },
                    { title: 'Commit and publish', desc: 'Commit the file. Your new profile README will appear on your GitHub profile page immediately.' },
                    { title: 'Customize further', desc: 'Edit the README.md anytime to add your latest projects, update stats, or tweak the design.' },
                  ].map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{s.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a
                  href={`https://github.com/new?name=${cleanUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Github className="h-4 w-4" /> Create "{cleanUsername}" repo on GitHub
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
