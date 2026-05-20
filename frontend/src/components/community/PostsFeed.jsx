import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { communityApi } from '../../services/api';
import PostCard from './PostCard';
import PostEditor from './PostEditor';
import {
  Plus,
  TrendingUp,
  Clock,
  Heart,
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'all', label: 'All Posts', icon: '📋' },
  { value: 'experience', label: 'Experience', icon: '💼' },
  { value: 'interview', label: 'Interview', icon: '🎤' },
  { value: 'tips', label: 'Tips & Tricks', icon: '💡' },
  { value: 'question', label: 'Questions', icon: '❓' },
  { value: 'success-story', label: 'Success Stories', icon: '🎉' },
  { value: 'resource', label: 'Resources', icon: '📚' },
  { value: 'discussion', label: 'Discussion', icon: '💬' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function PostsFeed() {
  const { user } = useAuth();
  const { subscribe, subscribePosts, unsubscribePosts } = useSocket();
  
  const [posts, setPosts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [showScheduled, setShowScheduled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts on mount and when filters change
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  // Fetch current user's scheduled posts on mount
  useEffect(() => {
    fetchScheduledPosts();
  }, []);
  // Refetch scheduled posts whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      fetchScheduledPosts();
    } else {
      setScheduledPosts([]);
    }
  }, [user?.uid]);

  // Subscribe to real-time updates
  useEffect(() => {
    subscribePosts();

    const unsubNewPost = subscribe('new_post', ({ post }) => {
      setPosts(prev => {
        const postId = post.id || post._id;
        if (prev.some(p => (p.id || p._id) === postId)) {
          return prev;
        }
        return [post, ...prev];
      });
    });

    const unsubLikeUpdated = subscribe('post_like_updated', ({ postId, likeCount, likes }) => {
      // Only update if it's from another user's action (prevents duplicate updates from our own likes)
      setPosts(prev => prev.map(post => {
        const pId = post.id || post._id;
        if (pId === postId) {
          // Check if the like count is different to avoid unnecessary re-renders
          if (post.likeCount !== likeCount) {
            return { ...post, likeCount, likes };
          }
        }
        return post;
      }));
    });

    const unsubCommentAdded = subscribe('comment_added', ({ postId, commentCount }) => {
      setPosts(prev => prev.map(post => {
        const pId = post.id || post._id;
        return pId === postId ? { ...post, commentCount } : post;
      }));
    });

    return () => {
      unsubscribePosts();
      unsubNewPost();
      unsubLikeUpdated();
      unsubCommentAdded();
    };
  }, [subscribe, subscribePosts, unsubscribePosts]);

  const fetchPosts = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setPage(1);
      }

      const params = {
        page: loadMore ? page + 1 : 1,
        limit: 20,
        sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      };

      const data = await communityApi.getPosts(params);
      
      if (loadMore) {
        setPosts(prev => [...prev, ...data.posts]);
        setPage(prev => prev + 1);
      } else {
        setPosts(data.posts);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledPosts = async () => {
    try {
      const data = await communityApi.getScheduledPosts();
      setScheduledPosts(data.posts || []);
    } catch {
      // Silently ignore — not critical
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const data = await communityApi.createPost(postData);
      if (data.post.status === 'scheduled') {
        setScheduledPosts(prev => [data.post, ...prev].sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
        ));
        setShowEditor(false);
        toast.success('Post scheduled successfully!');
      } else {
        setPosts(prev => [data.post, ...prev]);
        setShowEditor(false);
        toast.success('Post created successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelScheduled = async (postId) => {
    try {
      await communityApi.cancelScheduledPost(postId);
      setScheduledPosts(prev => prev.filter(p => (p.id || p._id) !== postId));
      toast.success('Scheduled post cancelled');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel scheduled post');
    }
  };

  const handleLikePost = async (postId) => {
    // Optimistic update - immediately show the change
    setPosts(prev => prev.map(post => {
      const pId = post.id || post._id;
      if (pId === postId) {
        const currentLikes = post.likes || [];
        const isCurrentlyLiked = currentLikes.some(l => l.uid === user?.uid);
        
        if (isCurrentlyLiked) {
          // Unlike - remove user from likes
          return {
            ...post,
            likes: currentLikes.filter(l => l.uid !== user?.uid),
            likeCount: Math.max(0, (post.likeCount || currentLikes.length) - 1)
          };
        } else {
          // Like - add user to likes
          return {
            ...post,
            likes: [...currentLikes, { uid: user?.uid, name: user?.displayName || user?.name }],
            likeCount: (post.likeCount || currentLikes.length) + 1
          };
        }
      }
      return post;
    }));

    try {
      // Call API in background - socket will confirm the update
      await communityApi.toggleLikePost(postId);
    } catch (error) {
      // Revert on error - toggle back
      setPosts(prev => prev.map(post => {
        const pId = post.id || post._id;
        if (pId === postId) {
          const currentLikes = post.likes || [];
          const isCurrentlyLiked = currentLikes.some(l => l.uid === user?.uid);
          
          if (isCurrentlyLiked) {
            return {
              ...post,
              likes: currentLikes.filter(l => l.uid !== user?.uid),
              likeCount: Math.max(0, (post.likeCount || currentLikes.length) - 1)
            };
          } else {
            return {
              ...post,
              likes: [...currentLikes, { uid: user?.uid, name: user?.displayName || user?.name }],
              likeCount: (post.likeCount || currentLikes.length) + 1
            };
          }
        }
        return post;
      }));
      toast.error('Failed to like post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await communityApi.deletePost(postId);
      setPosts(prev => prev.filter(post => {
        const pId = post.id || post._id;
        return pId !== postId;
      }));
      toast.success('Post deleted');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter posts by search
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Community Discussions</h2>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort Options */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'latest' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-4 h-4" />
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'popular' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className="w-4 h-4" />
              Popular
            </button>
            <button
              onClick={() => setSortBy('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'trending' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Scheduled posts section — only shown to the post author */}
          {scheduledPosts.length > 0 && (
            <div className="border border-sky-500/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowScheduled(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 bg-sky-500/10 hover:bg-sky-500/15 transition-colors"
              >
                <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Scheduled Posts ({scheduledPosts.length})
                </div>
                {showScheduled
                  ? <ChevronUp className="w-4 h-4 text-sky-400" />
                  : <ChevronDown className="w-4 h-4 text-sky-400" />
                }
              </button>
              {showScheduled && (
                <div className="divide-y divide-neutral-800/50 bg-neutral-900/50">
                  {scheduledPosts.map(post => {
                    const postId = post.id || post._id;
                    return (
                      <PostCard
                        key={postId}
                        post={post}
                        currentUser={user}
                        onLike={() => {}}
                        onCancelSchedule={handleCancelScheduled}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-muted border border-border rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted-foreground/20 rounded" />
                      <div className="w-24 h-3 bg-muted-foreground/20 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 bg-muted-foreground/20 rounded" />
                    <div className="w-full h-4 bg-muted-foreground/20 rounded" />
                    <div className="w-2/3 h-4 bg-muted-foreground/20 rounded" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredPosts.length > 0 ? (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredPosts.map(post => {
                  const postId = post.id || post._id;
                  return (
                    <motion.div key={postId} variants={itemVariants}>
                      <PostCard
                        post={post}
                        currentUser={user}
                        onLike={handleLikePost}
                        onDelete={handleDeletePost}
                        onCancelSchedule={handleCancelScheduled}
                        onCommentAdded={() => {
                          setPosts(prev => prev.map(p => {
                            const pId = p.id || p._id;
                            return pId === postId
                              ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                              : p;
                          }));
                        }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {hasMore && (
                <motion.button
                  variants={itemVariants}
                  onClick={() => fetchPosts(true)}
                  className="w-full py-3 text-primary hover:text-primary/80 font-medium"
                >
                  Load more posts
                </motion.button>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📝</p>
              <h3 className="text-lg font-medium text-foreground">No posts yet</h3>
              <p className="text-muted-foreground mt-1">Be the first to share your thoughts!</p>
              <button
                onClick={() => setShowEditor(true)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Editor Modal */}
      {showEditor && (
        <PostEditor
          onClose={() => setShowEditor(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
