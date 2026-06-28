import React, { useEffect, useState } from 'react';
import { X, FileCode, Loader2, Copy, Check } from 'lucide-react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';

const syntaxHighlight = (code) => {
  if (!code) return '';
  
  // Basic Regex highlighters
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    
  // Keywords (cyan)
  const keywords = /\b(const|let|var|function|class|import|export|return|if|else|for|while|async|await|try|catch|switch|case|default|break|continue|new|this|typeof|instanceof)\b/g;
  html = html.replace(keywords, '<span class="text-cyan-400">$1</span>');
  
  // Strings (green)
  const strings = /(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`)/g;
  html = html.replace(strings, '<span class="text-green-400">$1</span>');
  
  // Numbers (orange)
  const numbers = /\b(\d+)\b/g;
  html = html.replace(numbers, '<span class="text-orange-400">$1</span>');
  
  // Comments (muted)
  const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  html = html.replace(comments, '<span class="text-slate-500 italic">$1</span>');
  
  return html;
};

const EnhancedFileViewer = () => {
  const { selectedFile, sessionId, setInspectorOpen, setSelectedFile } = useProjectVisualizerStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedFile || !sessionId) return;
    
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const text = await projectVisualizerApi.getFileContent(sessionId, selectedFile.relativePath);
        setContent(text);
      } catch (err) {
        setError('Failed to load file content.');
        setContent('');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [selectedFile, sessionId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setSelectedFile(null); // Goes back to module inspector if module was selected
  };

  if (!selectedFile) return null;

  return (
    <div className="flex flex-col h-full bg-[#0a0f1c]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center gap-3 overflow-hidden">
          <button type="button" 
            onClick={handleBack}
            className="p-1 hover:bg-white/10 rounded mr-1 text-slate-400 hover:text-white"
            title="Back to Module"
          >
            <X className="w-5 h-5" />
          </button>
          <FileCode className="w-5 h-5 text-violet-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <h3 className="font-mono text-sm text-white truncate" title={selectedFile.fileName}>
              {selectedFile.fileName}
            </h3>
            <span className="text-xs text-slate-500 truncate" title={selectedFile.relativePath}>
              {selectedFile.relativePath}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button type="button"
            onClick={handleCopy}
            disabled={loading || !content}
            className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button type="button"
            onClick={() => setInspectorOpen(false)}
            className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[#050810] relative custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-400 font-medium text-sm flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>
        ) : (
          <div className="flex text-sm font-mono leading-relaxed min-w-max">
            {/* Line Numbers */}
            <div className="flex flex-col items-end px-4 py-4 select-none border-r border-white/5 bg-[#0a0f1c] text-slate-600">
              {content.split('\n').map((_, i) => (
                <span key={i} className="px-1">{i + 1}</span>
              ))}
            </div>
            {/* Code */}
            <div className="px-4 py-4 text-slate-300">
              <pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(content) }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFileViewer;
