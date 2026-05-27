import { Hash, Lock, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function ChannelList({ 
  channels, 
  activeChannel, 
  onSelectChannel, 
  onCreateChannel,
  loading 
}) {
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    'job-hunting': true,
    'interview-prep': true,
    'resume-tips': true,
    networking: true,
    announcements: true,
    other: true
  });

  // Group channels by category
  const groupedChannels = channels.reduce((acc, channel) => {
    const category = channel.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(channel);
    return acc;
  }, {});

  const categoryLabels = {
    general: 'General',
    'job-hunting': 'Job Hunting',
    'interview-prep': 'Interview Prep',
    'resume-tips': 'Resume Tips',
    networking: 'Networking',
    announcements: 'Announcements',
    other: 'Other'
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Create Channel Button */}
      <div className="px-3 mb-2">
        <button
          onClick={onCreateChannel}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Channel
        </button>
      </div>

      {/* Channel Categories */}
      {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
        <div key={category} className="mb-1">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
          >
            {expandedCategories[category] ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            {categoryLabels[category] || category}
            <span className="ml-auto text-muted-foreground/50 font-normal">
              {categoryChannels.length}
            </span>
          </button>

          {/* Channels in Category */}
          {expandedCategories[category] && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-0.5 px-2"
            >
              {categoryChannels.map(channel => {
                const channelId = channel.id || channel._id;
                const activeId = activeChannel?.id || activeChannel?._id;
                return (
                  <motion.button
                    key={channelId}
                    variants={itemVariants}
                    onClick={() => onSelectChannel(channel)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeId === channelId
                        ? 'bg-primary/20 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {channel.type === 'private' ? (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate text-sm">{channel.name}</span>
                      </div>
                      {channel.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {channel.lastMessage.senderName}: {channel.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {channel.memberCount > 0 && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {channel.memberCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>
      ))}

      {channels.length === 0 && !loading && (
        <div className="px-4 py-8 text-center text-muted-foreground">
          <p className="text-sm">No channels yet</p>
          <button
            onClick={onCreateChannel}
            className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
          >
            Create the first channel
          </button>
        </div>
      )}
    </div>
  );
}
