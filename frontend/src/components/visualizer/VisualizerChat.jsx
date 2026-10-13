import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageSquare, Send, Bot, User, Sparkles, Wand2, Search, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';


const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const VisualizerChat = () => {
  const { 
    chatExpanded, setChatExpanded, 
    messages, setMessages, addMessage,
    chatMode, setChatMode,
    isStreaming, setIsStreaming,
    sessionId, selectedModule,
    isSocketReady
  } = useProjectVisualizerStore();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatExpanded) scrollToBottom();
  }, [messages, chatExpanded]);

  const handleSubmit = async (e, overrideText = null) => {
    if (e) e.preventDefault();
    const text = overrideText || input;
    if (!text.trim() || isStreaming || !sessionId) return;

    setInput('');
    if (!chatExpanded) setChatExpanded(true);

    let contextPrefix = '';
    if (selectedModule) {
      contextPrefix = `[Context: I am looking at module '${selectedModule.name}']\n`;
    }

    const newMessage = { role: 'user', content: contextPrefix + text };
    addMessage(newMessage);
    
    // Add empty assistant message that will be populated by stream
    addMessage({ role: 'assistant', content: '' });
    setIsStreaming(true);

    try {
      const token = await getToken();
      if (!token && !import.meta.env.DEV) throw new Error('Not authenticated');

      let endpoint = `${API_BASE}/project-visualizer/analysis/${sessionId}/chat`;
      let bodyData = { 
        messages: [...messages, newMessage].slice(-5), 
        chatMode 
      };

      // Detect if we're asking about a specific file
      const fileMatch = newMessage.content.match(/\[Context: I am looking at file '(.*?)'\]/);
      if (fileMatch) {
        endpoint = `${API_BASE}/project-visualizer/analysis/${sessionId}/file-chat`;
        bodyData.filePath = fileMatch[1];
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let assistantContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                assistantContent += `\n\n**Error:** ${data.error}`;
              } else if (data.text) {
                assistantContent += data.text;
                // Update the last message
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'assistant', content: assistantContent };
                  return newMsgs;
                });
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk', dataStr);
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI service.' };
        return newMsgs;
      });
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const quickActions = [
    "What does this repo do?",
    "Where should I start contributing?",
    "Explain the architecture",
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 md:left-[250px] transition-all duration-300 ease-in-out border-t border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-2xl flex flex-col",
      chatExpanded ? "h-[500px]" : "h-[80px]"
    )}>
      
      {/* Header / Mode Selector */}
      {chatExpanded && (
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex gap-2">
            {[
              { id: 'onboarding', icon: Bot, label: 'Onboarding Guide', color: 'text-violet-400' },
              { id: 'qa', icon: Search, label: 'Q&A Engine', color: 'text-cyan-400' },
              { id: 'interview', icon: ShieldAlert, label: 'Principal Interview', color: 'text-red-400' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setChatMode(mode.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  chatMode === mode.id 
                    ? `bg-white/10 ${mode.color}` 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setChatExpanded(false)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      {chatExpanded && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <Sparkles className="w-12 h-12 text-violet-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">How can I help?</h3>
              <p className="text-slate-400 max-w-sm">
                Ask me to explain modules, find bugs, or guide you through the codebase.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full pb-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex gap-4",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-violet-400" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3",
                    msg.role === 'user' 
                      ? "bg-cyan-600 text-white rounded-tr-sm" 
                      : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border-white/10 prose-cyan"
                  )}>
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.content.replace(/\[Context:.*?\]\n/, '')}</div>
                    ) : (
                      <>
                        {msg.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          <div className="flex items-center gap-1 h-6">
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#0a0f1c] mt-auto flex items-center gap-4 max-w-6xl mx-auto w-full h-[80px]">
        {!chatExpanded && (
          <button 
            onClick={() => setChatExpanded(true)}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors shrink-0"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
        
        {!chatExpanded && messages.length === 0 && (
          <div className="hidden md:flex items-center gap-2 mr-4 shrink-0 overflow-x-auto custom-scrollbar pb-2">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => handleSubmit(null, action)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/50 text-sm text-slate-300 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { if (!chatExpanded) setChatExpanded(true); }}
            placeholder={selectedModule ? `Ask about ${selectedModule.name}...` : "Ask AI about the architecture or codebase..."}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-white transition-colors"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisualizerChat;
