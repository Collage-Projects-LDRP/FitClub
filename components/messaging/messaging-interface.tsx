"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Users, Search, Phone, Video, Plus, Smile, Loader2, X } from "lucide-react"
import { getAllUsers, type DatabaseUser, getConversationBetweenUsers, searchUsers } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

interface Reaction {
  emoji: string
  userId: string | number
  timestamp: string
}

interface Message {
  id: string | number
  sender_id: string | number
  receiver_id: string | number
  content: string
  created_at: string
  read?: boolean
  sender?: DatabaseUser
  reactions?: Reaction[]
}

interface Conversation {
  user: DatabaseUser
  lastMessage?: Message
  unreadCount: number
}

export default function MessagingInterface() {
  const [currentUser, setCurrentUser] = useState<DatabaseUser | null>(null)
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<DatabaseUser | null>(null)
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    messageId: string | number | null
    position: { x: number; y: number } | null
  }>({ messageId: null, position: null })

  useEffect(() => {
    const initializeMessaging = async () => {
      try {
        const user = await getCurrentUser()
        const allUsers = getAllUsers() // This is synchronous now

        setCurrentUser(user)
        setUsers(allUsers.filter((u) => u.id !== user?.id))

        // Create conversations from recent messages
        const recentMessagesPromises = allUsers
          .filter(u => u.id !== user?.id)
          .slice(0, 5) // Show recent 5 conversations
          .map(async (otherUser) => {
            try {
              const messages = getConversationBetweenUsers(user.id, otherUser.id)
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined
              
              const conversation: Conversation = {
                user: otherUser,
                lastMessage: lastMessage ? {
                  ...lastMessage,
                  id: String(lastMessage.id),
                  sender_id: lastMessage.sender_id,
                  receiver_id: lastMessage.receiver_id,
                  content: lastMessage.content,
                  created_at: lastMessage.created_at,
                  read: lastMessage.read,
                  sender: lastMessage.sender_id === user.id ? user : otherUser
                } : undefined,
                unreadCount: messages.filter(m => 
                  m.receiver_id === user.id && !m.read
                ).length
              }
              
              return conversation
            } catch (error) {
              console.error(`Error loading messages for user ${otherUser.id}:`, error)
              return null
            }
          })
        
        // Wait for all conversations to load and filter out any null values
        const recentMessages = (await Promise.all(recentMessagesPromises))
          .filter((conv): conv is Conversation => conv !== null)
        setConversations(recentMessages)
      } catch (error) {
        console.error("Error initializing messaging:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeMessaging()
  }, [])

  const handleConversationSelect = (user: DatabaseUser) => {
    setSelectedConversation(user)

    if (!currentUser) return

    try {
      // Check if we already have messages for this conversation
      if (conversationMessages[user.id]) {
        // Use existing messages from state
        setMessages(conversationMessages[user.id])
      } else {
        // Fetch messages if not already in state
        const conversationMessages = getConversationBetweenUsers(currentUser.id, user.id)
        const messagesWithSenders = conversationMessages.map((msg) => ({
          ...msg,
          id: String(msg.id),
          sender: msg.sender_id === currentUser.id ? currentUser : user,
        }))
        
        // Update both the messages state and conversationMessages
        setMessages(messagesWithSenders)
        setConversationMessages(prev => ({
          ...prev,
          [user.id]: messagesWithSenders
        }))
      }

      // Mark conversation as read
      setConversations((prev) => 
        prev.map((conv) => 
          conv.user.id === user.id 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      )
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  const handleAddReaction = (messageId: string | number, emoji: string) => {
    if (!currentUser) return
    
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions?.findIndex(r => r.userId === currentUser.id) ?? -1
          const newReactions = [...(msg.reactions || [])]
          
          if (existingReactionIndex >= 0) {
            // Toggle reaction if user already reacted with this emoji
            if (newReactions[existingReactionIndex].emoji === emoji) {
              newReactions.splice(existingReactionIndex, 1)
            } else {
              // Update existing reaction
              newReactions[existingReactionIndex] = {
                emoji,
                userId: currentUser.id,
                timestamp: new Date().toISOString()
              }
            }
          } else {
            // Add new reaction
            newReactions.push({
              emoji,
              userId: currentUser.id,
              timestamp: new Date().toISOString()
            })
          }
          
          return { ...msg, reactions: newReactions }
        }
        return msg
      })
    )
    
    // Update conversation messages in state
    if (selectedConversation) {
      setConversationMessages(prev => ({
        ...prev,
        [selectedConversation.id]: messages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, reactions: msg.reactions || [] }
          }
          return msg
        })
      }))
    }
    
    // Close the context menu
    setContextMenu({ messageId: null, position: null })
    
    // TODO: Send reaction to server
    // await sendReaction(messageId, emoji)
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.messageId) {
        setContextMenu({ messageId: null, position: null })
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation || !currentUser || sending) {
      return
    }

    setSending(true)

    try {
      const messageData = {
        id: String(Date.now()), // Ensure ID is a string
        sender_id: currentUser.id,
        receiver_id: selectedConversation.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false,
        reactions: []
      }

      // Optimistically update the UI
      const newMessageObj: Message = {
        ...messageData,
        sender: currentUser,
      }

      // Update messages for the current conversation
      const updatedMessages = [...messages, newMessageObj]
      setMessages(updatedMessages)
      
      // Update conversation messages in state
      setConversationMessages(prev => ({
        ...prev,
        [selectedConversation.id]: updatedMessages
      }))
      
      setNewMessage("")

      // Update the last message in the conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  ...newMessageObj,
                  sender: currentUser,
                },
                unreadCount: 0
              }
            : conv
        )
      )

      // TODO: Send message to server
      // await sendMessage(messageData)
    } catch (error) {
      console.error("Error sending message:", error)
      // Optionally show error to user
    } finally {
      setSending(false)
    }
  }

  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim() === '' 
    ? conversations 
    : conversations.filter(
        (conv) =>
          (conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conv.user.email && conv.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (conv.lastMessage?.content && conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())))
      )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 mr-3 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              Messages
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Users className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-200 mb-1">No conversations</h3>
                      <p className="text-sm text-gray-400">Start chatting with other members</p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                        New Message
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-700/50">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.user.id}
                          onClick={() => handleConversationSelect(conversation.user)}
                          className={`p-3 hover:bg-gray-700/30 transition-colors cursor-pointer ${
                            selectedConversation?.id === conversation.user.id 
                              ? "bg-gradient-to-r from-purple-900/30 to-transparent border-l-2 border-purple-400" 
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-11 h-11">
                                <AvatarImage src={conversation.user.profile_image || ""} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500">
                                  {conversation.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white truncate">
                                  {conversation.user.username}
                                </p>
                                {conversation.lastMessage && (
                                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                    {new Date(conversation.lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400 truncate max-w-[180px]">
                                  {conversation.lastMessage?.content || 'Start a conversation'}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-gray-700/50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversation.profile_image || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500">
                            {selectedConversation.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-white">{selectedConversation.username}</h3>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {selectedConversation.physique_category || "Fitness Enthusiast"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-350px)] p-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                          <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                            <MessageCircle className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-200 mb-1">No messages yet</h3>
                          <p className="text-sm text-gray-400 max-w-md">
                            Start the conversation with {selectedConversation.username.split(' ')[0]}. Send a message to get started!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div className="flex max-w-[85%] lg:max-w-[60%] items-start gap-2">
                                {message.sender_id !== currentUser?.id && (
                                  <Avatar className="w-8 h-8 mt-1">
                                    <AvatarImage src={message.sender?.profile_image || ""} />
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-600 to-pink-500">
                                      {message.sender?.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <div 
                                    className="relative"
                                    onContextMenu={(e) => {
                                      e.preventDefault()
                                      setContextMenu({
                                        messageId: message.id,
                                        position: { x: e.clientX, y: e.clientY }
                                      })
                                    }}
                                    onTouchStart={(e) => {
                                      // For mobile long press
                                      const touch = e.touches[0]
                                      const timer = setTimeout(() => {
                                        setContextMenu({
                                          messageId: message.id,
                                          position: { x: touch.clientX, y: touch.clientY }
                                        })
                                      }, 500) // 500ms long press
                                      
                                      const handleTouchEnd = () => {
                                        clearTimeout(timer)
                                        document.removeEventListener('touchend', handleTouchEnd)
                                      }
                                      
                                      document.addEventListener('touchend', handleTouchEnd, { once: true })
                                    }}
                                  >
                                    <div
                                      className={`px-4 py-2 rounded-2xl ${
                                        message.sender_id === currentUser?.id
                                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-none"
                                          : "bg-gray-700 text-white rounded-bl-none"
                                      }`}
                                    >
                                      <p className="text-sm">{message.content}</p>
                                    </div>
                                    
                                    {/* Display reactions */}
                                    {message.reactions && message.reactions.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {message.reactions.map((reaction, idx) => (
                                          <div 
                                            key={`${reaction.emoji}-${reaction.userId}-${idx}`}
                                            className="text-xs bg-gray-700/80 rounded-full px-2 py-0.5 flex items-center"
                                          >
                                            <span>{reaction.emoji}</span>
                                            {reaction.userId === currentUser?.id && (
                                              <span className="ml-1 text-gray-300">You</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <p className={`text-xs text-gray-400 mt-1 px-2 ${
                                    message.sender_id === currentUser?.id ? "text-right" : "text-left"
                                  }`}>
                                    {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-700/50">
                    <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                      <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-10 w-10">
                        <Plus className="w-5 h-5" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={`Message ${selectedConversation.username.split(' ')[0]}...`}
                          className="w-full bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-12 focus:ring-1 focus:ring-purple-400/30"
                          disabled={sending}
                        />
                        <div className="absolute right-2 bottom-0 top-0 flex items-center space-x-1">
                          <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-transparent h-8 w-8">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white h-10 w-10 p-0 flex-shrink-0"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Reaction Picker Context Menu */}
      {contextMenu.messageId && contextMenu.position && (
        <div 
          className="fixed bg-gray-800 rounded-lg shadow-xl p-2 z-50 flex space-x-1 items-center"
          style={{
            left: `${Math.min(contextMenu.position.x, window.innerWidth - 300)}px`,
            top: `${Math.max(0, contextMenu.position.y - 50)}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleAddReaction(contextMenu.messageId!, emoji)}
              className="text-xl p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              {emoji}
            </button>
          ))}
          <button 
            onClick={() => setContextMenu({ messageId: null, position: null })}
            className="ml-2 text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
