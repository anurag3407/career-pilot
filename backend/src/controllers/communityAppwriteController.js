import { databases } from '../config/appwrite.js';
import { ID, Query } from 'node-appwrite';
import { presenceService } from '../services/presenceService.js';
import { getIO } from '../config/socket.js';
import { ApiError } from '../middleware/errorHandler.js';
import { schedulePostJob, cancelPostJob, isSchedulerAvailable } from '../services/postScheduler.js';

const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default_db';
const CHANNELS_COL = process.env.VITE_APPWRITE_CHANNELS_COLLECTION_ID || 'channels';
const MESSAGES_COL = process.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID || 'messages';
const POSTS_COL = process.env.VITE_APPWRITE_POSTS_COLLECTION_ID || 'posts';
const COMMENTS_COL = process.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID || 'comments';
const CONVERSATIONS_COL = process.env.VITE_APPWRITE_CONVERSATIONS_COLLECTION_ID || 'conversations';
const DIRECT_MESSAGES_COL = process.env.VITE_APPWRITE_DIRECT_MESSAGES_COLLECTION_ID || 'directMessages';

// Helper for dates
const getISODate = (val) => (val ? new Date(val).toISOString() : new Date().toISOString());

// ============ CHANNEL CONTROLLERS ============

export const getChannels = async (req, res, next) => {
  try {
    const { type = 'all', limit = 50 } = req.query;
    const limitNum = Math.min(parseInt(limit) || 50, 100);

    const queries = [Query.limit(limitNum), Query.orderDesc('isDefault'), Query.orderDesc('createdAt')];
    if (type === 'public' || type === 'private') {
      queries.push(Query.equal('type', type));
    }

    const response = await databases.listDocuments(DB_ID, CHANNELS_COL, queries);
    let channels = response.documents.map(doc => ({ id: doc.$id, ...doc }));

    if (type === 'private') {
      channels = channels.filter(ch => {
        let members = typeof ch.members === 'string' ? JSON.parse(ch.members) : ch.members;
        return members && members.some(m => m.uid === req.user.uid);
      });
    }

    res.json({
      success: true,
      channels,
      pagination: {
        limit: limitNum,
        nextCursor: null, // Simplified
        hasMore: channels.length === limitNum
      }
    });
  } catch (error) { next(error); }
};

export const getChannel = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, CHANNELS_COL, req.params.channelId);
    res.json({ success: true, channel: { id: doc.$id, ...doc } });
  } catch (error) {
    if (error.code === 404) next(new ApiError(404, 'Channel not found'));
    else next(error);
  }
};

export const createChannel = async (req, res, next) => {
  try {
    const { name, description, type = 'public', category = 'general', icon } = req.body;
    if (typeof name !== 'string' || !name.trim()) throw new ApiError(400, 'Channel name is required');
    const channelName = name.trim().toLowerCase().replace(/\s+/g, '-');

    const existing = await databases.listDocuments(DB_ID, CHANNELS_COL, [Query.equal('name', channelName)]);
    if (existing.total > 0) throw new ApiError(400, 'Channel with this name already exists');

    const members = [{
      uid: req.user.uid,
      name: req.user.name,
      email: req.user.email,
      role: 'admin',
      joinedAt: new Date().toISOString()
    }];

    const channelData = {
      name: channelName,
      description: description || '',
      type,
      category,
      icon: icon || '💬',
      createdBy: req.user.uid,
      createdByName: req.user.name,
      members: JSON.stringify(members),
      memberCount: 1,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const doc = await databases.createDocument(DB_ID, CHANNELS_COL, ID.unique(), channelData);
    const newChannel = { id: doc.$id, ...channelData };
    try { getIO().emit('new_channel', { channel: newChannel }); } catch (e) {}

    res.status(201).json({ success: true, channel: newChannel });
  } catch (error) { next(error); }
};

export const joinChannel = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, CHANNELS_COL, req.params.channelId);
    let members = typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members || [];
    
    if (members.some(m => m.uid === req.user.uid)) {
      return res.json({ success: true, message: 'Already a member', channel: { id: doc.$id, ...doc } });
    }

    const newMember = {
      uid: req.user.uid,
      name: req.user.name,
      email: req.user.email,
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    members.push(newMember);

    const updated = await databases.updateDocument(DB_ID, CHANNELS_COL, req.params.channelId, {
      members: JSON.stringify(members),
      memberCount: members.length,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, channel: { id: updated.$id, ...updated, members } });
  } catch (error) { next(error); }
};

