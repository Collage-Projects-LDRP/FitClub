// Mock messaging database
export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  read: boolean
}

export interface BlockedUser {
  id: number
  blocker_id: number
  blocked_id: number
  created_at: string
}

export interface Conversation {
  id: number
  participant1_id: number
  participant2_id: number
  last_message?: Message
  updated_at: string
}

// Mock data
const mockMessages: Message[] = [
  {
    id: 1,
    sender_id: 2,
    receiver_id: 1,
    content: "Hey! Great progress on your recent posts. Keep it up!",
    created_at: "2024-01-15T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    sender_id: 1,
    receiver_id: 2,
    content: "Thanks! Your powerlifting videos are inspiring.",
    created_at: "2024-01-15T11:00:00Z",
    read: true,
  },
  {
    id: 3,
    sender_id: 3,
    receiver_id: 1,
    content: "Would love to know your workout routine!",
    created_at: "2024-01-14T15:20:00Z",
    read: true,
  },
]

const mockBlockedUsers: BlockedUser[] = []

// Message operations
export function sendMessage(senderId: number, receiverId: number, content: string): Message {
  const newMessage: Message = {
    id: mockMessages.length + 1,
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    created_at: new Date().toISOString(),
    read: false,
  }
  mockMessages.push(newMessage)
  return newMessage
}

export function getMessagesForUser(userId: number): Message[] {
  return mockMessages.filter((msg) => msg.sender_id === userId || msg.receiver_id === userId)
}

export function getConversationBetweenUsers(user1Id: number, user2Id: number): Message[] {
  return mockMessages
    .filter(
      (msg) =>
        (msg.sender_id === user1Id && msg.receiver_id === user2Id) ||
        (msg.sender_id === user2Id && msg.receiver_id === user1Id),
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export function getUserConversations(userId: number): any[] {
  const conversations = new Map()

  mockMessages
    .filter((msg) => msg.sender_id === userId || msg.receiver_id === userId)
    .forEach((msg) => {
      const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
      if (
        !conversations.has(otherUserId) ||
        new Date(msg.created_at) > new Date(conversations.get(otherUserId).created_at)
      ) {
        conversations.set(otherUserId, msg)
      }
    })

  return Array.from(conversations.entries()).map(([userId, lastMessage]) => ({
    userId: Number(userId),
    lastMessage,
  }))
}

export function markMessageAsRead(messageId: number): void {
  const message = mockMessages.find((msg) => msg.id === messageId)
  if (message) {
    message.read = true
  }
}

export function blockUser(blockerId: number, blockedId: number): void {
  const existingBlock = mockBlockedUsers.find(
    (block) => block.blocker_id === blockerId && block.blocked_id === blockedId,
  )

  if (!existingBlock) {
    mockBlockedUsers.push({
      id: mockBlockedUsers.length + 1,
      blocker_id: blockerId,
      blocked_id: blockedId,
      created_at: new Date().toISOString(),
    })
  }
}

export function unblockUser(blockerId: number, blockedId: number): void {
  const index = mockBlockedUsers.findIndex((block) => block.blocker_id === blockerId && block.blocked_id === blockedId)
  if (index > -1) {
    mockBlockedUsers.splice(index, 1)
  }
}

export function isUserBlocked(blockerId: number, blockedId: number): boolean {
  return mockBlockedUsers.some((block) => block.blocker_id === blockerId && block.blocked_id === blockedId)
}

export function getBlockedUsers(userId: number): number[] {
  return mockBlockedUsers.filter((block) => block.blocker_id === userId).map((block) => block.blocked_id)
}
