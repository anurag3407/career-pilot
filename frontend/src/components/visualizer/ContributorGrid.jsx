import React from 'react';
import { motion } from 'framer-motion';
import { Github, Info } from 'lucide-react';

const ContributorGrid = ({ contributors }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center">
        <Github className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">No Contributor Data</h3>
        <p className="text-slate-400 max-w-md">
          We couldn't fetch contributor data from GitHub. This might be due to API rate limits or the repository being empty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contributors.map((user, i) => (
        <motion.div
          key={user.login}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="relative shrink-0">
            <img 
              src={user.avatar} 
              alt={user.login} 
              className="w-14 h-14 rounded-full border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors"
              loading="lazy"
            />
            {i < 3 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-bold text-white">
                {i + 1}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <h4 className="font-semibold text-white truncate" title={user.login}>
              {user.login}
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
              <span className="font-medium text-cyan-400">{user.contributions.toLocaleString()}</span>
              <span>commits</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContributorGrid;
