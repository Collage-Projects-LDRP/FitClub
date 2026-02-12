"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { filterUsers } from "@/lib/database"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import {
  Waves,
  Crown,
  Trophy,
  Dumbbell,
  Star,
  Target,
  TrendingUp,
  Users,
  Award,
  Filter,
  ChevronDown,
  X,
} from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryMap: Record<string, string> = {
  "beach-body": "beach-body",
  "bikini-model": "bikini-model",
  "athletes-body": "athletes-body",
  "amateur-bodybuilder": "amateur-bodybuilder",
  "professional-bodybuilder": "professional-bodybuilder",
  "fitness-model": "fitness-model",
  "better-me": "better-me",
  beachbody: "beach-body",
  bikini: "bikini-model",
  athlete: "athletes-body",
  bodybuilder: "bodybuilder",
  powerlifter: "powerlifter",
  physique: "physique",
  crossfit: "crossfit",
  endurance: "endurance",
  general: "general",
  yoga: "yoga",
  functional: "functional",
  sports: "sports",
}

const categoryNames: Record<string, string> = {
  "beach-body": "Beach Body",
  "bikini-model": "Bikini Model",
  "athletes-body": "Athlete's Body",
  "amateur-bodybuilder": "Amateur BodyBuilder",
  "professional-bodybuilder": "Professional Bodybuilder",
  "fitness-model": "Fitness Competitor / Model",
  "better-me": "Better Me",
  beachbody: "Beach Body",
  bikini: "Bikini Model",
  athlete: "Athlete's Body",
  bodybuilder: "Bodybuilding",
  powerlifter: "Powerlifting",
  physique: "Physique",
  crossfit: "CrossFit",
  endurance: "Endurance",
  general: "General Fitness",
  yoga: "Yoga",
  functional: "Functional Fitness",
  sports: "Sports",
}

const categoryDescriptions: Record<string, string> = {
  "beach-body":
    "Summer ready physiques and beach workouts. Athletes who train for that perfect beach body look with outdoor fitness routines.",
  "bikini-model":
    "Competition ready bikini physiques. Female athletes competing in bikini divisions with focus on symmetry and conditioning.",
  "athletes-body":
    "Athletic performance and sports conditioning. Multi-sport athletes focused on peak performance and functional strength.",
  "amateur-bodybuilder":
    "Aspiring bodybuilders building muscle mass. Dedicated athletes working towards their first competitions.",
  "professional-bodybuilder":
    "Elite level competitive bodybuilders. Seasoned competitors with years of experience and multiple titles.",
  "fitness-model":
    "Fitness models and competition athletes. Athletes who combine aesthetics with athletic performance.",
  "better-me":
    "For those who want to improve their physique without chasing extreme muscle growth. Focused on healthy weight management, toning, and overall well-being to become the best version of themselves.",
  beachbody:
    "Summer ready physiques and beach workouts. Athletes who train for that perfect beach body look with outdoor fitness routines.",
  bikini:
    "Competition ready bikini physiques. Female athletes competing in bikini divisions with focus on symmetry and conditioning.",
  athlete:
    "Athletic performance and sports conditioning. Multi-sport athletes focused on peak performance and functional strength.",
  bodybuilder: "Classic bodybuilding focused on muscle mass, symmetry, and conditioning for competitive success.",
  powerlifter: "Strength athletes focused on the big three lifts: squat, bench press, and deadlift.",
  physique: "Aesthetic physique development with focus on V-taper, conditioning, and stage presentation.",
  crossfit: "Functional fitness athletes competing in varied, high-intensity workouts.",
  endurance: "Cardiovascular athletes specializing in running, cycling, and endurance sports.",
  general: "General fitness enthusiasts focused on overall health and wellness.",
  yoga: "Mind-body connection specialists teaching flexibility, balance, and mindfulness.",
  functional: "Movement specialists focused on real-world strength and mobility.",
  sports: "Sport-specific athletes excelling in their chosen disciplines.",
}

const categoryIcons: Record<string, any> = {
  "beach-body": Waves,
  "bikini-model": Crown,
  "athletes-body": Trophy,
  "amateur-bodybuilder": Dumbbell,
  "professional-bodybuilder": Star,
  "fitness-model": Target,
  "better-me": TrendingUp,
  beachbody: Waves,
  bikini: Crown,
  athlete: Trophy,
  bodybuilder: Dumbbell,
  powerlifter: Award,
  physique: Target,
  crossfit: TrendingUp,
  endurance: TrendingUp,
  general: Users,
  yoga: Target,
  functional: Award,
  sports: Trophy,
}

