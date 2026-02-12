"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessageAction } from "@/app/actions/messaging"
import { toast } from "@/hooks/use-toast"
import { Send, MessageCircle } from "lucide-react"

interface MessageComposerProps {
  receiverId: number
  receiverName: string
}

export default function MessageComposer({ receiverId, receiverName }: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    const result = await sendMessageAction(receiverId, message.trim())

    if (result.success) {
      setMessage("")
      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${receiverName}.`,
      })
    } else {
      toast({
        title: "Failed to send",
        description: result.error,
        variant: "destructive",
      })
    }

    setIsSending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="w-5 h-5 mr-2" />
          Send Message
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={`Write a message to ${receiverName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </CardContent>
    </Card>
  )
}
