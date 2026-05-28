import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  // STATE 
  notifications: [], // Array of notification objects: { id, message, type, isRead, timestamp }

  // GETTERS (DERIVED STATE)
  // Automatically calculates unread count for badges
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  //  ACTIONS 
  
  /**
   * Adds a new notification to the global state.
   * @param {Object} notification - The notification details.
   * @param {string} notification.message - The text/body of the notification.
   * @param {'success' | 'error' | 'info' | 'warning'} [notification.type='info'] - Type of alert for toast styling.
   */
  addNotification: (notification) => {
    const newNotification = {
      id: notification.id || crypto.randomUUID?.() || Date.now().toString(),
      message: notification.message,
      type: notification.type || 'info',
      isRead: false,
      timestamp: new Date(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Optional: Return the created notification so your Toast integration component
    // can immediately trigger a toast popup if needed.
    return newNotification;
  },

  /**
   * Dismisses (removes) a specific notification by its ID.
   * @param {string} id - The ID of the notification to remove.
   */
  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  /**
   * Marks a specific notification as read (useful for the dropdown list without deleting it).
   * @param {string} id - The ID of the notification to mark as read.
   */
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  /**
   * Marks all active notifications as read to clear out badges.
   */
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  /**
   * Clears all notifications completely from the store.
   */
  clearAll: () => {
    set({ notifications: [] });
  },
}));