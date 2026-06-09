import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Github,
  Briefcase,
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  LayoutDashboard,
  User,
  Settings,
  Upload,
  Star,
  BookOpen,
  Zap,
  Target,
  MessageSquare,
  Bell,
  Shield,
  Code2,
  GitBranch,
  FolderOpen,
  ChevronRight,
  Loader2,
  MapPin,
  Building2,
  AlertCircle,
  Mail,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeApi, jobTrackerApi } from '../services/api';

// ─── Static page/action items ────────────────────────────────────────────────
const PAGE_ACTIONS = [
  { id: 'p-dashboard',    title: 'Dashboard',             description: 'Your career overview',           icon: LayoutDashboard, path: '/dashboard',          category: 'Pages' },
  { id: 'p-jobs',         title: 'Job Search',            description: 'Browse & search jobs',           icon: Briefcase,       path: '/jobs',               category: 'Pages' },
  { id: 'p-job-tracker',  title: 'Job Tracker',           description: 'Track job applications',         icon: Target,          path: '/job-tracker',        category: 'Pages' },
  { id: 'p-resume-hub',   title: 'Resume Hub',            description: 'Manage all your resumes',        icon: FileText,        path: '/hub/resume',         category: 'Pages' },
  { id: 'p-portfolio',    title: 'Portfolio Hub',         description: 'Build your portfolio',           icon: Globe,           path: '/hub/portfolio',      category: 'Pages' },
  { id: 'p-interview',    title: 'Interview Prep',        description: 'Practice interview questions',   icon: MessageSquare,   path: '/interview-prep',     category: 'Pages' },
  { id: 'p-skill-gap',    title: 'Skill Gap Analyzer',    description: 'Find missing skills',            icon: Sparkles,        path: '/skill-gap',          category: 'Pages' },
  { id: 'p-analytics',    title: 'Analytics',             description: 'Career progress insights',       icon: TrendingUp,      path: '/dashboard/analytics',category: 'Pages' },
  { id: 'p-community',    title: 'Community',             description: 'Connect with others',            icon: Star,            path: '/community',          category: 'Pages' },
  { id: 'p-upload',       title: 'Upload Resume',         description: 'Upload a PDF resume',            icon: Upload,          path: '/upload',             category: 'Pages' },
  { id: 'p-job-alerts',   title: 'Job Alerts',            description: 'Manage your job alerts',         icon: Bell,            path: '/job-alerts',         category: 'Pages' },
  { id: 'p-email-gen',    title: 'Email Generator',       description: 'AI-powered email writing',       icon: Mail,            path: '/email-generator',    category: 'Pages' },
  { id: 'p-linkedin',     title: 'LinkedIn Optimizer',    description: 'Optimise your LinkedIn profile', icon: User,            path: '/linkedin-optimizer', category: 'Pages' },
  { id: 'p-github',       title: 'GitHub Dashboard',      description: 'View GitHub insights',           icon: Github,          path: '/github-dashboard',   category: 'Pages' },
  { id: 'p-repo',         title: 'Repo Analyzer',         description: 'Analyse repository insights',    icon: GitBranch,       path: '/repo-analyzer',      category: 'Pages' },
  { id: 'p-viz',          title: 'Project Visualizer',    description: 'Visualise project structure',    icon: Code2,           path: '/project-visualizer', category: 'Pages' },
  { id: 'p-fellowship',   title: 'Fellowship',            description: 'Open challenges & proposals',    icon: BookOpen,        path: '/fellowship',         category: 'Pages' },
  { id: 'p-deployments',  title: 'Deployments',           description: 'Your live portfolio deployments',icon: FolderOpen,      path: '/deployments',        category: 'Pages' },
  { id: 'p-profile',      title: 'Profile',               description: 'Manage your profile',            icon: User,            path: '/profile',            category: 'Pages' },
  { id: 'p-security',     title: 'Security Settings',     description: 'Password & 2FA settings',        icon: Shield,          path: '/security',           category: 'Pages' },
  { id: 'p-settings',     title: 'Settings',              description: 'App preferences',                icon: Settings,        path: '/settings',           category: 'Pages' },
  { id: 'p-templates',    title: 'Template Gallery',      description: 'Browse portfolio templates',     icon: Sparkles,        path: '/templates',          category: 'Pages' },
];

