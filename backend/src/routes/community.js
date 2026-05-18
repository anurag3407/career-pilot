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
} from '../controllers/communityFirebaseController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

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

// ============ SEARCH ROUTES ============
router.get('/search', searchCommunity);

// ============ UTILITY ROUTES ============
router.post('/fix-likes', fixPostLikeCounts);

export default router;