export const leaveChannel = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, CHANNELS_COL, req.params.channelId);
    if (doc.isDefault) throw new ApiError(400, 'Cannot leave default channel');

    let members = typeof doc.members === 'string' ? JSON.parse(doc.members) : doc.members || [];
    const updatedMembers = members.filter(m => m.uid !== req.user.uid);

    if (updatedMembers.length !== members.length) {
      await databases.updateDocument(DB_ID, CHANNELS_COL, req.params.channelId, {
        members: JSON.stringify(updatedMembers),
        memberCount: updatedMembers.length,
        updatedAt: new Date().toISOString()
      });
    }
    res.json({ success: true, message: 'Left channel successfully' });
  } catch (error) { next(error); }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const limitNum = parseInt(limit);

    const response = await databases.listDocuments(DB_ID, MESSAGES_COL, [
      Query.equal('channelId', req.params.channelId),
      Query.equal('isDeleted', false),
      Query.orderDesc('createdAt'),
      Query.limit(limitNum)
    ]);

    const messages = response.documents.map(doc => ({ id: doc.$id, ...doc })).reverse();
    res.json({
      success: true,
      messages,
      pagination: {
        limit: limitNum,
        hasMore: messages.length === limitNum
      }
    });
  } catch (error) { next(error); }
};

// ============ POST CONTROLLERS ============

const transformPost = (doc) => {
  let likes = typeof doc.likes === 'string' ? JSON.parse(doc.likes) : doc.likes || [];
  return {
    id: doc.$id,
    ...doc,
    likes,
    likeCount: likes.length,
    author: typeof doc.author === 'string' ? JSON.parse(doc.author) : doc.author
  };
};

export const getPosts = async (req, res, next) => {
  try {
    const { limit = 20, category, channelId, authorId } = req.query;
    const maxLimit = Math.min(parseInt(limit) || 20, 100);

    const queries = [Query.equal('isDeleted', false), Query.limit(maxLimit), Query.orderDesc('createdAt')];
    if (category && category !== 'all') queries.push(Query.equal('category', category));
    if (channelId) queries.push(Query.equal('channelId', channelId));
    if (authorId) queries.push(Query.equal('authorId', authorId));

    const response = await databases.listDocuments(DB_ID, POSTS_COL, queries);
    let posts = response.documents.map(transformPost).filter(p => !p.status || p.status === 'published');

    res.json({
      success: true,
      posts,
      pagination: {
        limit: maxLimit,
        hasMore: posts.length === maxLimit
      }
    });
  } catch (error) { next(error); }
};

export const getPost = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, POSTS_COL, req.params.postId);
    if (doc.isDeleted) throw new ApiError(404, 'Post not found');

    const post = transformPost(doc);
    let viewedBy = typeof doc.viewedBy === 'string' ? JSON.parse(doc.viewedBy) : doc.viewedBy || [];
    
    if (!viewedBy.includes(req.user.uid)) {
      viewedBy.push(req.user.uid);
      await databases.updateDocument(DB_ID, POSTS_COL, req.params.postId, {
        views: (doc.views || 0) + 1,
        viewedBy: JSON.stringify(viewedBy)
      });
      post.views = (post.views || 0) + 1;
    }

    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags = [], category = 'discussion', attachments = [], scheduledAt } = req.body;
    const isScheduled = Boolean(scheduledAt);

    const postData = {
      title,
      content,
      tags: JSON.stringify(tags.map(t => t.toLowerCase().trim())),
      category,
      attachments: JSON.stringify(attachments),
      author: JSON.stringify({
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.picture || null
      }),
      authorId: req.user.uid, // for querying
      likes: JSON.stringify([]),
      likeCount: 0,
      commentCount: 0,
      views: 0,
      viewedBy: JSON.stringify([]),
      isPinned: false,
      isAnnouncement: false,
      isEdited: false,
      isDeleted: false,
      status: isScheduled ? 'scheduled' : 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isScheduled) postData.scheduledAt = new Date(scheduledAt).toISOString();

    const doc = await databases.createDocument(DB_ID, POSTS_COL, ID.unique(), postData);
    const newPost = transformPost(doc);

    if (isScheduled) {
      try {
        await schedulePostJob(doc.$id, scheduledAt);
      } catch (err) {
        await databases.updateDocument(DB_ID, POSTS_COL, doc.$id, { status: 'published', scheduledAt: null });
        newPost.status = 'published';
      }
    } else {
      try { getIO().to('posts:feed').emit('new_post', { post: newPost }); } catch (e) {}
    }

    res.status(201).json({ success: true, post: newPost });
  } catch (error) { next(error); }
};

