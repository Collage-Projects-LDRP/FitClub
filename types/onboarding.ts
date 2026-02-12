export type OnboardingStep =
  | "welcome"
  | "category"
  | "profile"
  | "engagement"
  | "firstPost"
  | "rewards"
  | "streak"
  | "complete"

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "category",
  "profile",
  "engagement",
  "firstPost",
  "rewards",
  "streak",
  "complete",
]

export interface OnboardingState {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  userData: {
    points: number
    badges: Badge[]
    streak: number
    lastActive: string | null
    goals: string[]
    completedMissions: string[]
    category?: string
    gymType?: string
    trainingStyles?: string[]
    name?: string
    username?: string
    bio?: string
    personalGoal?: string
    hasPosted?: boolean
    firstPostAt?: string
    onboardingCompleted?: boolean
    onboardingCompletedAt?: string
    lastMissionCompletedAt?: string
    showBadge?: {
      badgeId: BadgeType
      onClose: () => void
    } | null
  }
  completedAt?: string
}

export type BadgeType = "new_challenger" | "fully_pumped_profile" | "community_starter"

export type Badge = {
  id: BadgeType
  name: string
  description: string
  icon: string
  earnedAt: string
  expiresAt?: string
}
