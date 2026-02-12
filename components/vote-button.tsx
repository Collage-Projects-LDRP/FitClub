"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { voteForUser } from "@/app/actions"
import { toast } from "@/hooks/use-toast"

interface VoteButtonProps {
  userId: number
  initialVoteCount: number
}

export default function VoteButton({ userId, initialVoteCount }: VoteButtonProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    setIsVoting(true)

    const result = await voteForUser(userId)

    if (result.success) {
      setVoteCount((prev) => prev + 1)
      toast({
        title: "Vote cast!",
        description: "Your vote has been recorded.",
      })
    } else {
      toast({
        title: "Vote failed",
        description: result.error || "Unable to cast vote",
        variant: "destructive",
      })
    }

    setIsVoting(false)
  }

  return (
    <Button
      onClick={handleVote}
      disabled={isVoting}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
    >
      <Heart className="w-4 h-4 mr-2" />
      Vote Now ({voteCount})
    </Button>
  )
}
