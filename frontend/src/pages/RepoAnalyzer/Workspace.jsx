import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Loader2, GitMerge } from 'lucide-react';
import GraphCanvas from '../../components/analyzer/GraphCanvas';
import FileDrawer from '../../components/analyzer/FileDrawer';
import ChatPanel from '../../components/analyzer/ChatPanel';
import { useAnalyzerStore } from '../../stores/useAnalyzerStore';
import { analyzerApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function RepoAnalyzerWorkspace() {
  const navigate = useNavigate();
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

        <div className="flex-1 flex justify-center mx-8 relative">
           <span className="text-slate-400 font-mono text-sm">{repoUrl || 'No Repository Loaded'}</span>
        </div>

        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => navigate('/repo-analyzer/dashboard')}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer mr-2"
          >
            Back to Dashboard
          </button>
          <span className="text-sm text-slate-400 font-medium">Mode:</span>
          <div className="flex items-center bg-[#0f172a] rounded-lg p-1 border border-slate-700">
            <button type="button"
              onClick={() => setIsInterviewMode(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${!isInterviewMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              QA Engine
            </button>
            <button type="button"
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

