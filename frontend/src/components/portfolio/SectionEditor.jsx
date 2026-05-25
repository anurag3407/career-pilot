import { useState } from "react";
import { Sparkles, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

// ─── AI Diff View ───────────────────────────────────────────────────────────
function AIDiffView({ original, enhanced, onAccept, onReject }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="ai-diff-overlay">
      <div className="ai-diff-card">
        <div className="ai-diff-header">
          <div className="ai-diff-title">
            <Sparkles size={16} className="sparkle-icon" />
            <span>AI Enhancement Preview</span>
          </div>
          <button className="ai-diff-close" onClick={onReject} aria-label="Reject">
            <X size={16} />
          </button>
        </div>

        <div className="ai-diff-body">
          {/* Enhanced (primary) */}
          <div className="ai-diff-section ai-diff-enhanced">
            <div className="ai-diff-label ai-label-new">✨ Enhanced</div>
            <div className="ai-diff-content">{enhanced}</div>
          </div>

          {/* Original (collapsible) */}
          <div className="ai-diff-section ai-diff-original">
            <button
              className="ai-diff-toggle"
              onClick={() => setShowOriginal((v) => !v)}
            >
              {showOriginal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span className="ai-diff-label ai-label-old">Original</span>
            </button>
            {showOriginal && (
              <div className="ai-diff-content ai-diff-muted">{original}</div>
            )}
          </div>
        </div>

        <div className="ai-diff-footer">
          <button className="ai-btn ai-btn-reject" onClick={onReject}>
            <X size={14} />
            Reject
          </button>
          <button className="ai-btn ai-btn-accept" onClick={onAccept}>
            <Check size={14} />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sparkle Loading Button ──────────────────────────────────────────────────
function EnhanceButton({ loading, onClick }) {
  return (
    <button
      type="button"
      className={`enhance-ai-btn ${loading ? "enhance-ai-btn--loading" : ""}`}
      onClick={onClick}
      disabled={loading}
      aria-label="Enhance section with AI"
      title="Enhance with AI"
    >
      <Sparkles size={14} className={loading ? "sparkle-spin" : ""} />
      <span>{loading ? "Enhancing…" : "Enhance with AI"}</span>
    </button>
  );
}

// ─── Main SectionEditor ──────────────────────────────────────────────────────
export default function SectionEditor({ section, onUpdate }) {
  const [content, setContent] = useState(section?.content ?? "");
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState(null); // { original, enhanced }

  // ── Hit the AI enhance endpoint ─────────────────────────────────────────
  const handleEnhance = async () => {
    if (!content.trim()) {
      toast.error("Please add some content before enhancing.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/enhance-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: section?.type ?? "general",
          content,
        }),
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const data = await res.json();
      setDiff({ original: content, enhanced: data.enhanced });
    } catch (err) {
      console.error(err);
      toast.error("AI enhancement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Accept: swap content, close diff, toast ─────────────────────────────
  const handleAccept = () => {
    setContent(diff.enhanced);
    onUpdate?.({ ...section, content: diff.enhanced });
    setDiff(null);
    toast.success("✨ Enhancement applied!");
  };

  // ── Reject: discard enhanced version ────────────────────────────────────
  const handleReject = () => {
    setDiff(null);
    toast("Enhancement discarded.", { icon: "↩️" });
  };

  return (
    <div className="section-editor">
      {/* Editor form header */}
      <div className="section-editor__header">
        <h3 className="section-editor__title">
          {section?.label ?? "Section"}
        </h3>

        {/* 🔑 AI Button — top-right of the form, as required by issue */}
        <EnhanceButton loading={loading} onClick={handleEnhance} />
      </div>

      {/* Text area */}
      <textarea
        className="section-editor__textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Write your ${section?.label?.toLowerCase() ?? "section"} here…`}
        rows={6}
      />

      {/* Diff overlay — shown only after AI returns */}
      {diff && (
        <AIDiffView
          original={diff.original}
          enhanced={diff.enhanced}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {/* ── Styles (scoped via class names) ────────────────────────────── */}
      <style>{`
        /* ── Layout ── */
        .section-editor {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-family: 'Inter', sans-serif;
        }
        .section-editor__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .section-editor__title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0;
        }
        .section-editor__textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          transition: border-color 0.2s;
          color: #2d3748;
          background: #fff;
        }
        .section-editor__textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
        }

        /* ── Enhance button ── */
        .enhance-ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
        }
        .enhance-ai-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.45);
        }
        .enhance-ai-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .enhance-ai-btn--loading {
          opacity: 0.75;
          cursor: not-allowed;
        }

        /* spinning sparkle */
        @keyframes spin-sparkle {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .sparkle-spin {
          animation: spin-sparkle 1s linear infinite;
        }

        /* ── Diff overlay ── */
        .ai-diff-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 12px;
          padding: 1rem;
        }
        .ai-diff-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          width: 100%;
          max-width: 520px;
          overflow: hidden;
          animation: slide-up 0.22s ease;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-diff-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0f0f0;
          background: linear-gradient(90deg, #faf5ff, #ede9fe);
        }
        .ai-diff-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #5b21b6;
        }
        .sparkle-icon {
          color: #7c3aed;
        }
        .ai-diff-close {
          border: none;
          background: transparent;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          border-radius: 6px;
          padding: 2px;
          transition: color 0.15s, background 0.15s;
        }
        .ai-diff-close:hover {
          color: #ef4444;
          background: #fee2e2;
        }
        .ai-diff-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ai-diff-section {
          border-radius: 8px;
          overflow: hidden;
        }
        .ai-diff-enhanced {
          border: 1.5px solid #a78bfa;
          background: #faf5ff;
        }
        .ai-diff-original {
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
        }
        .ai-diff-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.35rem 0.75rem;
        }
        .ai-label-new {
          color: #6d28d9;
          background: #ede9fe;
        }
        .ai-label-old {
          color: #6b7280;
        }
        .ai-diff-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.35rem 0.75rem;
          text-align: left;
          color: #6b7280;
        }
        .ai-diff-toggle:hover {
          background: #f3f4f6;
        }
        .ai-diff-content {
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre-wrap;
          color: #374151;
        }
        .ai-diff-muted {
          color: #9ca3af;
        }
        .ai-diff-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }

        /* ── Accept / Reject buttons ── */
        .ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.83rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.15s;
        }
        .ai-btn:active { transform: scale(0.97); }
        .ai-btn-reject {
          background: #f3f4f6;
          color: #374151;
        }
        .ai-btn-reject:hover {
          background: #fee2e2;
          color: #dc2626;
        }
        .ai-btn-accept {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          box-shadow: 0 2px 8px rgba(124,58,237,0.35);
        }
        .ai-btn-accept:hover {
          box-shadow: 0 4px 12px rgba(124,58,237,0.5);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
