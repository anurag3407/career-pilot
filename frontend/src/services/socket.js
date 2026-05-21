import { io } from 'socket.io-client';
import { auth } from '../config/firebase';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

let socket = null;

export const initializeSocket = async () => {
  if (socket?.connected) {
    return socket;
  }

  const user = auth.currentUser;
  if (!user) {
    console.warn('Cannot initialize socket: No authenticated user');
    return null;
  }

  const token = await user.getIdToken();

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
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