const QUICK_ACTIONS = [
  { id: 'qa-new-resume',  title: 'New Resume',            description: 'Start building a new resume',    icon: Plus,            path: '/resume-builder',     category: 'Quick Actions' },
  { id: 'qa-text-resume', title: 'Resume from Text',      description: 'Convert text into a resume',     icon: Zap,             path: '/text-to-resume',     category: 'Quick Actions' },
  { id: 'qa-search-jobs', title: 'Search Jobs',           description: 'Find your next opportunity',     icon: Search,          path: '/jobs',               category: 'Quick Actions' },
  { id: 'qa-interview',   title: 'Start Interview Prep',  description: 'Practice with AI interviewer',   icon: MessageSquare,   path: '/interview-prep',     category: 'Quick Actions' },
];

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  'Quick Actions': { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30', iconColor: 'text-violet-400' },
  'Pages':         { bg: 'bg-cyan-500/10',   text: 'text-cyan-300',   border: 'border-cyan-500/20',   iconColor: 'text-cyan-400'   },
  'Resumes':       { bg: 'bg-emerald-500/10',text: 'text-emerald-300',border: 'border-emerald-500/20',iconColor: 'text-emerald-400' },
  'Tracked Jobs':  { bg: 'bg-amber-500/10',  text: 'text-amber-300',  border: 'border-amber-500/20',  iconColor: 'text-amber-400'  },
};

