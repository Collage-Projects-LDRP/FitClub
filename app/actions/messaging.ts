"use server"

import { sendMessage as libSendMessage } from "@/lib/messaging"

export async function sendMessageAction(formData: FormData) {
  const senderId = formData.get("sender_id") as string
  const receiverId = formData.get("receiver_id") as string
  const content = formData.get("content") as string

  if (!senderId || !receiverId || !content) {
    throw new Error("Missing required fields")
  }

  try {
    const message = await libSendMessage({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
    })

    return { success: true, message }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}
