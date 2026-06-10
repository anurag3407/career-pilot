import { useState, useCallback, useContext, createContext } from "react";
import { X, XCircle } from "lucide-react";


// ─── Priority & style maps ────────────────────────────────────────────────────

const PRIORITY = { error: 0, warning: 1, success: 2, info: 3 };

const STYLES = {
  error:   { bg: "bg-red-50 border-red-400",       icon: "🔴", label: "Error"   },
  warning: { bg: "bg-yellow-50 border-yellow-400", icon: "🟡", label: "Warning" },
  success: { bg: "bg-green-50 border-green-400",   icon: "🟢", label: "Success" },
  info:    { bg: "bg-blue-50 border-blue-400",     icon: "🔵", label: "Info"    },
};

const POSITIONS = {
  "top-right":    "top-4 right-4",
  "top-left":     "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left":  "bottom-4 left-4",
};

// ─── Context (so any component can call addToast) ─────────────────────────────

// eslint-disable-next-line no-unused-vars
export const ToastContext = createContext(null);

// eslint-disable-next-line no-unused-vars
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastManager");
  return ctx;
}
// ─── Counter outside component so it survives re-renders ─────────────────────

let idCounter = 0;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToastManager({ position = "top-right", children }) {
  const [toasts, setToasts] = useState([]);

  // dismiss is defined BEFORE addToast so the setTimeout closure can see it
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) =>
        [...prev, { id, message, type, duration }].sort(
          (a, b) => PRIORITY[a.type] - PRIORITY[b.type]
        )
      );
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss] // dismiss is now a stable dep
  );

  const dismissAll = useCallback(() => setToasts([]), []);

  // Convenience helpers exposed via context
  const toast = {
    error:   (msg, dur) => addToast(msg, "error",   dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    success: (msg, dur) => addToast(msg, "success", dur),
    info:    (msg, dur) => addToast(msg, "info",    dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className={`fixed ${POSITIONS[position]} z-50 flex flex-col gap-2 w-80`}>
        {toasts.length > 1 && (
          <button
            onClick={dismissAll}
            className="self-end flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mb-1"
          >
            <XCircle size={14} /> Dismiss all
          </button>
        )}

        {toasts.map((t) => {
          const s = STYLES[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-2 p-3 rounded-lg border ${s.bg} shadow-sm text-sm`}
            >
              <span aria-hidden="true">{s.icon}</span>
              <span className="flex-1 text-gray-800">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label={`Dismiss ${s.label} notification`}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}