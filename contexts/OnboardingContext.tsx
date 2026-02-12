'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { OnboardingStep, ONBOARDING_STEPS } from '@/types/onboarding';
import { BadgePopup } from '@/components/onboarding/BadgePopup';

type BadgeType = 'new_challenger' | 'fully_pumped_profile' | 'community_starter';

type Badge = {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  expiresAt?: string;
};

const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, 'earnedAt' | 'id'>> = {
  new_challenger: {
    name: 'New Challenger',
    description: 'Awarded for joining the community!',
    icon: 'zap',
  },
  fully_pumped_profile: {
    name: 'Fully Pumped Profile',
    description: 'Awarded for completing your profile!',
    icon: 'user-check',
  },
  community_starter: {
    name: 'Community Starter',
    description: 'Awarded for completing your first mission!',
    icon: 'users',
  },
};

interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completedAt?: string; // Add completedAt property
  userData: {
    points: number;
    badges: Badge[];
    streak: number;
    lastActive: string | null;
    goals: string[];
    completedMissions: string[];
    category?: string;
    gymType?: string;
    trainingStyles?: string[];
    showBadge?: {
      badgeId: BadgeType;
      onClose: () => void;
    } | null;
  };
};

type OnboardingContextType = {
  state: OnboardingState;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  updateUserData: (data: Partial<OnboardingState['userData']>) => void;
  completeStep: (step: OnboardingStep) => void;
  addPoints: (points: number) => void;
  addBadge: (badgeId: BadgeType) => Promise<boolean>;
  showBadge: (badgeId: BadgeType) => Promise<void>;
  resetOnboarding: () => void;
  showCelebration: boolean;
  triggerCelebration: () => void;
  points: number;
};

const defaultState: OnboardingState = {
  currentStep: 'category',
  completedSteps: [],
  userData: {
    points: 0,
    badges: [],
    streak: 0,
    lastActive: null,
    goals: [],
    completedMissions: [],
    category: undefined,
    gymType: undefined,
    trainingStyles: [],
    showBadge: null,
  },
};

