import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { communityApi } from '../services/api';
import ChannelList from '../components/community/ChannelList';
import ChatWindow from '../components/community/ChatWindow';
import MembersList from '../components/community/MembersList';
import PostsFeed from '../components/community/PostsFeed';
import DirectMessages from '../components/community/DirectMessages';
import {
  MessageSquare,
  Users,
  FileText,
  Mail,
  Menu,
  X,
  Plus,
  Search,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SkeletonListItems, SkeletonPostList } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Community() {
  const { user } = useAuth();
  const { isConnected, onlineUsers, subscribe, joinChannel, leaveChannel } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();

  // View state
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'channels'); // channels, posts, dms
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [membersOpen, setMembersOpen] = useState(true);

  // Sync activeView with search parameter changes
  useEffect(() => {
    const view = searchParams.get('view');
    if (view && ['channels', 'posts', 'dms'].includes(view)) {
      setActiveView(view);
    }
  }, [searchParams]);

  // Update URL search parameters when tab is clicked
  const handleTabChange = (view) => {
    setActiveView(view);
    setSearchParams({ view });
  };

  // Channel state
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Modal state
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  // Handle optimistic message - immediately show in UI
  const handleOptimisticMessage = useCallback((optimisticMessage) => {
    setMessages(prev => [...prev, optimisticMessage]);
    // Update channel's last message
    setChannels(prev => prev.map(ch => {
      const chId = ch.id || ch._id;
      return chId === optimisticMessage.channelId
        ? { ...ch, lastMessage: { content: optimisticMessage.content, senderName: optimisticMessage.sender.name, timestamp: optimisticMessage.createdAt } }
        : ch;
    }));
  }, []);

  // Handle optimistic reaction - immediately show in UI
  const handleOptimisticReaction = useCallback(({ messageId, emoji, action }) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg.id || msg._id;
      if (msgId !== messageId) return msg;

      let reactions = [...(msg.reactions || [])];
      const reactionIndex = reactions.findIndex(r => r.emoji === emoji);

      if (action === 'add') {
        if (reactionIndex >= 0) {
          // Add user to existing reaction
          const userAlreadyReacted = reactions[reactionIndex].users.some(u => u.uid === user?.uid);
          if (!userAlreadyReacted) {
            reactions[reactionIndex] = {
              ...reactions[reactionIndex],
              users: [...reactions[reactionIndex].users, { uid: user?.uid, name: user?.name || user?.displayName }]
            };
          }
        } else {
          // Create new reaction
          reactions.push({
            emoji,
            users: [{ uid: user?.uid, name: user?.name || user?.displayName }]
          });
        }
      } else if (action === 'remove') {
        if (reactionIndex >= 0) {
          reactions[reactionIndex] = {
            ...reactions[reactionIndex],
            users: reactions[reactionIndex].users.filter(u => u.uid !== user?.uid)
          };
          if (reactions[reactionIndex].users.length === 0) {
            reactions = reactions.filter(r => r.emoji !== emoji);
          }
        }
      }

      return { ...msg, reactions };
    }));
  }, [user]);

  // Handle optimistic edit - immediately show in UI
  const handleOptimisticEdit = useCallback(({ messageId, content }) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg.id || msg._id;
      return msgId === messageId
        ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() }
        : msg;
    }));
  }, []);

  // Handle optimistic delete - immediately show in UI
  const handleOptimisticDelete = useCallback(({ messageId }) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg.id || msg._id;
      return msgId === messageId ? { ...msg, isDeleted: true } : msg;
    }));
  }, []);

  // Socket event handlers - must be defined before the useEffect that uses them
  const handleNewMessage = useCallback((data) => {
    const channelId = activeChannel?.id || activeChannel?._id;
    if (data.channelId === channelId) {
      // Check if this is a confirmation of our optimistic message
      if (data.tempId) {
        // Replace optimistic message with confirmed one
        setMessages(prev => prev.map(msg =>
          (msg.id === data.tempId || msg._id === data.tempId)
            ? { ...data, isOptimistic: false }
            : msg
        ));
      } else if (data.sender?.uid !== user?.uid) {
        // Only add if it's from another user (we already have our own messages)
        setMessages(prev => [...prev, data]);
      }
    }
    // Update channel's last message
    setChannels(prev => prev.map(ch => {
      const chId = ch.id || ch._id;
      return chId === data.channelId
        ? { ...ch, lastMessage: { content: data.content, senderName: data.sender.name, timestamp: data.createdAt } }
        : ch;
    }));
  }, [activeChannel, user]);

  const handleChannelMessages = useCallback((data) => {
    const channelId = activeChannel?.id || activeChannel?._id;
    if (data.channelId === channelId) {
      setMessages(data.messages);
      setLoadingMessages(false);
    }
  }, [activeChannel]);

  const handleNewChannel = useCallback(({ channel }) => {
    setChannels(prev => [...prev, channel]);
  }, []);

  // Handle message confirmation from server - replace optimistic message with confirmed one
  const handleMessageConfirmed = useCallback((data) => {
    const channelId = activeChannel?.id || activeChannel?._id;
    if (data.channelId === channelId && data.tempId) {
      setMessages(prev => prev.map(msg =>
        (msg.id === data.tempId || msg._id === data.tempId)
          ? { ...data, isOptimistic: false }
          : msg
      ));
    }
  }, [activeChannel]);

  const handleMessageEdited = useCallback(({ messageId, content, editedAt }) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg.id || msg._id;
      return msgId === messageId ? { ...msg, content, isEdited: true, editedAt } : msg;
    }));
  }, []);

  const handleMessageDeleted = useCallback(({ messageId }) => {
    setMessages(prev => prev.filter(msg => {
      const msgId = msg.id || msg._id;
      return msgId !== messageId;
    }));
  }, []);

  const handleReactionUpdated = useCallback(({ messageId, reactions }) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg.id || msg._id;
      return msgId === messageId ? { ...msg, reactions } : msg;
    }));
  }, []);

  const fetchChannels = useCallback(async () => {
    try {
      setLoadingChannels(true);
      const data = await communityApi.getChannels();
      setChannels(data.channels);
      // Auto-select first channel
      setActiveChannel(current => current || data.channels[0] || null);
    } catch (error) {
      toast.error('Failed to load channels', { id: 'community-channels-load-error' });
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  // Fetch channels on mount
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // Subscribe to socket events
  useEffect(() => {
    const unsubNewMessage = subscribe('new_message', handleNewMessage);
    const unsubChannelMessages = subscribe('channel_messages', handleChannelMessages);
    const unsubNewChannel = subscribe('new_channel', handleNewChannel);
    const unsubMessageConfirmed = subscribe('message_confirmed', handleMessageConfirmed);
    const unsubMessageEdited = subscribe('message_edited', handleMessageEdited);
    const unsubMessageDeleted = subscribe('message_deleted', handleMessageDeleted);
    const unsubReactionUpdated = subscribe('message_reaction_updated', handleReactionUpdated);

    return () => {
      unsubNewMessage();
      unsubChannelMessages();
      unsubNewChannel();
      unsubMessageConfirmed();
      unsubMessageEdited();
      unsubMessageDeleted();
      unsubReactionUpdated();
    };
  }, [subscribe, handleNewMessage, handleChannelMessages, handleNewChannel, handleMessageConfirmed, handleMessageEdited, handleMessageDeleted, handleReactionUpdated]);

  // Join channel when selected
  useEffect(() => {
    if (activeChannel) {
      const channelId = activeChannel.id || activeChannel._id;
      setLoadingMessages(true);
      joinChannel(channelId);
      return () => leaveChannel(channelId);
    }
  }, [activeChannel, joinChannel, leaveChannel]);

  const handleChannelSelect = (channel) => {
    const activeId = activeChannel?.id || activeChannel?._id;
    const newId = channel.id || channel._id;
    if (activeId !== newId) {
      setActiveChannel(channel);
      setMessages([]);
      setLoadingMessages(true);
    }
  };

  const handleCreateChannel = async (channelData) => {
    try {
      const data = await communityApi.createChannel(channelData);
      setChannels(prev => [...prev, data.channel]);
      setActiveChannel(data.channel);
      setShowCreateChannel(false);
      toast.success('Channel created!');
    } catch (error) {
      toast.error(error.message, { id: 'community-create-channel-error' });
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="h-full flex">
        {/* Left Sidebar - Channels/Navigation */}
<div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-background border-r border-border flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>          {/* View Tabs */}
          <div className="p-3 border-b border-border">
<div className="flex gap-1 bg-muted p-1 rounded-lg w-full">
                <button
                onClick={() => handleTabChange('channels')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeView === 'channels' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="inline">Chat</span>
              </button>
              <button
                onClick={() => handleTabChange('posts')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeView === 'posts' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span className="inline">Posts</span>
              </button>
              <button
                onClick={() => handleTabChange('dms')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeView === 'dms' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Mail className="w-4 h-4" />
                <span className="inline">DMs</span>
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-4 py-2 border-b border-border">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</span>
              <span className="text-muted-foreground/50 ml-auto">{onlineUsers.length} online</span>
            </div>
          </div>

          {/* Channel List or DM List */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'channels' && (
              <ChannelList
                channels={channels}
                activeChannel={activeChannel}
                onSelectChannel={handleChannelSelect}
                onCreateChannel={() => setShowCreateChannel(true)}
                loading={loadingChannels}
              />
            )}
            {activeView === 'dms' && (
              <DirectMessages />
            )}
          </div>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-r-lg p-1.5 shadow-md hover:bg-muted lg:hidden"
        >
          {sidebarOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {activeView === 'channels' && activeChannel ? (
            <ChatWindow
              channel={activeChannel}
              messages={messages}
              currentUser={user}
              onOptimisticMessage={handleOptimisticMessage}
              onOptimisticReaction={handleOptimisticReaction}
              onOptimisticEdit={handleOptimisticEdit}
              onOptimisticDelete={handleOptimisticDelete}
              loading={loadingMessages}
            />
          ) : activeView === 'posts' ? (
            <PostsFeed />
          ) : activeView === 'dms' ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground bg-background min-w-0">
              <div className="text-center px-6">
                <Mail className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">Select a channel to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Members */}
        {activeView === 'channels' && (
          <div className={`${membersOpen ? 'w-60' : 'w-0'} bg-background border-l border-border transition-all duration-300 overflow-hidden hidden lg:block`}>
            <MembersList
              channel={activeChannel}
              onlineUsers={onlineUsers}
            />
          </div>
        )}

        {/* Members Toggle */}
        {activeView === 'channels' && (
          <button
            onClick={() => setMembersOpen(!membersOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-l-lg p-1.5 shadow-md hover:bg-muted hidden lg:block"
          >
            <Users className="w-4 h-4 text-foreground" />
          </button>
        )}

        {/* Create Channel Modal */}
        {showCreateChannel && (
          <CreateChannelModal
            onClose={() => setShowCreateChannel(false)}
            onCreate={handleCreateChannel}
          />
        )}
      </div>
    </div>
  );
}

// Create Channel Modal Component
function CreateChannelModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [type, setType] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreate({ name, description, category, type });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'general', label: '💬 General' },
    { value: 'job-hunting', label: '🔍 Job Hunting' },
    { value: 'interview-prep', label: '🎯 Interview Prep' },
    { value: 'resume-tips', label: '📄 Resume Tips' },
    { value: 'networking', label: '🤝 Networking' },
    { value: 'other', label: '📌 Other' }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Create Channel
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Channel Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., frontend-devs"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={2}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Visibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="public"
                  checked={type === 'public'}
                  onChange={(e) => setType(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm text-foreground">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="private"
                  checked={type === 'private'}
                  onChange={(e) => setType(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm text-foreground">Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
