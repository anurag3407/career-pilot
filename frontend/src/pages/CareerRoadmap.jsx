import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Clock, BookOpen, Target, ChevronRight, Loader2, Trophy, Star } from 'lucide-react';

const difficultyColors = {
  beginner: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
  intermediate: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
  advanced: { bg: 'rgba(168, 85, 247, 0.15)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' },
};

const phaseGradients = [
  'linear-gradient(135deg, #06b6d4, #0ea5e9)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
];

export default function CareerRoadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedPhase, setExpandedPhase] = useState(null);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please enter a target role');
      return;
    }

    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const { auth } = await import('../config/firebase');
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const skills = currentSkills.split(',').map(s => s.trim()).filter(Boolean);

      const response = await fetch(`${API_BASE}/career-roadmap/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetRole, currentSkills: skills, yearsOfExperience }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roadmap');
      setRoadmap(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Career Roadmap Generator</h1>
            <p className="text-muted-foreground text-sm">AI-powered personalized learning paths to your dream role</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="premium-card p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-foreground mb-2">Target Role *</label>
            <input
              id="career-roadmap-target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., DevOps Engineer, AI Specialist"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-foreground mb-2">Current Skills</label>
            <input
              id="career-roadmap-skills"
              type="text"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g., Python, React, SQL (comma-separated)"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-foreground mb-2">Years of Experience: {yearsOfExperience}</label>
            <input
              id="career-roadmap-experience"
              type="range"
              min="0"
              max="20"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              className="w-full mt-3 accent-[var(--primary)]"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
            </div>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-4">{error}</motion.p>
        )}

        <button
          id="career-roadmap-generate-btn"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-8 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Generating Roadmap...' : 'Generate Roadmap'}
        </button>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
              <Map className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium">Crafting your personalized career roadmap...</p>
            <div className="mt-4 w-64 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
                initial={{ width: '0%' }}
                animate={{ width: '85%' }}
                transition={{ duration: 8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {roadmap && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{roadmap.title}</h2>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>Estimated: {roadmap.estimatedDuration}</span>
                <span className="mx-2">•</span>
                <span>{roadmap.phases?.length} phases</span>
              </div>
            </div>
          </div>

          <div className="relative ml-4 md:ml-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #06b6d4, #8b5cf6, #ec4899)' }} />

            {roadmap.phases?.map((phase, index) => {
              const isExpanded = expandedPhase === index;
              const gradient = phaseGradients[index % phaseGradients.length];
              const difficulty = difficultyColors[phase.difficulty] || difficultyColors.beginner;

              return (
                <motion.div
                  key={phase.id || index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-12 pb-10 last:pb-0"
                >
                  <div className="absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg z-10"
                    style={{ background: gradient }}
                  >
                    {index + 1}
                  </div>

                  <div
                    className="premium-card p-5 cursor-pointer group"
                    onClick={() => setExpandedPhase(isExpanded ? null : index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{phase.title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: difficulty.bg, color: difficulty.text, border: `1px solid ${difficulty.border}` }}
                          >
                            {phase.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{phase.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {phase.skills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                                <Trophy className="w-4 h-4 text-amber-500" /> Milestones
                              </h4>
                              <ul className="space-y-2">
                                {phase.milestones?.map((m, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Target className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                                    <span>{m}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                                <BookOpen className="w-4 h-4 text-blue-500" /> Resources
                              </h4>
                              <ul className="space-y-2">
                                {phase.resources?.map((r, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Star className="w-3.5 h-3.5 mt-0.5 text-secondary shrink-0" />
                                    <div>
                                      <span className="font-medium text-foreground">{r.title}</span>
                                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.type}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {roadmap.tips && roadmap.tips.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="premium-card p-6 mt-8"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" /> Pro Tips
              </h3>
              <ul className="space-y-3">
                {roadmap.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: phaseGradients[i % phaseGradients.length] }}>
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
