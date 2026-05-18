import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CommentSection from './CommentSection';

export default function PostCard({ post, currentUser, onLike, onCommentAdded, onCancelSchedule }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const navigate = useNavigate();

  const isOwn = post.author.uid === currentUser?.uid;
  const isLiked = post.likes?.some(l => l.uid === currentUser?.uid);
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
      experience: 'bg-blue-500/20 text-blue-400',
      interview: 'bg-purple-500/20 text-purple-400',
      tips: 'bg-yellow-500/20 text-yellow-400',
      question: 'bg-green-500/20 text-green-400',
      'success-story': 'bg-pink-500/20 text-pink-400',
      resource: 'bg-orange-500/20 text-orange-400',
      discussion: 'bg-muted text-muted-foreground',
    };
    return styles[category] || styles.discussion;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      experience: '💼',
      interview: '🎤',
      tips: '💡',
      question: '❓',
      'success-story': '🎉',
      resource: '📚',
      discussion: '💬',
    };
    return icons[category] || '💬';
  };

  const handleShare = async () => {
    const postId = post.id || post._id;
    try {
      await navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.origin + `/community/post/${postId}`
      });
    } catch {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.origin + `/community/post/${postId}`);
    }
  };

  return (
    <article className="bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
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
                  <span className="text-xs text-muted-foreground">• {post.author.jobRole}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {post.isEdited && <span>• edited</span>}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(post.category)}`}>
            {getCategoryIcon(post.category)}
            {post.category?.replace('-', ' ')}
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

        {/* Cancel schedule banner — only visible to the post author */}
        {post.status === 'scheduled' && post.scheduledAt && isOwn && onCancelSchedule && (
          <div className="mt-2 flex items-center justify-between px-3 py-2 bg-sky-500/10 border border-sky-500/20 rounded-lg">
            <p className="text-xs text-sky-400">
              This post will publish automatically on{' '}
              <span className="font-medium">
                {format(new Date(post.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </p>
            <button
              onClick={() => onCancelSchedule(post.id || post._id)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 ml-3 flex-shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
          {shouldTruncate && !showFullContent ? (
            <>
              <ReactMarkdown>
                {previewText + '...'}
              </ReactMarkdown>
              <button
                onClick={() => setShowFullContent(true)}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                Read more
              </button>
            </>
          ) : (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(tag => (
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

      {/* Attachments */}
      {post.attachments?.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto">
            {post.attachments.map((att, index) => (
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

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id || post._id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{Math.max(0, post.likes?.length || post.likeCount || 0)}</span>
          </button>

          {/* Comments */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${showComments ? 'fill-primary/20' : ''}`} />
            <span>{commentCount}</span>
            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmark */}
        <button className="text-muted-foreground hover:text-primary">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id || post._id}
          currentUser={currentUser}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </article>
  );
}
