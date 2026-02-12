"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserById } from "@/lib/database"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface VotedForTabProps {
  userId: number
}

export default function VotedForTab({ userId }: VotedForTabProps) {
  const [votedUsers, setVotedUsers] = useState<any[]>([])

  useEffect(() => {
    // Mock data - in real app, this would fetch from database
    const mockVotedUsers = [
      { id: 2, votedAt: "2024-01-15T10:30:00Z" },
      { id: 3, votedAt: "2024-01-14T15:20:00Z" },
      { id: 4, votedAt: "2024-01-13T09:45:00Z" },
      { id: 5, votedAt: "2024-01-12T14:10:00Z" },
    ]

    const usersWithDetails = mockVotedUsers
      .map((vote) => ({
        ...vote,
        user: getUserById(vote.id),
      }))
      .filter((vote) => vote.user)

    setVotedUsers(usersWithDetails)
  }, [userId])

  if (votedUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No votes cast yet</p>
        <p className="text-sm text-gray-400">Start voting for your favorite athletes!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {votedUsers.map((vote) => (
        <Card key={vote.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Link href={`/profile/${vote.user.id}`}>
              <div className="flex items-center space-x-3">
                <Image
                  src={vote.user.profile_image || "/placeholder.svg"}
                  alt={vote.user.username}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 hover:text-purple-600">{vote.user.username}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {vote.user.physique_category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    Voted on {new Date(vote.votedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
