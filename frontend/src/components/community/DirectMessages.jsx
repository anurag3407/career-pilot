import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { communityApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus, Circle, X } from 'lucide-react';

export default function DirectMessages() {
  const { user } = useAuth();
  const { subscribe, onlineUsers, startConversation } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDM, setShowNewDM] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Subscribe to new DMs
  useEffect(() => {
    const unsubNewDM = subscribe('new_direct_message', ({ message, conversation }) => {
      const convId = conversation.id || conversation._id;
      // Update conversations list
      setConversations(prev => {
        const exists = prev.find(c => (c.id || c._id) === convId);
        if (exists) {
          return prev.map(c => (c.id || c._id) === convId ? conversation : c);
        }
        return [conversation, ...prev];
      });

      // Update messages if viewing this conversation
      const selectedId = selectedConversation?.id || selectedConversation?._id;
      if (selectedId === convId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => unsubNewDM();
  }, [subscribe, selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await communityApi.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await communityApi.getConversationMessages(conversationId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSelectConversation = (conv) => {
    const convId = conv.id || conv._id;
    setSelectedConversation(conv);
    fetchMessages(convId);
  };

  const handleStartConversation = (targetUser) => {
    startConversation({
      receiverId: targetUser.uid,
      receiverName: targetUser.name,
      receiverEmail: targetUser.email
    });
    setShowNewDM(false);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  // Filter online users for new DM
  const filteredUsers = onlineUsers.filter(u => 
    u.uid !== user?.uid &&
    (searchQuery === '' || (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Direct Messages</h3>
        <button
          onClick={() => setShowNewDM(true)}
          className="p-1.5 text-primary hover:bg-primary/20 rounded-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-32 h-3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="py-2">
            {conversations.map(conv => {
              const convId = conv.id || conv._id;
              const selectedId = selectedConversation?.id || selectedConversation?._id;
              const otherUser = conv.otherParticipant;
              const isOnline = conv.isOnline;
              const unreadCount = conv.unreadCount || 0;

              return (
                <button
                  key={convId}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors ${
                    selectedId === convId ? 'bg-primary/20' : ''
                  }`}
                >
                  {/* Avatar with online status */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {otherUser?.avatar ? (
                        <img 
                          src={otherUser.avatar} 
                          alt={otherUser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(otherUser?.name)
                      )}
                    </div>
                    <span 
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                        isOnline ? 'bg-green-500' : 'bg-muted-foreground/50'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground truncate">
                        {otherUser?.name}
                      </span>
                      {conv.lastMessage?.timestamp && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage?.senderId === user?.uid && 'You: '}
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">No conversations yet</p>
            <button
              onClick={() => setShowNewDM(true)}
              className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Start a conversation
            </button>
          </div>
        )}
      </div>

      {/* New DM Modal */}
      {showNewDM && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">New Message</h3>
              <button
                onClick={() => setShowNewDM(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Online Users */}
              <div className="max-h-64 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Online Users
                </p>
                {filteredUsers.length > 0 ? (
                  <div className="space-y-1">
                    {filteredUsers.map(u => (
                      <button
                        key={u.uid}
                        onClick={() => handleStartConversation(u)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium">
                            {getInitials(u.name)}
                          </div>
                          <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-500 fill-green-500" />
                        </div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
