import React, { useEffect, useState } from 'react';
import { FileCode, Box, Network, AlertTriangle, Scale, Star, GitFork, Info } from 'lucide-react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-${color}-500/10 blur-xl group-hover:bg-${color}-500/20 transition-all`} />
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white tracking-tight">
      <AnimatedCounter value={value} />
    </div>
  </motion.div>
);

const StatsOverview = () => {
  const { stats, risks, github } = useProjectVisualizerStore();

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Stats */}
      <div className="flex flex-wrap gap-4">
        <StatCard 
          icon={<FileCode className="w-5 h-5" />} 
          label="Total Files" 
          value={stats.totalFiles || 0} 
          color="cyan"
          delay={0.1}
        />
        <StatCard 
          icon={<Box className="w-5 h-5" />} 
          label="Modules" 
          value={stats.moduleCount || 0} 
          color="violet"
          delay={0.2}
        />
        <StatCard 
          icon={<Network className="w-5 h-5" />} 
          label="Dependencies" 
          value={stats.dependencyCount || 0} 
          color="pink"
          delay={0.3}
        />
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5" />} 
          label="Risks Found" 
          value={risks?.length || 0} 
          color="orange"
          delay={0.4}
        />
      </div>

      {/* GitHub Metadata */}
      {github && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-6 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300"
        >
          {github.stars !== undefined && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-white">{github.stars.toLocaleString()}</span> stars
            </div>
          )}
          {github.forks !== undefined && (
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-white">{github.forks.toLocaleString()}</span> forks
            </div>
          )}
          {github.openIssues !== undefined && (
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-green-400" />
              <span className="font-medium text-white">{github.openIssues.toLocaleString()}</span> issues
            </div>
          )}
          {github.license && (
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-400" />
              <span>License: <span className="text-white">{github.license}</span></span>
            </div>
          )}
          
          <div className="ml-auto text-slate-500 font-mono text-xs">
            {stats.totalLOC?.toLocaleString()} total LOC
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsOverview;
