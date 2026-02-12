import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Star, Trophy, Users, Heart, Share2, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type ProfileData = {
  username: string
  name: string
  avatar: string
  banner: string
  bio: string
  votes: number
  rank: number
  isVerified: boolean
  socialLinks: {
    twitter?: string
    instagram?: string
    website?: string
  }
  stats: {
    followers: number
    following: number
    posts: number
  }
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  // In a real app, this would be fetched from an API
  const profile: ProfileData = {
    username: params.username,
    name: "John Doe",
    avatar: "/placeholder-avatar.jpg",
    banner: "/placeholder-banner.jpg",
    bio: "Fitness enthusiast and content creator. Helping people achieve their fitness goals through proper nutrition and training.",
    votes: 1245,
    rank: 42,
    isVerified: true,
    socialLinks: {
      twitter: "@johndoe",
      instagram: "@johndoe",
      website: "johndoe.com"
    },
    stats: {
      followers: 12500,
      following: 842,
      posts: 156
    }
  }

  const hasVoted = false // This would come from your auth state or API

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/qr-landing" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="border-gray-700 overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-purple-600 to-blue-600 relative">
            {/* Banner image would go here */}
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-700 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {profile.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  {profile.isVerified && (
                    <span className="ml-2 text-blue-400" title="Verified">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                </div>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <p className="mt-4 text-gray-300">{profile.bio}</p>

            {/* Stats */}
            <div className="flex items-center space-x-6 mt-6 text-sm">
              <div className="flex items-center text-gray-300">
                <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                <span>Rank: <span className="font-bold">#{profile.rank}</span></span>
              </div>
              <div className="flex items-center text-gray-300">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <span><span className="font-bold">{profile.votes.toLocaleString()}</span> votes</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Users className="h-5 w-5 text-blue-400 mr-2" />
                <span><span className="font-bold">{profile.stats.followers.toLocaleString()}</span> followers</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Vote Section */}
        <Card className="mt-6 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              Vote for {profile.name.split(' ')[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasVoted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vote Submitted!</h3>
                <p className="text-gray-300">Thank you for your vote. You can vote again in 24 hours.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-4">
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cast Your Vote</h3>
                <p className="text-gray-300 mb-6">Support {profile.name} by casting your vote. You can vote once per day.</p>
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  <Heart className="h-6 w-6 mr-2" />
                  Vote Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
