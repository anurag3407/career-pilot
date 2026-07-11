import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, History, Trash2 } from 'lucide-react';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
import { motion } from 'framer-motion';
import { roastApi } from '../../services/api';
import { useRoastStore } from '../../stores/useRoastStore';
import toast from 'react-hot-toast';

export default function RoastHub() {
  const history = useRoastStore((s) => s.history);
  const setHistory = useRoastStore((s) => s.setHistory);
  const lastResult = useRoastStore((s) => s.lastResult);
  const removeFromHistory = (id) => {
    // optimistic local removal
    setHistory(history.filter((r) => (r._id || r.id) !== id));
    roastApi.remove(id).catch(() => toast.error('Failed to delete'));
  };

  return (
    <HubLayout
      icon={Flame}
      title="Resume Roast"
      description="Get a brutally honest, comedic critique of your resume in 30 seconds. Free, BYOK, shareable."
      color="amber"
      breadcrumb="Resume Roast"
    >
      <ToolCard
        to="/resume-roast"
        icon={Flame}
        title="Roast a Resume"
        description="Paste your resume text or upload a PDF — AI delivers a comedic critique with star ratings and quick wins."
        badge="FREE"
        color="amber"
      />

      {history.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Recent Roasts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.slice(0, 6).map((r, i) => (
              <motion.div
                key={r._id || r.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group rounded-2xl border border-border bg-card p-4 hover:border-amber-500/40 transition-colors"
              >
                <Link to="/resume-roast" className="block">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{r.emoji || '🔥'}</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {r.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{r.tagline}</p>
                  {r.jobRole && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.jobRole}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <button type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromHistory(r._id || r.id);
                  }}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete roast"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </HubLayout>
  );
}