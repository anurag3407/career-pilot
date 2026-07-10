import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useTheme } from '../../hooks/useTheme';
import { Hash, Users, Pin, Search, Settings, MoreVertical, Loader2, Sun, Moon, Contrast } from 'lucide-react';

// Skeleton loader component for chat messages
const MessageSkeleton = ({ isOwn }) => (
  <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} animate-pulse`}>
    {!isOwn && (
      <div className="w-9 h-9 rounded-full bg-foreground/10 shrink-0" />
    )}
    <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      {!isOwn && <div className="h-3 w-20 bg-foreground/10 rounded" />}
      <div className={`rounded-2xl px-4 py-3 ${isOwn ? 'bg-primary/10' : 'bg-card border border-border'}`}>
        <div className="space-y-2">
          <div className={`h-3 ${isOwn ? 'w-32' : 'w-48'} bg-foreground/10 rounded`} />
          <div className={`h-3 ${isOwn ? 'w-24' : 'w-36'} bg-foreground/10 rounded`} />
        </div>
      </div>
      <div className="h-2 w-12 bg-foreground/10 mt-1 rounded" />
    </div>
  </div>
);

// Animated loading component
const ChatLoadingSkeleton = () => (
  <div className="flex-1 flex flex-col px-4 py-4 space-y-6 bg-background overflow-hidden">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20 pointer-events-none" />
    
    {/* Date separator skeleton */}
    <div className="flex items-center gap-4 my-2 animate-pulse">
      <div className="flex-1 h-px bg-foreground/10"></div>
      <div className="h-4 w-28 bg-foreground/10 rounded-full"></div>
      <div className="flex-1 h-px bg-foreground/10"></div>
    </div>
    
    {/* Message skeletons with staggered animation */}
    <div className="space-y-4">
      <div style={{ animationDelay: '0ms' }}>
        <MessageSkeleton isOwn={false} />
      </div>
      <div style={{ animationDelay: '100ms' }}>
        <MessageSkeleton isOwn={false} />
      </div>
      <div style={{ animationDelay: '200ms' }}>
        <MessageSkeleton isOwn={true} />
      </div>
      <div style={{ animationDelay: '300ms' }}>
        <MessageSkeleton isOwn={false} />
      </div>
      <div style={{ animationDelay: '400ms' }}>
        <MessageSkeleton isOwn={true} />
      </div>
    </div>
    
    {/* Floating loading indicator */}
    <div className="flex justify-center mt-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-lg border border-border">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-sm text-foreground font-medium">Loading messages...</span>
        <div className="flex gap-1 ml-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  </div>
);

export default function ChatWindow({ channel, messages, currentUser, onOptimisticMessage, onOptimisticReaction, onOptimisticEdit, onOptimisticDelete, loading }) {
  const { theme, toggleTheme } = useTheme();
  const { subscribe, startTyping, stopTyping } = useSocket();
  const [typingUsers, setTypingUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const clearTypingUsersTimeoutRef = useRef(null);
  const stopTypingTimeoutRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to typing events
  useEffect(() => {
    const channelId = channel.id || channel._id;
    
    const unsubTyping = subscribe('user_typing', ({ channelId: typingChannelId, user }) => {
      if (typingChannelId === channelId && user.uid !== currentUser?.uid) {
        setTypingUsers(prev => {
          if (!prev.find(u => u.uid === user.uid)) {
            return [...prev, user];
          }
          return prev;
        });
      }
    });

    const unsubStoppedTyping = subscribe('user_stopped_typing', ({ channelId: typingChannelId, user }) => {
      if (typingChannelId === channelId) {
        setTypingUsers(prev => prev.filter(u => u.uid !== user.uid));
      }
    });

    return () => {
      unsubTyping();
      unsubStoppedTyping();
    };
  }, [subscribe, channel.id, channel._id, currentUser]);

  // Clear typing users after 3 seconds
  useEffect(() => {
    if (typingUsers.length > 0) {
      clearTypingUsersTimeoutRef.current = setTimeout(() => {
        setTypingUsers([]);
      }, 3000);
    }
    return () => clearTimeout(clearTypingUsersTimeoutRef.current);
  }, [typingUsers]);

  useEffect(() => () => clearTimeout(stopTypingTimeoutRef.current), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = useCallback(() => {
    const channelId = channel.id || channel._id;
    startTyping(channelId);
    
    // Clear previous timeout
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    stopTypingTimeoutRef.current = setTimeout(() => {
      stopTyping(channelId);
    }, 2000);
  }, [channel.id, channel._id, startTyping, stopTyping]);

  // Filter messages based on search
  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Group messages by date
  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Channel Header */}
      <div className="h-14 px-4 border-b border-border bg-background flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">{channel.icon || '💬'}</span>
          <div>
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              {channel.name}
              {channel.type === 'private' && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  Private
                </span>
              )}
            </h2>
            {channel.description && (
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {channel.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              showSearch ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
            <Pin className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
            <Users className="w-5 h-5" />
          </button>
          <button type="button"
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : theme === 'dark' ? 'Switch to High Contrast' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : 
             theme === 'dark' ? <Contrast className="w-5 h-5" /> : 
             <Sun className="w-5 h-5" />}
          </button>
          <button type="button" className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-border bg-background/50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            autoFocus
          />
        </div>
      )}

      {/* Messages Area */}
      {loading ? (
        <ChatLoadingSkeleton />
      ) : (
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-background"
        >
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-muted"></div>
                <span className="text-xs text-muted-foreground font-medium">{date}</span>
                <div className="flex-1 h-px bg-muted"></div>
              </div>

              {/* Messages */}
              {dateMessages.map((message, index) => {
                const prevMessage = dateMessages[index - 1];
                const showAvatar = !prevMessage || 
                  prevMessage.sender.uid !== message.sender.uid ||
                  new Date(message.createdAt) - new Date(prevMessage.createdAt) > 5 * 60 * 1000;
                
                const messageId = message.id || message._id;
                const channelId = channel.id || channel._id;
                
                return (
                  <MessageBubble
                    key={messageId}
                    message={message}
                    isOwn={message.sender.uid === currentUser?.uid}
                    showAvatar={showAvatar}
                    channelId={channelId}
                    onOptimisticReaction={onOptimisticReaction}
                    onOptimisticEdit={onOptimisticEdit}
                    onOptimisticDelete={onOptimisticDelete}
                  />
                );
              })}
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                {searchQuery ? (
                  <>
                    <span className="text-4xl mb-3 block">🔎</span>
                    <h3 className="font-medium text-foreground">No results for "{searchQuery}"</h3>
                    <p className="text-sm mt-1">Try a different keyword or clear the search.</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-3 block">{channel.icon || '💬'}</span>
                    <h3 className="font-medium text-foreground">Welcome to #{channel.name}</h3>
                    <p className="text-sm mt-1">{channel.description || 'Start the conversation!'}</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground bg-background border-t border-border">
          <span className="inline-flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
            {typingUsers.length === 1 
              ? `${typingUsers[0].name} is typing...`
              : `${typingUsers.map(u => u.name).join(', ')} are typing...`
            }
          </span>
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        channelId={channel.id || channel._id}
        channelName={channel.name}
        onTyping={handleTyping}
        onOptimisticMessage={onOptimisticMessage}
        currentUser={currentUser}
      />
    </div>
  );
}
