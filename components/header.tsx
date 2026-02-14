"use client"

import type React from "react"

import { useState, useEffect, createContext, useCallback, useMemo, useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, LogOut, Home, Trophy, MessageCircle, Shield, User, Gift, Award, ChevronDown, Users, Dumbbell, Waves, Crown, Star, Target, Image as ImageIcon, TrendingUp, Share2, Plus } from "lucide-react"
import { useTheme } from "next-themes"
import { getCurrentUser } from "@/lib/auth"
import type { DatabaseUser } from "@/lib/database"
import { RewardPoints } from "@/components/reward-points"
import { Logo } from "@/components/logo"

// Helper function to get a plain user object
const getPlainUser = (user: any) => {
  if (!user) return null
  return JSON.parse(JSON.stringify(user))
}

// Create a context to share auth state
const AuthContext = createContext<{
  user: DatabaseUser | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}>({
  user: null,
  isLoading: true,
  refreshAuth: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(getPlainUser(currentUser));
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle auth state changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_id" || e.key === "username" || e.key === null) {
        checkAuth();
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);

    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  const value = useMemo(() => ({
    user,
    isLoading,
    refreshAuth: checkAuth,
  }), [user, isLoading, checkAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const categories = [
  {
    slug: "beach-body",
    name: "Beach Body",
    description: "Summer ready physiques and beach workouts",
    icon: Waves,
    color: "from-cyan-500 to-blue-500"
  },
  {
    slug: "bikini-model",
    name: "Bikini Model",
    description: "Competition ready bikini physiques",
    icon: Crown,
    color: "from-pink-500 to-rose-500"
  },
  {
    slug: "athletes-body",
    name: "Athlete's Body",
    description: "Athletic performance and sports conditioning",
    icon: Trophy,
    color: "from-indigo-500 to-purple-600"
  },
  {
    slug: "amateur-bodybuilder",
    name: "Amateur BodyBuilder",
    description: "Aspiring bodybuilders building muscle",
    icon: Dumbbell,
    color: "from-orange-500 to-red-500"
  },
  {
    slug: "professional-bodybuilder",
    name: "Professional Bodybuilder",
    description: "Elite level competitive bodybuilders",
    icon: Star,
    color: "from-yellow-500 to-orange-600"
  },
  {
    slug: "fitness-model",
    name: "Fitness Competitor / Model",
    description: "Fitness models and competition athletes",
    icon: Target,
    color: "from-purple-500 to-pink-500"
  },
  {
    slug: "better-me",
    name: "Better Me",
    description: "Personal growth and self-improvement journey",
    icon: TrendingUp,
    color: "from-green-500 to-teal-500"
  }
]

const navigationItems = [
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
]

const rewardsItems = [
  { href: "/rewards", label: "Reward Store", icon: Gift },
  { href: "/rewards/faq", label: "How to Earn Points", icon: Award },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, refreshAuth } = useAuth()

  // Refresh auth state when path changes
  useEffect(() => {
    refreshAuth()
  }, [pathname, refreshAuth])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("currentUser")
        sessionStorage.clear()
      }

      // Call the server-side logout function
      const { logout } = await import("@/lib/auth")
      await logout()

      // Redirect to home page
      router.push("/")

      // Force a page refresh to clear all state
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Even if there's an error, still clear local state and redirect
      router.push("/")
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 border-gray-700">
        <div className="container flex h-20 items-center justify-between px-4">
          <Logo size="sm" isClickable={false} showUnderline={false} className="opacity-50" />
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 border-gray-700">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Premium Text Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Community Dropdown */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-purple-400 flex items-center"
              asChild
            >
              <div>
                <Users className="w-4 h-4 mr-1" />
                Community
                <ChevronDown className="ml-1 h-4 w-4" />
              </div>
            </Button>
            <div className="absolute left-0 mt-2 w-80 bg-gray-900 border border-gray-800 text-white p-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="grid grid-cols-1 gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="w-full flex items-start p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`p-2 rounded-md mr-3 ${category.color} bg-opacity-20`}>
                      <category.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{category.name}</div>
                      <div className="text-xs text-gray-400">{category.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navigationItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={`text-gray-300 hover:text-purple-400 ${pathname === item.href ? 'text-purple-400' : ''}`}
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </Link>
            </Button>
          ))}

          {/* Rewards Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
              // className={`text-gray-300 hover:text-purple-400 ${pathname.startsWith('/rewards') ? 'text-purple-400' : ''}`}
              >
                <Gift className="w-4 h-4 mr-1" />
                Rewards
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56 bg-gray-900 border-gray-800 text-white">
              {rewardsItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="focus:bg-gray-800 focus:text-white cursor-pointer">
                  <Link href={item.href} className="w-full flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && <RewardPoints />}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </form>


        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400">
                  <User className="w-4 h-4 mr-2" />
                  {user.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3 border-b">
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                  </div>
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/messages" className="w-full cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/gallery" className="w-full cursor-pointer">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    <span>Gallery</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/rewards/history" className="w-full cursor-pointer">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>My Rewards</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-gray-300">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gray-800 border-gray-600">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  {/* Mobile Community Section */}
                  <div className="border-t border-gray-700 my-2 pt-2">
                    <div className="px-3 py-1 text-sm font-medium text-gray-300">Community</div>
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors text-sm"
                        >
                          <div className={`p-1 rounded-md ${category.color} bg-opacity-20`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-gray-400">{category.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}

                  {/* Mobile Rewards Section */}
                  <div className="border-t border-gray-700 my-2 pt-2">
                    <div className="px-3 py-1 text-sm font-medium text-gray-300">Rewards</div>
                    {rewardsItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors text-sm"
                        >
                          <Icon className="w-4 h-4 ml-1" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </nav>

                {/* Mobile User Actions */}
                {user ? (
                  <div className="border-t border-gray-600 pt-4 space-y-2">
                    <Link
                      href={`/profile/${user.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-900/20 transition-colors w-full text-left disabled:opacity-50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-600 pt-4 space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start text-gray-300">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
