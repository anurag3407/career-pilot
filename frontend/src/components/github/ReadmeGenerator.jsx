import { useState, useCallback, useRef } from "react";

const SAMPLE_PROMPT_PLACEHOLDER = `Describe your project...
e.g. "A React dashboard for tracking crypto portfolios with live price updates, charts, and portfolio analytics."`;

const DEFAULT_MARKDOWN = `# 🚀 Your Project Name

> A compelling one-liner about what this project does.

## Overview

AI-generated README will appear here after you describe your project and click **Generate**.

## Features

- ✨ Feature one
- ⚡ Feature two
- 🔒 Feature three

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Contributing

Pull requests are welcome!

## License

MIT
`;

function renderMarkdown(md) {
  let html = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><code class="lang-${lang}">${code.trim()}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>)|$)/g, '<ul>$1</ul>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr/>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    // Single newlines
    .replace(/\n/g, '<br/>');

  return `<p>${html}</p>`;
}

export default function ReadmeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("split"); // split | editor | preview
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const generate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a comprehensive, professional README.md for the following project. Use proper Markdown formatting with headers, code blocks, badges where appropriate, and well-structured sections (Overview, Features, Installation, Usage, Contributing, License). Make it engaging and developer-friendly.

Project description: ${prompt}

Return ONLY the raw markdown content, no explanations.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (text) setMarkdown(text);
      else setError("No content returned. Please try again.");
    } catch (e) {
      setError("Generation failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const copyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdown]);

  const downloadReadme = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0f12",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0f12; }
        ::-webkit-scrollbar-thumb { background: #2a2f3a; border-radius: 3px; }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #7dd3fc 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .prompt-box {
          width: 100%;
          background: #131720;
          border: 1px solid #1e2535;
          border-radius: 10px;
          color: #cbd5e1;
          font-family: inherit;
          font-size: 0.85rem;
          padding: 14px 16px;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.6;
        }
        .prompt-box:focus { border-color: #7dd3fc44; }
        .prompt-box::placeholder { color: #3a4255; }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-primary {
          background: linear-gradient(135deg, #7dd3fc, #a78bfa);
          color: #0d0f12;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-ghost {
          background: #131720;
          color: #94a3b8;
          border: 1px solid #1e2535;
        }
        .btn-ghost:hover { background: #1a2030; color: #e2e8f0; border-color: #2a3448; }
        .btn-success {
          background: #131720;
          color: #4ade80;
          border: 1px solid #1e2535;
        }

        .tab-bar {
          display: flex;
          gap: 2px;
          background: #0a0c0f;
          padding: 4px;
          border-radius: 8px;
          border: 1px solid #1e2535;
        }
        .tab {
          padding: 6px 14px;
          border-radius: 5px;
          font-family: inherit;
          font-size: 0.75rem;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #475569;
          transition: all 0.15s;
        }
        .tab.active {
          background: #131720;
          color: #e2e8f0;
        }

        .editor-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #0d0f12;
          border: 1px solid #1a2030;
          border-radius: 10px;
          overflow: hidden;
          min-height: 0;
        }
        .pane-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #0a0c10;
          border-bottom: 1px solid #1a2030;
          font-size: 0.7rem;
          color: #475569;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; }

        .md-editor {
          flex: 1;
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #94a3b8;
          font-family: inherit;
          font-size: 0.82rem;
          line-height: 1.75;
          padding: 18px;
          resize: none;
          min-height: 0;
        }

        .preview-pane {
          flex: 1;
          padding: 20px 24px;
          overflow-y: auto;
          line-height: 1.7;
        }
        .preview-pane h1 {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #1e2535;
        }
        .preview-pane h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #cbd5e1;
          margin: 22px 0 10px;
        }
        .preview-pane h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #94a3b8;
          margin: 16px 0 8px;
        }
        .preview-pane p { color: #94a3b8; margin-bottom: 10px; font-size: 0.875rem; }
        .preview-pane ul { padding-left: 20px; margin-bottom: 12px; }
        .preview-pane li { color: #94a3b8; font-size: 0.875rem; margin-bottom: 4px; }
        .preview-pane blockquote {
          border-left: 3px solid #7dd3fc55;
          padding: 8px 16px;
          background: #0a1628;
          border-radius: 0 6px 6px 0;
          color: #7dd3fc;
          font-size: 0.875rem;
          margin: 12px 0;
        }
        .preview-pane a { color: #7dd3fc; text-decoration: none; }
        .preview-pane a:hover { text-decoration: underline; }
        .preview-pane hr { border: none; border-top: 1px solid #1e2535; margin: 20px 0; }
        .preview-pane strong { color: #e2e8f0; }
        .preview-pane em { color: #a78bfa; }
        .code-block {
          background: #0a0c10;
          border: 1px solid #1e2535;
          border-radius: 8px;
          padding: 14px 16px;
          overflow-x: auto;
          font-size: 0.8rem;
          color: #7dd3fc;
          margin: 12px 0;
          line-height: 1.6;
        }
        .inline-code {
          background: #131720;
          border: 1px solid #1e2535;
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 0.82em;
          color: #a78bfa;
        }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(13,15,18,0.3);
          border-top-color: #0d0f12;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-bar {
          background: #1a0a0a;
          border: 1px solid #7f1d1d;
          border-radius: 8px;
          padding: 10px 14px;
          color: #fca5a5;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .split-view { flex-direction: column !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
        borderBottom: "1px solid #1a2030",
        background: "#0a0c10",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #7dd3fc22, #a78bfa22)",
            border: "1px solid #2a3448",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
          }}>📄</div>
          <span className="header-title">README Generator</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={copyMarkdown}>
            {copied ? (
              <><span>✓</span> Copied!</>
            ) : (
              <><span>⎘</span> Copy Markdown</>
            )}
          </button>
          <button type="button" className="btn btn-ghost" onClick={downloadReadme}>
            <span>↓</span> Download .md
          </button>
        </div>
      </div>

      {/* Prompt bar */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #1a2030",
        background: "#0a0c10",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            className="prompt-box"
            rows={2}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
            }}
            placeholder={SAMPLE_PROMPT_PLACEHOLDER}
          />
          <button type="button"
            className="btn btn-primary"
            onClick={generate}
            disabled={loading || !prompt.trim()}
            style={{ flexShrink: 0, height: 62 }}
          >
            {loading ? (
              <><div className="spinner" /> Generating…</>
            ) : (
              <>✦ Generate</>
            )}
          </button>
        </div>
        {error && <div className="error-bar" style={{ marginTop: 10 }}>⚠ {error}</div>}
        <div style={{ marginTop: 8, fontSize: "0.7rem", color: "#334155" }}>
          Tip: Press Ctrl+Enter to generate · Edit the markdown directly in the editor
        </div>
      </div>

      {/* Tab bar + action row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        borderBottom: "1px solid #1a2030",
        flexShrink: 0,
      }}>
        <div className="tab-bar">
          {["split", "editor", "preview"].map(t => (
            <button type="button" key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "split" ? "⊟ Split" : t === "editor" ? "✎ Editor" : "👁 Preview"}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "0.7rem", color: "#334155" }}>
          {markdown.split("\n").length} lines · {markdown.length} chars
        </div>
      </div>

      {/* Main split view */}
      <div
        className="split-view"
        style={{
          flex: 1,
          display: "flex",
          gap: 1,
          padding: "16px 24px",
          overflow: "hidden",
          minHeight: 0,
          background: "#0d0f12",
        }}
      >
        {/* Editor */}
        {(activeTab === "split" || activeTab === "editor") && (
          <div className="editor-pane" style={{ flex: 1 }}>
            <div className="pane-header">
              <div className="dot" style={{ background: "#ef4444" }} />
              <div className="dot" style={{ background: "#f59e0b" }} />
              <div className="dot" style={{ background: "#22c55e" }} />
              <span style={{ marginLeft: 6 }}>README.md — Markdown Editor</span>
            </div>
            <textarea
              ref={textareaRef}
              className="md-editor"
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              spellCheck={false}
            />
          </div>
        )}

        {/* Divider */}
        {activeTab === "split" && (
          <div style={{ width: 1, background: "#1a2030", flexShrink: 0 }} />
        )}

        {/* Preview */}
        {(activeTab === "split" || activeTab === "preview") && (
          <div className="editor-pane" style={{ flex: 1 }}>
            <div className="pane-header">
              <span style={{ fontSize: "0.85rem" }}>🌐</span>
              <span>Preview</span>
            </div>
            <div
              className="preview-pane"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}