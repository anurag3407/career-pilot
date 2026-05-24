import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { initializeSocket, disconnectSocket, getSocket, socketEvents } from '../services/socket';

const SocketContext = createContext(null);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;


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

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
     prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  }, []);

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

  // Subscribe to socket events
  const subscribe = useCallback((event, callback) => {
    const currentSocket = getSocket();
    if (currentSocket) {
      currentSocket.on(event, callback);
      return () => currentSocket.off(event, callback);
    }
    return () => {};
  }, [socket]);

  // Emit socket events
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