export const getScheduledPosts = async (req, res, next) => {
  try {
    const response = await databases.listDocuments(DB_ID, POSTS_COL, [
      Query.equal('authorId', req.user.uid),
      Query.equal('status', 'scheduled'),
      Query.equal('isDeleted', false),
      Query.orderAsc('scheduledAt')
    ]);
    res.json({ success: true, posts: response.documents.map(transformPost) });
  } catch (error) { next(error); }
};

export const cancelScheduledPost = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, POSTS_COL, req.params.postId);
    if (doc.authorId !== req.user.uid) throw new ApiError(403, 'Not authorized');
    if (doc.status !== 'scheduled') throw new ApiError(400, 'Post is not scheduled');

    await cancelPostJob(req.params.postId);
    await databases.updateDocument(DB_ID, POSTS_COL, req.params.postId, {
      status: 'draft',
      scheduledAt: null,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true, message: 'Cancelled' });
  } catch (error) { next(error); }
};

export const updatePost = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, POSTS_COL, req.params.postId);
    if (doc.authorId !== req.user.uid) throw new ApiError(403, 'Not authorized');

    const { title, content, tags, category } = req.body;
    const updateData = { isEdited: true, editedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = JSON.stringify(tags.map(t => t.toLowerCase().trim()));
    if (category) updateData.category = category;

    const updated = await databases.updateDocument(DB_ID, POSTS_COL, req.params.postId, updateData);
    res.json({ success: true, post: transformPost(updated) });
  } catch (error) { next(error); }
};

export const deletePost = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, POSTS_COL, req.params.postId);
    if (doc.authorId !== req.user.uid) throw new ApiError(403, 'Not authorized');

    await databases.updateDocument(DB_ID, POSTS_COL, req.params.postId, {
      isDeleted: true,
      deletedAt: new Date().toISOString()
    });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
};

export const toggleLikePost = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, POSTS_COL, req.params.postId);
    let likes = typeof doc.likes === 'string' ? JSON.parse(doc.likes) : doc.likes || [];
    
    const alreadyLiked = likes.some(l => l.uid === req.user.uid);
    if (alreadyLiked) {
      likes = likes.filter(l => l.uid !== req.user.uid);
    } else {
      likes.push({ uid: req.user.uid, name: req.user.name, likedAt: new Date().toISOString() });
    }

    await databases.updateDocument(DB_ID, POSTS_COL, req.params.postId, {
      likes: JSON.stringify(likes),
      likeCount: likes.length
    });

    try {
      getIO().to('posts:feed').emit('post_like_updated', {
        postId: req.params.postId,
        likeCount: likes.length,
        likes
      });
    } catch (e) {}

    res.json({ success: true, liked: !alreadyLiked, likeCount: likes.length });
  } catch (error) { next(error); }
};