const categoryColors: Record<string, string> = {
  "beach-body": "bg-gradient-to-r from-blue-500 to-green-500",
  "bikini-model": "bg-gradient-to-r from-pink-500 to-red-500",
  "athletes-body": "bg-gradient-to-r from-yellow-500 to-orange-500",
  "amateur-bodybuilder": "bg-gradient-to-r from-gray-500 to-black",
  "professional-bodybuilder": "bg-gradient-to-r from-purple-500 to-indigo-500",
  "fitness-model": "bg-gradient-to-r from-teal-500 to-cyan-500",
  "better-me": "bg-gradient-to-r from-green-500 to-teal-500",
  beachbody: "bg-gradient-to-r from-blue-500 to-green-500",
  bikini: "bg-gradient-to-r from-pink-500 to-red-500",
  athlete: "bg-gradient-to-r from-yellow-500 to-orange-500",
  bodybuilder: "bg-gradient-to-r from-gray-500 to-black",
  powerlifter: "bg-gradient-to-r from-purple-500 to-indigo-500",
  physique: "bg-gradient-to-r from-teal-500 to-cyan-500",
  crossfit: "bg-gradient-to-r from-blue-500 to-green-500",
  endurance: "bg-gradient-to-r from-pink-500 to-red-500",
  general: "bg-gradient-to-r from-yellow-500 to-orange-500",
  yoga: "bg-gradient-to-r from-gray-500 to-black",
  functional: "bg-gradient-to-r from-purple-500 to-indigo-500",
  sports: "bg-gradient-to-r from-teal-500 to-cyan-500",
}

// Sample data for filters
const sampleCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Brazil",
  "Mexico",
  "India",
  "Japan",
]

const sampleStates = [
  "California",
  "Texas",
  "Florida",
  "New York",
  "Illinois",
  "Pennsylvania",
  "Ohio",
  "Georgia",
  "North Carolina",
  "Michigan",
  "New Jersey",
  "Virginia",
]

