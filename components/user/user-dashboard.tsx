"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Heart, Camera, MessageSquare, Settings, TrendingUp, Target, LogOut, Loader2, Gift, User } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import dynamic from 'next/dynamic';
import type { DatabaseUser } from "@/lib/database"
import ProfileManagement from "./profile-management"
import PhotoGalleryWithSharing from "./photo-gallery-with-sharing"
import ContentManagement from "./content-management"
import VoteHistory from "./vote-history"

const WelcomeReelWizard = dynamic<{ user: any; onClose: () => void }>(
  () => import('./welcome-reel-wizard'),
  { ssr: false }
);

// Helper functions for reward tiers
const REWARD_TIERS = [
  { name: 'Bronze', minPoints: 0, nextTierPoints: 1000 },
  { name: 'Silver', minPoints: 1000, nextTierPoints: 5000 },
  { name: 'Gold', minPoints: 5000, nextTierPoints: 10000 },
  { name: 'Platinum', minPoints: 10000, nextTierPoints: 25000 },
  { name: 'Diamond', minPoints: 25000, nextTierPoints: 50000 },
  { name: 'Elite', minPoints: 50000, nextTierPoints: 100000 },
  { name: 'Legend', minPoints: 100000, nextTierPoints: Infinity }
];

const getRewardTier = (points: number): string => {
  const tier = REWARD_TIERS.find(tier => 
    points >= tier.minPoints && points < (tier.nextTierPoints || Infinity)
  ) || REWARD_TIERS[REWARD_TIERS.length - 1];
  return tier.name;
};

const getNextTierPoints = (points: number): number => {
  const tier = REWARD_TIERS.find(tier => 
    points >= tier.minPoints && points < (tier.nextTierPoints || Infinity)
  ) || REWARD_TIERS[REWARD_TIERS.length - 1];
  return tier.nextTierPoints;
};

const getNextTierName = (points: number): string => {
  const currentTierIndex = REWARD_TIERS.findIndex(tier => 
    points >= tier.minPoints && points < (tier.nextTierPoints || Infinity)
  );
  
  if (currentTierIndex === -1 || currentTierIndex === REWARD_TIERS.length - 1) {
    return 'Max Tier';
  }
  
  return REWARD_TIERS[currentTierIndex + 1].name;
};

interface WelcomeReelWizardProps {
  user: {
    id?: string | number;
    username?: string;
    email?: string;
  };
  onClose: () => void;
}

export default function UserDashboard() {
  const [user, setUser] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showWelcomeReel, setShowWelcomeReel] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)

        // Check for signup redirect after user is loaded
        const fromSignup = searchParams.get('from') === 'signup'
        if (fromSignup && !sessionStorage.getItem('welcomeReelShown')) {
          setShowWelcomeReel(true)
          sessionStorage.setItem('welcomeReelShown', 'true')
          // Clean up the URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, searchParams])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      // Clear client-side storage
      localStorage.removeItem("userToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("currentUser")
      sessionStorage.clear()

      // Call the server-side logout function
      const { logout } = await import('@/lib/auth')
      await logout()

      // Force a hard redirect to clear all application state
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      // Even if there's an error, still redirect to home
      window.location.href = "/"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Votes",
      value: user.vote_count || 100,
      icon: Heart,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      title: "Month to Date Votes",
      value: user.monthly_votes || 70,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Photos",
      value: (user as any).photos?.length || 6, // Using type assertion as a temporary fix
      icon: Camera,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Messages",
      value: 2, // This would come from messaging system
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ]

  const rewardsSection = (
    <div className="col-span-full mb-8">
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Your Rewards</h3>
              </div>
              <p className="text-purple-200 max-w-md">
                Earn points by being active and redeem them for exclusive rewards in our store.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {/* Available Points */}
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-purple-300 mb-1">Available</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    580 <span className="text-sm text-purple-300">pts</span>
                  </p>
                </div>
                
                {/* Total Earned Points */}
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-purple-300 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-white">
                    1480 <span className="text-sm text-purple-300">pts</span>
                  </p>
                </div>
                
                {/* Redeemed Points */}
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-purple-300 mb-1">Redeemed</p>
                  <p className="text-2xl font-bold text-amber-400">
                    900 <span className="text-sm text-purple-300">pts</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                onClick={() => router.push('/rewards')}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40 whitespace-nowrap"
              >
                <Gift className="w-5 h-5 mr-2" />
                Visit Rewards Store
              </Button>
            </div>
          </div>
          
          {/* <div className="mt-6">
            <div className="flex justify-between text-sm text-purple-200 mb-1">
              <span>Progress to next reward tier ({getRewardTier(user.total_earned_points || 0)})</span>
              <span>{user.total_earned_points || 0} / {getNextTierPoints(user.total_earned_points || 0)} pts</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-2.5 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ 
                  width: `${Math.min(100, ((user.total_earned_points || 0) / getNextTierPoints(user.total_earned_points || 0)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-purple-300 text-right">
              {getNextTierPoints(user.total_earned_points || 0) - (user.total_earned_points || 0)} points to {getNextTierName(user.total_earned_points || 0)}
            </p>
          </div> */}
        </div>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-purple-500">
              <AvatarImage src={user.profile_image || "/placeholder-user.jpg"} alt={user.username} />
              <AvatarFallback className="bg-purple-600 text-white text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.username}!</h1>
              <p className="text-gray-300">Manage your fitness profile and content</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
          >
            {loggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* New Rewards Section */}
        {rewardsSection}

        {/* Profile Progress */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-purple-400" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Profile completeness</span>
                <span className="text-white">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-600 text-white">
                  ✓ Profile Photo
                </Badge>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  ✓ Bio Added
                </Badge>
                <Badge variant="outline" className="border-gray-500 text-gray-300">
                  Add Photos
                </Badge>
                <Badge variant="outline" className="border-gray-500 text-gray-300">
                  Verify Account
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="votes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Votes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-200">Profile updated</span>
                      <span className="text-gray-400 text-sm ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-200">New photo uploaded</span>
                      <span className="text-gray-400 text-sm ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-200">Received 5 new votes</span>
                      <span className="text-gray-400 text-sm ml-auto">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                      onClick={() => {
                        const profileTab = document.querySelector('[data-value="profile"]') as HTMLElement;
                        if (profileTab) profileTab.click();
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            try {
                              // Here you would typically upload the file to your server
                              console.log('Uploading file:', file.name);
                              // Simulate upload
                              await new Promise(resolve => setTimeout(resolve, 1000));
                              console.log('File uploaded successfully');
                            } catch (error) {
                              console.error('Error uploading file:', error);
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:opacity-90 border-0"
                      onClick={() => window.open('https://www.instagram.com/accounts/login/', '_blank', 'noopener,noreferrer')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      Link Instagram
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-black text-white hover:bg-gray-900 border-0 flex items-center"
                      onClick={() => window.open('https://www.tiktok.com/login', '_blank', 'noopener,noreferrer')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                      Link TikTok
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManagement user={user} onUserUpdate={setUser} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoGalleryWithSharing user={user} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement user={user} />
          </TabsContent>

          <TabsContent value="votes">
            <VoteHistory user={user} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Welcome Reel Wizard Popup - Only show when coming from signup */}
      {showWelcomeReel && user && (
        <WelcomeReelWizard 
          user={{
            id: user.id,
            username: user.username || '',
            email: user.email || ''
          }}
          onClose={() => setShowWelcomeReel(false)}
        />
      )}
    </div>
  )
}
