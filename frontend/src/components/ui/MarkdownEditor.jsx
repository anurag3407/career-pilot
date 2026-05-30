import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3 } from 'lucide-react';

export default function MarkdownEditor({ value, onChange, placeholder = "Write your markdown here..." }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 h-[400px] w-full mt-2">
      {/* Editor Pane */}
      <div className="flex-1 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Edit3 className="w-3.5 h-3.5" />
          Editor
        </div>
        <textarea
          className="flex-1 w-full resize-none p-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm font-mono leading-relaxed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck="false"
        />
      </div>

      {/* Preview Pane */}
      <div className="flex-1 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-cyan-500 font-bold">Live Preview</span>
        </div>
        <div className="flex-1 w-full p-4 overflow-y-auto bg-zinc-950/20">
          {value ? (
            <div className="markdown-preview text-sm text-zinc-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5 text-white border-b border-white/10 pb-1" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4 text-white" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li className="text-zinc-300" {...props} />,
                  a: ({ node, ...props }) => <a className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-cyan-500/50 pl-4 py-1 italic text-zinc-400 bg-cyan-500/5 mb-4 rounded-r" {...props} />,
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-200 font-mono text-[0.85em]" {...props} />
                    ) : (
                      <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto mb-4 border border-white/10">
                        <code className="text-zinc-300 font-mono text-[0.85em]" {...props} />
                      </pre>
                    ),
                  hr: ({ node, ...props }) => <hr className="border-white/10 my-6" {...props} />,
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
              Preview will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
