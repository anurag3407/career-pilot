import { useState } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import '../styles/ShortcutsModal.css';

export function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcuts({
    onOpenShortcuts: () => setIsOpen(true),
    onCloseModal: () => setIsOpen(false),
  });

  const shortcuts = [
    { keys: 'Ctrl + K', description: 'Global search' },
    { keys: 'Ctrl + N', description: 'New resume' },
    { keys: 'Escape', description: 'Close modals' },
    { keys: 'Shift + ?', description: 'Show this help' },
  ];

  // Expose openShortcuts method for external access
  if (!window.openShortcuts) {
    window.openShortcuts = () => setIsOpen(true);
  }

  return (
    <>
      {isOpen && (
        <div
          className="shortcuts-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div className="shortcuts-modal">
          <div className="shortcuts-header">
            <h2>Keyboard Shortcuts</h2>
            <button
              className="shortcuts-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="shortcuts-content">
            {shortcuts.map((shortcut, i) => (
              <div key={i} className="shortcut-row">
                <kbd className="shortcut-key">{shortcut.keys}</kbd>
                <span className="shortcut-desc">{shortcut.description}</span>
              </div>
            ))}
          </div>
          <div className="shortcuts-footer">
            Press <kbd>Escape</kbd> to close
          </div>
        </div>
      )}
    </>
  );
}

export default ShortcutsModal;
