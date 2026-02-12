"use client"

import { useState, useEffect } from "react"
import { Gift, ChevronDown, History, HelpCircle, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RewardPoints() {
  const [points, setPoints] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Set fixed demo points to 1000
    const fetchPoints = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 200))
        // Fixed demo points
        setPoints(580)
      } catch (error) {
        console.error("Failed to fetch reward points:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoints()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800/50">
        <div className="h-5 w-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-600/20 hover:to-amber-600/20 transition-colors group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Zap className={`w-4 h-4 ${isHovered ? 'text-yellow-300' : 'text-yellow-400'} transition-colors`} />
          <span className="text-sm font-medium text-yellow-100">
            {isLoading ? '...' : points.toLocaleString()}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isHovered ? 'text-yellow-300' : 'text-yellow-400/70'}`} />
          <div className={`absolute inset-0 rounded-full bg-yellow-400/10 ${isHovered ? 'animate-ping' : 'hidden'}`}></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-900 border border-yellow-100 dark:border-yellow-900/50 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 border-b border-yellow-100 dark:border-yellow-900/30">
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">Available Points</p>
          <div className="flex items-baseline mt-1">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-300">{points.toLocaleString()}</p>
          </div>
          <div className="w-full bg-yellow-100 dark:bg-yellow-900/30 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" 
              style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 text-right">
            {Math.floor((points / 1000) * 100)}% to next tier
          </p>
        </div>
        
        <Link href="/rewards" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer group hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
            <div className="w-full flex items-center px-4 py-3">
              <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors">
                <Gift className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Rewards Store</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Redeem your points</p>
              </div>
            </div>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/rewards/history" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer group hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
            <div className="w-full flex items-center px-4 py-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <History className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Reward History</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">View your transactions</p>
              </div>
            </div>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/rewards/faq" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer group hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
            <div className="w-full flex items-center px-4 py-3">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">How to Earn Points</p>
                <p className="text-xs text-green-600 dark:text-green-400">Learn & earn more</p>
              </div>
            </div>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
