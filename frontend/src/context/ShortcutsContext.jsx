import { createContext, useState } from 'react';

export const ShortcutsContext = createContext();

export function ShortcutsProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openShortcuts = () => setIsOpen(true);
  const closeShortcuts = () => setIsOpen(false);

  return (
    <ShortcutsContext.Provider value={{ isOpen, openShortcuts, closeShortcuts }}>
      {children}
    </ShortcutsContext.Provider>
  );
}
