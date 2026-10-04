import { db } from '../config/firebase.js';

const conversationsRef = db.collection('conversations');
const channelsRef = db.collection('channels');

/**
 * Verify the user is a participant in the given conversation.
 * Throws an error if not found or not a member.
 */
export async function assertConversationMember(uid, conversationId) {
  const convDoc = await conversationsRef.doc(conversationId).get();
  if (!convDoc.exists) {
    throw new Error('Conversation not found');
  }
  const conversation = convDoc.data();
  if (!conversation.participantIds || !conversation.participantIds.includes(uid)) {
    throw new Error('UNAUTHORIZED');
  }
  return { id: convDoc.id, ...conversation };
}

/**
 * Verify the user is a member of the given channel.
 * Throws an error if not found or not a member.
 */
export async function assertChannelMember(uid, channelId) {
  const channelDoc = await channelsRef.doc(channelId).get();
  if (!channelDoc.exists) {
    throw new Error('Channel not found');
  }
  const channel = channelDoc.data();

  // Public/default channels are open to all authenticated users
  if (channel.type === 'public' || channel.isDefault) {
    return { id: channelDoc.id, ...channel };
  }

  // Private channels require explicit membership
  if (!channel.members || !channel.members.some(m => m.uid === uid)) {
    throw new Error('UNAUTHORIZED');
  }
  return { id: channelDoc.id, ...channel };
}

/**
 * Verify the user is a member of the given fellowship room.
 * Fellowship rooms store members as a 'memberIds' array.
 * Throws an error if not found or not a member.
 */
export async function assertFellowshipMember(uid, roomId) {
  const roomDoc = await db.collection('fellowshipRooms').doc(roomId).get();
  if (!roomDoc.exists) {
    throw new Error('Fellowship room not found');
  }
  const room = roomDoc.data();
  if (!room.memberIds || !room.memberIds.includes(uid)) {
    throw new Error('UNAUTHORIZED');
  }
  return { id: roomDoc.id, ...room };
}
