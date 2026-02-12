"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { getLeaderboard } from "@/lib/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HeroBanner() {
  const [sortBy, setSortBy] = useState("most-votes")

  // Get athletes and sort based on selection
  const getAllAthletes = () => {
    const athletes = getLeaderboard(16)

    switch (sortBy) {
      case "most-votes":
        return athletes.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      case "least-votes":
        return athletes.sort((a, b) => (a.vote_count || 0) - (b.vote_count || 0))
      case "most-monthly":
        return athletes.sort((a, b) => (b.monthly_votes || 0) - (a.monthly_votes || 0))
      case "newest":
        return athletes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case "oldest":
        return athletes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      default:
        return athletes
    }
  }

  const topAthletes = getAllAthletes()

  return (
    <section className="bg-black text-white py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with title and filter */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Discover. Vote. Inspire.</h1>
            <p className="text-gray-300 text-lg">Where champions rise and communities thrive</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="most-votes" className="text-white hover:bg-gray-700">
                  Most Votes
                </SelectItem>
                <SelectItem value="least-votes" className="text-white hover:bg-gray-700">
                  Least Votes
                </SelectItem>
                <SelectItem value="most-monthly" className="text-white hover:bg-gray-700">
                  Top This Month
                </SelectItem>
                <SelectItem value="newest" className="text-white hover:bg-gray-700">
                  Newest
                </SelectItem>
                <SelectItem value="oldest" className="text-white hover:bg-gray-700">
                  Oldest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top row - 8 athletes */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {topAthletes.slice(0, 8).map((athlete, index) => (
            <Link key={athlete.id} href={`/profile/${athlete.id}`}>
              <div className="relative group cursor-pointer">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-red-600 bg-gray-900">
                  <Image
                    src={athlete.profile_image || "/placeholder.svg"}
                    alt={athlete.username}
                    width={200}
                    height={267}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    crossOrigin="anonymous"
                  />

                  {/* Diagonal lines accent */}
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 opacity-60">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
                        <path d="M4 4L20 20M4 8L16 20M4 12L12 20M4 16L8 20" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Vote counts */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <div className="bg-white text-black px-2 py-1 rounded">{athlete.vote_count || 0}</div>
                      <div className="bg-red-600 text-white px-2 py-1 rounded">{athlete.monthly_votes || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom row - 8 more athletes */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {topAthletes.slice(8, 16).map((athlete, index) => (
            <Link key={athlete.id} href={`/profile/${athlete.id}`}>
              <div className="relative group cursor-pointer">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-red-600 bg-gray-900">
                  <Image
                    src={athlete.profile_image || "/placeholder.svg"}
                    alt={athlete.username}
                    width={200}
                    height={267}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    crossOrigin="anonymous"
                  />

                  {/* Diagonal lines accent */}
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 opacity-60">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
                        <path d="M4 4L20 20M4 8L16 20M4 12L12 20M4 16L8 20" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Vote counts */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <div className="bg-white text-black px-2 py-1 rounded">{athlete.vote_count || 0}</div>
                      <div className="bg-red-600 text-white px-2 py-1 rounded">{athlete.monthly_votes || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white rounded"></div>
            <span>YTD Votes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>This Month</span>
          </div>
        </div>
      </div>
    </section>
  )
}
