import { db } from '../config/firebase.js';
import { presenceService } from '../services/presenceService.js';
import { getIO } from '../config/socket.js';
import { ApiError } from '../middleware/errorHandler.js';
import { FieldValue } from 'firebase-admin/firestore';
import { schedulePostJob, cancelPostJob, isSchedulerAvailable } from '../services/postScheduler.js';

// Collection references
const channelsRef = db.collection('channels');
const messagesRef = db.collection('messages');
const postsRef = db.collection('posts');
const commentsRef = db.collection('comments');
const conversationsRef = db.collection('conversations');
const directMessagesRef = db.collection('directMessages');

// ============ CHANNEL CONTROLLERS ============

// Get all channels
export const getChannels = async (req, res, next) => {
  try {
    const { type = 'all', limit = 50, cursor } = req.query;
    const limitNum = Math.min(parseInt(limit) || 50, 100);

    let query = channelsRef
      .orderBy('isDefault', 'desc')
      .orderBy('createdAt', 'desc')
      .limit(limitNum);

    if (type === 'public' || type === 'private') {
      query = query.where('type', '==', type);
    }

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!Number.isNaN(cursorDate.getTime())) {
        query = query.startAfter(cursorDate);
      }
    }

    const snapshot = await query.get();

    let channels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (type === 'private') {
      channels = channels.filter(ch =>
        ch.members && ch.members.some(m => m.uid === req.user.uid)
      );
    }

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc?.data().createdAt?.toDate?.()?.toISOString() || null;

    res.json({
      success: true,
      channels,
      pagination: {
        limit: limitNum,
        nextCursor,
        hasMore: snapshot.size === limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single channel
export const getChannel = async (req, res, next) => {
  try {
    const doc = await channelsRef.doc(req.params.channelId).get();
    
    if (!doc.exists) {
      throw new ApiError(404, 'Channel not found');
    }

    res.json({ success: true, channel: { id: doc.id, ...doc.data() } });
  } catch (error) {
    next(error);
  }
};

// Create channel
export const createChannel = async (req, res, next) => {
  try {
    const { name, description, type = 'public', category = 'general', icon } = req.body;

    const channelName = name.toLowerCase().replace(/\s+/g, '-');

    // Check if channel name exists
    const existingSnapshot = await channelsRef.where('name', '==', channelName).get();
    if (!existingSnapshot.empty) {
      throw new ApiError(400, 'Channel with this name already exists');
    }

    const channelData = {
      name: channelName,
      description: description || '',
      type,
      category,
      icon: icon || '💬',
      createdBy: req.user.uid,
      createdByName: req.user.name,
      members: [{
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        role: 'admin',
        joinedAt: new Date().toISOString()
      }],
      memberCount: 1,
      isDefault: false,
      lastMessage: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await channelsRef.add(channelData);
    const newChannel = { id: docRef.id, ...channelData, createdAt: new Date(), updatedAt: new Date() };

    // Notify all users about new channel
    try {
      const io = getIO();
      io.emit('new_channel', { channel: newChannel });
    } catch (e) {
      // Socket might not be initialized yet
    }

    res.status(201).json({ success: true, channel: newChannel });
  } catch (error) {
    next(error);
  }
};

// Join channel
export const joinChannel = async (req, res, next) => {
  try {
    const channelDoc = await channelsRef.doc(req.params.channelId).get();
    
    if (!channelDoc.exists) {
      throw new ApiError(404, 'Channel not found');
    }

    const channel = { id: channelDoc.id, ...channelDoc.data() };

    // Check if already a member
    if (channel.members && channel.members.some(m => m.uid === req.user.uid)) {
      return res.json({ success: true, message: 'Already a member', channel });
    }

    const newMember = {
      uid: req.user.uid,
      name: req.user.name,
      email: req.user.email,
      role: 'member',
      joinedAt: new Date().toISOString()
    };

    await channelsRef.doc(req.params.channelId).update({
      members: FieldValue.arrayUnion(newMember),
      memberCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp()
    });

    channel.members.push(newMember);
    channel.memberCount = (channel.memberCount || 0) + 1;

    res.json({ success: true, channel });
  } catch (error) {
    next(error);
  }
};

// Leave channel
export const leaveChannel = async (req, res, next) => {
  try {
    const channelDoc = await channelsRef.doc(req.params.channelId).get();
    
    if (!channelDoc.exists) {
      throw new ApiError(404, 'Channel not found');
    }

    const channel = channelDoc.data();

    if (channel.isDefault) {
      throw new ApiError(400, 'Cannot leave default channel');
    }

    await db.runTransaction(async (tx) => {
      const channelRef = channelsRef.doc(req.params.channelId);
      const snapshot = await tx.get(channelRef);
      if (!snapshot.exists) {
        throw new ApiError(404, 'Channel not found');
      }

      const channelData = snapshot.data();
      const members = channelData.members || [];
      const updatedMembers = members.filter(m => m.uid !== req.user.uid);

      if (updatedMembers.length === members.length) {
        return;
      }

      const nextCount = Math.max(0, (channelData.memberCount || members.length) - 1);
      tx.update(channelRef, {
        members: updatedMembers,
        memberCount: nextCount,
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    res.json({ success: true, message: 'Left channel successfully' });
  } catch (error) {
    next(error);
  }
};

// Get channel messages
export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;
    const limitNum = parseInt(limit);

    let query = messagesRef
      .where('channelId', '==', channelId)
      .where('isDeleted', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(limitNum);

    if (before) {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        query = query.startAfter(beforeDate);
      }
    }

    const snapshot = await query.get();

    const messages = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }))
      .reverse();

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc?.data().createdAt?.toDate?.()?.toISOString() || null;

    res.json({
      success: true,
      messages,
      pagination: {
        limit: limitNum,
        nextCursor,
        hasMore: snapshot.size === limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============ POST CONTROLLERS ============

// Get all posts
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, sortBy = 'latest' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = postsRef.where('isDeleted', '==', false);

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    if (sortBy === 'popular') {
      query = query.orderBy('likeCount', 'desc').orderBy('createdAt', 'desc');
    } else if (sortBy === 'trending') {
      query = query.orderBy('views', 'desc').orderBy('likeCount', 'desc');
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    const startIndex = (pageNum - 1) * limitNum;
    if (startIndex > 0) {
      query = query.offset(startIndex);
    }

    query = query.limit(limitNum);

    const snapshot = await query.get();

    const posts = snapshot.docs
      .map(doc => {
        const data = doc.data();
        const likes = data.likes || [];
        return {
          id: doc.id,
          ...data,
          likeCount: likes.length,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        };
      })
      // Exclude posts that are still waiting for their scheduled publish time
      .filter(post => !post.status || post.status === 'published');

    res.json({
      success: true,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        hasMore: snapshot.size === limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single post
export const getPost = async (req, res, next) => {
  try {
    const doc = await postsRef.doc(req.params.postId).get();
    
    if (!doc.exists || doc.data().isDeleted) {
      throw new ApiError(404, 'Post not found');
    }

    const data = doc.data();
    const likes = data.likes || [];
    const post = { 
      id: doc.id, 
      ...data,
      // Always use the actual likes array length as the source of truth
      likeCount: likes.length
    };

    // Increment view count
    const viewedBy = post.viewedBy || [];
    if (!viewedBy.includes(req.user.uid)) {
      await postsRef.doc(req.params.postId).update({
        views: FieldValue.increment(1),
        viewedBy: FieldValue.arrayUnion(req.user.uid)
      });
      post.views = (post.views || 0) + 1;
    }

    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// Create post (supports optional scheduledAt for deferred publishing)
export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags = [], category = 'discussion', attachments = [], scheduledAt } = req.body;

    const isScheduled = Boolean(scheduledAt);

    if (isScheduled) {
      const scheduleDate = new Date(scheduledAt);
      if (isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now()) {
        throw new ApiError(400, 'scheduledAt must be a valid future datetime');
      }
    }

    const postData = {
      title,
      content,
      tags: tags.map(t => t.toLowerCase().trim()),
      category,
      attachments,
      author: {
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.picture || null
      },
      likes: [],
      likeCount: 0,
      commentCount: 0,
      views: 0,
      viewedBy: [],
      isPinned: false,
      isAnnouncement: false,
      isEdited: false,
      isDeleted: false,
      status: isScheduled ? 'scheduled' : 'published',
      ...(isScheduled && { scheduledAt: new Date(scheduledAt).toISOString() }),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await postsRef.add(postData);
    const newPost = {
      id: docRef.id,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isScheduled) {
      try {
        const jobId = await schedulePostJob(docRef.id, scheduledAt);
        if (!jobId && !isSchedulerAvailable()) {
          // Redis unavailable — fall back to immediate publish rather than leaving post stranded
          await postsRef.doc(docRef.id).update({ status: 'published', scheduledAt: null });
          newPost.status = 'published';
          newPost.scheduledAt = null;
        }
      } catch (scheduleErr) {
        // Job enqueue failed after post was saved — revert to immediate publish to avoid orphan
        console.error('schedulePostJob failed, publishing immediately:', scheduleErr.message);
        await postsRef.doc(docRef.id).update({ status: 'published', scheduledAt: null });
        newPost.status = 'published';
        newPost.scheduledAt = null;
      }
    } else {
      // Notify feed subscribers for instant-publish posts
      try {
        const io = getIO();
        io.to('posts:feed').emit('new_post', { post: newPost });
      } catch {
        // Socket might not be initialized
      }
    }

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    next(error);
  }
};

// Get current user's scheduled posts
export const getScheduledPosts = async (req, res, next) => {
  try {
    const snapshot = await postsRef
      .where('author.uid', '==', req.user.uid)
      .where('status', '==', 'scheduled')
      .where('isDeleted', '==', false)
      .orderBy('scheduledAt', 'asc')
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// Cancel a scheduled post — reverts to draft and removes the queue job
export const cancelScheduledPost = async (req, res, next) => {
  try {
    const doc = await postsRef.doc(req.params.postId).get();

    if (!doc.exists) {
      throw new ApiError(404, 'Post not found');
    }

    const post = doc.data();

    if (post.author.uid !== req.user.uid) {
      throw new ApiError(403, 'Not authorized to modify this post');
    }

    if (post.status !== 'scheduled') {
      throw new ApiError(400, 'Post is not in scheduled state');
    }

    await cancelPostJob(req.params.postId);

    await postsRef.doc(req.params.postId).update({
      status: 'draft',
      scheduledAt: null,
      updatedAt: FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Scheduled post cancelled and reverted to draft' });
  } catch (error) {
    next(error);
  }
};

// Update post
export const updatePost = async (req, res, next) => {
  try {
    const doc = await postsRef.doc(req.params.postId).get();
    
    if (!doc.exists) {
      throw new ApiError(404, 'Post not found');
    }

    const post = doc.data();

    if (post.author.uid !== req.user.uid) {
      throw new ApiError(403, 'Not authorized to edit this post');
    }

    const { title, content, tags, category } = req.body;

    const updateData = {
      isEdited: true,
      editedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags.map(t => t.toLowerCase().trim());
    if (category) updateData.category = category;

    await postsRef.doc(req.params.postId).update(updateData);

    const updatedPost = { id: doc.id, ...post, ...updateData };
    res.json({ success: true, post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// Delete post
export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const normalizedPostId = typeof postId === 'string' ? postId.trim() : '';

    if (!normalizedPostId) {
      throw new ApiError(400, 'Invalid or missing postId');
    }

    const doc = await postsRef.doc(normalizedPostId).get();
    
    if (!doc.exists) {
      throw new ApiError(404, 'Post not found');
    }

    const post = doc.data();

    if (!post || !post.author || !post.author.uid) {
      throw new ApiError(400, 'Invalid post data');
    }

    if (post.author.uid !== req.user.uid) {
      throw new ApiError(403, 'Not authorized to delete this post');
    }

    if (post.isDeleted) {
      return res.json({ success: true, message: 'Post already deleted' });
    }

    await postsRef.doc(normalizedPostId).update({
      isDeleted: true,
      deletedAt: FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike post
export const toggleLikePost = async (req, res, next) => {
  try {
    const postRef = postsRef.doc(req.params.postId);
    let newLikeCount = 0;
    let newLikes = [];
    let liked = false;

    await db.runTransaction(async (tx) => {
      const doc = await tx.get(postRef);

      if (!doc.exists) {
        throw new ApiError(404, 'Post not found');
      }

      const post = doc.data();
      const likes = post.likes || [];
      const currentLikeCount = post.likeCount || likes.length;
      const likeToRemove = likes.find(l => l.uid === req.user.uid);
      const alreadyLiked = Boolean(likeToRemove);

      const likeData = { uid: req.user.uid, name: req.user.name, likedAt: new Date().toISOString() };

      if (alreadyLiked) {
        newLikeCount = Math.max(0, currentLikeCount - 1);
        newLikes = likes.filter(l => l.uid !== req.user.uid);
        liked = false;
      } else {
        newLikeCount = currentLikeCount + 1;
        newLikes = [...likes, likeData];
        liked = true;
      }

      tx.update(postRef, {
        likes: newLikes,
        likeCount: newLikeCount
      });
    });

    // Notify via socket
    try {
      const io = getIO();
      io.to('posts:feed').emit('post_like_updated', {
        postId: req.params.postId,
        likeCount: newLikeCount,
        likes: newLikes
      });
    } catch (e) {
      // Socket might not be initialized
    }

    res.json({
      success: true,
      liked,
      likeCount: newLikeCount
    });
  } catch (error) {
    next(error);
  }
};

// ============ COMMENT CONTROLLERS ============

// Get comments for a post
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let topLevelQuery = commentsRef
      .where('postId', '==', postId)
      .where('isDeleted', '==', false)
      .where('parentCommentId', '==', null)
      .orderBy('createdAt', 'asc');

    const startIndex = (pageNum - 1) * limitNum;
    if (startIndex > 0) {
      topLevelQuery = topLevelQuery.offset(startIndex);
    }

    topLevelQuery = topLevelQuery.limit(limitNum);

    const topLevelSnapshot = await topLevelQuery.get();
    const topLevelComments = topLevelSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    const repliesByParent = await Promise.all(
      topLevelComments.map(async (comment) => {
        const repliesSnapshot = await commentsRef
          .where('parentCommentId', '==', comment.id)
          .where('isDeleted', '==', false)
          .orderBy('createdAt', 'asc')
          .limit(5)
          .get();

        return repliesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }));
      })
    );

    const commentsWithReplies = topLevelComments.map((comment, index) => ({
      ...comment,
      replies: repliesByParent[index] || []
    }));

    res.json({
      success: true,
      comments: commentsWithReplies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        hasMore: topLevelSnapshot.size === limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create comment
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    const postDoc = await postsRef.doc(postId).get();
    if (!postDoc.exists) {
      throw new ApiError(404, 'Post not found');
    }

    const commentData = {
      content,
      postId,
      author: {
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.picture || null
      },
      parentCommentId: parentCommentId || null,
      likes: [],
      likeCount: 0,
      replyCount: 0,
      isEdited: false,
      isDeleted: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await commentsRef.add(commentData);

    // Update post comment count
    await postsRef.doc(postId).update({
      commentCount: FieldValue.increment(1)
    });

    // Update parent comment reply count if it's a reply
    if (parentCommentId) {
      await commentsRef.doc(parentCommentId).update({
        replyCount: FieldValue.increment(1)
      });
    }

    const newComment = { id: docRef.id, ...commentData, createdAt: new Date() };
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike comment
export const toggleLikeComment = async (req, res, next) => {
  try {
    const doc = await commentsRef.doc(req.params.commentId).get();
    
    if (!doc.exists) {
      throw new ApiError(404, 'Comment not found');
    }

    const comment = doc.data();
    const likes = comment.likes || [];
    const currentLikeCount = comment.likeCount || 0;
    const alreadyLiked = likes.some(l => l.uid === req.user.uid);

    const likeData = { uid: req.user.uid, name: req.user.name };

    let newLikeCount;
    let newLikes;

    if (alreadyLiked) {
      newLikeCount = Math.max(0, currentLikeCount - 1); // Ensure it doesn't go negative
      newLikes = likes.filter(l => l.uid !== req.user.uid);
      
      await commentsRef.doc(req.params.commentId).update({
        likes: newLikes,
        likeCount: newLikeCount
      });
    } else {
      newLikeCount = currentLikeCount + 1;
      newLikes = [...likes, likeData];
      
      await commentsRef.doc(req.params.commentId).update({
        likes: newLikes,
        likeCount: newLikeCount
      });
    }

    res.json({
      success: true,
      liked: !alreadyLiked,
      likeCount: newLikeCount
    });
  } catch (error) {
    next(error);
  }
};

// ============ DIRECT MESSAGE CONTROLLERS ============

// Get user's conversations
export const getConversations = async (req, res, next) => {
  try {
    const snapshot = await conversationsRef
      .where('participantIds', 'array-contains', req.user.uid)
      .where('isActive', '==', true)
      .orderBy('updatedAt', 'desc')
      .limit(50)
      .get();

    let conversations = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));

    conversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants?.find(p => p.uid !== req.user.uid);
        const isOnline = await presenceService.isOnline(otherParticipant?.uid);
        const unreadCount = conv.unreadCount?.[req.user.uid] || 0;
        
        return {
          ...conv,
          otherParticipant,
          isOnline,
          unreadCount,
          updatedAt: conv.updatedAt?.toDate?.() || conv.updatedAt
        };
      })
    );

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// Get messages in a conversation
export const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50 } = req.query;
    const limitNum = parseInt(limit);

    // Verify user is part of conversation
    const convDoc = await conversationsRef.doc(conversationId).get();
    if (!convDoc.exists) {
      throw new ApiError(404, 'Conversation not found');
    }

    const conversation = convDoc.data();
    if (!conversation.participantIds.includes(req.user.uid)) {
      throw new ApiError(403, 'Not authorized to view this conversation');
    }

    // Simple query - filter and sort in memory to avoid composite index
    const snapshot = await directMessagesRef
      .where('conversationId', '==', conversationId)
      .get();

    let messages = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }))
      .filter(msg => !msg.isDeleted);

    // Sort by createdAt descending, take limit, then reverse
    messages.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
    messages = messages.slice(0, limitNum).reverse();

    res.json({
      success: true,
      messages,
      conversation: { id: convDoc.id, ...conversation }
    });
  } catch (error) {
    next(error);
  }
};

// ============ PRESENCE CONTROLLER ============

export const getOnlineUsers = async (req, res, next) => {
  try {
    const users = await presenceService.getOnlineUsers({ includeEmail: false });
    const count = await presenceService.getOnlineCount();
    
    res.json({ 
      success: true, 
      users,
      count 
    });
  } catch (error) {
    next(error);
  }
};

// ============ SEARCH CONTROLLER ============

export const searchCommunity = async (req, res, next) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length < 2) {
      throw new ApiError(400, 'Search query must be at least 2 characters');
    }

    const results = { posts: [], channels: [], messages: [] };
    const searchQuery = q.toLowerCase();

    if (type === 'all' || type === 'posts') {
      const postsSnapshot = await postsRef
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const postResults = postsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));

      results.posts = postResults
        .filter(post => 
          post.title?.toLowerCase().includes(searchQuery) ||
          post.content?.toLowerCase().includes(searchQuery) ||
          post.tags?.some(tag => tag.includes(searchQuery))
        )
        .slice(0, 10);
    }

    if (type === 'all' || type === 'channels') {
      const channelsSnapshot = await channelsRef
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      results.channels = channelsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(ch => 
          ch.name?.toLowerCase().includes(searchQuery) ||
          ch.description?.toLowerCase().includes(searchQuery)
        )
        .slice(0, 10);
    }

    if (type === 'all' || type === 'messages') {
      const messagesSnapshot = await messagesRef
        .where('isDeleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const messageResults = messagesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));

      results.messages = messageResults
        .filter(msg => msg.content?.toLowerCase().includes(searchQuery))
        .slice(0, 10);
    }

    res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
};

// Initialize default channels (run once)
export const initializeDefaultChannels = async () => {
  const defaultChannels = [
    { name: 'general', description: 'General discussions and introductions', icon: '💬', category: 'general', isDefault: true },
    { name: 'job-hunting', description: 'Share job opportunities and hunting tips', icon: '🔍', category: 'job-hunting', isDefault: true },
    { name: 'interview-prep', description: 'Interview preparation and experiences', icon: '🎯', category: 'interview-prep', isDefault: true },
    { name: 'resume-tips', description: 'Resume writing tips and reviews', icon: '📄', category: 'resume-tips', isDefault: true },
    { name: 'success-stories', description: 'Share your job search victories!', icon: '🎉', category: 'other', isDefault: true },
    { name: 'announcements', description: 'Important platform announcements', icon: '📢', category: 'announcements', isDefault: true }
  ];

  for (const ch of defaultChannels) {
    // Check if channel exists
    const existingSnapshot = await channelsRef.where('name', '==', ch.name).get();
    
    if (existingSnapshot.empty) {
      await channelsRef.add({
        ...ch,
        type: 'public',
        createdBy: 'system',
        createdByName: 'System',
        members: [],
        memberCount: 0,
        lastMessage: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      console.log(`Created default channel: ${ch.name}`);
    }
  }
};

// Fix posts with incorrect like counts (one-time utility)
export const fixPostLikeCounts = async (req, res, next) => {
  try {
    const snapshot = await postsRef.get();
    let fixed = 0;

    for (const doc of snapshot.docs) {
      const post = doc.data();
      const likes = post.likes || [];
      const actualLikeCount = likes.length;
      const storedLikeCount = post.likeCount || 0;

      // Fix if mismatch or negative
      if (storedLikeCount !== actualLikeCount || storedLikeCount < 0) {
        await postsRef.doc(doc.id).update({
          likeCount: actualLikeCount
        });
        fixed++;
        console.log(`Fixed post ${doc.id}: ${storedLikeCount} -> ${actualLikeCount}`);
      }
    }

    res.json({ success: true, message: `Fixed ${fixed} posts` });
  } catch (error) {
    next(error);
  }
};

// Export collection references for socket service
export { channelsRef, messagesRef, postsRef, commentsRef, conversationsRef, directMessagesRef };
