import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const Editor = lazy(() =>
  import('@monaco-editor/react').then((m) => ({ default: m.Editor }))
);

/**
 * CodeEditor — Monaco-based code editor wrapper.
 *
 * Lazy-loaded so the ~3MB Monaco bundle is only fetched when a candidate
 * actually starts a coding interview. For behavioral/technical interviews
 * the chunk never loads.
 *
 * Props:
 *   language    - 'javascript' | 'python' | 'java' | 'cpp' | 'go'
 *   value       - string (controlled)
 *   onChange    - (value) => void
 *   height     - CSS height (default '420px')
 */
const LANG_TO_MONACO = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go'
};

export default function CodeEditor({
  language = 'javascript',
  value = '',
  onChange,
  height = '420px'
}) {
  const monacoLang = LANG_TO_MONACO[language] || 'javascript';

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[#1e1e1e]">
      <Suspense
        fallback={
          <div
            className="flex items-center justify-center gap-2 text-muted-foreground bg-[#1e1e1e]"
            style={{ height }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading editor…</span>
          </div>
        }
      >
        <Editor
          height={height}
          language={monacoLang}
          value={value}
          onChange={(v) => onChange?.(v ?? '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            renderLineHighlight: 'gutter',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 }
          }}
          loading={
            <div
              className="flex items-center justify-center gap-2 text-muted-foreground"
              style={{ height }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading editor…</span>
            </div>
          }
        />
      </Suspense>
    </div>
  );
}
