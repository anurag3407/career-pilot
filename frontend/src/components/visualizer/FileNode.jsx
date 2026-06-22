import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileCode, FileText, FileJson, FileType, Code } from 'lucide-react';
import { cn } from '../../lib/utils';

const getLangColor = (lang) => {
  const map = {
    'JavaScript': '#f1e05a', 'JavaScript React': '#f1e05a',
    'TypeScript': '#3178c6', 'TypeScript React': '#3178c6',
    'Python': '#3572A5', 'Go': '#00ADD8', 'Rust': '#dea584',
    'Java': '#b07219', 'Ruby': '#701516', 'CSS': '#563d7c',
    'HTML': '#e34c26', 'PHP': '#4F5D95', 'C': '#555555',
    'C++': '#f34b7d', 'Swift': '#F05138', 'JSON': '#292929',
    'Markdown': '#083fa1'
  };
  return map[lang] || '#cccccc';
};

const getIcon = (lang, color) => {
  const props = { className: "w-4 h-4 shrink-0", style: { color } };
  if (lang.includes('React') || lang.includes('Script')) return <FileCode {...props} />;
  if (lang === 'JSON') return <FileJson {...props} />;
  if (lang === 'Markdown') return <FileText {...props} />;
  if (lang === 'TypeScript') return <FileType {...props} />;
  return <Code {...props} />;
};

const FileNode = ({ data, selected }) => {
  const { fileName, language, loc } = data;
  const color = getLangColor(language);

  return (
    <div
      className={cn(
        "relative w-[200px] h-[70px] rounded-lg bg-[#0f172a] border overflow-hidden flex transition-all duration-300",
        selected 
          ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] z-10 scale-[1.03]" 
          : "border-slate-800 hover:border-slate-700"
      )}
    >
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0"
      />
      
      {/* Left Color Bar */}
      <div 
        className="w-1.5 h-full shrink-0"
        style={{ backgroundColor: color }}
      />

      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {getIcon(language, color)}
          <span className="font-mono text-sm text-slate-200 truncate" title={fileName}>
            {fileName}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[10px]">
          <span 
            className="px-1.5 py-0.5 rounded text-slate-300 font-medium"
            style={{ backgroundColor: `${color}15` }}
          >
            {language}
          </span>
          <span className="text-slate-500">
            {loc} LOC
          </span>
        </div>
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0"
      />
    </div>
  );
};

export default FileNode;
