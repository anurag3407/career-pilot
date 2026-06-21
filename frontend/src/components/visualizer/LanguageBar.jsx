import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getLangColor = (lang) => {
  const map = {
    'JavaScript': '#f1e05a', 'JavaScript React': '#f1e05a',
    'TypeScript': '#3178c6', 'TypeScript React': '#3178c6',
    'Python': '#3572A5', 'Go': '#00ADD8', 'Rust': '#dea584',
    'Java': '#b07219', 'Ruby': '#701516', 'CSS': '#563d7c',
    'HTML': '#e34c26', 'PHP': '#4F5D95', 'C': '#555555',
    'C++': '#f34b7d', 'Swift': '#F05138', 'JSON': '#292929',
    'Markdown': '#083fa1', 'Shell': '#89e051'
  };
  return map[lang] || '#8b5cf6'; // fallback to violet
};

const LanguageBar = ({ languages }) => {
  const languageData = useMemo(() => {
    if (!languages) return [];
    
    // languages might be a Map or a plain object depending on how it serializes
    let entries = [];
    if (languages instanceof Map) {
      entries = Array.from(languages.entries());
    } else if (typeof languages === 'object') {
      entries = Object.entries(languages);
    }
    
    const total = entries.reduce((sum, [_, loc]) => sum + loc, 0);
    
    if (total === 0) return [];
    
    return entries
      .map(([lang, loc]) => ({
        lang,
        loc,
        pct: (loc / total) * 100,
        color: getLangColor(lang)
      }))
      .sort((a, b) => b.loc - a.loc); // sort largest first
  }, [languages]);

  if (languageData.length === 0) return null;

  return (
    <div className="w-full">
      {/* The Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800 border border-slate-700/50 shadow-inner">
        {languageData.map((data, i) => (
          <motion.div
            key={data.lang}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(data.pct, 0.5)}%` }} // Ensure visible even if small
            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
            className="h-full relative group cursor-pointer"
            style={{ backgroundColor: data.color }}
          >
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              {data.lang} • {data.pct.toFixed(1)}% ({data.loc.toLocaleString()} LOC)
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {languageData.filter(d => d.pct >= 1).map((data) => (
          <div key={data.lang} className="flex items-center gap-1.5 text-xs text-slate-300">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium">{data.lang}</span>
            <span className="text-slate-500">{data.pct.toFixed(1)}%</span>
          </div>
        ))}
        {languageData.some(d => d.pct < 1) && (
          <div className="text-xs text-slate-500 flex items-center">
            + others
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageBar;
