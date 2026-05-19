import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers = {}) {
  const { onSearch, onNewResume, onCloseModal, onOpenShortcuts } = handlers;
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'SELECT' ||
        event.target.isContentEditable
      ) {
        return;
      }
      
      const isCtrlCmd = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      
      if (isCtrlCmd && key === 'k') {
        event.preventDefault();
        onSearch?.();
      }
      if (isCtrlCmd && key === 'n') {
        event.preventDefault();
        onNewResume?.();
      }
      if (event.key === 'Escape') {
        onCloseModal?.();
      }
      if (event.shiftKey && event.key === '?') {
        event.preventDefault();
        onOpenShortcuts?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onNewResume, onCloseModal, onOpenShortcuts]);
}
