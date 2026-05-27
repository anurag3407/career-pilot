import { motion } from "framer-motion";
import { Sparkles, Eye, Mic, Brain, TrendingUp, Volume2, AlertCircle } from "lucide-react";

/**
 * Premium Interview Simulator Card Component
 * Modern SaaS-style UI with realistic video preview and analytics overlay
 */
export default function InterviewSimulatorCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl shadow-slate-900/50">
      {/* Animated background blur effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-3xl opacity-0"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content container */}
      <div className="relative p-6 sm:p-8">
        {/* Header with icon and title */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur-lg opacity-20" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Interview Simulator</h3>
              <p className="text-xs text-slate-400">Real-time feedback & analytics</p>
            </div>
          </motion.div>
        </div>

        {/* Main video preview section */}
        <div className="relative mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Video frame with glassmorphism */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-lg border border-slate-600/30 shadow-xl">
              {/* Aspect ratio container */}
              <div className="aspect-video bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Simulated video with animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-slate-900"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* User avatar placeholder - simulating video feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    {/* Avatar circle with glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-slate-600/50">
                      <span className="text-4xl">👤</span>
                    </div>
                  </motion.div>
                </div>

                {/* Live indicator badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/10 backdrop-blur-md rounded-full border border-red-500/30 shadow-lg"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                  <span className="text-xs font-semibold text-red-300">Live Interview</span>
                </motion.div>

                {/* Duration timer */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-slate-600/30 text-xs font-mono text-slate-300">
                  00:45
                </div>

                {/* Mic and camera status indicators - bottom left */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <motion.button
                    aria-label="Toggle microphone"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md border border-slate-600/30 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500/50 transition-all shadow-lg"
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    aria-label="Toggle camera"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-md border border-slate-600/30 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500/50 transition-all shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Decorative gradient border effect */}
            <motion.div
              className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur -z-10"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Analytics metrics grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Confidence Score */}
          <AnalyticsMetric
            icon={Brain}
            label="Confidence"
            value="87%"
            color="from-purple-500 to-pink-500"
            status="excellent"
            delay={0.2}
          />

          {/* Eye Contact */}
          <AnalyticsMetric
            icon={Eye}
            label="Eye Contact"
            value="92%"
            color="from-blue-500 to-cyan-500"
            status="excellent"
            delay={0.3}
          />

          {/* Speech Clarity */}
          <AnalyticsMetric
            icon={Volume2}
            label="Clarity"
            value="78%"
            color="from-emerald-500 to-teal-500"
            status="good"
            delay={0.4}
          />

          {/* Response Quality */}
          <AnalyticsMetric
            icon={TrendingUp}
            label="Quality"
            value="85%"
            color="from-orange-500 to-red-500"
            status="excellent"
            delay={0.5}
          />
        </div>

        {/* Footer with action hints */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-6 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-400"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Real-time AI analysis active</span>
          </div>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-500"
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Reusable metric card component for analytics display
 */
function AnalyticsMetric({
  icon: Icon,
  label,
  value,
  color = "from-blue-500 to-purple-500",
  status = "good",
  delay = 0,
}) {
  const statusColors = {
    excellent: "text-emerald-400",
    good: "text-amber-400",
    poor: "text-red-400",
  };

  const statusIndicatorColors = {
    excellent: "bg-emerald-500/30 border-emerald-500/50",
    good: "bg-amber-500/20 border-amber-500/30",
    poor: "bg-red-500/20 border-red-500/30",
  };

  // Safe defaults for object access
  const safeStatusColor = statusColors[status] || statusColors.good;
  const safeStatusIndicator = statusIndicatorColors[status] || statusIndicatorColors.good;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      {/* Card background with gradient */}
      <div className={`absolute -inset-px rounded-xl bg-gradient-to-r ${color} blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

      <div className="relative rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-md border border-slate-600/30 p-3 sm:p-4 transition-all duration-300 hover:border-slate-500/50">
        {/* Icon with background */}
        <div className={`absolute -right-2 -top-2 w-10 h-10 rounded-full bg-gradient-to-r ${color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />

        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-600/30 flex items-center justify-center border border-slate-600/50">
              <Icon className="w-4 h-4 text-slate-300" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${safeStatusIndicator}`}
            />
          </div>

          <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
          <p className={`text-2xl font-bold ${safeStatusColor}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
