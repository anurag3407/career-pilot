// In-memory presence store (can be replaced with Redis for scaling)
const onlineUsers = new Map();

// Track which rooms each user has joined
const userRooms = new Map();

export const presenceService = {
  async setOnline(uid, userData) {
    onlineUsers.set(uid, {
      ...userData,
      lastSeen: new Date(),
      status: 'online'
    });
    // Initialize empty room set for user
    if (!userRooms.has(uid)) {
      userRooms.set(uid, new Set());
    }
  },

  async setOffline(uid) {
    const user = onlineUsers.get(uid);
    if (user) {
      user.status = 'offline';
      user.lastSeen = new Date();
      // Keep in map for a while for "last seen" info
      setTimeout(() => {
        const currentUser = onlineUsers.get(uid);
        if (currentUser && currentUser.status === 'offline') {
          onlineUsers.delete(uid);
        }
      }, 5 * 60 * 1000); // Remove after 5 minutes
    }
    // Clear user's room memberships
    userRooms.delete(uid);
  },

  async joinRoom(uid, room) {
    if (!userRooms.has(uid)) {
      userRooms.set(uid, new Set());
    }
    userRooms.get(uid).add(room);
  },

  async leaveRoom(uid, room) {
    const rooms = userRooms.get(uid);
    if (rooms) {
      rooms.delete(room);
    }
  },

  async getUserRooms(uid) {
    return Array.from(userRooms.get(uid) || []);
  },

  async getRoomMembers(room) {
    const members = [];
    for (const [uid, rooms] of userRooms) {
      if (rooms.has(room)) {
        const user = onlineUsers.get(uid);
        if (user && user.status === 'online') {
          members.push({
            uid,
            name: user.name,
            picture: user.picture
          });
        }
      }
    }
    return members;
  },

  async setAway(uid) {
    const user = onlineUsers.get(uid);
    if (user) {
      user.status = 'away';
      user.lastSeen = new Date();
    }
  },

  async getStatus(uid) {
    const user = onlineUsers.get(uid);
    return user ? user.status : 'offline';
  },

  async getOnlineUsers(options = {}) {
    const { includeEmail = false } = options;
    const users = [];
    for (const [uid, data] of onlineUsers) {
      if (data.status === 'online') {
        users.push({
          uid,
          name: data.name,
          email: includeEmail ? data.email : undefined,
          picture: data.picture,
          status: data.status,
          lastSeen: data.lastSeen
        });
      }
    }
    return users;
  },

  async getAllUsersWithStatus() {
    const users = [];
    for (const [uid, data] of onlineUsers) {
      users.push({
        uid,
        name: data.name,
        email: data.email,
        picture: data.picture,
        status: data.status,
        lastSeen: data.lastSeen
      });
    }
    return users;
  },

  async isOnline(uid) {
    const user = onlineUsers.get(uid);
    return user && user.status === 'online';
  },

  async getOnlineCount() {
    let count = 0;
    for (const [, data] of onlineUsers) {
      if (data.status === 'online') count++;
    }
    return count;
  }
};

export default presenceService;
