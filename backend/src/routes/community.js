import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  // Channels
  getChannels,
  getChannel,
  createChannel,
  joinChannel,
  leaveChannel,
  getChannelMessages,
  // Posts
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  // Post scheduling
  getScheduledPosts,
  cancelScheduledPost,
  // Comments
  getComments,
  createComment,
  toggleLikeComment,
  // Direct Messages
  getConversations,
  getConversationMessages,
  // Presence
  getOnlineUsers,
  // Search
  searchCommunity,
  // Utilities
  fixPostLikeCounts
} from '../controllers/communityAppwriteController.js';

const router = express.Router();

// Parsed once at module load — ADMIN_UIDS is static for the process lifetime.
const ADMIN_UIDS = (process.env.ADMIN_UIDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (ADMIN_UIDS.length === 0) {
  console.warn(
    '⚠️  ADMIN_UIDS is not set — the /community/fix-likes endpoint will reject all requests. ' +
    'Set ADMIN_UIDS to a comma-separated list of Firebase UIDs in your .env file.'
  );
}

// All routes require authentication
router.use(verifyToken);

// Restricts a route to UIDs listed in ADMIN_UIDS (comma-separated env var).
// Must be placed after router.use(verifyToken) so req.user is already populated.
const requireAllowlistedUID = (req, res, next) => {
  if (!ADMIN_UIDS.includes(req.user?.uid)) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// ============ CHANNEL ROUTES ============
router.get('/channels', getChannels);
router.get('/channels/:channelId', getChannel);
router.post('/channels', createChannel);
router.post('/channels/:channelId/join', joinChannel);
router.post('/channels/:channelId/leave', leaveChannel);
router.get('/channels/:channelId/messages', getChannelMessages);

// ============ POST ROUTES ============
router.get('/posts', getPosts);
router.get('/posts/scheduled/mine', getScheduledPosts);
router.get('/posts/:postId', getPost);
router.post('/posts', createPost);
router.put('/posts/:postId', updatePost);
router.delete('/posts/:postId', deletePost);
router.post('/posts/:postId/like', toggleLikePost);
router.delete('/posts/:postId/schedule', cancelScheduledPost);

// ============ COMMENT ROUTES ============
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', createComment);
router.post('/comments/:commentId/like', toggleLikeComment);

// ============ DIRECT MESSAGE ROUTES ============
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getConversationMessages);

// ============ PRESENCE ROUTES ============
router.get('/online-users', getOnlineUsers);

// Room-based presence endpoints
router.post('/presence/channel/:channelId/subscribe', async (req, res, next) => {
  const { channelId } = req.params;
  try {
    const { getIO } = await import('../config/socket.js');
    const io = getIO();
    const socketId = req.headers['x-socket-id'];
    
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(`channel:${channelId}`);
        const { presenceService } = await import('../services/presenceService.js');
        await presenceService.joinRoom(req.user.uid, `channel:${channelId}`);
        return res.json({ success: true, message: `Joined channel ${channelId} presence` });
      }
    }
    return res.status(400).json({ success: false, error: 'Socket not connected' });
  } catch (error) {
    next(error);
  }
});

router.post('/presence/channel/:channelId/unsubscribe', async (req, res, next) => {
  const { channelId } = req.params;
  try {
    const { getIO } = await import('../config/socket.js');
    const io = getIO();
    const socketId = req.headers['x-socket-id'];
    
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(`channel:${channelId}`);
        const { presenceService } = await import('../services/presenceService.js');
        await presenceService.leaveRoom(req.user.uid, `channel:${channelId}`);
        return res.json({ success: true, message: `Left channel ${channelId} presence` });
      }
    }
    return res.status(400).json({ success: false, error: 'Socket not connected' });
  } catch (error) {
    next(error);
  }
});

router.get('/presence/channel/:channelId/members', async (req, res, next) => {
  const { channelId } = req.params;
  try {
    const { presenceService } = await import('../services/presenceService.js');
    const members = await presenceService.getRoomMembers(`channel:${channelId}`);
    return res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
});

// ============ SEARCH ROUTES ============
router.get('/search', searchCommunity);

// ============ UTILITY ROUTES ============
// requireAllowlistedUID enforces ADMIN_UIDS allowlist — prevents DoS via unbounded batch recalculation
router.post('/fix-likes', requireAllowlistedUID, fixPostLikeCounts);

export default router;
