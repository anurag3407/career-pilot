import { io } from 'socket.io-client';
import { createSocketOptions } from './socketOptions.js';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = async () => {
  /**
   * Reuse the existing instance even when it is still connecting or currently
   * reconnecting. Checking only socket.connected would allow concurrent calls
   * to create multiple Socket.IO clients.
   */
  if (socket) {
    return socket;
  }

  const session = window.Clerk?.session;

  if (!session) {
    console.warn(
      'Cannot initialize socket: No authenticated user'
    );
    return null;
  }

  /**
   * Read auth.currentUser again for each handshake because the signed-in user
   * may change after the initial socket creation.
   */
  const getFreshToken = async () => {
    const session = window.Clerk?.session;

    if (!session) {
      throw new Error('No authenticated user');
    }

    return await session.getToken();
  };

  /**
   * Keep a stable instance reference for all listeners. The module-level
   * socket variable may later be cleared by disconnectSocket().
   */
  const socketInstance = io(
    SOCKET_URL,
    createSocketOptions(getFreshToken)
  );

  /**
   * Assign synchronously before authentication finishes. A second concurrent
   * initializeSocket() call will now reuse this instance.
   */
  socket = socketInstance;

  socketInstance.on('connect', () => {
    const engine = socketInstance.io.engine;
    const initialTransport = engine.transport.name;

    if (import.meta.env.DEV) {
      console.info(
        `🔌 Socket connected using ${initialTransport}`
      );
    }

    engine.once('upgrade', (transport) => {
      if (import.meta.env.DEV) {
        console.info(
          `⬆️ Socket transport upgraded from ` +
            `${initialTransport} to ${transport.name}`
        );
      }
    });
  });

  socketInstance.io.on(
    'reconnect_attempt',
    (attempt) => {
      if (import.meta.env.DEV) {
        console.info(
          `🔄 Socket reconnection attempt ${attempt}`
        );
      }
    }
  );

  socketInstance.io.on('reconnect', (attempt) => {
    if (import.meta.env.DEV) {
      console.info(
        `✅ Socket reconnected after ${attempt} ` +
          `attempt(s) using ` +
          `${socketInstance.io.engine.transport.name}`
      );
    }
  });

  socketInstance.io.on(
    'reconnect_error',
    (error) => {
      console.warn(
        'Socket reconnection error:',
        error.message
      );
    }
  );

  socketInstance.io.on(
    'reconnect_failed',
    () => {
      console.error(
        'Socket reconnection attempts exhausted'
      );
    }
  );

  socketInstance.on(
    'connect_error',
    (error) => {
      const msg = error?.message || '';
      if (msg.includes('xhr poll error') || msg.includes('404') || msg.includes('websocket error')) {
        // Real-time Socket.IO server is not available on serverless hosts (Vercel/Netlify). Disconnect gracefully.
        socketInstance.disconnect();
      } else {
        console.warn(
          'Socket connection note:',
          msg
        );
      }
    }
  );

  socketInstance.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socketInstance;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event helpers
export const socketEvents = {
  // Channel events
  joinChannel: (channelId) => {
    socket?.emit('join_channel', channelId);
  },

  leaveChannel: (channelId) => {
    socket?.emit('leave_channel', channelId);
  },

  sendMessage: (data) => {
    socket?.emit('send_message', data);
  },

  startTyping: (channelId) => {
    socket?.emit('typing_start', { channelId });
  },

  stopTyping: (channelId) => {
    socket?.emit('typing_stop', { channelId });
  },

  addReaction: (messageId, emoji) => {
    socket?.emit('add_reaction', { messageId, emoji });
  },

  removeReaction: (messageId, emoji) => {
    socket?.emit('remove_reaction', { messageId, emoji });
  },

  editMessage: (messageId, content) => {
    socket?.emit('edit_message', { messageId, content });
  },

  deleteMessage: (messageId) => {
    socket?.emit('delete_message', { messageId });
  },

  // Direct message events
  startConversation: (data) => {
    socket?.emit('start_conversation', data);
  },

  sendDirectMessage: (data) => {
    socket?.emit('send_direct_message', data);
  },

  markMessagesRead: (conversationId) => {
    socket?.emit('mark_messages_read', { conversationId });
  },

  dmStartTyping: (conversationId, receiverId) => {
    socket?.emit('dm_typing_start', { conversationId, receiverId });
  },

  dmStopTyping: (conversationId, receiverId) => {
    socket?.emit('dm_typing_stop', { conversationId, receiverId });
  },

  // Post events
  subscribePosts: () => {
    socket?.emit('subscribe_posts');
  },

  unsubscribePosts: () => {
    socket?.emit('unsubscribe_posts');
  },

  likePost: (postId) => {
    socket?.emit('like_post', { postId });
  },

  newComment: (data) => {
    socket?.emit('new_comment', data);
  },

  // Presence events
  getOnlineUsers: () => {
    socket?.emit('get_online_users');
  },

  updateStatus: (status) => {
    socket?.emit('update_status', { status });
  }
};

export default { initializeSocket, getSocket, disconnectSocket, socketEvents };
