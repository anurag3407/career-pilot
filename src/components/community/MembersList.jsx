import { Circle, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function MembersList({ channel, onlineUsers }) {
  const safeOnlineUsers = onlineUsers || [];
  // Get channel members with online status
  const membersWithStatus = channel?.members?.map(member => ({
    ...member,
    isOnline: safeOnlineUsers.some(u => u.uid === member.uid)
  })) || [];

  // Sort: online first, then by role
  const sortedMembers = [...membersWithStatus].sort((a, b) => {
    // Online status first
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    
    // Then by role
    const roleOrder = { admin: 0, moderator: 1, member: 2 };
    return (roleOrder[a.role] || 2) - (roleOrder[b.role] || 2);
  });

  const onlineMembers = sortedMembers.filter(m => m.isOnline);
  const offlineMembers = sortedMembers.filter(m => !m.isOnline);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Crown className="w-3 h-3 text-yellow-500" />;
    }
    if (role === 'moderator') {
      return <Shield className="w-3 h-3 text-primary" />;
    }
    return null;
  };

  const MemberItem = ({ member }) => (
    <motion.div variants={itemVariants} className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg cursor-pointer">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(member.name)
          )}
        </div>
        {/* Online Indicator */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
            member.isOnline ? 'bg-green-500' : 'bg-muted-foreground/50'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium truncate ${
            member.isOnline ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {member.name}
          </span>
          {getRoleBadge(member.role)}
        </div>
        {member.email && (
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        )}
      </div>
    </motion.div>
  );

  if (!channel) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Select a channel to see members
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Members</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {onlineMembers.length} online · {channel.memberCount || membersWithStatus.length} total
        </p>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              Online — {onlineMembers.length}
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-1"
            >
              {onlineMembers.map(member => (
                <MemberItem key={member.uid} member={member} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Circle className="w-2 h-2 fill-muted-foreground/50 text-muted-foreground/50" />
              Offline — {offlineMembers.length}
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-1"
            >
              {offlineMembers.map(member => (
                <MemberItem key={member.uid} member={member} />
              ))}
            </motion.div>
          </div>
        )}

        {membersWithStatus.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No members in this channel
          </div>
        )}
      </div>

      {/* Global Online Users */}
      {safeOnlineUsers.length > 0 && (
        <div className="border-t border-border p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            All Online Users
          </h4>
          <div className="flex flex-wrap gap-1">
            {safeOnlineUsers.slice(0, 10).map(user => (
              <div
                key={user.uid}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium ring-2 ring-background"
                title={user.name}
              >
                {getInitials(user.name)}
              </div>
            ))}
            {safeOnlineUsers.length > 10 && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium ring-2 ring-background">
                +{safeOnlineUsers.length - 10}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
