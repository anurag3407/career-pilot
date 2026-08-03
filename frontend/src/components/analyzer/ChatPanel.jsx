import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAnalyzerStore } from '../../stores/useAnalyzerStore';


const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const { 
    messages, 
    addMessage, 
    sessionId, 
    isInterviewMode, 
    isStreaming,
    setIsStreaming,
    setMessages
  } = useAnalyzerStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isStreaming) return;

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');
    setIsStreaming(true);

    addMessage({ role: 'assistant', content: '' });

    try {
      const user = window.Clerk?.user;
      const token = await window.Clerk?.session?.getToken();

      const response = await fetch(`${API_BASE}/analyzer/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMessage],
          isInterviewMode
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                streamContent += data.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'assistant', content: streamContent };
                  return newMsgs;
                });
              } else if (data.error) {
                console.error('Chat error:', data.error);
              }
            } catch (e) {
              // Ignore incomplete JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat stream error:', error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'assistant', content: 'Error: Failed to connect to AI engine.' };
        return newMsgs;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050816] relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center gap-2">
          {isInterviewMode ? (
            <ShieldAlert className="w-5 h-5 text-red-500" />
          ) : (
            <Bot className="w-5 h-5 text-blue-500" />
          )}
          <span className="font-semibold text-slate-200">
            {isInterviewMode ? 'Principal Interview Mode' : 'QA Engine Mode'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4">
            <Bot className="w-12 h-12 text-slate-700" />
            <p className="max-w-[250px]">
              {isInterviewMode 
                ? "I am ready to grill you on this architecture. Send a message to begin."
                : "Ask me anything about this repository's structure, patterns, or architecture."}
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-blue-600' : isInterviewMode ? 'bg-red-900/50 text-red-500' : 'bg-slate-800 text-blue-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#0b1120]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!sessionId || isStreaming}
            placeholder={!sessionId ? "Ingest a repository first..." : "Ask about the codebase..."}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-full py-3 pl-4 pr-12 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || !sessionId || isStreaming}
            className="absolute right-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
