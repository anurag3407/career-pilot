import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';

/**
 * Hook to access the sidebar open/close state and animation flag.
 * Must be used inside a SidebarProvider.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
