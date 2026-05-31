import { createContext } from 'react';

/**
 * Context object that holds the state and operations for real-time web socket connections.
 * Shared between SocketProvider and useSocket hook.
 */
export const SocketContext = createContext(null);