const validateStep = (step: string): step is OnboardingStep => {
  return ONBOARDING_STEPS.includes(step as OnboardingStep);
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode; initialStep?: OnboardingStep }> = ({ 
  children, 
  initialStep = 'category' 
}) => {
  const [state, setState] = useState<OnboardingState>(() => ({
    currentStep: initialStep,
    completedSteps: [],
    userData: {
      points: 0,
      badges: [],
      streak: 0,
      lastActive: null,
      goals: [],
      completedMissions: [],
      category: undefined,
      gymType: undefined,
      trainingStyles: [],
      showBadge: null,
    },
  }));

  const [showCelebration, setShowCelebration] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Reset onboarding state to initial values
  const resetOnboarding = useCallback(() => {
    const newState = { ...defaultState, currentStep: initialStep };
    setState(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingState', JSON.stringify(newState));
    }
  }, [initialStep]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (initialized && state.currentStep !== 'complete') {
      try {
        localStorage.setItem('onboardingState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving onboarding state:', error);
      }
    } else if (state.currentStep === 'complete') {
      // Only save complete state once to prevent overwriting
      try {
        const completeState = {
          ...state,
          completedAt: state.completedAt || new Date().toISOString(),
        };
        localStorage.setItem('onboardingState', JSON.stringify(completeState));
        localStorage.setItem('onboardingComplete', 'true');
      } catch (error) {
        console.error('Error saving complete state:', error);
      }
    }
  }, [state, initialized]);

  // Mark as initialized after first render
  useEffect(() => {
    setInitialized(true);
  }, []);

  const nextStep = useCallback(async () => {
    try {
      setState(prevState => {
        const currentIndex = ONBOARDING_STEPS.indexOf(prevState.currentStep);
        
        if (currentIndex < 0 || currentIndex >= ONBOARDING_STEPS.length - 1) {
          console.warn('No next step available or invalid current step:', prevState.currentStep);
          return prevState; // Return previous state if no next step
        }
        
        // Move to next step
        const nextStep = ONBOARDING_STEPS[currentIndex + 1];
        const newState = {
          ...prevState,
          currentStep: nextStep,
          completedSteps: [...new Set([...prevState.completedSteps, prevState.currentStep])],
        };
        
        // If this is the last step, mark as complete
        if (currentIndex === ONBOARDING_STEPS.length - 2) {
          return {
            ...newState,
            currentStep: 'complete',
            completedSteps: [...new Set([...newState.completedSteps, 'complete' as OnboardingStep])],
            completedAt: new Date().toISOString(),
          };
        }
        
        return newState;
      });
    } catch (error) {
      console.error('Error in nextStep:', error);
      // Fall back to first step on error
      setState(prev => ({
        ...prev,
        currentStep: 'category',
      }));
    }
  }, []); // No dependencies needed since we use functional updates

  const prevStep = useCallback(() => {
    try {
      const currentIndex = ONBOARDING_STEPS.indexOf(state.currentStep);
      if (currentIndex > 0) {
        setState(prev => ({
          ...prev,
          currentStep: ONBOARDING_STEPS[currentIndex - 1],
        }));
      }
    } catch (error) {
      console.error('Error in prevStep:', error);
    }
  }, [state.currentStep]);

  const goToStep = useCallback((step: OnboardingStep) => {
    try {
      if (!validateStep(step)) {
        console.warn(`Invalid step: ${step}`);
        return;
      }
      
      setState(prev => ({
        ...prev,
        currentStep: step,
      }));
    } catch (error) {
      console.error('Error in goToStep:', error);
    }
  }, []);

  const updateUserData = useCallback((data: Partial<OnboardingState['userData']>) => {
    setState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        ...data,
      },
    }));
  }, []);

  const addBadge = useCallback(async (badgeId: BadgeType): Promise<boolean> => {
    // Check if badge already exists
    const badgeExists = state.userData.badges.some(b => b.id === badgeId);
    if (badgeExists) return false;

    const newBadge: Badge = {
      id: badgeId,
      ...BADGE_DEFINITIONS[badgeId],
      earnedAt: new Date().toISOString(),
      // Make new_challenger badge expire in 3 days
      ...(badgeId === 'new_challenger' ? { 
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() 
      } : {})
    };

    setState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        badges: [...prev.userData.badges, newBadge],
      },
    }));

    return true;
  }, [state.userData.badges]);

  const showBadgePopup = useCallback(async (badgeId: BadgeType) => {
    return new Promise<void>((resolve) => {
      updateUserData({
        showBadge: {
          badgeId,
          onClose: () => {
            updateUserData({ showBadge: undefined });
            resolve();
          },
        },
      });
    });
  }, [updateUserData]);

  const completeStep = useCallback(async (step: OnboardingStep) => {
    setState(prev => {
      const newCompletedSteps = [...new Set([...prev.completedSteps, step])];
      
      // Check for profile completion
      const isProfileComplete = ['category', 'profile', 'engagement'].every(step => 
        newCompletedSteps.includes(step as OnboardingStep)
      );

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        userData: {
          ...prev.userData,
          ...(isProfileComplete && !prev.userData.badges.some(b => b.id === 'fully_pumped_profile')
            ? { badges: [...prev.userData.badges, {
                id: 'fully_pumped_profile',
                ...BADGE_DEFINITIONS['fully_pumped_profile'],
                earnedAt: new Date().toISOString(),
              }]}
            : {}),
        },
      };
    });
  }, []);

  const addPoints = useCallback((points: number) => {
    const pointsToAdd = Number(points) || 0;
    if (pointsToAdd <= 0) {
      console.warn('Cannot add zero or negative points:', points);
      return;
    }
    
    setState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        points: (prev.userData.points || 0) + pointsToAdd,
      },
    }));
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error triggering celebration:', error);
    }
  }, []);

  const value = useMemo<OnboardingContextType>(
    () => ({
      state,
      nextStep,
      prevStep,
      goToStep,
      updateUserData,
      completeStep,
      addPoints,
      addBadge,
      showBadge: async (badgeId: BadgeType) => {
        await showBadgePopup(badgeId);
      },
      resetOnboarding,
      showCelebration,
      triggerCelebration,
      points: state.userData.points,
    }),
    [
      state,
      nextStep,
      prevStep,
      goToStep,
      updateUserData,
      completeStep,
      addPoints,
      addBadge,
      showBadgePopup,
      resetOnboarding,
      showCelebration,
      triggerCelebration,
      state.userData.points,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {state.userData.showBadge && (
        <BadgePopup
          isOpen={!!state.userData.showBadge}
          onClose={state.userData.showBadge.onClose}
          onContinue={state.userData.showBadge.onClose}
          badgeType={state.userData.showBadge.badgeId}
          totalPoints={state.userData.points}
        />
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
