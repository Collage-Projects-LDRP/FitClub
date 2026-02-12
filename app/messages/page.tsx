export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserConversations } from "@/lib/messaging"
import { getUserById } from "@/lib/database"
import MessagingInterface from "@/components/messaging/messaging-interface"

export default async function MessagesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const conversations = await getUserConversations(user.id)
  const conversationsWithUsers = await Promise.all(
    conversations.map(async (conv) => ({
      ...conv,
      user: await getUserById(conv.userId),
    })),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-300">Connect with the Maxopolis community</p>
        </div>

        <MessagingInterface currentUserId={user.id} conversations={conversationsWithUsers} />
      </div>
    </div>
  )
}
