import { createContext } from 'react';

/**
 * Context object that holds the state and operations for the Sidebar.
 * Shared between SidebarProvider and useSidebar hook.
 */
export const SidebarContext = createContext(undefined);