function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || CATEGORY_STYLES['Pages'];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border} leading-none`}>
      {category}
    </span>
  );
}

// ─── Highlight matched text ───────────────────────────────────────────────────
function HighlightedText({ text = '', query = '' }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-cyan-400/20 text-cyan-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const CommandPalette = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const [query, setQuery]               = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentActions, setRecentActions] = useState([]);

  // Dynamic data
  const [resumes, setResumes]         = useState([]);
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [dataError, setDataError]     = useState(null);

  const inputRef    = useRef(null);
  const containerRef = useRef(null);
  const listRef     = useRef(null);

  // ── Fetch dynamic data on open ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    setTimeout(() => inputRef.current?.focus(), 50);

    const saved = JSON.parse(localStorage.getItem('recentCommands') || '[]');
    setRecentActions(saved);

    setLoading(true);
    setDataError(null);

    Promise.all([
      resumeApi.getAll().catch(() => ({ resumes: [] })),
      jobTrackerApi.getAll().catch(() => ({ jobs: [] })),
    ]).then(([resumeData, jobData]) => {
      const r = Array.isArray(resumeData?.resumes)
        ? resumeData.resumes
        : Array.isArray(resumeData)
        ? resumeData
        : [];

      const j = Array.isArray(jobData?.jobs)
        ? jobData.jobs
        : Array.isArray(jobData)
        ? jobData
        : [];

      setResumes(r);
      setTrackedJobs(j);
    }).catch(() => {
      setDataError('Could not load resumes / tracked jobs.');
    }).finally(() => {
      setLoading(false);
    });

    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'auto';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // ── Build resume items ──────────────────────────────────────────────────────
  const resumeItems = useMemo(() =>
    resumes.map(r => ({
      id: `resume-${r._id || r.id}`,
      title: r.name || r.title || 'Untitled Resume',
      description: r.jobRole ? `Resume · ${r.jobRole}` : 'Resume',
      icon: FileText,
      path: `/resume/${r._id || r.id}`,
      category: 'Resumes',
    })),
  [resumes]);

  // ── Build tracked-job items ─────────────────────────────────────────────────
  const trackedJobItems = useMemo(() =>
    trackedJobs.map(j => ({
      id: `job-${j._id || j.id}`,
      title: j.jobTitle || j.title || 'Untitled Job',
      description: [j.company, j.status].filter(Boolean).join(' · ') || 'Tracked Job',
      icon: Building2,
      path: '/job-tracker',
      category: 'Tracked Jobs',
    })),
  [trackedJobs]);

  // ── Merge all items ─────────────────────────────────────────────────────────
  const allItems = useMemo(
    () => [...QUICK_ACTIONS, ...PAGE_ACTIONS, ...resumeItems, ...trackedJobItems],
    [resumeItems, trackedJobItems]
  );

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  // ── Group for display ───────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const map = {};
    filteredItems.forEach(item => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [filteredItems]);

  // Flat list for keyboard navigation (mirrors render order)
  const flatList = useMemo(() => {
    const order = ['Quick Actions', 'Pages', 'Resumes', 'Tracked Jobs'];
    return order.flatMap(cat => grouped[cat] || []);
  }, [grouped]);

  // Keep selectedIndex in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') { setIsOpen(false); return; }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < flatList.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : flatList.length - 1));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flatList[selectedIndex];
        if (selected) handleSelect(selected);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatList]);

  // ── Select handler ──────────────────────────────────────────────────────────
  const handleSelect = useCallback((action) => {
    navigate(action.path);

    const stripped = {
      id: action.id,
      title: action.title,
      description: action.description,
      path: action.path,
      category: action.category,
    };

    const updated = [
      stripped,
      ...recentActions.filter(a => a.id !== action.id),
    ].slice(0, 5);

    localStorage.setItem('recentCommands', JSON.stringify(updated));
    setRecentActions(updated);
    toast.success(`Opening ${action.title}`);
    setIsOpen(false);
  }, [navigate, recentActions, setIsOpen]);

  const handleOutsideClick = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  if (!isOpen) return null;

  // ── Render ──────────────────────────────────────────────────────────────────
  const renderGroup = (category, items) => {
    const s = CATEGORY_STYLES[category] || CATEGORY_STYLES['Pages'];
    return (
      <div key={category} className="mb-1">
        {/* Group header */}
        <div className="flex items-center gap-2 px-4 py-1.5 sticky top-0 bg-[#0b1120]/90 backdrop-blur-sm z-10">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text}`}>{category}</span>
          <div className={`flex-1 h-px ${s.bg.replace('bg-', 'bg-').replace('/10', '/20').replace('/15', '/20')}`} />
          <span className="text-[10px] text-gray-600">{items.length}</span>
        </div>

        <div className="space-y-0.5 px-2">
          {items.map((item) => {
            const idx = flatList.indexOf(item);
            const isSelected = selectedIndex === idx;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                data-idx={idx}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 group ${
                  isSelected
                    ? `${s.bg} border ${s.border}`
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected ? `${s.bg} ${s.iconColor}` : 'bg-white/5 text-gray-400 group-hover:text-gray-200'
                }`}>
                  <Icon size={15} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    <HighlightedText text={item.title} query={query} />
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    <HighlightedText text={item.description} query={query} />
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={14}
                  className={`shrink-0 transition-all duration-150 ${
                    isSelected ? `${s.iconColor} opacity-100 translate-x-0` : 'text-gray-600 opacity-0 -translate-x-1'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const categoryOrder = ['Quick Actions', 'Pages', 'Resumes', 'Tracked Jobs'];
  const hasResults = flatList.length > 0;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-start justify-center px-4 pt-20"
      style={{ animation: 'fadeIn 0.12s ease' }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1120]/98 shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        style={{ maxHeight: 'min(640px, 85vh)', animation: 'slideDown 0.15s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 shrink-0">
          {loading
            ? <Loader2 size={17} className="text-cyan-400 animate-spin shrink-0" />
            : <Search size={17} className="text-cyan-400 shrink-0" />
          }

          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, resumes, jobs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-600 text-sm"
          />

          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="text-gray-500 hover:text-gray-300 transition text-xs px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
            >
              Clear
            </button>
          )}

          <kbd className="hidden sm:block text-[10px] text-gray-600 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* ── Recent (shown when no query) ───────────────────────────────── */}
        {!query && recentActions.length > 0 && (
          <div className="border-b border-white/10 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <Clock size={11} />
              Recent
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentActions.map((action) => {
                const style = CATEGORY_STYLES[action.category] || CATEGORY_STYLES['Pages'];
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all hover:brightness-125 ${style.bg} ${style.text} ${style.border}`}
                  >
                    <Clock size={10} />
                    {action.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Error notice ───────────────────────────────────────────────── */}
        {dataError && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 shrink-0">
            <AlertCircle size={13} />
            {dataError}
          </div>
        )}

        {/* ── Results list ───────────────────────────────────────────────── */}
        <div ref={listRef} className="overflow-y-auto flex-1 py-2 scroll-smooth">
          {hasResults
            ? categoryOrder.map(cat => grouped[cat]?.length > 0 ? renderGroup(cat, grouped[cat]) : null)
            : (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Search size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">No results for "{query}"</p>
                  <p className="text-xs text-gray-600 mt-1">Try a page name, resume title, or job title</p>
                </div>
              </div>
            )
          }
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-3 text-[11px] text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="bg-white/8 border border-white/10 rounded px-1 py-0.5 text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white/8 border border-white/10 rounded px-1 py-0.5 text-[10px]">↵</kbd>
              Select
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-600">
            <kbd className="bg-white/8 border border-white/10 rounded px-1.5 py-0.5 text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="bg-white/8 border border-white/10 rounded px-1.5 py-0.5 text-[10px]">K</kbd>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
};

export default CommandPalette;
