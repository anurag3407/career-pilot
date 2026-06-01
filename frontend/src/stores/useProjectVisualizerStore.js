import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProjectVisualizerStore = create(
  persist(
    (set, get) => ({
      // Session
      repoUrl: '',
      sessionId: null,
      status: 'idle', // 'idle' | 'analyzing' | 'complete' | 'error'
      error: null,
      
      // Analysis data
      stats: null,
      modules: [],
      fileGraph: { nodes: [], edges: [] },
      moduleGraph: { nodes: [], edges: [] },
      risks: [],
      suggestions: [],
      architectureSummary: '',
      
      // GitHub enrichment
      github: null,
      contributors: [],
      commits: [],
      
      // UI state
      viewMode: 'modules', // 'modules' | 'files' | 'dependencies'
      selectedModule: null,
      selectedFile: null,
      fileContent: '',
      searchQuery: '',
      activeTab: 'architecture', // 'architecture' | 'modules' | 'risks' | 'contributors'
      inspectorOpen: false,
      chatExpanded: false,
      
      // Chat
      messages: [],
      isStreaming: false,
      chatMode: 'onboarding', // 'onboarding' | 'qa' | 'interview'
      
      // Actions
      setRepoUrl: (url) => set({ repoUrl: url }),
      setSessionId: (id) => set({ sessionId: id }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),
      
      setAnalysisData: (data) => set({
        stats: data.stats,
        modules: data.modules,
        fileGraph: data.fileGraph,
        moduleGraph: data.moduleGraph,
        risks: data.risks,
        suggestions: data.suggestions,
        architectureSummary: data.architectureSummary,
        github: data.github,
        status: 'complete',
      }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedModule: (mod) => set({ selectedModule: mod, inspectorOpen: true }),
      setSelectedFile: (file) => set({ selectedFile: file, inspectorOpen: true }),
      setFileContent: (content) => set({ fileContent: content }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setInspectorOpen: (open) => set({ inspectorOpen: open }),
      setChatExpanded: (expanded) => set({ chatExpanded: expanded }),
      
      setContributors: (contributors) => set({ contributors }),
      setCommits: (commits) => set({ commits }),
      
      // Chat actions
      setChatMode: (mode) => set({ chatMode: mode }),
      setMessages: (msgs) => set({ messages: typeof msgs === 'function' ? msgs(get().messages) : msgs }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      
      // Reset
      reset: () => set({
        repoUrl: '', sessionId: null, status: 'idle', error: null,
        stats: null, modules: [], fileGraph: { nodes: [], edges: [] },
        moduleGraph: { nodes: [], edges: [] }, risks: [], suggestions: [],
        architectureSummary: '', github: null, contributors: [], commits: [],
        viewMode: 'modules', selectedModule: null, selectedFile: null,
        fileContent: '', searchQuery: '', activeTab: 'architecture',
        inspectorOpen: false, chatExpanded: false,
        messages: [], isStreaming: false, chatMode: 'onboarding',
      }),
    }),
    {
      name: 'project-visualizer-store',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
      partialize: (state) => ({
        repoUrl: state.repoUrl,
        sessionId: state.sessionId,
        status: state.status,
        stats: state.stats,
        modules: state.modules,
        risks: state.risks,
        suggestions: state.suggestions,
        architectureSummary: state.architectureSummary,
        github: state.github,
        activeTab: state.activeTab,
        messages: state.messages,
      }),
    }
  )
);
