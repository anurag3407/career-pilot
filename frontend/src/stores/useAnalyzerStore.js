import { create } from 'zustand';

export const useAnalyzerStore = create((set) => ({
  repoUrl: '',
  sessionId: null,
  nodes: [],
  edges: [],
  selectedFile: null,
  fileContent: '',
  messages: [],
  isInterviewMode: false,
  isLoading: false,
  isStreaming: false,

  setRepoUrl: (url) => set({ repoUrl: url }),
  setSessionId: (id) => set({ sessionId: id }),
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setFileContent: (content) => set({ fileContent: content }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsInterviewMode: (mode) => set({ isInterviewMode: mode }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  
  reset: () => set({
    repoUrl: '',
    sessionId: null,
    nodes: [],
    edges: [],
    selectedFile: null,
    fileContent: '',
    messages: [],
    isInterviewMode: false,
    isLoading: false,
    isStreaming: false
  })
}));
