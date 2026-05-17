import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CommentSection from './CommentSection';

export default function PostCard({ post, currentUser, onLike, onCommentAdded }) {
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
      discussion: 'bg-neutral-700 text-neutral-300',
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
    <article className="bg-neutral-800 border border-neutral-700 rounded-xl hover:border-neutral-600 transition-colors">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
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
                <span className="font-medium text-white">{post.author.name}</span>
                {post.author.jobRole && (
                  <span className="text-xs text-neutral-500">• {post.author.jobRole}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
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
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <div className="prose prose-sm prose-invert max-w-none text-neutral-400">
          {shouldTruncate && !showFullContent ? (
            <>
              <ReactMarkdown className="break-words">
  {preview.content}
</ReactMarkdown>
              <button
                onClick={() => setShowFullContent(true)}
                className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
              >
                Read more
              </button>
            </>
          ) : (
            <ReactMarkdown className="break-words">
  {post.content}
</ReactMarkdown>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-neutral-700 text-neutral-400 rounded text-xs hover:bg-neutral-600 cursor-pointer"
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
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-700 rounded-lg text-sm text-neutral-300"
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
      <div className="px-4 py-3 border-t border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id || post._id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{Math.max(0, post.likes?.length || post.likeCount || 0)}</span>
          </button>

          {/* Comments */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              showComments ? 'text-indigo-400' : 'text-neutral-500 hover:text-indigo-400'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${showComments ? 'fill-indigo-900' : ''}`} />
            <span>{commentCount}</span>
            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-indigo-400"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmark */}
        <button className="text-neutral-500 hover:text-indigo-400">
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
