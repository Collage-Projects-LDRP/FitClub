'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { UserPlus, ArrowLeft, Trophy, BarChart2, Users, Award, MessageSquare, Heart, Image as ImageIcon, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/header"

export default function NewUserProfile() {
  const { user, isLoading } = useAuth()
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/leaderboard" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Leaderboard
          </Link>
        </div>
        
        {/* Profile Header */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 mb-8">
          <div className="absolute inset-0 bg-[url('/placeholder-logo.png')] bg-cover bg-center opacity-5"></div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-gray-700 overflow-hidden">
                <Image
                  src="/images/design-mode/product-detail-banner%281%29%281%29%281%29.webp"
                  alt="New User"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 8rem, 10rem"
                />
                {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <UserPlus className="w-16 h-16 text-white/70" />
                </div> */}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">New Athlete</h1>
                <p className="text-purple-300 mb-4">@new_athlete</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                  <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white">Rank: <span className="text-gray-300">New</span></span>
                  </div>
                  <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-white">Points: <span className="text-gray-300">0</span></span>
                  </div>
                  <div className="flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white">Votes: <span className="text-gray-300">0</span></span>
                  </div>
                </div>
                
                <p className="text-gray-300 max-w-2xl">
                  This athlete is just getting started on their fitness journey. Check back soon to see their progress!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About Card */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Location: <span className="text-gray-400">Not specified</span></span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Award className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Category: <span className="text-gray-400">Not specified</span></span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This profile hasn't been set up yet. Once this athlete completes their profile, you'll see their bio, goals, and fitness journey here.
                </p>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Workouts</div>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-sm text-gray-400">Photos</div>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Votes</div>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">0</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery Placeholder */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-white">Gallery</CardTitle>
                  {/* <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-900/30">
                    <Plus className="w-4 h-4 mr-1" /> Add Photo
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item} 
                      className="aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-500"
                    >
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300">No Activity Yet</h3>
                  <p className="text-gray-500 mt-2">This user hasn't been active yet.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section - Only show when not logged in */}
        {!isLoading && !user && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Fitness Journey?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join our community of athletes, share your progress, and compete for the top spot on the leaderboard!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 px-8 text-lg">
                  <Link href="/signup">
                    Sign Up Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent border-purple-500 text-purple-400 hover:bg-purple-900/30 hover:text-white py-6 px-8 text-lg">
                  <Link href="/login">
                    Log In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
