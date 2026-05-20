import { Server } from 'socket.io';
import { socketAuthMiddleware } from '../middleware/socketAuth.js';
import { setupSocketHandlers } from '../services/socketServiceFirebase.js';
import { presenceService } from '../services/presenceService.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(socketAuthMiddleware);

  // Connection handler
  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.user.uid})`);

    // Track user presence
    try {
      await presenceService.setOnline(socket.user.uid, socket.user);
    } catch (error) {
      console.error(`Presence setOnline failed for ${socket.user.uid}:`, error);
    }
    
    // Join user's personal room for DMs
    socket.join(`user:${socket.user.uid}`);

    // Join global presence room (for general presence updates)
    socket.join('global');

    // Broadcast user online status only to global room
    io.to('global').emit('user_online', {
      uid: socket.user.uid,
      name: socket.user.name,
      timestamp: new Date()
    });

    // Setup all socket event handlers
    setupSocketHandlers(io, socket);

    // Handle channel presence subscription
    socket.on('join_channel', async (channelId) => {
      if (channelId) {
        socket.join(`channel:${channelId}`);
        await presenceService.joinRoom(socket.user.uid, `channel:${channelId}`);
        console.log(`${socket.user.name} joined channel presence: ${channelId}`);
        
        // Notify channel members
        io.to(`channel:${channelId}`).emit('user_joined_channel', {
          uid: socket.user.uid,
          name: socket.user.name,
          channelId,
          timestamp: new Date()
        });
      }
    });

    socket.on('leave_channel', async (channelId) => {
      if (channelId) {
        socket.leave(`channel:${channelId}`);
        await presenceService.leaveRoom(socket.user.uid, `channel:${channelId}`);
        console.log(`${socket.user.name} left channel presence: ${channelId}`);
        
        // Notify channel members
        io.to(`channel:${channelId}`).emit('user_left_channel', {
          uid: socket.user.uid,
          name: socket.user.name,
          channelId,
          timestamp: new Date()
        });
      }
    });

    // Handle friends presence subscription
    socket.on('subscribe_friends', async (userId) => {
      if (userId) {
        socket.join(`friends:${userId}`);
        await presenceService.joinRoom(socket.user.uid, `friends:${userId}`);
        console.log(`${socket.user.name} subscribed to friends presence: ${userId}`);
      }
    });

    socket.on('unsubscribe_friends', async (userId) => {
      if (userId) {
        socket.leave(`friends:${userId}`);
        await presenceService.leaveRoom(socket.user.uid, `friends:${userId}`);
        console.log(`${socket.user.name} unsubscribed from friends presence: ${userId}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async (reason) => {
      console.log(`❌ User disconnected: ${socket.user.name} - ${reason}`);
      
      // Get user's rooms before going offline
      const rooms = await presenceService.getUserRooms(socket.user.uid);
      
      await presenceService.setOffline(socket.user.uid);
      
      // Broadcast to global room
      io.to('global').emit('user_offline', {
        uid: socket.user.uid,
        name: socket.user.name,
        timestamp: new Date()
      });

      // Notify channel rooms about user leaving
      for (const room of rooms) {
        if (room.startsWith('channel:')) {
          io.to(room).emit('user_left_channel', {
            uid: socket.user.uid,
            name: socket.user.name,
            channelId: room.replace('channel:', ''),
            timestamp: new Date()
          });
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.user.name}:`, error);
    });
  });

  console.log('🔌 Socket.IO initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export default { initializeSocket, getIO };
