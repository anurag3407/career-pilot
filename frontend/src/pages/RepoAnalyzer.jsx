import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Loader2, GitMerge } from 'lucide-react';
import GraphCanvas from '../components/analyzer/GraphCanvas';
import FileDrawer from '../components/analyzer/FileDrawer';
import ChatPanel from '../components/analyzer/ChatPanel';
import { useAnalyzerStore } from '../stores/useAnalyzerStore';
import { analyzerApi } from '../services/api';
import toast from 'react-hot-toast';

export default function RepoAnalyzer() {
  const [urlInput, setUrlInput] = useState('');
  const { 
    repoUrl, 
    setRepoUrl, 
    setSessionId, 
    setGraph, 
    isInterviewMode, 
    setIsInterviewMode,
    isLoading,
    setIsLoading,
    selectedFile
  } = useAnalyzerStore();

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!urlInput.includes('github.com')) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      setIsLoading(true);
      const res = await analyzerApi.ingest(urlInput.trim());
      
      setSessionId(res.sessionId);
      setGraph(res.nodes, res.edges);
      setRepoUrl(urlInput.trim());
      
      toast.success('Repository ingested successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to ingest repository. Make sure it is public.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#050816] overflow-hidden text-slate-200">
      
      {/* Top Bar */}
      <div className="h-16 border-b border-white/10 bg-[#0b1120] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <GitMerge className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-lg font-bold">Codebase Analyzer</h1>
        </div>

        <form onSubmit={handleIngest} className="flex-1 max-w-2xl mx-8 relative">
          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste GitHub Repository URL (e.g., https://github.com/expressjs/express)"
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-2 pl-10 pr-24 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !urlInput.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            Analyze
          </button>
        </form>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 font-medium">Mode:</span>
          <div className="flex items-center bg-[#0f172a] rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setIsInterviewMode(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${!isInterviewMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              QA Engine
            </button>
            <button
              onClick={() => setIsInterviewMode(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${isInterviewMode ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Interview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Graph Canvas */}
        <div className="flex-1 relative border-r border-white/10">
          {!repoUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <GitMerge className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-300">No Repository Loaded</p>
              <p className="text-sm mt-2 max-w-md text-center">Paste a GitHub URL above to analyze its dependency graph and chat with the architecture.</p>
            </div>
          ) : (
            <GraphCanvas />
          )}
        </div>

        {/* Right: Drawer + Chat */}
        <div className="w-[450px] shrink-0 flex flex-col bg-[#050816]">
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '50%', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="shrink-0 border-b border-white/10"
              >
                <FileDrawer />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>
        </div>

      </div>
    </div>
  );
}
