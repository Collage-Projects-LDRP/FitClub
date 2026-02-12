"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardCard } from "@/components/reward-card"
import { getRewards, getCurrentUser } from "@/lib/database"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Award, ThumbsUp, Share2, Calendar, LogIn, Star } from "lucide-react"
import Link from "next/link"

interface Reward {
  id: number
  name: string
  description: string
  points_required: number
  image_url: string
  category: string
  stock: number
}

const POINTS_INFO = [
  {
    title: "Vote for Athletes",
    description: "Earn points by voting for your favorite athletes",
    points: "+10 points per vote",
    icon: <ThumbsUp className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Share on Social Media",
    description: "Share our content on your social media profiles",
    points: "+25 points per share",
    icon: <Share2 className="h-5 w-5 text-green-500" />,
  },
  {
    title: "Daily Check-in",
    description: "Check in daily to earn bonus points",
    points: "+5 points per day",
    icon: <Calendar className="h-5 w-5 text-yellow-500" />,
  },
  {
    title: "Refer Friends",
    description: "Earn points when your friends sign up using your referral",
    points: "+100 points per referral",
    icon: <Award className="h-5 w-5 text-purple-500" />,
  },
]

export default function RewardsPage() {
  const [rewards, setRewards] = useState<{
    all: Reward[]
    trips: Reward[]
    products: Reward[]
    consultations: Reward[]
  }>({ all: [], trips: [], products: [], consultations: [] })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())

  useEffect(() => {
    try {
      // Get all rewards grouped by category
      const allRewards = getRewards()
      const trips = getRewards("trip")
      const products = getRewards("product")
      const consultations = getRewards("consultation")
      
      setRewards({
        all: allRewards,
        trips,
        products,
        consultations
      })
      setLoading(false)
    } catch (err) {
      console.error("Error loading rewards:", err)
      setError("Failed to load rewards. Please try again later.")
      setLoading(false)
    }
  }, [])

  const renderRewards = (items: Reward[]) => {
    if (loading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      )
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No rewards found</h3>
          <p className="text-sm text-muted-foreground">
            Check back later for new rewards!
          </p>
        </div>
      )
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Rewards Store</h1>
        <p className="mt-2 text-muted-foreground">
          Redeem your hard-earned points for amazing rewards
        </p>
        
        {!currentUser && (
          <div className="mt-6">
            <Alert className="inline-flex items-center max-w-md mx-auto">
              <LogIn className="h-4 w-4 mr-2" />
              <AlertDescription className="flex-1">
                <Link href="/login" className="text-blue-500 hover:underline font-medium">
                  Sign in
                </Link> to start earning and redeeming points!
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderRewards(rewards.all)}
        </TabsContent>
        <TabsContent value="products" className="mt-0">
          {renderRewards(rewards.products)}
        </TabsContent>
        <TabsContent value="trips" className="mt-0">
          {renderRewards(rewards.trips)}
        </TabsContent>
        <TabsContent value="consultations" className="mt-0">
          {renderRewards(rewards.consultations)}
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">How to Earn Points</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {POINTS_INFO.map((item, index) => (
            <div key={index} className="bg-background p-5 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/10">
                  {item.icon}
                </div>
                <h3 className="font-medium">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
