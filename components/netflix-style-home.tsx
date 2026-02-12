"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Trophy,
  Dumbbell,
  Target,
  Waves,
  Play,
  Pause,
  Crown,
  Star,
  Medal,
  Award,
  Filter,
} from "lucide-react"
import HomeLeaderboard from "./home-leaderboard"

interface NetflixStyleHomeProps {
  users: any[]
  currentUser: any
}

export default function NetflixStyleHome({ users, currentUser }: NetflixStyleHomeProps) {
  const [showFAQ, setShowFAQ] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  // Get users for different sections
  const trendingUsers = users.filter((user) => (user.monthly_votes || 0) > 5).slice(0, 10)
  const leaderboardUsers = [...users].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))

  // Updated category data with new categories
  const categories = [
    {
      slug: "beach-body",
      name: "Beach Body",
      description: "Summer ready physiques and beach workouts",
      icon: Waves,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "beach-body").length,
      color: "from-cyan-500 to-blue-500",
    },
    {
      slug: "bikini-model",
      name: "Bikini Model",
      description: "Competition ready bikini physiques",
      icon: Crown,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "bikini-model" && u.gender === "female").length,
      color: "from-pink-500 to-rose-500",
    },
    {
      slug: "better-me",
      name: "Better Me",
      description: "Personal growth and self-improvement journey",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "better-me").length,
      color: "from-green-500 to-teal-500",
    },
    {
      slug: "athletes-body",
      name: "Athlete's Body",
      description: "Athletic performance and sports conditioning",
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "athletes-body").length,
      color: "from-indigo-500 to-purple-600",
    },
    {
      slug: "amateur-bodybuilder",
      name: "Amateur BodyBuilder",
      description: "Aspiring bodybuilders building muscle",
      icon: Dumbbell,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "amateur-bodybuilder").length,
      color: "from-orange-500 to-red-500",
    },
    {
      slug: "professional-bodybuilder",
      name: "Professional Bodybuilder",
      description: "Elite level competitive bodybuilders",
      icon: Star,
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "professional-bodybuilder").length,
      color: "from-yellow-500 to-orange-600",
    },
    {
      slug: "fitness-model",
      name: "Fitness Competitor / Model",
      description: "Fitness models and competition athletes",
      icon: Target,
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      count: users.filter((u) => u.physique_category === "fitness-model").length,
      color: "from-purple-500 to-pink-500",
    },
  ]

  const ScrollableRow = ({
    title,
    users,
    showTrending = false,
  }: { title: string; users: any[]; showTrending?: boolean }) => {
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const itemWidth = 170
    const gap = 12
    const containerPadding = 32
    const maxScroll = Math.max(0, (users.length * (itemWidth + gap)) - (window.innerWidth - containerPadding) + gap)

    useEffect(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return
        e.preventDefault()
        
        container.scrollTo({
          left: container.scrollLeft + e.deltaY,
          behavior: 'smooth'
        })
      }

      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    const scroll = (direction: "left" | "right") => {
      const scrollAmount = itemWidth * 3
      if (!scrollContainerRef.current) return
      
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        })
      } else {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        })
      }
    }

    return (
      <div className="relative group">
        <div className="flex items-center justify-between mb-2 px-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 pb-6 -mx-4"
          style={{
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {users.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <div className="flex-shrink-0 w-44 bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer" style={{ width: `${itemWidth}px` }}>
                <div className="aspect-[3/4] relative">
                  <Image
                    src={user.profile_image || "/placeholder.svg"}
                    alt={user.username}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <h3 className="text-white font-medium text-sm mb-1">{user.username}</h3>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">{user.vote_count || 0} votes</span>
                      <span className="text-pink-300">{user.monthly_votes || 0} monthly</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const CategoryScrollableRow = ({
    title,
    categories,
  }: { title: string; categories: any[] }) => {
    const [isClient, setIsClient] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const itemWidth = 190
    const gap = 12
    const containerPadding = 32
    const maxScroll = isClient 
      ? Math.max(0, (categories.length * (itemWidth + gap)) - (window.innerWidth - containerPadding) + gap) 
      : 0

    useEffect(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return
        e.preventDefault()
        
        container.scrollTo({
          left: container.scrollLeft + e.deltaY,
          behavior: 'smooth'
        })
      }

      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    const scroll = (direction: "left" | "right") => {
      const scrollAmount = itemWidth * 3
      if (!scrollContainerRef.current) return
      
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        })
      } else {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        })
      }
    }

    return (
      <div className="relative group">
        <div className="flex items-center justify-between mb-2 px-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 pb-6 -mx-4"
          style={{
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <div className="flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer" style={{ width: `${itemWidth}px` }}>
                <div className="aspect-[3/4] relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Centered category title and description */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{category.name}</h3>
                    <p className="text-white text-sm opacity-90 leading-relaxed">{category.description}</p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-200">{category.count} Athletes</span>
                      <span className="text-purple-300">View All →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const faqItems = [
    {
      question: "What is Maxopolis?",
      answer:
        "Maxopolis is the ultimate fitness community platform where athletes showcase their physiques, share knowledge, and inspire each other to reach new heights. It's a place where fitness enthusiasts can vote for their favorite athletes and connect with like-minded individuals.",
    },
    {
      question: "How does voting work?",
      answer:
        "Members can vote for their favorite athletes' profiles and photos. Each user gets one vote per athlete, and votes are tracked both monthly and yearly. The most voted athletes appear on our leaderboards and trending sections.",
    },
    {
      question: "Can I share my photos on social media?",
      answer:
        "Yes! When you upload photos to your profile, you can share them to Instagram and TikTok with custom QR code overlays. These QR codes allow viewers to scan and vote for your content directly on Maxopolis.",
    },
    {
      question: "Is Maxopolis free to use?",
      answer:
        "Yes, Maxopolis is completely free to use. You can create a profile, upload photos, vote for other athletes, and participate in the community without any cost.",
    },
    {
      question: "How do I join the community?",
      answer:
        "Simply click the 'Join Maxopolis' button and create your profile. Choose your fitness category, upload your photos, and start connecting with the community!",
    },
    {
      question: "What fitness categories are available?",
      answer:
        "We support various fitness categories including Beach Body, Bikini Model, Athlete's Body, Amateur BodyBuilder, Professional Bodybuilder, Fitness Competitor/Model, and more. Choose the category that best represents your fitness journey.",
    },
  ]

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Banner with Video - Only for non-logged-in users */}
      {!currentUser && (
        <div className="relative h-screen">
          <div className="absolute inset-0">
            {/* Video Background */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop"
            >
              <source
                src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=139&oauth2_token_id=57447761"
                type="video/mp4"
              />
              {/* Fallback image if video doesn't load */}
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop"
                alt="Fitness Community"
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Video Controls */}
          <button
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="absolute top-8 right-8 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          >
            {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
                TURN YOUR WORKOUT
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  INTO REWARDS
                </span>
              </h1>
              <p className="text-2xl text-gray-200 mb-8 leading-relaxed">
                Join the Maxopolis community, post your progress, get votes, and redeem points for real fitness gear.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg"
                  >
                    Join Maxopolis Now
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-4 text-lg"
                  >
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className={`relative z-10 pb-20 ${!currentUser ? "pt-6 sm:pt-0 sm:-mt-24" : "pt-20"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Trending Categories - Now as scrollable row */}
          <div className="mt-8 sm:mt-4">
            <CategoryScrollableRow title="Top Trending Categories" categories={categories} />
          </div>

          {/* Trending Athletes */}
          {trendingUsers.length > 0 && (
            <ScrollableRow title="Trending Athletes" users={trendingUsers} showTrending={true} />
          )}

          {/* Leaderboard Section */}
          <HomeLeaderboard users={leaderboardUsers} />

          {/* FAQ Section */}
          <div className="my-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setShowFAQ(showFAQ === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-white font-medium">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          showFAQ === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showFAQ === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
