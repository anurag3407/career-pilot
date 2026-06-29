import { useEffect, useRef, useCallback, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Hook to access the socket context (connection state, events, notifications, etc.).
 * Must be used inside a SocketProvider.
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

/**
 * Custom hook to listen to socket events with automatic cleanup
 * @param {string} event - The event name to listen for
 * @param {function} callback - The callback function to execute
 */
export function useSocketEvent(event, callback) {
  const { subscribe } = useSocket();
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => callbackRef.current(...args);
    const unsubscribe = subscribe(event, handler);
    return unsubscribe;
  }, [event, subscribe]);
}

/**
 * Custom hook for typing indicator with debounce
 * @param {string} channelId - The channel ID
 * @param {number} debounceMs - Debounce time in milliseconds
 */
export function useTypingIndicator(channelId, debounceMs = 2000) {
  const { startTyping, stopTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleTyping = useCallback(() => {
    if (!channelId) return;

    startTyping(channelId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(channelId);
    }, debounceMs);
  }, [channelId, startTyping, stopTyping, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channelId) {
        stopTyping(channelId);
      }
    };
  }, [channelId, stopTyping]);

  return handleTyping;
}

export default { useSocketEvent, useTypingIndicator };
