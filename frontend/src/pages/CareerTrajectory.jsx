import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Briefcase,
  Clock,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Target,
  Layers,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhanceApi } from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

/**
 * Colour palette for distinguishing the 3 career paths.
 * Uses HSL-tuned colours that work well with both light and dark themes.
 */
const PATH_COLORS = [
  { accent: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)', label: 'Sky' },
  { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', label: 'Violet' },
  { accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', label: 'Emerald' },
];

const LEVEL_BADGES = {
  Junior: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
  Mid: 'bg-sky-500/15 text-sky-500 border-sky-500/25',
  Senior: 'bg-violet-500/15 text-violet-500 border-violet-500/25',
  Lead: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
  Director: 'bg-rose-500/15 text-rose-500 border-rose-500/25',
};

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Media & Entertainment',
  'Consulting',
  'Manufacturing',
  'Government',
  'Non-profit',
];

/* ─── Loading Skeleton ─────────────────────────────────────────────── */
function TrajectoryLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-8 w-64 bg-foreground/10" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-48 bg-foreground/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="rounded-xl border border-border p-4 space-y-3">
                <Skeleton className="h-5 w-32 bg-foreground/10" />
                <Skeleton className="h-4 w-20 bg-foreground/10" />
                <Skeleton className="h-3 w-full bg-foreground/10" />
                <Skeleton className="h-3 w-2/3 bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Single Role Card ─────────────────────────────────────────────── */
function RoleCard({ role, index, color }) {
  const levelClass = LEVEL_BADGES[role.level] || 'bg-muted text-muted-foreground border-border';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.35 }}
      className="relative rounded-xl border p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform"
      style={{
        borderColor: color.border,
        backgroundColor: color.bg,
      }}
    >
      {/* Step indicator */}
      <div
        className="absolute -top-3 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
        style={{ backgroundColor: color.accent }}
      >
        {index + 1}
      </div>

      {/* Title & Level */}
      <div className="pt-1">
        <h4 className="text-base font-bold text-foreground leading-snug">{role.title}</h4>
        <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${levelClass}`}>
          {role.level}
        </span>
      </div>

      {/* Timeline */}
      {role.timeToReach && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{role.timeToReach}</span>
        </div>
      )}

      {/* Salary */}
      {role.estimatedSalary && (
        <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: color.accent }}>
          <DollarSign className="w-3.5 h-3.5" />
          <span>{role.estimatedSalary}</span>
        </div>
      )}

      {/* Skills */}
      {role.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {role.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs font-medium rounded-md bg-foreground/5 text-foreground/70 border border-foreground/10"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Career Path Section ──────────────────────────────────────────── */
function CareerPath({ path, index }) {
  const color = PATH_COLORS[index % PATH_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Path Header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: `2px solid ${color.border}` }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color.bg, color: color.accent }}
        >
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate">
            Path {index + 1}: {path.pathName}
          </h3>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold border"
          style={{
            borderColor: color.border,
            backgroundColor: color.bg,
            color: color.accent,
          }}
        >
          {path.roles?.length || 0} roles
        </span>
      </div>

      {/* Roles Grid */}
      <div className="p-6">
        {/* Timeline connector (desktop) */}
        <div className="hidden lg:flex items-center justify-between mb-6 px-4">
          {path.roles?.map((_, i) => (
            <React.Fragment key={i}>
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ borderColor: color.accent, backgroundColor: i === 0 ? color.accent : 'transparent' }}
              />
              {i < (path.roles?.length || 0) - 1 && (
                <div className="flex-1 mx-2">
                  <div className="h-0.5 w-full" style={{ backgroundColor: color.border }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {path.roles?.map((role, i) => (
            <RoleCard key={i} role={role} index={i} color={color} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page Component ──────────────────────────────────────────── */
const CareerTrajectory = () => {
  const [formData, setFormData] = useState({
    currentRole: '',
    skills: '',
    yearsOfExperience: '',
    industry: 'Technology',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    const parsedSkills = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!formData.currentRole.trim() && parsedSkills.length === 0) {
      toast.error('Please enter at least your current role or skills.');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const resumeData = {
        currentRole: formData.currentRole.trim(),
        skills: parsedSkills,
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience, 10)
          : 0,
        industry: formData.industry,
      };

      const response = await enhanceApi.careerTrajectory(resumeData);
      setResults(response.data);
    } catch (error) {
      console.error('Career trajectory error:', error);
      toast.error(error.message || 'Failed to predict career trajectory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Career Trajectory Predictor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your potential career paths with AI-generated trajectories tailored to your skills,
            experience, and industry.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-border mb-10"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Tell us about your current career
          </div>

          <form onSubmit={handlePredict} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Role */}
              <div>
                <label htmlFor="currentRole" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Briefcase size={16} className="text-primary" />
                  Current Role
                </label>
                <input
                  id="currentRole"
                  type="text"
                  name="currentRole"
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
                  value={formData.currentRole}
                  onChange={handleChange}
                />
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Layers size={16} className="text-primary" />
                  Key Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. React, Node.js, Python, AWS, Leadership"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Years of Experience */}
              <div>
                <label htmlFor="yearsOfExperience" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Clock size={16} className="text-primary" />
                  Years of Experience
                </label>
                <input
                  id="yearsOfExperience"
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  max="50"
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 3"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Award size={16} className="text-primary" />
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Career Paths...
                </span>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Predict My Career Path
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && <TrajectoryLoadingSkeleton />}

        {/* Results */}
        <AnimatePresence>
          {!loading && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Analyzed Profile Summary */}
              {results.analyzedProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Your Profile Summary
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                      <p className="text-sm font-bold text-foreground">{results.analyzedProfile.currentRole}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</p>
                      <p className="text-sm font-bold text-foreground">
                        {results.analyzedProfile.yearsOfExperience} years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills</p>
                      <p className="text-sm font-bold text-foreground">
                        {results.analyzedProfile.skillCount} identified
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</p>
                      <p className="text-sm font-bold text-foreground">{results.analyzedProfile.industry}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Section Title */}
              <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Your Predicted Career Paths
              </h2>

              {/* Career Paths */}
              {results.trajectories?.length > 0 ? (
                <div className="space-y-6">
                  {results.trajectories.map((path, i) => (
                    <CareerPath key={i} path={path} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No trajectories were generated.</p>
                  <p className="text-sm">Try adjusting your role or skills and try again.</p>
                </div>
              )}

              {/* Disclaimer */}
              {results.disclaimer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{results.disclaimer}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerTrajectory;
