// Mock database for Vercel deployment - No SQLite dependencies
// This provides full functionality using in-memory data

export interface User {
  id: number
  username: string
  email: string
  profile_image: string
  bio: string
  physique_category: string
  gender: string
  created_at: string
  vote_count?: number
  monthly_votes?: number
  reward_points: number
  total_earned_points: number
  age?: number
  country?: string
  state?: string
  city?: string
  location?: string
  votes?: number
  rank?: number
}

export interface Vote {
  id: number
  voter_id: number
  voted_for_id: number
  created_at: string
}

export interface Photo {
  id: number
  user_id: number
  url: string
  caption: string
  created_at: string
}

export interface Content {
  id: number
  user_id: number
  title: string
  type: "workout" | "recipe"
  description: string
  file_url?: string
  created_at: string
}

export interface Reward {
  id: number
  name: string
  description: string
  points_required: number
  image_url: string
  category: 'trip' | 'product' | 'consultation' | 'other'
  stock: number
  created_at: string
  is_active?: boolean
}

export interface UserReward {
  id: number
  user_id: number
  reward_id: number
  claimed_at: string
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number?: string
  shipped_at?: string | null
  delivered_at?: string | null
}

export interface RewardTransaction {
  id: number
  user_id: number
  points: number
  type: 'earn' | 'redeem' | 'expire' | 'adjust'
  description: string
  reference_id?: number // reward_id for redemptions, content_id for earning points
  created_at: string
}

// Type alias for compatibility
export type DatabaseUser = User

