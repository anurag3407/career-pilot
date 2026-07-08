import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { enhanceApi } from '../../../services/api';

/**
 * AIChatPanel — right-side chat in the AI Builder modal.
 *
 * v1 scope: send a freeform prompt → backend returns a structured patch
 * describing one or more field edits. We apply patches to portfolioData
 * and push them into the preview iframe via the existing
 * `UPDATE_PORTFOLIO_DATA` postMessage channel.
 *
 * Falls back to a local mock patch if the backend is unreachable so the
 * demo flow stays unblocked in development.
 */

const SUGGESTIONS = [
  'Make my bio sound more confident.',
  'Rewrite my bio to be one sentence shorter.',
  'Set the accent color to electric blue.',
  'Suggest 3 skills for a senior frontend developer.',
  'Polish my project descriptions to highlight impact.',
];

function makeMockPatch(prompt, currentData) {
  const lower = prompt.toLowerCase();
  const patch = {};
  if (lower.includes('bio')) {
    patch.personal = {
      ...(currentData?.personal || {}),
      bio: `${currentData?.personal?.bio || 'Engineer'} — rewritten by AI for confidence, clarity, and conversion.`,
    };
  } else if (lower.includes('color') || lower.includes('blue') || lower.includes('green')) {
    if (lower.includes('blue')) patch.themeAccent = '#3b82f6';
    else if (lower.includes('green')) patch.themeAccent = '#10b981';
    else patch.themeAccent = '#8b5cf6';
  } else if (lower.includes('skill')) {
    patch.skills = [
      { name: 'React / Next.js', rating: 96, type: 'Engine' },
      { name: 'TypeScript', rating: 94, type: 'Engine' },
      { name: 'System Design', rating: 88, type: 'Aerodynamics' },
      { name: 'Cloud & DevOps', rating: 86, type: 'Turbocharger' },
    ];
  } else if (lower.includes('project')) {
    patch.projects = (currentData?.projects || []).map((p) => ({
      ...p,
      description: `${p.description || ''} (impact-focused polish).`,
    }));
  } else {
    patch.personal = {
      ...(currentData?.personal || {}),
      bio: `${currentData?.personal?.bio || ''} [AI: applied to: ${prompt}]`.trim(),
    };
  }
  return patch;
}

export default function AIChatPanel({ portfolioData, onApplyPatch, onShowToast }) {
  const [messages, setMessages] = useState([
    {
      id: 'sys-1',
      role: 'assistant',
      content:
        "Hi! Tell me what to change in your portfolio — bio, accent color, skills, project copy. Or click any element on the left to edit it directly.",
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);
    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Thinking…',
    };
    setMessages((prev) => [...prev, assistantMsg]);

    let patch = null;
    let appliedSummary = '';

    try {
      const response = await enhanceApi.aiEditPortfolio?.({
        prompt: text,
        currentData: portfolioData,
      });
      patch = response?.patch || null;
      appliedSummary = response?.summary || 'Applied changes.';
    } catch (e) {
      // Fallback path — local mock so dev never blocks
      patch = makeMockPatch(text, portfolioData);
      appliedSummary = `Applied (offline mock): ${Object.keys(patch).join(', ')}`;
    }

    if (patch && Object.keys(patch).length > 0) {
      onApplyPatch?.(patch);
      onShowToast?.(appliedSummary);
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMsg.id
          ? {
              ...m,
              content:
                appliedSummary ||
                "I couldn't detect a clear change in that prompt. Try mentioning a section like 'bio', 'skills', or 'projects'.",
            }
          : m
      )
    );
    setBusy(false);
  }, [busy, input, onApplyPatch, onShowToast, portfolioData]);

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0d] border-l border-neutral-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
            AI Editor
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-600 uppercase">
          F1_Racing
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex',
                m.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
                  m.role === 'user'
                    ? 'bg-[#E10600] text-white rounded-tr-sm'
                    : 'bg-white/5 border border-white/10 text-neutral-200 rounded-tl-sm'
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-900/50 rounded-full px-2.5 py-1 hover:border-[#E10600]/50 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-neutral-800">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-2 focus-within:border-[#E10600]/60">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Tell the AI what to change…"
            className="flex-1 resize-none bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={busy || !input.trim()}
            className={cn(
              'inline-flex items-center justify-center h-7 w-7 rounded-md',
              'bg-[#E10600] text-white hover:bg-[#ff2a1f] transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            aria-label="Send"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span className="text-sm leading-none">↑</span>
            )}
          </button>
        </div>
        <div className="text-[10px] font-mono text-neutral-600 mt-1.5 text-center uppercase tracking-widest">
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}