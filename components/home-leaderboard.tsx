"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, X, ChevronDown, ChevronRight, Filter } from "lucide-react"

interface User {
  id: number
  name: string
  username: string
  avatar: string
  profile_image?: string
  country?: string
  state?: string
  city?: string
  age?: number
  gender?: string
  physique_category?: string
  vote_count?: number
  monthly_votes?: number
}

interface HomeLeaderboardProps {
  users: User[]
}

interface FilterOption {
  value: string;
  label: string;
  options?: Array<{ value: string; label: string }> | string[];
  isRange?: boolean;
}

const filterOptions: FilterOption[] = [
  {
    value: 'category',
    label: 'Category',
    options: [
      { value: 'all', label: 'All Categories' },
      { value: 'beach-body', label: 'Beach Body' },
      { value: 'bikini-model', label: 'Bikini Model' },
      { value: 'athletes-body', label: 'Athletes Body' },
      { value: 'amateur-bodybuilder', label: 'Amateur Body Builder' },
      { value: 'professional-bodybuilder', label: 'Professional Body Builder' },
      { value: 'fitness-model', label: 'Fitness Model / Competitor' },
      { value: 'better-me', label: 'Better Me' },
    ],
  },
  {
    value: 'gender',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    value: 'country',
    label: 'Country',
    options: [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Italy',
      'Spain',
      'Brazil',
      'Mexico',
      'India',
      'Japan',
    ],
  },
  {
    value: 'state',
    label: 'State',
    options: [
      'California',
      'Texas',
      'Florida',
      'New York',
      'Illinois',
      'Pennsylvania',
      'Ohio',
      'Georgia',
      'North Carolina',
      'Michigan',
      'New Jersey',
      'Virginia',
    ],
  },
  {
    value: 'city',
    label: 'City',
    options: [
      'Los Angeles',
      'New York City',
      'Chicago',
      'Houston',
      'Phoenix',
      'Philadelphia',
      'San Antonio',
      'San Diego',
      'Dallas',
      'San Jose',
      'Austin',
      'Jacksonville',
    ],
  },
  {
    value: 'age',
    label: 'Age Range',
    isRange: true,
  },
];

type FilterKey = 'category' | 'country' | 'state' | 'city' | 'age' | 'gender';

type Filters = {
  [key in FilterKey]?: string;
};

export default function HomeLeaderboard({ users: initialUsers }: HomeLeaderboardProps) {
  // Initialize with default filters that will be shown as active
  const [filters, setFilters] = useState<Filters>({})
  const [selectedFilter, setSelectedFilter] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  
  // Show top 15 users without filtering on the homepage
  const displayedUsers = initialUsers.slice(0, 15)
  
  // Get active filters display (exclude empty or 'all' values)
  const activeFiltersDisplay = (Object.entries(filters) as [FilterKey, string][])
    .filter(([_, value]) => value && value !== 'all')
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
      value: value.toString()
    }))

  // Add or update a filter
  const addFilter = (key: string, value: string) => {
    if (value === "all") {
      const newFilters = { ...filters }
      delete newFilters[key as FilterKey]
      setFilters(newFilters)
      setActiveFilters((prev: Record<string, string>) => {
        const newActive = { ...prev }
        delete newActive[key]
        return newActive
      })
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value,
      }))
      setActiveFilters((prev: Record<string, string>) => ({
        ...prev,
        [key]: value,
      }))
    }
    setSelectedFilter("")
  }

  // Remove a filter
  const removeFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key as FilterKey]
    setFilters(newFilters)
    setActiveFilters((prev: Record<string, string>) => {
      const newActive = { ...prev }
      delete newActive[key]
      return newActive
    })
  }

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400 to-yellow-600 text-black"
      case 1: return "from-gray-300 to-gray-500 text-black"
      case 2: return "from-amber-600 to-amber-800 text-white"
      default: return "from-purple-500 to-purple-700 text-white"
    }
  }

  const buildQueryString = () => {
    const params = new URLSearchParams()
    
    // Include all active filters in the query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Handle age range format
        if (key === 'age' && value.includes('-')) {
          params.append('age', value)
        } else if (value !== 'all') {
          params.append(key, value.toString())
        }
      }
    })
    
    return params.toString()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isFilterButton = target.closest(`[data-filter-button]`);
      const isDropdown = target.closest(`[data-dropdown]`);
      
      if (selectedFilter && !isFilterButton && !isDropdown) {
        setSelectedFilter('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedFilter]);

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
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
                  activeFiltersDisplay.some(f => f.key === filter.value) || selectedFilter === filter.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{filter.label}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {selectedFilter === filter.value && (
                <div 
                  data-dropdown={filter.value}
                  className="absolute right-0 z-50 mt-1 w-56 bg-gray-800 rounded-md shadow-lg p-2 border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Dropdown content */}
                  {filter.value === 'age' ? (
                    <div className="space-y-2 p-2">
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min age" className="w-full bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm" />
                        <span className="text-gray-400 text-xs">to</span>
                        <input type="number" placeholder="Max age" className="w-full bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm" />
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
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {filter.options?.map((option) => {
                        const value = typeof option === 'string' ? option : option.value
                        const label = typeof option === 'string' ? option : option.label
                        return (
                          <button
                            key={value}
                            onClick={(e) => {
                              e.stopPropagation();
                              addFilter(filter.value, value);
                              setSelectedFilter('');
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-gray-700"
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <Button 
            onClick={() => {
              const queryString = buildQueryString()
              window.location.href = `/leaderboard${queryString ? `?${queryString}` : ''}`
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm h-9 px-4"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersDisplay.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFiltersDisplay.map((filter) => (
            <div 
              key={`${filter.key}-${filter.value}`}
              className="flex items-center bg-gray-700 text-white text-sm rounded-full px-3 py-1"
            >
              <span className="font-medium">{filter.label}: {filter.value}</span>
              <button 
                onClick={() => removeFilter(filter.key)}
                className="ml-2 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {displayedUsers.map((user: User, index: number) => (
          <div key={user.id} className="group relative">
            <Link href={`/profile/${user.id}`} className="block h-full">
            <Card className="bg-gray-900 border-gray-700 overflow-hidden transition-transform duration-300 hover:scale-105 h-full">
              <div className="relative aspect-[3/4] w-full">
                <img
                  src={user.profile_image || "/placeholder-user.jpg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute -top-3 -left-3 z-10 w-14 h-14 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-gray-900 border-2 border-purple-500/50 group-hover:border-purple-400/70 transition-all duration-300`}>
                    <span className="text-xl font-extrabold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h3 className="text-white font-semibold">{user.username}</h3>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <span>{user.vote_count || 0} votes</span>
                  </div>
                </div>
              </div>
            </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