// Updated mockUsers with new categories and more diverse profiles
const mockUsers: User[] = [
  // Beach Body
  {
    id: 1,
    username: "BeachVibes",
    email: "beach@example.com",
    profile_image: "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/05/Muscular-Asian-Man-With-Abs-In-The-Ocean.jpg?quality=86&strip=all",
    bio: "Beach body specialist. Summer ready year-round! Surf, sand, and fitness.",
    physique_category: "beach-body",
    gender: "male",
    created_at: "2024-02-06T00:00:00Z",
    age: 26,
    country: "United States",
    state: "California",
    city: "Los Angeles",
    location: "Los Angeles, CA",
    votes: 245,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 2,
    username: "SunKissedFit",
    email: "sunkissed@example.com",
    profile_image: "https://i.ytimg.com/vi/Y-yv4b_3J6o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD1uGRcfpVkElayGYekNUzizKbd5A",
    bio: "Beach workouts and outdoor fitness. Living the beach lifestyle every day!",
    physique_category: "beach-body",
    gender: "male",
    created_at: "2024-02-07T00:00:00Z",
    age: 24,
    country: "United States",
    state: "Florida",
    city: "Miami",
    location: "Miami, FL",
    votes: 189,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Bikini Model
  {
    id: 3,
    username: "BikiniBabe",
    email: "bikini@example.com",
    profile_image: "https://shotkit.com/wp-content/uploads/2021/07/alexi-romano-hip-pop.jpg",
    bio: "Bikini competitor and nutrition coach. Helping women achieve their goals.",
    physique_category: "bikini-model",
    gender: "female",
    created_at: "2024-01-10T00:00:00Z",
    age: 25,
    country: "United States",
    state: "California",
    city: "San Diego",
    location: "San Diego, CA",
    votes: 312,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 4,
    username: "CompetitionQueen",
    email: "queen@example.com",
    profile_image: "https://www.beachbunnyswimwear.com/cdn/shop/files/ICONTRI_ICONSKIMPY_PINK_2.jpg?v=1750354607&width=320",
    bio: "Professional bikini competitor with 5 years experience.",
    physique_category: "bikini-model",
    gender: "female",
    created_at: "2024-01-12T00:00:00Z",
    age: 28,
    country: "United States",
    state: "Texas",
    city: "Austin",
    location: "Austin, TX",
    votes: 267,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Athletes Body
  {
    id: 5,
    username: "SportsStar",
    email: "sports@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuL_2qAuQzn5qPBBRR6w4gkO-uPhbViTIZ5g&s",
    bio: "Multi-sport athlete. Basketball, tennis, and track & field competitor.",
    physique_category: "athletes-body",
    gender: "female",
    created_at: "2024-02-12T00:00:00Z",
    age: 27,
    country: "United States",
    state: "New York",
    city: "New York",
    location: "New York, NY",
    votes: 428,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 6,
    username: "AthleteAce",
    email: "ace@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHJyTBxLVl6w1oLjl75bU3aWAqk0bxe-jO0PGG4_8NzZO5vEEOG3-WA7NqbDUndspw7l0&usqp=CAU",
    bio: "Professional athlete and sports performance coach. Peak performance.",
    physique_category: "athletes-body",
    gender: "male",
    created_at: "2024-02-13T00:00:00Z",
    age: 29,
    country: "United States",
    state: "California",
    city: "Los Angeles",
    location: "Los Angeles, CA",
    votes: 356,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Amateur BodyBuilder
  {
    id: 7,
    username: "AmateurBuilder",
    email: "amateur@example.com",
    profile_image: "https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop&crop=face",
    bio: "Aspiring bodybuilder working towards first competition.",
    physique_category: "amateur-bodybuilder",
    gender: "male",
    created_at: "2024-01-15T00:00:00Z",
    age: 24,
    country: "United States",
    state: "Illinois",
    city: "Chicago",
    location: "Chicago, IL",
    votes: 156,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 8,
    username: "NoviceLifter",
    email: "novice@example.com",
    profile_image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=300&fit=crop&crop=face",
    bio: "2 years into bodybuilding journey. Natural athlete building muscle.",
    physique_category: "amateur-bodybuilder",
    gender: "female",
    created_at: "2024-01-20T00:00:00Z",
    age: 22,
    country: "United States",
    state: "Texas",
    city: "Houston",
    location: "Houston, TX",
    votes: 134,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Professional BodyBuilder
  {
    id: 9,
    username: "ProBuilder",
    email: "pro@example.com",
    profile_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=face",
    bio: "Professional bodybuilder with 10+ years competitive experience.",
    physique_category: "professional-bodybuilder",
    gender: "male",
    created_at: "2024-01-05T00:00:00Z",
    age: 32,
    country: "United States",
    state: "Nevada",
    city: "Las Vegas",
    location: "Las Vegas, NV",
    votes: 589,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 10,
    username: "ElitePhysique",
    email: "elite@example.com",
    profile_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face",
    bio: "IFBB Pro bodybuilder. Multiple competition wins.",
    physique_category: "professional-bodybuilder",
    gender: "male",
    created_at: "2024-01-08T00:00:00Z",
    age: 35,
    country: "United States",
    state: "California",
    city: "Los Angeles",
    location: "Los Angeles, CA",
    votes: 467,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Fitness Model
  {
    id: 11,
    username: "FitnessModel",
    email: "model@example.com",
    profile_image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
    bio: "Fitness model and competition athlete. Magazine features.",
    physique_category: "fitness-model",
    gender: "female",
    created_at: "2024-01-25T00:00:00Z",
    age: 26,
    country: "United States",
    state: "Florida",
    city: "Miami",
    location: "Miami, FL",
    votes: 378,
    rank: 1,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 12,
    username: "CompetitorPro",
    email: "competitor@example.com",
    profile_image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop&crop=face",
    bio: "Fitness competitor specializing in physique and wellness divisions.",
    physique_category: "fitness-model",
    gender: "male",
    created_at: "2024-01-30T00:00:00Z",
    age: 29,
    country: "United States",
    state: "New York",
    city: "New York",
    location: "New York, NY",
    votes: 289,
    rank: 2,
    reward_points: 0,
    total_earned_points: 0,
  },

  // Additional users for other categories
  {
    id: 13,
    username: "FitMike92",
    email: "mike@example.com",
    profile_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face",
    bio: "Classic bodybuilder from LA. 5 years of serious training and muscle building!",
    physique_category: "bodybuilder",
    gender: "male",
    created_at: "2024-01-01T00:00:00Z",
    age: 28,
    country: "United States",
    state: "California",
    city: "Los Angeles",
    location: "Los Angeles, CA",
    votes: 234,
    rank: 3,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 14,
    username: "SarahStrong",
    email: "sarah@example.com",
    profile_image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
    bio: "Powerlifter and fitness coach. Deadlift PR: 405lbs. Teaching proper form.",
    physique_category: "professional-bodybuilder",
    gender: "female",
    created_at: "2024-01-02T00:00:00Z",
    age: 30,
    country: "United States",
    state: "Texas",
    city: "Dallas",
    location: "Dallas, TX",
    votes: 198,
    rank: 4,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 15,
    username: "FlexAlex",
    email: "alex@example.com",
    profile_image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop&crop=face",
    bio: "Men's physique competitor. Currently cutting for nationals.",
    physique_category: "physique",
    gender: "male",
    created_at: "2024-01-03T00:00:00Z",
    age: 26,
    country: "United States",
    state: "Florida",
    city: "Miami",
    location: "Miami, FL",
    votes: 167,
    rank: 5,
    reward_points: 0,
    total_earned_points: 0,
  },
  // Add demo login users
  {
    id: 16,
    username: "testuser",
    email: "test@example.com",
    profile_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face",
    bio: "Demo test user account",
    physique_category: "bodybuilder",
    gender: "male",
    created_at: "2024-01-01T00:00:00Z",
    age: 25,
    country: "United States",
    state: "California",
    city: "Los Angeles",
    location: "Los Angeles, CA",
    votes: 50,
    rank: 6,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 17,
    username: "anotheruser",
    email: "another@example.com",
    profile_image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
    bio: "Another demo user account",
    physique_category: "fitness-model",
    gender: "female",
    created_at: "2024-01-01T00:00:00Z",
    age: 27,
    country: "United States",
    state: "New York",
    city: "New York",
    location: "New York, NY",
    votes: 75,
    rank: 7,
    reward_points: 0,
    total_earned_points: 0,
  },
  {
    id: 18,
    username: "beachbabe88",
    email: "beachbabe88@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAQjEAn-zKBmcCz75ZBZRj2ACswme8KOalMg&s",
    bio: "Lover of the sun and surf",
    physique_category: "beach-body",
    gender: "male",
    created_at: "2024-02-10T10:00:00Z",
    age: 25,
    country: "United States",
    state: "California",
    city: "Santa Monica",
    location: "Santa Monica, CA",
    votes: 110,
    rank: 5,
    reward_points: 10,
    total_earned_points: 120,
  },
  {
    id: 19,
    username: "bikinistar",
    email: "bikinistar@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUVdf7NKKv4pRBcBI8RPrLW6D9hXYdywoCUw&s",
    bio: "Passionate bikini model and traveler",
    physique_category: "bikini-model",
    gender: "female",
    created_at: "2024-03-15T14:30:00Z",
    age: 23,
    country: "Australia",
    state: "Queensland",
    city: "Gold Coast",
    location: "Gold Coast, QLD",
    votes: 85,
    rank: 8,
    reward_points: 5,
    total_earned_points: 70,
  },
  {
    id: 20,
    username: "fit_dan",
    email: "fit_dan@example.com",
    profile_image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=300&fit=crop&crop=face",
    bio: "Certified trainer and fitness model",
    physique_category: "fitness-model",
    gender: "male",
    created_at: "2024-04-05T09:15:00Z",
    age: 30,
    country: "United Kingdom",
    state: "England",
    city: "London",
    location: "London, UK",
    votes: 190,
    rank: 2,
    reward_points: 20,
    total_earned_points: 200,
  },
  {
    id: 21,
    username: "iron_john",
    email: "ironjohn@example.com",
    profile_image: "https://media.defense.gov/2015/Dec/08/2001455214/2000/2000/0/151208-F-ZZ000-001.jpg",
    bio: "Professional bodybuilder and coach",
    physique_category: "professional-bodybuilder",
    gender: "male",
    created_at: "2024-05-01T12:00:00Z",
    age: 34,
    country: "Canada",
    state: "Ontario",
    city: "Toronto",
    location: "Toronto, ON",
    votes: 320,
    rank: 1,
    reward_points: 50,
    total_earned_points: 450,
  },
  {
    id: 22,
    username: "amateur_amy",
    email: "amyfit@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOMjAHaL8yJqCsA0mUwAJDjc38TPu3XIVW5w&s",
    bio: "New to bodybuilding but loving every step",
    physique_category: "amateur-bodybuilder",
    gender: "male",
    created_at: "2024-06-20T11:11:00Z",
    age: 26,
    country: "Germany",
    state: "Berlin",
    city: "Berlin",
    location: "Berlin, Germany",
    votes: 60,
    rank: 10,
    reward_points: 3,
    total_earned_points: 45,
  },
  {
    id: 23,
    username: "athlete_tom",
    email: "tom.athlete@example.com",
    profile_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyA9gUpTyk1IcGR7P98kyqdnxzTqfS-zsPRg&s",
    bio: "Track athlete turned physique competitor",
    physique_category: "athletes-body",
    gender: "female",
    created_at: "2024-07-12T08:45:00Z",
    age: 28,
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    location: "Mumbai, MH",
    votes: 95,
    rank: 6,
    reward_points: 7,
    total_earned_points: 85,
  },
    {
      "id": 24,
      "username": "beachbabe24",
      "email": "beachbabe24@example.com",
      "profile_image": "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/05/Muscular-Asian-Man-With-Abs-In-The-Ocean.jpg?quality=86&strip=all",
      "bio": "Beach-loving fitness enthusiast",
      "physique_category": "beach body",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 25,
      "country": "United States",
      "state": "Florida",
      "city": "Miami",
      "location": "Miami, FL",
      "votes": 80,
      "rank": 5,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 25,
      "username": "bikinistunner25",
      "email": "bikinistunner25@example.com",
      "profile_image": "https://shotkit.com/wp-content/uploads/2021/07/alexi-romano-hip-pop.jpg",
      "bio": "Bikini model & swimwear competitor",
      "physique_category": "bikini model",
      "gender": "female",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 24,
      "country": "Australia",
      "state": "Queensland",
      "city": "Gold Coast",
      "location": "Gold Coast, QLD",
      "votes": 89,
      "rank": 3,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 26,
      "username": "fitlifejane",
      "email": "fitlifejane@example.com",
      "profile_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRpFvUVdFlMV8eylSdsSzJEr4MXdGpbPpHhA&s",
      "bio": "Fitness model, health coach",
      "physique_category": "fitness-model",
      "gender": "female",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 27,
      "country": "United Kingdom",
      "state": "London",
      "city": "London",
      "location": "London, UK",
      "votes": 91,
      "rank": 1,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 27,
      "username": "pro_body_emma",
      "email": "pro_body_emma@example.com",
      "profile_image": "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=300&h=300&fit=crop&crop=face",
      "bio": "IFBB Pro bodybuilder, personal trainer",
      "physique_category": "professional-bodybuilder",
      "gender": "female",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 31,
      "country": "United States",
      "state": "California",
      "city": "Los Angeles",
      "location": "Los Angeles, CA",
      "votes": 76,
      "rank": 9,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 28,
      "username": "am_bodybuilder",
      "email": "am_bodybuilder@example.com",
      "profile_image": "https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop&crop=face",
      "bio": "Amateur competitor, fitness blogger",
      "physique_category": "Amateur BodyBuilder",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 29,
      "country": "Canada",
      "state": "Ontario",
      "city": "Toronto",
      "location": "Toronto, ON",
      "votes": 60,
      "rank": 12,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 29,
      "username": "ath_jackie",
      "email": "ath_jackie@example.com",
      "profile_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOMjAHaL8yJqCsA0mUwAJDjc38TPu3XIVW5w&s",
      "bio": "Track & field athlete, national champ",
      "physique_category": "athletes-body",
      "gender": "male",
      "created_at": "2024-01-01T00:00:00Z",
      "age": 22,
      "country": "South Africa",
      "state": "Gauteng",
      "city": "Pretoria",
      "location": "Pretoria, GT",
      "votes": 70,
      "rank": 8,
      "reward_points": 0,
      "total_earned_points": 0
    },
    {
      "id": 30,
      "username": "BetterMeJourney",
      "email": "betterme@example.com",
      "profile_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwaqr5HdohDChQWqw-XzApwSXMKQYSY_v-cHpIxxiW8PYltbijSr-g6ZRwDLWZuh97L1I&usqp=CAU",
      "bio": "On a journey to become the best version of myself. Focused on health, wellness, and sustainable fitness.",
      "physique_category": "better-me",
      "gender": "female",
      "created_at": "2024-05-15T10:00:00Z",
      "age": 29,
      "country": "United States",
      "state": "California",
      "city": "Los Angeles",
      "reward_points": 150,
      "total_earned_points": 250,
      "votes": 42,
      "monthly_votes": 12,
      "rank": 25
    },
    // Better Me - Additional Profiles
  {
    "id": 31,
    "username": "WellnessWarrior",
    "email": "wellness@example.com",
    "profile_image": "https://endometriosisaustralia.org/wp-content/uploads/2023/01/Kayla-Itsines-Thumbs-up.jpg",
    "bio": "Holistic health coach focusing on mind-body balance. Yoga, meditation, and clean eating enthusiast.",
    "physique_category": "better-me",
    "gender": "female",
    "age": 34,
    "country": "United States",
    "state": "California",
    "city": "San Diego",
    "created_at": new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    "reward_points": 420,
    "total_earned_points": 680,
    "vote_count": 56,
    "monthly_votes": 18
  },
  {
    "id": 32,
    "username": "FitAfter40",
    "email": "fit40@example.com",
    "profile_image": "https://hips.hearstapps.com/hmg-prod/images/one-latin-man-exercising-outdoors-royalty-free-image-1609435065.?crop=0.668xw:1.00xh;0.224xw,0&resize=1200:*",
    "bio": "Proving that age is just a number. Fitness journey started at 40, now stronger than ever!",
    "physique_category": "better-me",
    "gender": "male",
    "age": 47,
    "country": "Canada",
    "state": "British Columbia",
    "city": "Vancouver",
    "created_at": new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    "reward_points": 380,
    "total_earned_points": 520,
    "vote_count": 72,
    "monthly_votes": 22
  },
  {
    "id": 33,
    "username": "MindfulMuscle",
    "email": "mindful@example.com",
    "profile_image": "https://images.squarespace-cdn.com/content/v1/59e55f54b1ffb66d8c7adc9a/1509634890956-22ED9JNVXYWR0VWHFMZR/ke17ZwdGBToddI8pDm48kCHChmuivJZ1Va5ov3ZJeg17gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0ouw-8l5B_J38LMU7OZFvYcSGirBhY_3j1yQtntvGS73bypqQ-qjSV5umPUlGbQFAw/fit-man-with-energy-drink-PY5GHAF.jpg",
    "bio": "Building strength inside and out. Certified personal trainer and meditation teacher.",
    "physique_category": "better-me",
    "gender": "male",
    "age": 29,
    "country": "United Kingdom",
    "city": "London",
    "created_at": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    "reward_points": 290,
    "total_earned_points": 350,
    "vote_count": 38,
    "monthly_votes": 14
  },
  {
    "id": 34,
    "username": "StrongerMe",
    "email": "stronger@example.com",
    "profile_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXddFsc2ZN8pvT0JDHluovLkrnIVCWnx3vsg&s",
    "bio": "From couch to 5K to marathon finisher! Documenting my fitness journey one step at a time.",
    "physique_category": "better-me",
    "gender": "female",
    "age": 31,
    "country": "Australia",
    "city": "Sydney",
    "created_at": new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    "reward_points": 510,
    "total_earned_points": 790,
    "vote_count": 89,
    "monthly_votes": 27
  },
  {
    "id": 35,
    "username": "DadBodToGodBod",
    "email": "dadbod@example.com",
    "profile_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPohaIXmrubsly97t-Wb1X_3MwvsgHfMs-iQ&s",
    "bio": "Dad of two on a mission to get in the best shape of my life. Sharing the ups and downs of the journey.",
    "physique_category": "better-me",
    "gender": "male",
    "age": 36,
    "country": "United States",
    "state": "Texas",
    "city": "Austin",
    "created_at": new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    "reward_points": 470,
    "total_earned_points": 620,
    "vote_count": 65,
    "monthly_votes": 19
  },
]

// Generate more realistic votes with higher monthly counts
const mockVotes: Vote[] = [
  // Recent votes (this month) - January 2024
  { id: 1, voter_id: 1, voted_for_id: 5, created_at: "2024-01-15T10:30:00Z" }, // SportsStar
  { id: 2, voter_id: 2, voted_for_id: 5, created_at: "2024-01-15T11:00:00Z" },
  { id: 3, voter_id: 3, voted_for_id: 5, created_at: "2024-01-15T12:00:00Z" },
  { id: 4, voter_id: 4, voted_for_id: 5, created_at: "2024-01-15T13:00:00Z" },
  { id: 5, voter_id: 6, voted_for_id: 5, created_at: "2024-01-15T14:00:00Z" },
  { id: 6, voter_id: 7, voted_for_id: 5, created_at: "2024-01-15T15:00:00Z" },
  { id: 7, voter_id: 8, voted_for_id: 5, created_at: "2024-01-15T16:00:00Z" },
  { id: 8, voter_id: 9, voted_for_id: 5, created_at: "2024-01-15T17:00:00Z" },
  { id: 9, voter_id: 10, voted_for_id: 5, created_at: "2024-01-15T18:00:00Z" },
  { id: 10, voter_id: 11, voted_for_id: 5, created_at: "2024-01-15T19:00:00Z" },

  // ProBuilder votes (ID 9)
  { id: 11, voter_id: 1, voted_for_id: 9, created_at: "2024-01-14T10:30:00Z" },
  { id: 12, voter_id: 2, voted_for_id: 9, created_at: "2024-01-14T11:00:00Z" },
  { id: 13, voter_id: 3, voted_for_id: 9, created_at: "2024-01-14T12:00:00Z" },
  { id: 14, voter_id: 4, voted_for_id: 9, created_at: "2024-01-14T13:00:00Z" },
  { id: 15, voter_id: 5, voted_for_id: 9, created_at: "2024-01-14T14:00:00Z" },

  // Add more votes for other users
  ...Array.from({ length: 100 }, (_, i) => ({
    id: 16 + i,
    voter_id: Math.floor(Math.random() * 15) + 1,
    voted_for_id: Math.floor(Math.random() * 15) + 1,
    created_at: Math.random() > 0.6 ? "2024-01-15T00:00:00Z" : "2023-12-15T00:00:00Z", // 60% recent votes
  })).filter((vote) => vote.voter_id !== vote.voted_for_id), // Remove self-votes
]

// Expanded photos for more users with category-specific images
const mockPhotos: Photo[] = [
  // BeachVibes photos (ID 1)
  {
    id: 1,
    user_id: 1,
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop",
    caption: "Beach workout session at sunrise",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop",
    caption: "Volleyball training on the sand",
    created_at: "2024-01-02T00:00:00Z",
  },

  // BikiniBabe photos (ID 3)
  {
    id: 3,
    user_id: 3,
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop",
    caption: "Competition prep posing",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    user_id: 3,
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop",
    caption: "Stage ready physique",
    created_at: "2024-01-02T00:00:00Z",
  },

  // SportsStar photos (ID 5)
  {
    id: 5,
    user_id: 5,
    url: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=500&fit=crop",
    caption: "Basketball training session",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    user_id: 5,
    url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop",
    caption: "Track and field practice",
    created_at: "2024-01-02T00:00:00Z",
  },
]

const mockContent: Content[] = [
  {
    id: 1,
    user_id: 1,
    title: "Beach Body Workout",
    type: "workout",
    description: "Get summer ready with this beach workout routine",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: 3,
    title: "Bikini Competition Prep",
    type: "workout",
    description: "12-week competition preparation program",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    user_id: 5,
    title: "Athletic Performance Training",
    type: "workout",
    description: "Sport-specific conditioning program",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Helper function to calculate vote counts
function calculateVoteCounts(userId: number) {
  const totalVotes = mockVotes.filter((vote) => vote.voted_for_id === userId).length
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const monthlyVotes = mockVotes.filter(
    (vote) => vote.voted_for_id === userId && vote.created_at.startsWith(currentMonth),
  ).length

  return { vote_count: totalVotes, monthly_votes: monthlyVotes }
}

// User operations
export function getAllUsers(): User[] {
  return mockUsers
    .map((user) => ({
      ...user,
      ...calculateVoteCounts(user.id),
    }))
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
}

export function getUserById(id: number | string): User | undefined {
  const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
  const user = mockUsers.find((u) => u.id === numericId)
  if (!user) return undefined

  return {
    ...user,
    ...calculateVoteCounts(user.id),
  }
}

export function getUserByUsername(username: string): User | undefined {
  const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())
  if (!user) return undefined

  return {
    ...user,
    ...calculateVoteCounts(user.id),
  }
}

export function searchUsers(query: string): User[] {
  const searchTerm = query.toLowerCase()
  return mockUsers
    .filter((user) => user.username.toLowerCase().includes(searchTerm) || user.bio.toLowerCase().includes(searchTerm))
    .map((user) => ({
      ...user,
      ...calculateVoteCounts(user.id),
    }))
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
}

export function filterUsers(category?: string, filters: Record<string, string> = {}): User[] {
  let filteredUsers = [...mockUsers]

  // Apply category filter if provided
  if (category && category !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.physique_category === category)
  }

  // Apply other filters
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || value === 'all') return;
    
    switch (key) {
      case 'gender':
        filteredUsers = filteredUsers.filter(user => user.gender === value);
        break;
      case 'country':
        filteredUsers = filteredUsers.filter(user => user.country === value);
        break;
      case 'state':
        filteredUsers = filteredUsers.filter(user => user.state === value);
        break;
      case 'city':
        filteredUsers = filteredUsers.filter(user => user.city === value);
        break;
      case 'age':
        const [min, max] = value.split('-').map(Number);
        filteredUsers = filteredUsers.filter(user => {
          const age = user.age || 0;
          return max ? age >= min && age <= max : age >= min;
        });
        break;
    }
  });

  return filteredUsers
    .map((user) => ({
      ...user,
      ...calculateVoteCounts(user.id),
    }))
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
}

// New function for getting users by category
export function getUsersByCategory(categoryId: string): User[] {
  return mockUsers
    .filter((user) => user.physique_category === categoryId)
    .map((user) => ({
      ...user,
      ...calculateVoteCounts(user.id),
    }))
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
}

// Vote operations
export function addVote(voterId: number, votedForId: number): any {
  // Check if vote already exists
  const existingVote = mockVotes.find((vote) => vote.voter_id === voterId && vote.voted_for_id === votedForId)

  if (existingVote) {
    return null // Vote already exists
  }

  // Add new vote
  const newVote: Vote = {
    id: mockVotes.length + 1,
    voter_id: voterId,
    voted_for_id: votedForId,
    created_at: new Date().toISOString(),
  }

  mockVotes.push(newVote)
  return { success: true }
}

export function hasUserVoted(voterId: number, votedForId: number): boolean {
  return mockVotes.some((vote) => vote.voter_id === voterId && vote.voted_for_id === votedForId)
}

export function getVotersForUser(userId: number): any[] {
  const userVotes = mockVotes.filter((vote) => vote.voted_for_id === userId)
  return userVotes
    .map((vote) => {
      const voter = mockUsers.find((user) => user.id === vote.voter_id)
      return {
        username: voter?.username || "Unknown",
        profile_image:
          voter?.profile_image ||
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
        created_at: vote.created_at,
      }
    })
    .slice(0, 10) // Limit to 10 recent voters
}

// Photo operations
export function getPhotosForUser(userId: number): Photo[] {
  return mockPhotos.filter((photo) => photo.user_id === userId)
}

// Content operations
export function getContentForUser(userId: number): Content[] {
  return mockContent.filter((content) => content.user_id === userId)
}

// Leaderboard
export function getLeaderboard(limit = 20): User[] {
  return getAllUsers().slice(0, limit)
}

// Messaging operations
export function getConversationBetweenUsers(user1Id: number, user2Id: number): any[] {
  // This would normally query the database for messages between two users
  // For now, return mock conversation data
  const mockMessages = [
    {
      id: 1,
      sender_id: user1Id,
      receiver_id: user2Id,
      content: "Hey! Great progress on your recent posts. Keep it up!",
      created_at: "2024-01-15T10:30:00Z",
      read: true,
    },
    {
      id: 2,
      sender_id: user2Id,
      receiver_id: user1Id,
      content: "Thanks! Your training videos are really inspiring.",
      created_at: "2024-01-15T11:00:00Z",
      read: true,
    },
    {
      id: 3,
      sender_id: user1Id,
      receiver_id: user2Id,
      content: "Would love to know more about your workout routine!",
      created_at: "2024-01-15T11:30:00Z",
      read: false,
    },
  ]

  return mockMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export async function getCurrentUser() {
  // In a real app, this would check the session
  // For demo, return the first user with some reward points
  const user = users[0] // Get the first user
  if (user) {
    return {
      ...user,
      reward_points: 880, // Updated based on sample transactions
      total_earned_points: 1230
    }
  }
  return null
}

// Mock rewards data
export const mockRewards: Reward[] = [
  // Existing rewards...
  {
    id: 1,
    name: "VIP Training Session",
    description: "One-on-one training session with a professional trainer",
    points_required: 500,
    image_url: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/personal-training-instagram-ads-design-template-88eacefe2d8e535679b81b4b99a5f8f6.jpg?ts=1698432960",
    category: "consultation",
    stock: 10,
    created_at: new Date().toISOString(),
  },
  // {
  //   id: 2,
  //   name: "Gym Merchandise Pack",
  //   description: "Exclusive gym merchandise including t-shirt and water bottle",
  //   points_required: 300,
  //   image_url: "/rewards/merch-pack.jpg",
  //   category: "product",
  //   stock: 25,
  //   created_at: new Date().toISOString(),
  // },
  {
    id: 3,
    name: "Weekend Fitness Retreat",
    description: "All-inclusive weekend fitness retreat in the mountains",
    points_required: 1500,
    image_url: "https://media.istockphoto.com/id/91694746/photo/mountain-resort.jpg?s=612x612&w=is&k=20&c=eBwRWKZapK453KmHZyRsXzdrSMZwGPEZuncRDE4fjUk=",
    category: "trip",
    stock: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Nutrition Consultation",
    description: "Personalized nutrition plan from a certified dietitian",
    points_required: 400,
    image_url: "https://www.nutritioned.org/wp-content/uploads/2023/05/nutrition-jobs.jpg",
    category: "consultation",
    stock: 15,
    created_at: new Date().toISOString(),
  },
  // {
  //   id: 5,
  //   name: "Premium Gym Bag",
  //   description: "High-quality gym bag with multiple compartments",
  //   points_required: 250,
  //   image_url: "/rewards/gym-bag.jpg",
  //   category: "product",
  //   stock: 20,
  //   created_at: new Date().toISOString(),
  // },
  // AllMax Nutrition Products
  {
    id: 6,
    name: "AllMax ISOFLEX Whey Protein",
    description: "Ultra-premium whey protein isolate with 27g of protein per serving",
    points_required: 1200,
    image_url: "https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14163/id:aa74f05c74fd5742afa77fdff8bc3859/https://techforbs.com/1-removebg-preview.png",
    category: "product",
    stock: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "AllMax Creatine Monohydrate",
    description: "Pure pharmaceutical grade creatine monohydrate for muscle growth",
    points_required: 800,
    image_url: "https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14168/id:ab6eff67544c912b5d3cc9d6c3b9a63c/https://techforbs.com/4-7.pn",
    category: "product",
    stock: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "AllMass Extreme",
    description: "Ultimate weight gainer with 50g of protein per serving",
    points_required: 1800,
    image_url: "https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14163/id:aa74f05c74fd5742afa77fdff8bc3859/https://techforbs.com/1-removebg-preview.png",
    category: "product",
    stock: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    name: "AllMax Aminocore",
    description: "Complete amino acid profile with 8.5g BCAAs per serving",
    points_required: 1000,
    image_url: "https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14169/id:6e8ee1c0d0b01eb749e28a3bb02cb643/https://techforbs.com/5-6.png",
    category: "product",
    stock: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: "AllMax ZMX",
    description: "Advanced ZMA formula for recovery and muscle growth",
    points_required: 900,
    image_url: "https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14166/id:b9882e6bb57237d68f0bda46d8abd7cd/https://techforbs.com/2-8.png",
    category: "product",
    stock: 10,
    created_at: new Date().toISOString(),
  },
]

// Mock user rewards data with sample history
export const mockUserRewards: UserReward[] = [
  {
    id: 1,
    user_id: 1, // Assuming user with ID 1 exists
    reward_id: 1, // VIP Training Session
    claimed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'delivered',
    tracking_number: 'TRK123456789',
    shipped_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 1,
    reward_id: 2, // Gym Merchandise Pack
    claimed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'shipped',
    tracking_number: 'TRK987654321',
    shipped_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    delivered_at: null
  },
  {
    id: 3,
    user_id: 1,
    reward_id: 4, // Nutrition Consultation
    claimed_at: new Date().toISOString(), // Today
    status: 'pending',
    tracking_number: '',
    shipped_at: null,
    delivered_at: null
  }
]

// Mock transactions data with sample history
export const mockTransactions: RewardTransaction[] = [
  // Initial points
  {
    id: 1,
    user_id: 1,
    points: 1000,
    type: 'earn',
    description: 'Welcome bonus',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Points from votes
  {
    id: 2,
    user_id: 1,
    points: 50,
    type: 'earn',
    description: 'Points for receiving votes',
    reference_id: 123,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  // First reward redemption
  {
    id: 3,
    user_id: 1,
    points: -500,
    type: 'redeem',
    description: 'Redeemed reward: VIP Training Session',
    reference_id: 1,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More points from content creation
  {
    id: 4,
    user_id: 1,
    points: 150,
    type: 'earn',
    description: 'Points for creating content',
    reference_id: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Second reward redemption
  {
    id: 5,
    user_id: 1,
    points: -300,
    type: 'redeem',
    description: 'Redeemed reward: Gym Merchandise Pack',
    reference_id: 2,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Most recent points
  {
    id: 6,
    user_id: 1,
    points: 30,
    type: 'earn',
    description: 'Daily login bonus',
    created_at: new Date().toISOString()
  },
  // Most recent redemption
  {
    id: 7,
    user_id: 1,
    points: -400,
    type: 'redeem',
    description: 'Redeemed reward: Nutrition Consultation',
    reference_id: 4,
    created_at: new Date().toISOString()
  }
]

// Add transaction helper function
function addTransaction(transaction: Omit<RewardTransaction, 'id' | 'created_at'>) {
  const newTransaction: RewardTransaction = {
    id: mockTransactions.length + 1,
    ...transaction,
    created_at: new Date().toISOString(),
  }
  mockTransactions.push(newTransaction)
  return newTransaction
}

// Get rewards with optional category filter
export function getRewards(category?: string): Reward[] {
  if (!category) {
    return mockRewards
  }
  return mockRewards.filter(reward => reward.category === category)
}

// Get a reward by ID
export function getRewardById(id: number): Reward | undefined {
  return mockRewards.find(reward => reward.id === id)
}

// Get user's claimed rewards
export function getUserRewards(userId: number): UserReward[] {
  return mockUserRewards.filter(reward => reward.user_id === userId)
}

// Claim a reward
export function claimReward(userId: number, rewardId: number) {
  const reward = getRewardById(rewardId)
  const user = users.find(u => u.id === userId)
  
  if (!reward || !user) {
    return { success: false, message: 'Invalid reward or user' }
  }
  
  if (reward.stock <= 0) {
    return { success: false, message: 'This reward is out of stock' }
  }
  
  if (user.reward_points < reward.points_required) {
    return { 
      success: false, 
      message: `You need ${reward.points_required - user.reward_points} more points to claim this reward` 
    }
  }
  
  // Deduct points from user
  if (!addRewardPoints(
    userId, 
    -reward.points_required, 
    `Redeemed reward: ${reward.name}`,
    rewardId
  )) {
    return { success: false, message: 'Failed to process reward' }
  }
  
  // Reduce stock
  reward.stock--
  
  // Add to user's rewards
  const userReward: UserReward = {
    id: mockUserRewards.length + 1,
    user_id: userId,
    reward_id: rewardId,
    claimed_at: new Date().toISOString(),
    status: 'pending',
    tracking_number: '',
    shipped_at: null,
    delivered_at: null
  }
  
  mockUserRewards.push(userReward)
  return { success: true, message: 'Reward claimed successfully' }
}

// Update addRewardPoints to track transactions
export function addRewardPoints(
  userId: number, 
  points: number, 
  description: string, 
  referenceId?: number
): boolean {
  const user = users.find(u => u.id === userId)
  if (!user) return false
  
  user.reward_points = (user.reward_points || 0) + points
  user.total_earned_points = (user.total_earned_points || 0) + Math.max(0, points)
  
  // Record transaction
  addTransaction({
    user_id: userId,
    points,
    type: points > 0 ? 'earn' : 'redeem',
    description,
    reference_id: referenceId
  })
  
  return true
}

// Get user's transaction history
export function getUserTransactionHistory(
  userId: number, 
  limit: number = 20,
  offset: number = 0
): RewardTransaction[] {
  return mockTransactions
    .filter(tx => tx.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(offset, offset + limit)
}

// Add points for content engagement
export function addPointsForEngagement(
  userId: number, 
  action: 'vote' | 'post' | 'share' | 'daily_login',
  referenceId?: number
): boolean {
  const pointsMap = {
    vote: 10,
    post: 50,
    share: 20,
    daily_login: 5
  }
  
  const points = pointsMap[action] || 0
  if (points === 0) return false
  
  const descriptions = {
    vote: 'Points for receiving a vote',
    post: 'Points for creating content',
    share: 'Points for sharing content',
    daily_login: 'Daily login bonus'
  }
  
  return addRewardPoints(
    userId, 
    points, 
    descriptions[action],
    referenceId
  )
}

// Update an existing user
export function updateUser(id: number, userData: Partial<User>): User | null {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      id, // Ensure ID doesn't change
      created_at: mockUsers[userIndex].created_at // Preserve creation date
    };
    
    return mockUsers[userIndex];
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete a user from the database
export function deleteUser(id: number): boolean {
  try {
    const initialLength = mockUsers.length;
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return false;
    
    mockUsers.splice(userIndex, 1);
    return mockUsers.length < initialLength;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Add a new user to the database
export function addUser(userData: Omit<User, 'id' | 'created_at'>): User | null {
  try {
    // Generate a new ID (max existing ID + 1)
    const newId = mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1;
    
    // Create the new user object with required fields
    const newUser: User = {
      id: newId,
      username: userData.username,
      email: userData.email || `${userData.username.toLowerCase().replace(/\s+/g, '')}@example.com`,
      profile_image: userData.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=random`,
      bio: userData.bio || '',
      physique_category: userData.physique_category || 'fitness-model',
      gender: userData.gender || 'other',
      created_at: new Date().toISOString(),
      vote_count: 0,
      monthly_votes: 0,
      reward_points: 0,
      total_earned_points: 0,
      age: userData.age || null,
      country: userData.country || '',
      state: userData.state || '',
      city: userData.city || '',
      location: userData.location || '',
      votes: 0,
      rank: null
    };

    // Add the new user to the mock database
    mockUsers.push(newUser);
    
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}

// Export users array for compatibility
export const users = mockUsers.map((user) => ({
  id: user.id.toString(),
}))
