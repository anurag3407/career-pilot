import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Search,
  Bot,
  AlertTriangle,
  ArrowRight,
  History,
  Loader2,
  Trash2,
  Clock,
  Star,
  GitFork,
  Package,
  BookOpen,
  BrainCircuit,
  Layers,
  ShieldCheck,
  Terminal,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { cn } from '../../lib/utils';
import Navbar from '../../components/Navbar';

export default function ProjectVisualizerLanding({ embedded = false }) {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState('graph');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const navigate = useNavigate();
  const { setStatus, setAnalysisData, setRepoUrl, status, reset } = useProjectVisualizerStore();

  useEffect(() => {
    reset();
    loadHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await projectVisualizerApi.getHistory();
      if (data?.success !== false && Array.isArray(data)) {
        setHistory(data);
      }
    } catch (e) {
      console.warn('Failed to load history', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    try {
      await projectVisualizerApi.deleteHistory(id);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      toast.success('History item deleted');
    } catch {
      toast.error('Failed to delete history');
    }
  };

  const handleSubmit = async (e, repoUrlToUse) => {
    if (e) e.preventDefault();
    const targetUrl = repoUrlToUse || url;

    if (!targetUrl || !targetUrl.includes('github.com')) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      setStatus('analyzing');
      setRepoUrl(targetUrl);
      toast.loading('Analyzing repository AST and module relationships...', { id: 'analyze' });

      const result = await projectVisualizerApi.analyze(targetUrl);
      toast.success('Architecture map generated', { id: 'analyze' });

      setAnalysisData(result);
      navigate(`/project-visualizer/dashboard/${result.sessionId}`);
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Failed to analyze repository', { id: 'analyze' });
    }
  };

  const presetRepos = [
    { label: 'facebook/react', url: 'https://github.com/facebook/react' },
    { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
    { label: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
  ];

  const features = [
    {
      title: 'Architecture Graph',
      desc: 'Interactive module dependency graph rendering folders, imports, and structural relationships.',
      icon: GitBranch,
      badge: 'Graph Engine',
    },
    {
      title: 'Dependency Scanner',
      desc: 'Review parsed dependency information and structural risks alongside code health signals.',
      icon: Package,
      badge: 'Risk Audit',
    },
    {
      title: 'Context-Aware Codebase AI',
      desc: 'Ask questions with repository context, inspect module flows, and verify details in the file viewer.',
      icon: Bot,
      badge: 'Code Q&A',
    },
    {
      title: 'Repo Interview Prep',
      desc: 'Generate targeted technical interview questions based directly on the repo architecture.',
      icon: BrainCircuit,
      badge: 'Interview Prep',
    },
    {
      title: 'Automated Onboarding Wiki',
      desc: 'Generate markdown guides, CONTRIBUTING.md drafts, and module overviews.',
      icon: BookOpen,
      badge: 'Developer Docs',
    },
    {
      title: 'Code Hotspots & Complexity',
      desc: 'Identify structural bottlenecks, circular dependencies, and high-complexity files.',
      icon: AlertTriangle,
      badge: 'Quality Audit',
    },
  ];

  const faqs = [
    {
      question: 'How long does it take to analyze a repository?',
      answer:
        'Analysis time depends on repository size and GitHub availability. The parser extracts module dependencies and file hierarchies, while generated analyses remain available in your history.',
    },
    {
      question: 'Does this work with private GitHub repositories?',
      answer:
        'Public repositories are supported by default. For private repositories, configure a GitHub personal access token in Settings.',
    },
    {
      question: 'What programming languages are supported?',
      answer:
        'Architecture analysis supports JavaScript, TypeScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP, C/C++, C#, Vue, Svelte, CSS, SQL, and configuration files.',
    },
    {
      question: 'How does the AI Codebase Chat work?',
      answer:
        'We build a structural summary of the repository and pass that context to your configured AI provider. Always verify critical file paths directly in the file explorer.',
    },
  ];

  return (
    <div className="cp-flight min-h-screen bg-background text-foreground overflow-x-hidden font-sans relative">
      {!embedded && <Navbar />}

      <div className={cn('relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20', embedded ? 'pt-8' : 'pt-24')}>
        {/* Header / Hero */}
        <div className="text-center max-w-3xl mx-auto pb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-3">
            04 Presence &amp; Network / Repo Visualizer
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-foreground leading-[1.08] mb-4">
            Turn any GitHub repo into an interactive architecture map
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Parse dependencies, inspect module graphs, spot structural risks, and chat with a repository before an interview or code review.
          </p>

          {/* Input Form */}
          <form onSubmit={(e) => handleSubmit(e)} id="analyzer-form" className="max-w-2xl mx-auto mb-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
              <div className="flex flex-1 items-center px-2">
                <Search className="w-4 h-4 text-primary mr-2.5 shrink-0" aria-hidden="true" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  aria-label="GitHub repository URL"
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground py-2"
                  disabled={status === 'analyzing'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'analyzing' || !url}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Parsing AST...</span>
                  </>
                ) : (
                  <>
                    <span>Visualize</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium mr-1">Sample repos:</span>
            {presetRepos.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setUrl(preset.url);
                  handleSubmit(null, preset.url);
                }}
                className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors font-mono text-foreground inline-flex items-center gap-1.5"
              >
                <GitBranch className="w-3 h-3 text-primary" aria-hidden="true" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Analysis History */}
        {!isLoadingHistory && history.length > 0 && (
          <section id="history" className="max-w-4xl mx-auto my-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-foreground">Your recent analyses</h2>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {history.length} saved
              </span>
            </div>

            <div className="grid gap-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/project-visualizer/dashboard/${item.sessionId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/project-visualizer/dashboard/${item.sessionId}`);
                    }
                  }}
                  className="group flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <GitBranch className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {item.repoOwner} / {item.repoName}
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {new Date(item.lastAnalyzed).toLocaleDateString()}
                        </span>
                        {item.github?.stars !== undefined && (
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3 h-3" aria-hidden="true" />
                            {item.github.stars} stars
                          </span>
                        )}
                        {item.stats?.totalFiles !== undefined && (
                          <span className="inline-flex items-center gap-1 font-mono text-primary">
                            <GitFork className="w-3 h-3" aria-hidden="true" />
                            {item.stats.totalFiles} files
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      View Map
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(item._id, e)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Delete history entry"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Preview Panel */}
        <section className="max-w-5xl mx-auto my-12 rounded-xl bg-card border border-border p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              Illustrative workspace preview
            </span>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-muted rounded-lg border border-border text-xs font-medium">
              {[
                { id: 'graph', label: 'Architecture Graph', icon: GitBranch },
                { id: 'calltree', label: 'Module Tree', icon: Layers },
                { id: 'health', label: 'Health Checks', icon: ShieldCheck },
                { id: 'chat', label: 'Code Q&A', icon: Bot },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors',
                    activeTab === tab.id
                      ? 'bg-card text-primary border border-border font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-background border border-border p-5 min-h-[220px]">
            {activeTab === 'graph' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xs font-mono font-semibold text-primary mb-1">src/server.ts</p>
                  <p className="text-xs text-muted-foreground">Entry point router &amp; HTTP bootstrap layer</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xs font-mono font-semibold text-foreground mb-1">src/auth/service.ts</p>
                  <p className="text-xs text-muted-foreground">Token verification &amp; session store</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xs font-mono font-semibold text-accent-foreground mb-1">src/db/client.ts</p>
                  <p className="text-xs text-muted-foreground">Database connection pool &amp; query layer</p>
                </div>
              </div>
            )}

            {activeTab === 'calltree' && (
              <div className="space-y-2 font-mono text-xs text-foreground">
                <div className="p-2.5 rounded bg-card border border-border">ROOT: app.listen(3000)</div>
                <div className="ml-4 p-2.5 rounded bg-card border border-border">router.use(&apos;/api/v1/auth&apos;, authRouter)</div>
                <div className="ml-4 p-2.5 rounded bg-card border border-border">router.use(&apos;/api/v1/visualize&apos;, visualizerRouter)</div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm font-semibold text-foreground">Dependency scan</p>
                  <p className="text-xs text-muted-foreground mt-1">Inspects manifests and import cycles</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm font-semibold text-foreground">Complexity hotspots</p>
                  <p className="text-xs text-muted-foreground mt-1">Flags oversized or tightly coupled modules</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm font-semibold text-foreground">Risk severity</p>
                  <p className="text-xs text-muted-foreground mt-1">Grouped by critical, high, medium, low</p>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border text-foreground">
                  <span className="font-semibold">Question:</span> How does authentication flow work in this repository?
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-foreground">
                  <span className="font-semibold text-primary">Codebase Q&amp;A:</span> Token checks run in{' '}
                  <code className="bg-muted px-1 py-0.5 rounded font-mono">middleware/auth.ts</code> before controllers execute.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Capabilities Grid */}
        <section id="features" className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Capabilities</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-2">
              Everything you need to orient in a new codebase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <feature.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="my-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question} className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180 text-primary')} aria-hidden="true" />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
