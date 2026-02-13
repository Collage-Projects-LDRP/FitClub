"use client"

import { useState, useEffect } from "react"
import { getAllUsers, getUserById } from "@/lib/database"
import { UserCard } from "@/components/user-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award, Crown, Filter, TrendingUp, Users, Target, X, ChevronDown, LayoutGrid, List, MapPin, Calendar, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FilterOption {
  value: string;
  label: string;
  options?: FilterOption[];
  isRange?: boolean;
}

const filterOptions: FilterOption[] = [
  {
    value: 'category',
    label: 'Category',
    options: [
      { 
        value: 'all', 
        label: 'All Categories',
      },
      { 
        value: 'beach-body', 
        label: 'Beach Body',
        options: [
          { value: 'beach-body', label: 'All Beach Body' },
          { value: 'beach-body-male', label: 'Male' },
          { value: 'beach-body-female', label: 'Female' },
        ]
      },
      { 
        value: 'bikini-model', 
        label: 'Bikini Model',
        options: [
          { value: 'bikini-model', label: 'All Bikini Models' },
          { value: 'bikini-model-professional', label: 'Professional' },
          { value: 'bikini-model-amateur', label: 'Amateur' },
        ]
      },
      { 
        value: 'athletes-body', 
        label: 'Athletes Body',
        options: [
          { value: 'athletes-body', label: 'All Athletes' },
          { value: 'athletes-body-male', label: 'Male' },
          { value: 'athletes-body-female', label: 'Female' },
        ]
      },
      { 
        value: 'amateur-bodybuilder', 
        label: 'Amateur Body Builder',
        options: [
          { value: 'amateur-bodybuilder', label: 'All Amateurs' },
          { value: 'amateur-bodybuilder-male', label: 'Male' },
          { value: 'amateur-bodybuilder-female', label: 'Female' },
        ]
      },
      { 
        value: 'professional-bodybuilder', 
        label: 'Professional Body Builder',
        options: [
          { value: 'professional-bodybuilder', label: 'All Professionals' },
          { value: 'professional-bodybuilder-male', label: 'Male' },
          { value: 'professional-bodybuilder-female', label: 'Female' },
        ]
      },
      { 
        value: 'fitness-model', 
        label: 'Fitness Model / Competitor',
        options: [
          { value: 'fitness-model', label: 'All Fitness Models' },
          { value: 'fitness-model-male', label: 'Male' },
          { value: 'fitness-model-female', label: 'Female' },
        ]
      },
      { value: 'better-me', 
        label: 'Better Me',
        options: [
          { value: 'better-me', label: 'All Better Me' },
          { value: 'better-me-male', label: 'Male' },
          { value: 'better-me-female', label: 'Female' },
        ]
      },
    ],
  },
  {
    value: 'gender',
    label: 'Gender',
    options: [
      { value: 'all', label: 'All Genders' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    value: 'country',
    label: 'Country',
    options: [
      { value: 'all', label: 'All Countries' },
      { value: 'United States', label: 'United States' },
      { value: 'Canada', label: 'Canada' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'Australia', label: 'Australia' },
      { value: 'Germany', label: 'Germany' },
      { value: 'France', label: 'France' },
      { value: 'Italy', label: 'Italy' },
      { value: 'Spain', label: 'Spain' },
      { value: 'Brazil', label: 'Brazil' },
      { value: 'Mexico', label: 'Mexico' },
      { value: 'India', label: 'India' },
      { value: 'Japan', label: 'Japan' },
      { value: 'China', label: 'China' },
      { value: 'South Korea', label: 'South Korea' },
      { value: 'Russia', label: 'Russia' },
      { value: 'South Africa', label: 'South Africa' },
      { value: 'Nigeria', label: 'Nigeria' },
      { value: 'Egypt', label: 'Egypt' },
      { value: 'Saudi Arabia', label: 'Saudi Arabia' },
      { value: 'UAE', label: 'UAE' },
      { value: 'Turkey', label: 'Turkey' },
      { value: 'Netherlands', label: 'Netherlands' },
      { value: 'Sweden', label: 'Sweden' },
      { value: 'Switzerland', label: 'Switzerland' },
      { value: 'Norway', label: 'Norway' },
      { value: 'Denmark', label: 'Denmark' },
      { value: 'Finland', label: 'Finland' },
      { value: 'Belgium', label: 'Belgium' },
      { value: 'Austria', label: 'Austria' },
      { value: 'Portugal', label: 'Portugal' },
      { value: 'Greece', label: 'Greece' },
      { value: 'Poland', label: 'Poland' },
      { value: 'Ukraine', label: 'Ukraine' },
      { value: 'Romania', label: 'Romania' },
      { value: 'Hungary', label: 'Hungary' },
      { value: 'Czech Republic', label: 'Czech Republic' },
      { value: 'Ireland', label: 'Ireland' },
      { value: 'New Zealand', label: 'New Zealand' },
      { value: 'Singapore', label: 'Singapore' },
      { value: 'Thailand', label: 'Thailand' },
      { value: 'Indonesia', label: 'Indonesia' },
      { value: 'Malaysia', label: 'Malaysia' },
      { value: 'Philippines', label: 'Philippines' },
      { value: 'Vietnam', label: 'Vietnam' },
      { value: 'Argentina', label: 'Argentina' },
      { value: 'Chile', label: 'Chile' },
      { value: 'Colombia', label: 'Colombia' },
      { value: 'Peru', label: 'Peru' },
      { value: 'Venezuela', label: 'Venezuela' },
    ],
  },
  {
    value: 'state',
    label: 'State / Province',
    options: [
      { value: 'Alabama', label: 'Alabama' },
      { value: 'Alaska', label: 'Alaska' },
      { value: 'Arizona', label: 'Arizona' },
      { value: 'Arkansas', label: 'Arkansas' },
      { value: 'California', label: 'California' },
      { value: 'Colorado', label: 'Colorado' },
      { value: 'Connecticut', label: 'Connecticut' },
      { value: 'Delaware', label: 'Delaware' },
      { value: 'Florida', label: 'Florida' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Hawaii', label: 'Hawaii' },
      { value: 'Idaho', label: 'Idaho' },
      { value: 'Illinois', label: 'Illinois' },
      { value: 'Indiana', label: 'Indiana' },
      { value: 'Iowa', label: 'Iowa' },
      { value: 'Kansas', label: 'Kansas' },
      { value: 'Kentucky', label: 'Kentucky' },
      { value: 'Louisiana', label: 'Louisiana' },
      { value: 'Maine', label: 'Maine' },
      { value: 'Maryland', label: 'Maryland' },
      { value: 'Massachusetts', label: 'Massachusetts' },
      { value: 'Michigan', label: 'Michigan' },
      { value: 'Minnesota', label: 'Minnesota' },
      { value: 'Mississippi', label: 'Mississippi' },
      { value: 'Missouri', label: 'Missouri' },
      { value: 'Montana', label: 'Montana' },
      { value: 'Nebraska', label: 'Nebraska' },
      { value: 'Nevada', label: 'Nevada' },
      { value: 'New Hampshire', label: 'New Hampshire' },
      { value: 'New Jersey', label: 'New Jersey' },
      { value: 'New Mexico', label: 'New Mexico' },
      { value: 'New York', label: 'New York' },
      { value: 'North Carolina', label: 'North Carolina' },
      { value: 'North Dakota', label: 'North Dakota' },
      { value: 'Ohio', label: 'Ohio' },
      { value: 'Oklahoma', label: 'Oklahoma' },
      { value: 'Oregon', label: 'Oregon' },
      { value: 'Pennsylvania', label: 'Pennsylvania' },
      { value: 'Rhode Island', label: 'Rhode Island' },
      { value: 'South Carolina', label: 'South Carolina' },
      { value: 'South Dakota', label: 'South Dakota' },
      { value: 'Tennessee', label: 'Tennessee' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Utah', label: 'Utah' },
      { value: 'Vermont', label: 'Vermont' },
      { value: 'Virginia', label: 'Virginia' },
      { value: 'Washington', label: 'Washington' },
      { value: 'West Virginia', label: 'West Virginia' },
      { value: 'Wisconsin', label: 'Wisconsin' },
      { value: 'Wyoming', label: 'Wyoming' },
    ],
  },
  {
    value: 'city',
    label: 'City',
    options: [
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'Chicago', label: 'Chicago' },
      { value: 'Houston', label: 'Houston' },
      { value: 'Phoenix', label: 'Phoenix' },
      { value: 'Philadelphia', label: 'Philadelphia' },
      { value: 'San Antonio', label: 'San Antonio' },
      { value: 'San Diego', label: 'San Diego' },
      { value: 'Dallas', label: 'Dallas' },
      { value: 'San Jose', label: 'San Jose' },
      { value: 'Austin', label: 'Austin' },
      { value: 'Jacksonville', label: 'Jacksonville' },
      { value: 'Fort Worth', label: 'Fort Worth' },
      { value: 'Columbus', label: 'Columbus' },
      { value: 'Charlotte', label: 'Charlotte' },
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'Indianapolis', label: 'Indianapolis' },
      { value: 'Seattle', label: 'Seattle' },
      { value: 'Denver', label: 'Denver' },
      { value: 'Washington', label: 'Washington' },
      { value: 'Boston', label: 'Boston' },
      { value: 'El Paso', label: 'El Paso' },
      { value: 'Nashville', label: 'Nashville' },
      { value: 'Detroit', label: 'Detroit' },
      { value: 'Oklahoma City', label: 'Oklahoma City' },
      { value: 'Portland', label: 'Portland' },
      { value: 'Las Vegas', label: 'Las Vegas' },
      { value: 'Memphis', label: 'Memphis' },
      { value: 'Louisville', label: 'Louisville' },
      { value: 'Baltimore', label: 'Baltimore' },
      { value: 'Milwaukee', label: 'Milwaukee' },
      { value: 'Albuquerque', label: 'Albuquerque' },
      { value: 'Tucson', label: 'Tucson' },
      { value: 'Fresno', label: 'Fresno' },
      { value: 'Sacramento', label: 'Sacramento' },
      { value: 'Kansas City', label: 'Kansas City' },
      { value: 'Long Beach', label: 'Long Beach' },
      { value: 'Mesa', label: 'Mesa' },
      { value: 'Atlanta', label: 'Atlanta' },
      { value: 'Colorado Springs', label: 'Colorado Springs' },
      { value: 'Virginia Beach', label: 'Virginia Beach' },
      { value: 'Raleigh', label: 'Raleigh' },
      { value: 'Omaha', label: 'Omaha' },
      { value: 'Miami', label: 'Miami' },
      { value: 'Oakland', label: 'Oakland' },
      { value: 'Minneapolis', label: 'Minneapolis' },
      { value: 'Tulsa', label: 'Tulsa' },
      { value: 'Wichita', label: 'Wichita' },
      { value: 'New Orleans', label: 'New Orleans' },
      { value: 'Arlington', label: 'Arlington' },
    ],
  },
  {
    value: 'age',
    label: 'Age',
    isRange: true,
    options: [
      { value: '18-24', label: '18-24' },
      { value: '25-34', label: '25-34' },
      { value: '35-44', label: '35-44' },
      { value: '45-54', label: '45-54' },
      { value: '55-64', label: '55-64' },
      { value: '65+', label: '65+' },
    ],
  },
]

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "beach-body", label: "Beach Body" },
  { value: "bikini-model", label: "Bikini Model" },
  { value: "athletes-body", label: "Athletes Body" },
  { value: "amateur-bodybuilder", label: "Amateur Body Builder" },
  { value: "professional-bodybuilder", label: "Professional Body Builder" },
  { value: "fitness-model", label: "Fitness Model / Competitor" },
]

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({})
  const [selectedFilter, setSelectedFilter] = useState<string>("")
  const [showFilterDropdown, setShowFilterDropdown] = useState<string>("")
  const viewMode = 'list' // Only list view is supported
  const [selectedUser, setSelectedUser] = useState<any | null>({
    id: 'welcome',
    username: 'Max Willson',
    profile_image: 'https://intowellness.in/wp-content/uploads/2024/05/product-detail-banner.webp',
    rank: 'New',
    bio: 'Welcome to our fitness community! This is where you can explore top athletes, track your progress, and connect with like-minded fitness enthusiasts. Get started by browsing the leaderboard or create your profile to join the competition!',
    age: '',
    city: 'Join us',
    state: '',
    country: 'Worldwide',
    votes: 0,
    points: 0,
    extra: 'Welcome to FitClub',
    isNew: true
  })
  const [isScrolled, setIsScrolled] = useState(false)

  const addFilter = (type: string, value: string) => {
    // Close the dropdown first for immediate feedback
    setSelectedFilter("");
    
    // Handle age range specially
    if (type === 'age') {
      const [min, max] = value.split('-').map(Number)
      setActiveFilters(prev => ({
        ...prev,
        ageMin: min.toString(),
        ageMax: max ? max.toString() : '100',
      }))
      return
    }

    // Handle other filter types
    if (value === "all") {
      const newFilters = { ...activeFilters }
      delete newFilters[type]
      setActiveFilters(newFilters)
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [type]: value,
      }))
    }
  }

  const removeFilter = (type: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[type]
    setActiveFilters(newFilters)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        // Sort by vote count in descending order
        const sortedUsers = allUsers.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
        setUsers(sortedUsers)
        
        // Parse URL query parameters
        const params = new URLSearchParams(window.location.search)
        const initialFilters: { [key: string]: string } = {}
        
        params.forEach((value, key) => {
          if (['category', 'gender', 'country', 'state', 'city', 'age'].includes(key)) {
            initialFilters[key] = value
          }
        })
        
        // Apply initial filters if any
        if (Object.keys(initialFilters).length > 0) {
          setActiveFilters(initialFilters)
        } else {
          setFilteredUsers(sortedUsers)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    fetchUsers()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    let filtered = [...users]

    // Apply active filters
    Object.entries(activeFilters).forEach(([type, value]) => {
      if (type === 'ageMin' || type === 'ageMax') {
        // Skip here, we'll handle age range separately
        return
      }

      if (type === 'age') {
        const [min, max] = value.split("-").map(Number);
        filtered = filtered.filter((user) => {
          const age = user.age || 25;
          return max ? age >= min && age <= max : age >= min;
        });
      } else if (type === 'category') {
        // Handle category filters with subcategories
        filtered = filtered.filter((user) => {
          const userCategory = user.physique_category || '';
          return userCategory.includes(value.replace(/-\w+$/, ''));
        });
      } else {
        filtered = filtered.filter((user) => user[type] === value);
      }
    });

    // Handle age range filter
    if (activeFilters.ageMin || activeFilters.ageMax) {
      const minAge = parseInt(activeFilters.ageMin || '18', 10);
      const maxAge = parseInt(activeFilters.ageMax || '100', 10);
      filtered = filtered.filter((user) => {
        const age = user.age || 25;
        return age >= minAge && age <= maxAge;
      });
    }

    setFilteredUsers(filtered);
  }, [activeFilters, users]);

  const handleUserClick = (e: React.MouseEvent, user: any) => {
    e.preventDefault();
    e.stopPropagation();
    // For the welcome user or users without a valid ID, mark as new
    if (!user.id || user.id === 'welcome') {
      setSelectedUser({
        ...user,
        isNew: true
      });
    } else {
      // For other users, check if they exist in the database
      const userExists = users.some(u => u.id === user.id);
      setSelectedUser({
        ...user,
        isNew: !userExists
      });
    }
  };

  const closeProfilePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(null);
  };

  const handleFilterClick = (filterType: string) => {
    setShowFilterDropdown(showFilterDropdown === filterType ? "" : filterType);
  };

  const applyFilter = (type: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...activeFilters };
      delete newFilters[type];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [type]: value
      }));
    }
    setShowFilterDropdown("");
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Leaderboard */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                    <h1 className="text-2xl font-bold">Leaderboard</h1>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">Filter By:</span>
                    
                    {/* Filter Buttons */}
                    {filterOptions.map((filter) => (
                      <div key={filter.value} className="relative">
                        <button
                          onClick={() => handleFilterClick(filter.value)}
                          className={`flex items-center px-3 py-1.5 text-sm rounded-full border ${
                            activeFilters[filter.value] 
                              ? 'border-purple-500 bg-purple-500/20 text-white' 
                              : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                          }`}
                        >
                          {filter.label}
                          <ChevronDown className="ml-1 w-4 h-4" />
                        </button>

                        {/* Filter Dropdown */}
                        {showFilterDropdown === filter.value && (
                          <div className="absolute left-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                            <div className="p-2 space-y-1">
                              {filter.options?.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => applyFilter(filter.value, option.value)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded ${
                                    activeFilters[filter.value] === option.value
                                      ? 'bg-purple-600 text-white'
                                      : 'text-gray-300 hover:bg-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Active Filters Chips - Moved to bottom */}
                  {Object.entries(activeFilters).filter(([_, value]) => value).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-700">
                      <span className="text-sm font-medium text-gray-400">Active Filters:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(activeFilters).map(([key, value]) => {
                          if (!value) return null;
                          const filter = filterOptions.find(f => f.value === key);
                          const option = filter?.options?.find(opt => opt.value === value);
                          return (
                            <div
                              key={`${key}-${value}`}
                              className="flex items-center px-2.5 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-600"
                            >
                              {option?.label || value}
                              <button
                                onClick={() => applyFilter(key, 'all')}
                                className="ml-1.5 text-gray-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center ml-2"
                        >
                          <X className="w-3.5 h-3.5 mr-1" /> Clear all
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Leaderboard Content */}
            <div className="space-y-2">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className="bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border-l-4 border-transparent hover:border-purple-500 transition-all duration-200 rounded-lg p-4 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-8 text-center">
                      <span className="text-lg font-medium text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                    <Link 
                      href={`/profile/${user.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-gray-800 transition-all"
                    >
                      <Image
                        src={user.profile_image || '/default-avatar.png'}
                        alt={user.username}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <Link 
                          href={`/profile/${user.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-lg truncate hover:text-purple-400 transition-colors"
                        >
                          {user.username}
                        </Link>
                      </div>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-sm text-purple-400 font-medium">
                          {user.physique_category || 'Athlete'}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400">
                          {user.city || 'Unknown'}{user.state ? `, ${user.state}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto text-right flex-shrink-0">
                      <div className="text-purple-400 font-bold text-lg">
                        {user.votes || user.vote_count || 0}
                      </div>
                      <div className="text-xs text-gray-400">
                        votes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Profile Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              {/* Large Square Profile Image with Border */}
              <div className="relative p-4">
                <h3 className="text-2xl font-bold text-center mb-4">{selectedUser.extra}</h3>
                <Link 
                  href={selectedUser.isNew ? '/profile/new' : `/profile/${selectedUser.id}`}
                  className="block relative w-full aspect-square overflow-hidden border-4 border-white/30 rounded-lg hover:border-purple-500 transition-all duration-200"
                >
                  <Image 
                    src={selectedUser.profile_image || '/default-avatar.png'} 
                    alt={selectedUser.username}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    priority
                  />
                  {/* Profile Badge Overlay */}
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {selectedUser.physique_category || 'Athlete'}
                  </div>
                </Link>
              </div>
              
              <div className="px-6 pb-6 pt-4">
                {selectedUser ? (
                  <>
                    <div className="text-center mb-6">
                      <Link 
                        href={selectedUser.isNew ? '/profile/new' : `/profile/${selectedUser.id}`}
                        className="text-2xl font-bold hover:text-purple-400 transition-colors inline-block"
                      >
                        {selectedUser.username}
                      </Link>
                      <div className="flex items-center justify-center space-x-3 mt-2">
                        <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium">
                          Rank #{selectedUser.rank || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{selectedUser.votes || '0'}</div>
                        <div className="text-xs text-gray-400">Votes</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{selectedUser.followers || '0'}</div>
                        <div className="text-xs text-gray-400">Followers</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-pink-400">{selectedUser.posts || '0'}</div>
                        <div className="text-xs text-gray-400">Posts</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress to next rank</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* About Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center">
                        <span className="w-1 h-4 bg-purple-500 rounded-full mr-2"></span>
                        About Me
                      </h4>
                      <p className="text-gray-300">
                        {selectedUser.bio || 'No bio available. This user prefers to keep an air of mystery about them.'}
                      </p>
                    </div>
                    
                    {/* Details Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center">
                        <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                        Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-400">Age:</span>
                          <span className="ml-auto">{selectedUser.age || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-400">Location:</span>
                          <span className="ml-auto">
                            {[selectedUser.city, selectedUser.state]
                              .filter(Boolean)
                              .join(', ') || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* View Full Profile Button */}
                    <div className="mt-6">
                      <Link 
                        href={selectedUser.isNew ? '/profile/new' : `/profile/${selectedUser.id}`}
                        className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/20"
                      >
                        {selectedUser.isNew ? 'Create Your Profile' : 'View Full Profile'}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium">Welcome to the Leaderboard</h3>
                    <p className="text-gray-400 mt-2">Select an athlete to view their profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
