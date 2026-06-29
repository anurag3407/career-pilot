import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { initializeSocket, disconnectSocket, getSocket, socketEvents } from '../services/socket';
import { SocketContext } from './SocketContext';

/**
 * Provider component that handles real-time web socket connections,
 * status updates of online users, and push notifications.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @returns {React.JSX.Element} The rendered Provider component.
 */
export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;


  /**
   * Pushes a new notification to the state stack.
   *
   * @param {string} type - The notification type.
   * @param {object} data - Metadata payload of the notification.
   */
  const pushNotification = useCallback((type, data) => {
    setNotifications((prev) =>
      [
        {
          id: `${type}-${Date.now()}-${Math.random()}`,
          type,
          data,
          read: false,
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 50)
    );
  }, []);

  /**
   * Marks a specific notification as read.
   *
   * @param {string} id - The notification ID.
   */
  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  /**
   * Marks all notifications as read.
   */
  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
     prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  /**
   * Dismisses a specific notification.
   *
   * @param {string} id - The notification ID.
   */
  const dismissNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  }, []);

  /**
   * Clears all notifications.
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Initialize socket when user logs in
  useEffect(() => {
    let mounted = true;
    let cleanupHandlers = () => {};

    const setupSocket = async () => {
      if (user) {
        const socketInstance = await initializeSocket();
        if (mounted && socketInstance) {
          setSocket(socketInstance);

          const handleConnect = () => setIsConnected(true);
          const handleDisconnect = () => setIsConnected(false);
          const handleOnlineUsers = ({ users }) => setOnlineUsers(users);
          const handleUserOnline = ({ uid, name }) => {
            setOnlineUsers(prev => {
              if (!prev.some(u => u.uid === uid)) {
                return [...prev, { uid, name, status: 'online' }];
              }
              return prev;
            });
          };
          const handleUserOffline = ({ uid }) => {
            setOnlineUsers(prev => prev.filter(u => u.uid !== uid));
          };
          const handleStatusChanged = ({ uid, status }) => {
            setOnlineUsers(prev =>
              prev.map(u => u.uid === uid ? { ...u, status } : u)
            );
          };


          const handleNotification = (data) =>
            pushNotification('notification', data);

          const handleJobAlertNewJobs = (data) =>
             pushNotification('job_alert_new_jobs', data);

          const handleJobAlertEmailSent = (data) =>
            pushNotification('job_alert_email_sent', data);

          const handleJobAlertEmailFailed = (data) =>
            pushNotification('job_alert_email_failed', data);

          socketInstance.on('connect', handleConnect);
          socketInstance.on('disconnect', handleDisconnect);
          socketInstance.on('online_users', handleOnlineUsers);
          socketInstance.on('user_online', handleUserOnline);
          socketInstance.on('user_offline', handleUserOffline);
          socketInstance.on('user_status_changed', handleStatusChanged);
          socketInstance.on('notification', handleNotification);
          socketInstance.on('job_alert_new_jobs', handleJobAlertNewJobs);
          socketInstance.on('job_alert_email_sent', handleJobAlertEmailSent);
          socketInstance.on('job_alert_email_failed', handleJobAlertEmailFailed);

          if (socketInstance.connected) handleConnect();

          cleanupHandlers = () => {
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('online_users', handleOnlineUsers);
            socketInstance.off('user_online', handleUserOnline);
            socketInstance.off('user_offline', handleUserOffline);
            socketInstance.off('user_status_changed', handleStatusChanged);
            socketInstance.off('notification', handleNotification);
            socketInstance.off('job_alert_new_jobs', handleJobAlertNewJobs);
            socketInstance.off('job_alert_email_sent', handleJobAlertEmailSent);
            socketInstance.off('job_alert_email_failed', handleJobAlertEmailFailed);
          };

          // Get initial online users
          socketEvents.getOnlineUsers();
        }
      } else {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
        setNotifications([]);
      }
    };

    setupSocket();

    return () => {
      mounted = false;
      cleanupHandlers();
      if (!user) {
        disconnectSocket();
      }
    };
  }, [user]);

  /**
   * Subscribes to a socket event with a callback, returning an unsubscribe cleanup function.
   *
   * @param {string} event - The socket event name.
   * @param {Function} callback - The event handler callback function.
   * @returns {Function} An unsubscribe function to remove the listener.
   */
  const subscribe = useCallback((event, callback) => {
    const currentSocket = getSocket();
    if (currentSocket) {
      currentSocket.on(event, callback);
      return () => currentSocket.off(event, callback);
    }
    return () => {};
  }, [socket]);

  /**
   * Emits a socket event with data to the server.
   *
   * @param {string} event - The socket event name.
   * @param {object} data - The message payload to emit.
   */
  const emit = useCallback((event, data) => {
    const currentSocket = getSocket();
    if (currentSocket?.connected) {
      currentSocket.emit(event, data);
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    dismissNotification,
    clearNotifications,
    subscribe,
    emit,
    ...socketEvents
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