// ============ COMMENT CONTROLLERS ============

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { limit = 20 } = req.query;

    const topLevelResponse = await databases.listDocuments(DB_ID, COMMENTS_COL, [
      Query.equal('postId', postId),
      Query.equal('isDeleted', false),
      Query.isNull('parentCommentId'),
      Query.orderAsc('createdAt'),
      Query.limit(parseInt(limit) || 20)
    ]);

    const comments = topLevelResponse.documents.map(doc => ({
      id: doc.$id, ...doc,
      author: typeof doc.author === 'string' ? JSON.parse(doc.author) : doc.author,
      replies: []
    }));

    // In a real app we'd fetch replies properly, but for this simplified version:
    res.json({ success: true, comments, pagination: { limit, hasMore: false } });
  } catch (error) { next(error); }
};

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    const commentData = {
      content,
      postId,
      authorId: req.user.uid,
      author: JSON.stringify({
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.picture || null
      }),
      parentCommentId: parentCommentId || null,
      likes: JSON.stringify([]),
      likeCount: 0,
      replyCount: 0,
      isEdited: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const doc = await databases.createDocument(DB_ID, COMMENTS_COL, ID.unique(), commentData);
    
    // Update post count
    const post = await databases.getDocument(DB_ID, POSTS_COL, postId);
    await databases.updateDocument(DB_ID, POSTS_COL, postId, { commentCount: (post.commentCount || 0) + 1 });

    res.status(201).json({ success: true, comment: { id: doc.$id, ...doc, author: JSON.parse(commentData.author) } });
  } catch (error) { next(error); }
};

export const toggleLikeComment = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, COMMENTS_COL, req.params.commentId);
    let likes = typeof doc.likes === 'string' ? JSON.parse(doc.likes) : doc.likes || [];
    
    const alreadyLiked = likes.some(l => l.uid === req.user.uid);
    if (alreadyLiked) {
      likes = likes.filter(l => l.uid !== req.user.uid);
    } else {
      likes.push({ uid: req.user.uid, name: req.user.name });
    }

    await databases.updateDocument(DB_ID, COMMENTS_COL, req.params.commentId, {
      likes: JSON.stringify(likes),
      likeCount: likes.length
    });

    res.json({ success: true, liked: !alreadyLiked, likeCount: likes.length });
  } catch (error) { next(error); }
};

// ============ DIRECT MESSAGE CONTROLLERS ============

export const getConversations = async (req, res, next) => {
  try {
    const response = await databases.listDocuments(DB_ID, CONVERSATIONS_COL, [
      Query.search('participantIds', req.user.uid),
      Query.equal('isActive', true),
      Query.orderDesc('updatedAt'),
      Query.limit(50)
    ]);
    res.json({ success: true, conversations: response.documents.map(d => ({ id: d.$id, ...d })) });
  } catch (error) { next(error); }
};

export const getConversationMessages = async (req, res, next) => {
  try {
    const doc = await databases.getDocument(DB_ID, CONVERSATIONS_COL, req.params.conversationId);
    let pIds = typeof doc.participantIds === 'string' ? JSON.parse(doc.participantIds) : doc.participantIds || [];
    if (!pIds.includes(req.user.uid)) throw new ApiError(403, 'Not authorized');

    const response = await databases.listDocuments(DB_ID, DIRECT_MESSAGES_COL, [
      Query.equal('conversationId', req.params.conversationId),
      Query.equal('isDeleted', false),
      Query.orderDesc('createdAt'),
      Query.limit(50)
    ]);
    res.json({ success: true, messages: response.documents.map(d => ({ id: d.$id, ...d })).reverse(), conversation: { id: doc.$id, ...doc } });
  } catch (error) { next(error); }
};

// ============ PRESENCE CONTROLLER ============

export const getOnlineUsers = async (req, res, next) => {
  try {
    const users = await presenceService.getOnlineUsers({ includeEmail: false });
    const count = await presenceService.getOnlineCount();
    res.json({ success: true, users, count });
  } catch (error) { next(error); }
};

// ============ SEARCH CONTROLLER ============

export const searchCommunity = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) throw new ApiError(400, 'Search query must be at least 2 characters');
    const response = await databases.listDocuments(DB_ID, POSTS_COL, [
      Query.equal('isDeleted', false),
      Query.orderDesc('createdAt'),
      Query.limit(10)
    ]);
    const posts = response.documents.map(transformPost).filter(p => p.title?.toLowerCase().includes(q.toLowerCase()));
    res.json({ success: true, results: { posts, channels: [], messages: [] } });
  } catch (error) { next(error); }
};

export const fixPostLikeCounts = async (req, res, next) => {
  res.json({ success: true, message: 'Not implemented for Appwrite yet' });
};
