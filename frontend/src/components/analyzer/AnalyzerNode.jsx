import { Handle, Position } from '@xyflow/react';
import { FileCode, FileText, FileJson, Image, Box } from 'lucide-react';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-400" />;
    case 'md':
      return <FileText className="w-4 h-4 text-slate-400" />;
    default:
      return <Box className="w-4 h-4 text-slate-300" />;
  }
};

export default function AnalyzerNode({ data, selected }) {
  return (
    <div className={`
      relative rounded-lg border bg-[#0f172a] shadow-lg transition-all duration-200
      ${selected ? 'border-blue-500 shadow-blue-500/20 shadow-xl scale-105' : 'border-slate-700 hover:border-slate-500'}
      min-w-[150px]
    `}>
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {getFileIcon(data.fileName)}
          <span className="text-sm font-medium text-slate-200 font-mono">
            {data.fileName}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
          {data.relativePath}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  );
}
