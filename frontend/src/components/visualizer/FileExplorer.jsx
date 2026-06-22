import React, { useState, useMemo, useEffect } from 'react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import CodeViewer from './CodeViewer';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, Loader2, Search, FileJson } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const buildFileTree = (nodes) => {
  const root = { name: 'root', type: 'folder', children: {}, path: '' };

  nodes.forEach(node => {
    const parts = node.id.split('/');
    let current = root;
    let currentPath = '';

    parts.forEach((part, i) => {
      currentPath += (currentPath ? '/' : '') + part;
      const isFile = i === parts.length - 1;

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          children: isFile ? null : {},
          data: isFile ? node.data : null
        };
      }
      current = current.children[part];
    });
  });

  return root;
};

const FileTreeNode = ({ node, level = 0, onSelect, selectedPath, expandedFolders, toggleFolder }) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;

  if (node.name === 'root') {
    return (
      <div className="flex flex-col w-full">
        {Object.values(node.children)
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            return a.name.localeCompare(b.name);
          })
          .map(child => (
            <FileTreeNode 
              key={child.path} 
              node={child} 
              level={0} 
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div 
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors whitespace-nowrap",
          isSelected ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/5 text-slate-300"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => isFolder ? toggleFolder(node.path) : onSelect(node)}
      >
        {isFolder ? (
          isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" /> // spacer
        )}

        {isFolder ? (
          isExpanded ? <FolderOpen className="w-4 h-4 text-violet-400 shrink-0" /> : <Folder className="w-4 h-4 text-violet-400 shrink-0" />
        ) : (
          <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        
        <span className="text-sm truncate">{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div className="flex flex-col w-full">
          {Object.values(node.children)
            .sort((a, b) => {
              if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map(child => (
              <FileTreeNode 
                key={child.path} 
                node={child} 
                level={level + 1} 
                onSelect={onSelect}
                selectedPath={selectedPath}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  const { fileGraph, sessionId, setChatExpanded, addMessage, setChatMode } = useProjectVisualizerStore();
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileTree = useMemo(() => {
    if (!fileGraph || !fileGraph.nodes) return null;
    let nodes = fileGraph.nodes;
    if (searchQuery) {
      nodes = nodes.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return buildFileTree(nodes);
  }, [fileGraph, searchQuery]);

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) newExpanded.delete(path);
    else newExpanded.add(path);
    setExpandedFolders(newExpanded);
  };

  const handleSelect = async (node) => {
    setSelectedNode(node);
    setExplanation(null);
    try {
      setIsLoading(true);
      const content = await projectVisualizerApi.getFileContent(sessionId, node.path);
      setFileContent(content);
    } catch (e) {
      toast.error('Failed to load file content');
      setFileContent('// Error loading file content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!selectedNode) return;
    try {
      setIsExplaining(true);
      const result = await projectVisualizerApi.explainFile(sessionId, selectedNode.path);
      setExplanation(result);
    } catch (e) {
      toast.error('Failed to generate explanation');
    } finally {
      setIsExplaining(false);
    }
  };

  const startFileChat = () => {
    if (!selectedNode) return;
    setChatExpanded(true);
    setChatMode('qa');
    addMessage({ 
      role: 'user', 
      content: `[Context: I am looking at file '${selectedNode.path}']\nCan you explain this file in more detail?` 
    });
  };

  if (!fileTree) return null;

  return (
    <div className="flex h-full border border-white/10 rounded-2xl overflow-hidden bg-black/40">
      {/* Left Sidebar - File Tree */}
      <div className="w-80 shrink-0 border-r border-white/10 flex flex-col bg-[#0a0f1c]">
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar p-2">
          <FileTreeNode 
            node={fileTree} 
            onSelect={handleSelect} 
            selectedPath={selectedNode?.path}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        </div>
      </div>

      {/* Right Area - Code & Explanation */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {selectedNode ? (
          <>
            <div className={cn("flex-1 h-full p-4 flex flex-col", explanation ? "md:w-2/3 border-r border-white/10" : "w-full")}>
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : (
                <CodeViewer 
                  code={fileContent} 
                  language={selectedNode.data?.language} 
                  fileName={selectedNode.path}
                  onExplain={handleExplain}
                />
              )}
            </div>
            
            {explanation && (
              <div className="md:w-1/3 w-full h-full bg-[#0a0f1c] overflow-y-auto custom-scrollbar border-t md:border-t-0 border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0f1c]/95 backdrop-blur z-10">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-violet-400" />
                    AI Explanation
                  </h3>
                  <button 
                    onClick={() => setExplanation(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {isExplaining ? (
                     <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                       <Loader2 className="w-8 h-8 animate-spin text-violet-400 mb-4" />
                       <p>Analyzing file structure...</p>
                     </div>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Purpose</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{explanation.purpose}</p>
                      </div>
                      
                      {explanation.keyFunctions && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Functions</h4>
                          <ul className="space-y-2">
                            {Array.isArray(explanation.keyFunctions) 
                              ? explanation.keyFunctions.map((fn, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-1.5 shrink-0" />
                                    {fn}
                                  </li>
                                ))
                              : <p className="text-sm text-slate-300">{explanation.keyFunctions}</p>
                            }
                          </ul>
                        </div>
                      )}

                      {explanation.dependencies && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Dependencies</h4>
                          <p className="text-sm text-slate-300">{explanation.dependencies}</p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-white/10">
                        <button 
                          onClick={startFileChat}
                          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                        >
                          Chat about this file
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileCode className="w-16 h-16 mb-4 opacity-50" />
            <p>Select a file to view its code and AI explanation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
