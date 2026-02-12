"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function VoteHistory() {
  const myVotes = [
    {
      id: 1,
      athlete: "SarahStrong",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
      date: "2024-01-15",
      category: "powerlifter",
    },
    {
      id: 2,
      athlete: "FlexAlex",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop&crop=face",
      date: "2024-01-14",
      category: "physique",
    },
    {
      id: 3,
      athlete: "YogaZen",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&crop=face",
      date: "2024-01-13",
      category: "general",
    },
  ]

  const votesReceived = [
    { id: 1, voter: "FitMike92", date: "2024-01-15" },
    { id: 2, voter: "IronJohn", date: "2024-01-14" },
    { id: 3, voter: "CardioQueen", date: "2024-01-12" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-500">Votes Given</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-gray-500">Votes Received</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-500">This Month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myVotes.map((vote) => (
                <div key={vote.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={vote.image || "/placeholder.svg"}
                    alt={vote.athlete}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{vote.athlete}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {vote.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{vote.date}</span>
                    </div>
                  </div>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Votes Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {votesReceived.map((vote) => (
                <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{vote.voter}</p>
                    <p className="text-sm text-gray-500">voted for you</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{vote.date}</p>
                    <Heart className="w-4 h-4 text-red-500 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
