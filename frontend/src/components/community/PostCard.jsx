import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentSection from './CommentSection';

export default function PostCard({ post, currentUser, onLike, onCommentAdded, onCancelSchedule }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  // const isOwn = post.author.uid === currentUser?.uid;
  const isLiked = post.likes?.some(id => id === currentUser?.uid);
  const contentPreviewLength = 300;
  const shouldTruncate = post.content.length > contentPreviewLength;
  const rawPreview = post.content.slice(0, contentPreviewLength);
  const safePreview = rawPreview.replace(/\s+\S*$/, '').trim();
  const previewText = safePreview.length > 0 ? safePreview : rawPreview;

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
    onCommentAdded?.();
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const getCategoryStyle = (category) => {
    const styles = {
      tech: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      career: 'bg-green-500/10 text-green-500 border-green-500/20',
      interview: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      default: 'bg-primary/10 text-primary border-primary/20'
    };
    return styles[category?.toLowerCase()] || styles.default;
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/community/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: postUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(postUrl);
        }
      }
    } else {
      navigator.clipboard.writeText(postUrl);
    }
  };

  return (
    <article className="bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 shadow-sm overflow-hidden group">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold border-2 border-background shadow-sm">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(post.author.name)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{post.author.name}</span>
                {post.author.jobRole && (
                  <span className="text-xs text-text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {post.author.jobRole}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Clock className="w-3 h-3" />
                <span>
                  {post.createdAt?.seconds
                    ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true })
                    : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getCategoryStyle(post.category)}`}>
            {post.category || 'General'}
          </span>
          {post.isPinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
              📌 Pinned
            </span>
          )}
          {post.status === 'scheduled' && post.scheduledAt && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">
              <Clock className="w-3 h-3" />
              Scheduled · {format(new Date(post.scheduledAt), 'MMM d, h:mm a')}
            </span>
          )}
          {post.status === 'draft' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-600/40 text-neutral-400">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 py-3">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {post.title}
        </h3>

        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert break-words overflow-hidden">
          {shouldTruncate && !showFullContent ? (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                disallowedElements={['script', 'iframe', 'style']}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                  ),
                }}
              >
                {previewText + '...'}
              </ReactMarkdown>
              <button
                onClick={() => setShowFullContent(true)}
                className="text-primary hover:text-primary/80 font-medium text-sm mt-2 block"
              >
                Read more
              </button>
            </>
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                disallowedElements={['script', 'iframe', 'style']}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullContent(false)}
                  className="text-primary hover:text-primary/80 font-medium text-sm mt-2 block"
                >
                  Show less
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike?.(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-red-500 font-medium' : 'text-muted-foreground hover:text-red-500'
              }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${showComments ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount}</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comment Section Container */}
      {showComments && (
        <div className="border-t border-border bg-muted/10">
          <CommentSection postId={post.id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </article>
  );
}