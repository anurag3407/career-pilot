import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Clock, FileEdit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommitTimeline = ({ commits }) => {
  if (!commits || commits.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-cyan-400" /> Recent Activity
      </h3>
      
      <div className="relative max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
        {/* Timeline Line */}
        <div className="absolute top-0 bottom-0 left-[27px] w-px bg-white/10" />
        
        <div className="flex flex-col gap-6">
          {commits.map((commit, i) => (
            <motion.div 
              key={commit.sha}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative pl-14 group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[24px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 border-4 border-[#0f172a] box-content group-hover:scale-150 transition-transform" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium mb-1 line-clamp-2 leading-relaxed">
                    {commit.message}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {commit.author.avatar ? (
                        <img src={commit.author.avatar} alt="" className="w-4 h-4 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-700" />
                      )}
                      <span className="font-medium text-slate-300">{commit.author.login}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 text-xs font-mono text-slate-500 bg-black/30 px-2 py-1 rounded">
                  {commit.sha.substring(0, 7)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommitTimeline;
