import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { communityApi } from '../../services/api';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SkeletonCommentList } from '../ui/Skeleton';

function CommentItem({ comment, currentUser, onReply, onLike, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLiked = comment.likes?.some(l => l.uid === currentUser?.uid);
  const isOwn = comment.author?.uid === currentUser?.uid;
  const likeCount = comment.likes?.length || comment.likeCount || 0;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium">
            {comment.author?.avatar ? (
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name || "Profile Avatar"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(comment.author?.name)
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground">
              {comment.author?.name || 'Anonymous'}
            </span>
            {isOwn && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                You
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount > 0 ? likeCount : ''}</span>
            </button>

            {depth === 0 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="submit"
                disabled={!replyContent.trim() || isSubmitting}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                   <>
        <Send className="w-4 h-4" />
        <span className="sr-only">Post Reply</span>
    </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-1">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mb-2 ml-11"
          >
            {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          
          {showReplies && (
            <div className="space-y-1">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id || reply._id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={onReply}
                  onLike={onLike}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId, currentUser, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async (loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);
      
      const pageToFetch = loadMore ? page + 1 : 1;
      const data = await communityApi.getComments(postId, pageToFetch);
      
      if (loadMore) {
        setComments(prev => [...prev, ...data.comments]);
        setPage(pageToFetch);
      } else {
        setComments(data.comments);
        setPage(1);
      }
      
      setTotal(data.pagination.total);
      setHasMore(data.comments.length === 20 && data.pagination.total > pageToFetch * 20);
    } catch (error) {
      toast.error('Failed to load comments', { id: `community-comments-load-error-${postId}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await communityApi.createComment(postId, { content: newComment.trim() });
      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
      setTotal(prev => prev + 1);
      onCommentAdded?.();
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment', { id: `community-post-comment-error-${postId}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId, content) => {
    const data = await communityApi.createComment(postId, { 
      content, 
      parentCommentId 
    });
    
    // Add reply to the parent comment
    setComments(prev => prev.map(comment => {
      if ((comment.id || comment._id) === parentCommentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), data.comment],
          replyCount: (comment.replyCount || 0) + 1
        };
      }
      return comment;
    }));
    
    onCommentAdded?.();
  };

  const handleLikeComment = async (commentId) => {
    try {
      const data = await communityApi.toggleLikeComment(commentId);
      
      // Update the comment in state
      const updateCommentLike = (comments) => {
        return comments.map(comment => {
          if ((comment.id || comment._id) === commentId) {
            const newLikes = data.liked
              ? [...(comment.likes || []), { uid: currentUser.uid, name: currentUser.displayName }]
              : (comment.likes || []).filter(l => l.uid !== currentUser.uid);
            return { ...comment, likes: newLikes, likeCount: data.likeCount };
          }
          // Check replies
          if (comment.replies) {
            return { ...comment, replies: updateCommentLike(comment.replies) };
          }
          return comment;
        });
      };
      
      setComments(updateCommentLike);
    } catch (error) {
      toast.error('Failed to like comment', { id: `community-like-comment-error-${commentId}` });
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Comment Input */}
      <div className="p-4 border-b border-border bg-muted/50">
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || "Profile Avatar"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              currentUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
            )}
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 bg-muted border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Post Comment </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <SkeletonCommentList count={3} className="py-2" />
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground/60" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="px-4 divide-y divide-border">
            {comments.map(comment => (
              <CommentItem
                key={comment.id || comment._id}
                comment={comment}
                currentUser={currentUser}
                onReply={handleReply}
                onLike={handleLikeComment}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="p-4 text-center">
            <button
              onClick={() => fetchComments(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Load more comments ({total - comments.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
