"use client"

import { useEffect, useState, useRef, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext"
import type { OnboardingStep } from "@/types/onboarding"
import CategoryStep from "@/components/onboarding/steps/CategoryStep"
import EngagementStep from "@/components/onboarding/steps/EngagementStep"
import FirstPostStep from "@/components/onboarding/steps/FirstPostStep"
import RewardsStep from "@/components/onboarding/steps/RewardsStep"
import StreakStep from "@/components/onboarding/steps/StreakStep"
import ProfileStep from "@/components/onboarding/steps/ProfileStep"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
 
// Define the onboarding steps in order
const ONBOARDING_STEPS: OnboardingStep[] = [
  "category",
  "profile",
  "engagement",
  "firstPost",
  "rewards",
  "streak",
  "complete",
]

// Loading component for Suspense fallback
function OnboardingLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

// Inner component that uses the onboarding context and search params
function OnboardingFlowWithParams() {
  const { state, goToStep, showCelebration, triggerCelebration, updateUserData, addPoints, addBadge, nextStep } =
    useOnboarding()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const hasRedirected = useRef(false)
  const hasInitializedFromUrl = useRef(false)

  // Handle URL parameter for initial step
  const stepParam = useMemo(() => searchParams.get("step") as OnboardingStep | null, [searchParams])
  useEffect(() => {
    if (hasInitializedFromUrl.current) return
    if (stepParam && ONBOARDING_STEPS.includes(stepParam)) {
      if (stepParam !== state.currentStep) {
        goToStep(stepParam)
      }
    }
    hasInitializedFromUrl.current = true
    setIsLoading(false)
  }, [stepParam, goToStep, state.currentStep])

  // Handle invalid steps by redirecting to the first step
  useEffect(() => {
    if (!isLoading && !ONBOARDING_STEPS.includes(state.currentStep) && !hasRedirected.current) {
      hasRedirected.current = true
      goToStep("category")
    }
  }, [state.currentStep, isLoading, goToStep])

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    // Check if onboarding is complete
    if (state.currentStep === "complete") {
      // Store completion in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("onboardingComplete", "true")
      }
      // Redirect to dashboard after a short delay to show completion animation
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.currentStep, router])

  const handleProfileComplete = async (profileData: any) => {
    try {
      // Update user data with the profile information
      await updateUserData({
        ...profileData,
        goals: state.userData.goals || [],
        trainingStyles: state.userData.trainingStyles || [],
        gymType: state.userData.gymType,
      })

      // Add points for completing the profile
      await addPoints(50)

      // Trigger celebration
      triggerCelebration()

      // Move to the next step after a short delay
      setTimeout(() => {
        nextStep()
      }, 1500)
    } catch (error) {
      console.error("Error completing profile:", error)
      // Handle error appropriately
    }
  }

  useEffect(() => {
    // Trigger celebration when the user completes the category selection
    if (state.currentStep === "engagement") {
      triggerCelebration()
    }
  }, [state.currentStep, triggerCelebration])

  const renderStep = () => {
    // If we have an invalid step, return null (the useEffect will handle the redirect)
    if (!ONBOARDING_STEPS.includes(state.currentStep)) {
      return null
    }

    if (isLoading) {
      return <OnboardingLoading />
    }

    switch (state.currentStep) {
      case "category":
        return <CategoryStep />
      case "profile":
        return <ProfileStep handleProfileComplete={handleProfileComplete} />
      case "engagement":
        return <EngagementStep />
      case "firstPost":
        return <FirstPostStep />
      case "rewards":
        return <RewardsStep />
      case "streak":
        return <StreakStep />
      case "complete":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete!</h2>
              <p className="text-gray-600 mb-6">You're all set to start your fitness journey!</p>
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </motion.div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-4 py-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Component without search params for fallback
function OnboardingFlowFallback() {
  const { state, showCelebration, triggerCelebration, updateUserData, addPoints, addBadge, nextStep } = useOnboarding()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if onboarding is complete
    if (state.currentStep === "complete") {
      // Store completion in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("onboardingComplete", "true")
      }
      // Redirect to dashboard after a short delay to show completion animation
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.currentStep, router])

  const handleProfileComplete = async (profileData: any) => {
    try {
      // Update user data with the profile information
      await updateUserData({
        ...profileData,
        goals: state.userData.goals || [],
        trainingStyles: state.userData.trainingStyles || [],
        gymType: state.userData.gymType,
      })

      // Add points for completing the profile
      await addPoints(50)

      // Trigger celebration
      triggerCelebration()

      // Move to the next step after a short delay
      setTimeout(() => {
        nextStep()
      }, 1500)
    } catch (error) {
      console.error("Error completing profile:", error)
      // Handle error appropriately
    }
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case "category":
        return <CategoryStep />
      case "profile":
        return <ProfileStep handleProfileComplete={handleProfileComplete} />
      case "engagement":
        return <EngagementStep />
      case "firstPost":
        return <FirstPostStep />
      case "rewards":
        return <RewardsStep />
      case "streak":
        return <StreakStep />
      case "complete":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete!</h2>
              <p className="text-gray-600 mb-6">You're all set to start your fitness journey!</p>
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </motion.div>
          </div>
        )
      default:
        return <CategoryStep />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-4 py-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Main export that wraps the flow in the provider with Suspense
export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <Suspense fallback={<OnboardingLoading />}>
        <OnboardingFlowWithParams />
      </Suspense>
    </OnboardingProvider>
  )
}
