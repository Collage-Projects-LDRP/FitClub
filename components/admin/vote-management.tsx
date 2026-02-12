"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"

export default function VoteManagement() {
  const recentVotes = [
    { id: 1, voter: "FitMike92", votedFor: "SarahStrong", timestamp: "2024-01-15T10:30:00Z" },
    { id: 2, voter: "YogaZen", votedFor: "FlexAlex", timestamp: "2024-01-15T09:15:00Z" },
    { id: 3, voter: "IronJohn", votedFor: "BikiniBabe", timestamp: "2024-01-15T08:45:00Z" },
    { id: 4, voter: "CardioQueen", votedFor: "BeastMode87", timestamp: "2024-01-15T07:20:00Z" },
    { id: 5, voter: "CrossFitKing", votedFor: "FitMike92", timestamp: "2024-01-15T06:10:00Z" },
  ]

  const voteStats = [
    { user: "SarahStrong", totalVotes: 45, monthlyVotes: 12, trend: "up" },
    { user: "FlexAlex", totalVotes: 38, monthlyVotes: 8, trend: "up" },
    { user: "FitMike92", totalVotes: 42, monthlyVotes: 6, trend: "down" },
    { user: "BikiniBabe", totalVotes: 35, monthlyVotes: 9, trend: "up" },
    { user: "BeastMode87", totalVotes: 31, monthlyVotes: 5, trend: "down" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVotes.map((vote) => (
                <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{vote.voter}</p>
                    <p className="text-sm text-gray-600">voted for {vote.votedFor}</p>
                    <p className="text-xs text-gray-500">{new Date(vote.timestamp).toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vote Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {voteStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{stat.user}</p>
                    <p className="text-sm text-gray-600">
                      Total: {stat.totalVotes} | This Month: {stat.monthlyVotes}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <Badge variant={stat.trend === "up" ? "default" : "secondary"}>
                      {stat.trend === "up" ? "Rising" : "Falling"}
                    </Badge>
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
