import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { 
  MoreHorizontal, 
  Reply, 
  Smile, 
  Edit2, 
  Trash2, 
  Pin,
  Copy,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👏'];

export default function MessageBubble({ message, isOwn, showAvatar, channelId, onOptimisticReaction, onOptimisticEdit, onOptimisticDelete }) {
  const { addReaction, removeReaction, editMessage, deleteMessage } = useSocket();
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleReaction = (emoji) => {
    const messageId = message.id || message._id;
    const hasReacted = message.reactions?.some(
      r => r.emoji === emoji && r.users.some(u => u.uid === user?.uid)
    );

    if (hasReacted) {
      // Optimistic update - immediately show removal
      onOptimisticReaction?.({ messageId, emoji, action: 'remove' });
      removeReaction(messageId, emoji);
    } else {
      // Optimistic update - immediately show addition
      onOptimisticReaction?.({ messageId, emoji, action: 'add' });
      addReaction(messageId, emoji);
    }
    setShowReactions(false);
  };

  const handleEdit = () => {
    const messageId = message.id || message._id;
    if (editContent.trim() && editContent !== message.content) {
      // Optimistic update - immediately show edited content
      onOptimisticEdit?.({ messageId, content: editContent.trim() });
      editMessage(messageId, editContent.trim());
    }
    setIsEditing(false);
  };

  const confirmDelete = () => {
    const messageId = message.id || message._id;
    // Optimistic update - immediately show as deleted
    onOptimisticDelete?.({ messageId });
    deleteMessage(messageId);
    setShowConfirmDelete(false);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or insecure contexts
        const textarea = document.createElement('textarea');
        textarea.value = message.content;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Fallback copy command failed');
        }
      }
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const formattedTime = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) 
    : '';

  if (message.isDeleted) {
    return (
      <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <div className="w-8" />
        <div className="bg-muted rounded-lg px-4 py-2 text-muted-foreground italic text-sm">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group flex gap-3 hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
          {message.sender.avatar ? (
            <img 
              src={message.sender.avatar} 
              alt={message.sender.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(message.sender.name)
          )}
        </div>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`}>
        {showAvatar && (
          <div className={`flex items-baseline gap-2 mb-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium text-sm text-foreground">
              {message.sender.name}
            </span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
        )}

        {/* Reply Preview */}
        {message.replyToPreview && (
          <div className={`mb-1 ${isOwn ? 'ml-auto' : 'mr-auto'} max-w-sm`}>
            <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 border-l-2 border-primary">
              <span className="font-medium">{message.replyToPreview.senderName}</span>
              <p className="truncate">{message.replyToPreview.content}</p>
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className={`relative inline-block ${isOwn ? 'text-left' : ''}`}>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button type="button"
                onClick={handleEdit}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
              >
                Save
              </button>
              <button type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-muted-foreground/20 text-foreground rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              className={`rounded-2xl px-4 py-2 max-w-lg ${
                isOwn 
                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                  : 'bg-card border border-border text-foreground rounded-bl-md'
              }`}
            >
           <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  disallowedElements={['img']}
  components={{
    a: ({ node, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" />
    ),
  }}
  className="prose prose-invert prose-sm max-w-none break-words text-sm"
>
  {message.content}
</ReactMarkdown>
              {message.isEdited && (
                <span className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  (edited)
                </span>
              )}
            </div>
          )}

          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="inline-block">
                  {attachment.type?.startsWith('image/') ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="max-w-xs rounded-lg"
                    />
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80"
                    >
                      📎 {attachment.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions?.length > 0 && (
            <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
              {message.reactions.map((reaction, index) => (
                <button type="button"
                  key={index}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                    reaction.users.some(u => u.uid === user?.uid)
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.users.length}</span>
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {showActions && !isEditing && (
            <div 
              className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 px-2`}
            >
              <div className="flex items-center gap-1 bg-card border border-border rounded-lg shadow-sm p-1">
                {/* Quick Reaction */}
                <div className="relative">
                  <button type="button"
                    onClick={() => setShowReactions(!showReactions)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {showReactions && (
                    <div className="absolute bottom-full mb-1 left-0 bg-card border border-border rounded-lg shadow-lg p-1 flex gap-1">
                      {QUICK_REACTIONS.map(emoji => (
                        <button type="button"
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="p-1 hover:bg-muted rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Copy */}
                <button type="button" 
                  onClick={handleCopy}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Edit & Delete (only for own messages) */}
                {isOwn && (
                  <>
                    <button type="button"
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {showConfirmDelete ? (
                      <div className="flex items-center gap-1 bg-destructive/10 rounded p-0.5">
                        <button type="button"
                          onClick={confirmDelete}
                          className="text-[10px] text-destructive hover:underline px-1"
                        >
                          Confirm
                        </button>
                        <button type="button"
                          onClick={() => setShowConfirmDelete(false)}
                          className="text-[10px] text-muted-foreground hover:underline px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => setShowConfirmDelete(true)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
