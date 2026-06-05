import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { 
  Send, 
  Smile, 
  Paperclip, 
  AtSign, 
  Hash,
  X,
  Image as ImageIcon
} from 'lucide-react';

const EMOJI_LIST = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '💯', '🚀', '✨', '🙌', '💪', '🤔'];

export default function MessageInput({ channelId, channelName, onTyping, replyTo, onCancelReply, onOptimisticMessage, currentUser }) {
  const { sendMessage, isConnected } = useSocket();
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachmentsRef = useRef([]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => () => {
    attachmentsRef.current.forEach((attachment) => {
      if (attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim() && attachments.length === 0) return;
    
    if (!isConnected) {
      console.error('Socket not connected, cannot send message');
      return;
    }

    const messageContent = content.trim();
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create optimistic message for immediate display
    const optimisticMessage = {
      id: tempId,
      _id: tempId,
      content: messageContent,
      channelId,
      sender: {
        uid: currentUser?.uid,
        name: currentUser?.displayName || currentUser?.name || 'You',
        email: currentUser?.email,
        avatar: currentUser?.photoURL || currentUser?.avatar || null
      },
      messageType: 'text',
      attachments: attachments,
      reactions: [],
      replyTo: replyTo?._id || null,
      replyToPreview: replyTo ? {
        content: replyTo.content?.substring(0, 100),
        senderName: replyTo.sender?.name
      } : null,
      isEdited: false,
      isDeleted: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true // Flag to identify optimistic messages
    };

    // Immediately show in UI
    if (onOptimisticMessage) {
      onOptimisticMessage(optimisticMessage);
    }

    // Send to server
    sendMessage({
      channelId,
      content: messageContent,
      replyTo: replyTo?._id,
      attachments,
      tempId // Send tempId so server can reference it
    });

    attachments.forEach((attachment) => {
      if (attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
    });
    setContent('');
    setAttachments([]);
    setShowEmoji(false);
    if (onCancelReply) onCancelReply();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);
    onTyping?.();
  };

  const insertEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // For now, just store file names - actual upload would go to your storage
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      // In production, you'd upload and get a URL
      url: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const attachment = prev[index];
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
          <div className="flex-1 text-sm">
            <span className="text-muted-foreground">Replying to </span>
            <span className="font-medium text-foreground">{replyTo.sender.name}</span>
            <p className="text-muted-foreground truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-b border-border flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="relative group bg-muted rounded-lg px-3 py-2 flex items-center gap-2"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground max-w-[150px] truncate">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={content}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${channelName}`}
              rows={1}
              className="w-full px-4 py-2.5 pr-24 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary focus:border-primary max-h-32"
              style={{ minHeight: '44px' }}
            />
            
            {/* Action Buttons inside input */}
            <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
              {/* Emoji Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    showEmoji ? 'text-primary bg-primary/20' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Emoji Dropdown */}
                {showEmoji && (
                  <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 w-64">
                    <div className="grid grid-cols-6 gap-1">
                      {EMOJI_LIST.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="p-2 text-xl hover:bg-muted rounded-lg cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mention Button */}
              <button
                type="button"
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <AtSign className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!content.trim() && attachments.length === 0}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send Message</span>
          </button>
        </div>
      </form>
    </div>
  );
}
