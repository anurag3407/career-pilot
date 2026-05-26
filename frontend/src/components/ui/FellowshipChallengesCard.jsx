import { motion } from "framer-motion";
import { Clock, TrendingUp, Code, Palette, Zap, ArrowRight } from "lucide-react";

/**
 * Premium Fellowship Challenges Section Component
 * Modern SaaS-style cards with realistic opportunity display
 */
export default function FellowshipChallengesCard() {
  const challenges = [
    {
      id: 1,
      title: "Build AI-Powered Analytics Dashboard",
      company: "TechVenture Labs",
      logo: "🚀",
      category: "Development",
      reward: 15000,
      difficulty: "Advanced",
      tech: ["React", "Node.js", "ML"],
      avatar: "👨‍💼",
      deadline: "14 days",
      status: "Hot",
      applicants: 24,
    },
    {
      id: 2,
      title: "Redesign Mobile App UI/UX",
      company: "DesignCo Studio",
      logo: "🎨",
      category: "Design",
      reward: 8500,
      difficulty: "Intermediate",
      tech: ["Figma", "UI/UX", "Mobile"],
      avatar: "👩‍🎨",
      deadline: "21 days",
      status: "Featured",
      applicants: 18,
    },
    {
      id: 3,
      title: "Content Strategy & SEO Optimization",
      company: "GrowthHub Inc",
      logo: "📈",
      category: "Marketing",
      reward: 12000,
      difficulty: "Intermediate",
      tech: ["SEO", "Content", "Analytics"],
      avatar: "👨‍💼",
      deadline: "10 days",
      status: "Hot",
      applicants: 32,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-baseline gap-2 mb-4"
      >
        <h3 className="text-lg font-bold text-white">Featured Opportunities</h3>
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-lg"
        >
          ⚡
        </motion.span>
      </motion.div>

      {/* Challenges grid */}
      <div className="grid gap-4 sm:gap-5">
        {challenges.map((challenge, idx) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={idx} />
        ))}
      </div>

      {/* View all button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 text-blue-300 hover:text-blue-200 hover:border-blue-500/50 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
      >
        View All Opportunities
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </div>
  );
}

/**
 * Individual challenge/opportunity card component
 */
function ChallengeCard({ challenge, index }) {
  const difficultyColors = {
    Beginner: "from-emerald-500 to-teal-500",
    Intermediate: "from-blue-500 to-cyan-500",
    Advanced: "from-purple-500 to-pink-500",
  };

  const statusColors = {
    Hot: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300",
    Featured: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      className="group relative"
    >
      {/* Hover background effect */}
      <motion.div
        className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        variants={{
          hover: { opacity: 0.5 },
        }}
      />

      {/* Main card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-lg border border-slate-600/30 overflow-hidden transition-all duration-300 group-hover:border-slate-500/50 shadow-xl">
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
          variants={{
            hover: { opacity: 1 },
          }}
          initial={{ opacity: 0 }}
        />

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Header with company and status */}
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Company logo and info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Company logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md border border-slate-600/30 flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                {challenge.logo}
              </div>

              {/* Company details */}
              <div className="flex-1 min-w-0">
                <motion.p
                  variants={{
                    hover: { color: "#60a5fa" },
                  }}
                  className="text-xs font-semibold text-slate-400 uppercase tracking-wider transition-colors"
                >
                  {challenge.company}
                </motion.p>
                <p className="text-slate-600 text-xs mt-0.5">{challenge.category}</p>
              </div>
            </div>

            {/* Status badge */}
            {challenge.status && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2 }}
                className={`px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${
                  statusColors[challenge.status]
                } backdrop-blur-md border text-xs font-bold whitespace-nowrap flex-shrink-0`}
              >
                ✨ {challenge.status}
              </motion.div>
            )}
          </div>

          {/* Challenge title */}
          <motion.h4
            variants={{
              hover: { color: "#ffffff" },
            }}
            className="text-base sm:text-lg font-bold text-slate-100 mb-3 line-clamp-2 transition-colors"
          >
            {challenge.title}
          </motion.h4>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.tech.map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.1 + i * 0.05 }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-xs font-medium text-slate-300 group-hover:border-slate-500/50 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-slate-700/0 via-slate-600/30 to-slate-700/0 mb-4" />

          {/* Bottom section - metrics and CTA */}
          <div className="flex items-center justify-between gap-4">
            {/* Left - deadline and difficulty */}
            <div className="flex items-center gap-4 flex-1">
              {/* Deadline */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/20 border border-slate-600/30 text-xs text-slate-300"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{challenge.deadline}</span>
              </motion.div>

              {/* Difficulty badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r ${
                  difficultyColors[challenge.difficulty]
                } text-white shadow-lg`}
              >
                {challenge.difficulty}
              </motion.div>
            </div>

            {/* Right - reward amount */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex-shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 text-sm">₹{challenge.reward.toLocaleString()}</span>
            </motion.div>
          </div>

          {/* Bottom row - applicants and apply button */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-700/30">
            {/* Applicants count */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-slate-600/30 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-300">👥</span>
              </div>
              <span className="font-medium">{challenge.applicants} applied</span>
            </motion.div>

            {/* Apply button */}
            <motion.button
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 group/btn"
            >
              <span>Apply Now</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
