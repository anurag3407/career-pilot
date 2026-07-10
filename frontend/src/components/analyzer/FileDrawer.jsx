import { X, Terminal } from 'lucide-react';
import { useAnalyzerStore } from '../../stores/useAnalyzerStore';

export default function FileDrawer() {
  const { selectedFile, fileContent, setSelectedFile } = useAnalyzerStore();

  if (!selectedFile) return null;

  return (
    <div className="h-full flex flex-col bg-[#0b1120] border-b border-white/10 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-mono">
          <Terminal className="w-4 h-4" />
          {selectedFile.relativePath}
        </div>
        <button type="button" 
          onClick={() => setSelectedFile(null)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-slate-300">
        {!fileContent ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <span className="animate-pulse">Loading stream...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words">
            <code>
              {fileContent.split('\n').map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="select-none text-slate-600 w-8 text-right shrink-0">{i + 1}</span>
                  <span className="break-all">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
