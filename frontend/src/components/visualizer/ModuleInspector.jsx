import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, FileCode, Search, BrainCircuit, ArrowRight } from 'lucide-react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { cn } from '../../lib/utils';
import EnhancedFileViewer from './EnhancedFileViewer';

const ModuleInspector = () => {
  const { 
    selectedModule, 
    selectedFile,
    inspectorOpen, 
    setInspectorOpen,
    setSelectedFile,
    setChatExpanded,
    setChatMode
  } = useProjectVisualizerStore();

  const handleAskAI = () => {
    setChatMode('onboarding');
    setChatExpanded(true);
    // Note: Actually asking about the module will be handled by context injection in chat
  };

  const renderModuleDetails = () => {
    if (!selectedModule) return null;
    const { name, type, fileCount, loc, path, dependencies, files } = selectedModule;
    
    return (
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{name}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">{type}</span>
              <span className="text-slate-400">{fileCount} files</span>
              <span className="text-slate-400">{loc?.toLocaleString()} LOC</span>
            </div>
          </div>
          <button 
            onClick={() => setInspectorOpen(false)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-slate-400 mb-6 font-mono break-all bg-black/30 p-2 rounded border border-white/5">
          {path}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Dependencies */}
          {dependencies && dependencies.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Dependencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {dependencies.map(dep => (
                  <span key={dep} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Files List */}
          {files && files.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4" /> Files in Module
              </h4>
              <div className="flex flex-col gap-1.5">
                {files.map(file => {
                  // extract relative path or filename
                  const fileName = file.split('/').pop();
                  return (
                    <button
                      key={file}
                      onClick={() => setSelectedFile({ relativePath: file, fileName })}
                      className="text-left px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-sm text-slate-400 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20 transition-colors flex items-center gap-2 group"
                    >
                      <FileCode className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      <span className="truncate">{fileName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 mt-auto border-t border-white/10">
          <button
            onClick={handleAskAI}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/25 active:scale-95"
          >
            <BrainCircuit className="w-5 h-5" /> Ask AI about this module
          </button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {inspectorOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-[400px] max-w-full bg-[#0f172a]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-40 flex flex-col"
        >
          {selectedFile ? (
            <EnhancedFileViewer />
          ) : (
            renderModuleDetails()
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModuleInspector;
