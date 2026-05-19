import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard shortcuts
 * @param {Object} handlers - Object with callback functions
 */
export function useKeyboardShortcuts(handlers = {}) {
  const { onSearch, onNewResume, onCloseModal, onOpenShortcuts } = handlers;
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlCmd = isMac ? event.metaKey : event.ctrlKey;
      // Ctrl/Cmd + K: Open search
      if (isCtrlCmd && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
      }
      // Ctrl/Cmd + N: New resume
      if (isCtrlCmd && event.key === 'n') {
        event.preventDefault();
        onNewResume?.();
      }
      // Escape: Close modal
      if (event.key === 'Escape') {
        onCloseModal?.();
      }
      // Shift + ?: Open shortcuts help
      if (event.shiftKey && event.key === '?') {
        event.preventDefault();
        onOpenShortcuts?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onNewResume, onCloseModal, onOpenShortcuts]);
}
