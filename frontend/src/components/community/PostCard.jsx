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

const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export default function PostCard({ post, currentUser, onLike, onCommentAdded, onCancelSchedule }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);


  const safePost = {
    id: post?.id ?? post?._id,
    _id: post?._id ?? post?.id,
    title: typeof post?.title === 'string' && post.title.trim() ? post.title : 'Untitled post',
    content: typeof post?.content === 'string' ? post.content : '',
    category: post?.category || 'discussion',
    status: post?.status || 'published',
    author: post?.author && typeof post.author === 'object' ? post.author : { name: 'Anonymous' },
    likes: Array.isArray(post?.likes) ? post.likes : [],
    tags: Array.isArray(post?.tags) ? post.tags.filter(Boolean) : [],
    attachments: Array.isArray(post?.attachments) ? post.attachments : [],
    views: Number.isFinite(post?.views) ? post.views : 0,
    isPinned: Boolean(post?.isPinned),
    isEdited: Boolean(post?.isEdited),
    scheduledAt: post?.scheduledAt || null,
    createdAt: isValidDate(post?.createdAt) ? post.createdAt : new Date().toISOString(),
    commentCount: Number.isFinite(post?.commentCount) ? post.commentCount : 0,
  };

  const [commentCount, setCommentCount] = useState(safePost.commentCount || 0);

  const isOwn = safePost.author?.uid === currentUser?.uid;
  const isLiked = safePost.likes.some(l => l.uid === currentUser?.uid);

  // const isOwn = post.author.uid === currentUser?.uid;
  const isLiked = post.likes?.some(id => id === currentUser?.uid);

  const contentPreviewLength = 300;
  const shouldTruncate = safePost.content.length > contentPreviewLength;
  const rawPreview = safePost.content.slice(0, contentPreviewLength);
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

    const postId = safePost.id || safePost._id;
    const shareUrl = `${window.location.origin}/community/post/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: safePost.title,
          text: safePost.content.substring(0, 100) + '...',
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
    } catch {
      try {
        navigator.clipboard.writeText(shareUrl);
      } catch {
        // Ignore clipboard failures in restricted environments.
      }

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

    <article className="bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
              {safePost.author?.avatar ? (
                <img
                  src={safePost.author.avatar}
                  alt={safePost.author.name}

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
                getInitials(safePost.author?.name)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">

                <span className="font-medium text-foreground">{safePost.author?.name || 'Anonymous'}</span>
                {safePost.author?.jobRole && (
                  <span className="text-xs text-muted-foreground">• {safePost.author.jobRole}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(safePost.createdAt), { addSuffix: true })}</span>
                {safePost.isEdited && <span>• edited</span>}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {safePost.views || 0}

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


        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(safePost.category)}`}>
            {getCategoryIcon(safePost.category)}
            {safePost.category?.replace('-', ' ')}

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getCategoryStyle(post.category)}`}>
            {post.category || 'General'}

          </span>
          {safePost.isPinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
              📌 Pinned
            </span>
          )}
          {safePost.status === 'scheduled' && safePost.scheduledAt && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">
              <Clock className="w-3 h-3" />
              Scheduled · {format(new Date(safePost.scheduledAt), 'MMM d, h:mm a')}
            </span>
          )}
          {safePost.status === 'draft' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-600/40 text-neutral-400">
              Draft
            </span>
          )}
        </div>


        {safePost.status === 'scheduled' && safePost.scheduledAt && isOwn && onCancelSchedule && (
          <div className="mt-2 flex items-center justify-between px-3 py-2 bg-sky-500/10 border border-sky-500/20 rounded-lg">
            <p className="text-xs text-sky-400">
              This post will publish automatically on{' '}
              <span className="font-medium">
                {format(new Date(safePost.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </p>
            <button
              onClick={() => onCancelSchedule(safePost.id || safePost._id)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 ml-3 flex-shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-3">

      </div>

      {/* Content */}
      <div className="p-4 py-3">

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {safePost.title}
        </h3>


        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">

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

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              disallowedElements={['script', 'iframe', 'style']}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                ),
              }}
            >
              {safePost.content}
            </ReactMarkdown>
          )}
        </div>

        {safePost.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {safePost.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {safePost.attachments.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto">
            {safePost.attachments.map((att, index) => (
              <div key={index} className="flex-shrink-0">
                {att.type?.startsWith('image/') ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="max-h-48 rounded-lg"
                  />
                ) : (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm text-foreground"
                  >
                    📎 {att.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(safePost.id || safePost._id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{Math.max(0, safePost.likes.length || safePost.likeCount || 0)}</span>

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

            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <button className="text-muted-foreground hover:text-primary">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={safePost.id || safePost._id}
          currentUser={currentUser}
          onCommentAdded={handleCommentAdded}
        />

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