const sampleCities = [
  "Los Angeles",
  "New York City",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
]

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string>("")
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const addFilter = (type: string, value: string | number) => {
    const valueStr = String(value);
    
    if (valueStr === 'all') {
      const newFilters = { ...activeFilters };
      delete newFilters[type];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [type]: valueStr
      }));
    }
    setSelectedFilter('');
  }

  const removeFilter = (type: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[type]
    setActiveFilters(newFilters)
  }

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    const mappedCategory = categoryMap[slug]
    if (!mappedCategory) {
      notFound()
    }

    // Get all users in the category with filters applied
    let categoryUsers = filterUsers(mappedCategory, activeFilters)

    // Special filtering for specific categories
    if (slug === "bikini-model" || slug === "bikini") {
      categoryUsers = categoryUsers.filter((user) => user.gender === "female")
    } else if (slug === "amateur-bodybuilder") {
      // Show all users with the amateur-bodybuilder category
      categoryUsers = categoryUsers.filter((user) => user.physique_category === "amateur-bodybuilder")
    } else if (slug === "professional-bodybuilder") {
      // Filter for professional bodybuilders (30 or more votes)
      categoryUsers = categoryUsers.filter((user) => (user.votes || user.vote_count || 0) >= 30)
    }

    setUsers(categoryUsers)
    setFilteredUsers(categoryUsers)
    setLoading(false)
  }, [slug, activeFilters])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading category...</p>
        </div>
      </div>
    )
  }

  const mappedCategory = categoryMap[slug]
  if (!mappedCategory) {
    notFound()
  }

  const categoryName = categoryNames[slug]
  const categoryDescription = categoryDescriptions[slug]
  const CategoryIcon = categoryIcons[slug]
  const categoryColor = categoryColors[slug]

  // Get different user groups
  const topPerformers = filteredUsers.slice(0, 10)
  const trendingUsers = filteredUsers.filter((user) => (user.monthly_votes || 0) > 2).slice(0, 10)
  const allCategoryUsers = filteredUsers.slice(0, 20)

  const ScrollableRow = ({ title, users, scrollPosition, scrollType, icon: Icon }: any) => (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center mb-4 px-4 sm:px-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-purple-400" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{title}</h2>
      </div>
      <div className="relative group px-4 sm:px-0">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {users.map((user: any) => (
              <Link key={user.id} href={`/profile/${user.id}`}>
                <div className="flex-shrink-0 w-48 bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={user.profile_image || "/placeholder.svg"}
                      alt={user.username}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">{user.username}</h3>
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
      </div>
    </div>
  )

  // Sample filter options data
  const filterOptions = [
    { 
      value: 'country', 
      label: 'Country',
      options: [
        { value: 'all', label: 'All Countries' },
        { value: 'United States', label: 'United States' },
        { value: 'Canada', label: 'Canada' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'Australia', label: 'Australia' }
      ]
    },
    { 
      value: 'state', 
      label: 'State',
      options: [
        { value: 'all', label: 'All States' },
        { value: 'California', label: 'California' },
        { value: 'Texas', label: 'Texas' },
        { value: 'Florida', label: 'Florida' },
        { value: 'New York', label: 'New York' }
      ]
    },
    { 
      value: 'city', 
      label: 'City',
      options: [
        { value: 'all', label: 'All Cities' },
        { value: 'Los Angeles', label: 'Los Angeles' },
        { value: 'New York', label: 'New York' },
        { value: 'Chicago', label: 'Chicago' },
        { value: 'Houston', label: 'Houston' }
      ]
    },
    {
      value: 'age',
      label: 'Age',
      options: [
        { value: '18-25', label: '18-25' },
        { value: '26-35', label: '26-35' },
        { value: '36-45', label: '36-45' },
        { value: '46-55', label: '46-55' },
        { value: '56-100', label: '56+' }
      ]
    },
    {
      value: 'gender',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    }
  ]

  const getFilterLabel = (type: string, value: string) => {
    if (type === "age") return `Age: ${value}`
    if (type === "gender") return `Gender: ${value.charAt(0).toUpperCase() + value.slice(1)}`
    return `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className={`absolute inset-0 ${categoryColor} opacity-10`} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-full bg-gradient-to-r ${categoryColor} mr-4`}>
                <CategoryIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="text-lg sm:text-xl px-4 py-2 bg-gray-800 text-white border-gray-700"
              >
                {categoryName}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">{categoryName}</h1>

            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8">
              {categoryDescription}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                <span className="text-gray-300">{filteredUsers.length} Athletes</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                <span className="text-gray-300">{trendingUsers.length} Trending</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                <span className="text-gray-300">Top Ranked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-sm text-gray-400 hidden md:inline">Filter By:</span>
            {filterOptions.map((filter) => (
              <div key={filter.value} className="relative">
                <button
                  data-filter-button={filter.value}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFilter(selectedFilter === filter.value ? '' : filter.value)
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                    Object.keys(activeFilters).includes(filter.value) || selectedFilter === filter.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filter.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {selectedFilter === filter.value && (
                  <div 
                    data-dropdown={filter.value}
                    className="absolute right-0 z-50 mt-1 w-56 bg-gray-800 rounded-md shadow-lg p-2 border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {filter.value === 'age' ? (
                      <div className="space-y-2 p-2">
                        <div className="flex items-center gap-2">
                          <input type="number" placeholder="Min age" className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded" />
                          <span className="text-gray-400">to</span>
                          <input type="number" placeholder="Max age" className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const minInput = document.querySelector(`input[placeholder="Min age"]`) as HTMLInputElement;
                            const maxInput = document.querySelector(`input[placeholder="Max age"]`) as HTMLInputElement;
                            if (minInput?.value || maxInput?.value) {
                              addFilter('age', `${minInput?.value || '18'}-${maxInput?.value || '100'}`);
                              setSelectedFilter('');
                            }
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-4 rounded-md text-xs"
                        >
                          Apply Age Range
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filter.options?.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              addFilter(filter.value, opt.value);
                              setSelectedFilter('');
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-gray-700 text-gray-200 whitespace-nowrap"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={() => {
                // Clear all filters
                Object.keys(activeFilters).forEach(key => removeFilter(key));
              }}
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {Object.entries(activeFilters).map(([type, value]) => (
              <div key={type} className="flex items-center bg-purple-600/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                <span className="text-purple-200">{getFilterLabel(type, value)}</span>
                <button 
                  onClick={() => removeFilter(type)} 
                  className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-purple-500/30"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Netflix-style Scrollable Rows */}
        {topPerformers.length > 0 && (
          <ScrollableRow
            title="Top Performers"
            users={topPerformers}
            scrollPosition={0}
            scrollType="top"
            icon={Trophy}
          />
        )}

        {trendingUsers.length > 0 && (
          <ScrollableRow
            title="Trending Athletes"
            users={trendingUsers}
            scrollPosition={0}
            scrollType="trending"
            icon={TrendingUp}
          />
        )}

        <ScrollableRow
          title={`All ${categoryName}`}
          users={allCategoryUsers}
          scrollPosition={0}
          scrollType="all"
          icon={CategoryIcon}
        />

        {/* Category Stats */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">{filteredUsers.length}</div>
              <div className="text-gray-300 text-sm sm:text-base">Filtered</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">{trendingUsers.length}</div>
              <div className="text-gray-300 text-sm sm:text-base">Trending Now</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                {filteredUsers.reduce((sum, user) => sum + (user.vote_count || 0), 0)}
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Total Votes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
