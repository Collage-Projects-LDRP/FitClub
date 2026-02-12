'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Loader2, CheckCircle, ThumbsUp, MessageSquare, Zap, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BadgePopup } from '../BadgePopup';
import { toast } from '@/components/ui/use-toast';
import { NavigationButtons } from '../NavigationButtons';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';

type MissionType = 'like' | 'vote' | 'comment';

interface Mission {
  id: MissionType;
  title: string;
  description: string;
  icon: any;
  points: number;
  action?: () => Promise<boolean>;
}

const MISSIONS: Mission[] = [
  { 
    id: 'like', 
    title: 'Like a Post', 
    description: 'Show some love to a community post',
    icon: ThumbsUp, 
    points: 10,
    action: async () => {
      // Simulate API call to like a post
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  },
  { 
    id: 'vote', 
    title: 'Vote on a Transformation', 
    description: 'Cast your vote on a transformation post',
    icon: Zap, 
    points: 10,
    action: async () => {
      // Simulate API call to vote
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  },
  { 
    id: 'comment', 
    title: 'Leave a Comment', 
    description: 'Share your thoughts on a post',
    icon: MessageSquare, 
    points: 10,
    action: async () => {
      // Simulate API call to post comment
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  },
];

export default function EngagementStep() {
  const { nextStep, prevStep, addPoints, addBadge, state, updateUserData, points } = useOnboarding();
  const [completedMissions, setCompletedMissions] = useState<MissionType[]>([]);
  const [isLoading, setIsLoading] = useState<MissionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [allMissionsCompleted, setAllMissionsCompleted] = useState(false);
  
  const currentStep = getOnboardingStepNumber('engagement');
  const totalSteps = TOTAL_ONBOARDING_STEPS;
  
  const allComplete = completedMissions.length === MISSIONS.length;
  const totalPoints = completedMissions.reduce((sum, id) => {
    const mission = MISSIONS.find(m => m.id === id);
    return sum + (mission?.points || 0);
  }, 0) + (allComplete ? 30 : 0); // 30 bonus points for completing all

  const completeStep = async () => {
    setIsSubmitting(true);
    try {
      // Add any completion logic here if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      nextStep();
    } catch (error) {
      console.error('Error completing engagement step:', error);
      toast({
        title: 'Error',
        description: 'There was an error completing this step. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (completedMissions.length === 0) return;
    
    if (allComplete) {
      setShowBadge(true);
    } else {
      await completeStep();
    }
  };

  const toggleMission = async (mission: Mission) => {
    if (isLoading) return;
    
    const isAlreadyCompleted = completedMissions.includes(mission.id);
    
    try {
      // If completing the mission, show loading state
      if (!isAlreadyCompleted) {
        setIsLoading(mission.id);
        
        // Simulate API call for the mission action
        if (mission.action) {
          const success = await mission.action();
          if (!success) throw new Error('Failed to complete mission');
        }
        
        // Add to completed missions
        setCompletedMissions(prev => [...prev, mission.id]);
        
        // Add points for this mission
        await addPoints(mission.points);
        
        toast({
          title: "Mission Complete!",
          description: `You've earned ${mission.points} MaxPoints for ${mission.title}`,
        });
        
        // If all missions are complete, award the Community Starter badge and add bonus points
        if (completedMissions.length === MISSIONS.length) {
          const badgeAdded = await addBadge('community_starter');
          if (badgeAdded) {
            await addBadge('community_starter');
          }
          
          const bonusPoints = 30;
          await addPoints(bonusPoints);
          
          toast({
            title: "All Missions Complete!",
            description: `You've earned a bonus of ${bonusPoints} MaxPoints!`,
          });
        }
      } else {
        // If unchecking, just remove from completed
        setCompletedMissions(prev => prev.filter(id => id !== mission.id));
      }
    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: "Error",
        description: `Failed to complete ${mission.title}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  // This function is merged into the handleComplete above
  // and completeStep handles the submission logic

  const handleSkip = () => {
    // Skip to the next step without completing missions
    nextStep();
  };

  return (
    <>
      <BadgePopup 
        isOpen={showBadge} 
        onClose={async () => {
          setShowBadge(false);
          await completeStep();
        }}
        onContinue={async () => {
          setShowBadge(false);
          await completeStep();
        }}
        badgeType="community_starter"
        totalPoints={points + totalPoints}
      />
      <OnboardingContainer
        currentStep={currentStep}
        totalSteps={totalSteps}
        title="Engage with the Community"
        description="Complete missions to earn points and level up"
        className="max-w-6xl w-full"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Your First Missions</h2>
            <p className="text-muted-foreground">
              Complete these simple tasks to get started and earn up to 60 MaxPoints!
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {MISSIONS.map((mission) => {
            const isComplete = completedMissions.includes(mission.id);
            const isMissionLoading = isLoading === mission.id;
            
            return (
              <div
                key={mission.id}
                onClick={() => toggleMission(mission)}
                className={`p-4 rounded-lg border-2 flex items-start justify-between cursor-pointer transition-all ${
                  isComplete 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    isComplete 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <mission.icon className={`w-5 h-5 ${
                      isComplete ? 'text-green-600 dark:text-green-400' : ''
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {mission.title}
                      {isMissionLoading && (
                        <Loader2 className="ml-2 h-4 w-4 inline-block animate-spin" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mission.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-3 ${
                    isComplete ? 'text-yellow-600' : 'text-muted-foreground'
                  }`}>
                    +{mission.points}
                  </span>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedMissions.length} of {MISSIONS.length} missions complete
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{totalPoints} MaxPoints</p>
              {allComplete && (
                <p className="text-xs text-green-500">+30 bonus points for completing all!</p>
              )}
            </div>
          </div>

          <NavigationButtons 
            onNext={handleComplete}
            onBack={prevStep}
            onSkip={handleSkip}
            isNextDisabled={completedMissions.length === 0}
            isNextLoading={isSubmitting}
            showBack={true}
            showSkip={true}
            nextLabel={isSubmitting ? 'Saving...' : 'Continue'}
          />
        </div>
      </OnboardingContainer>
    </>
  );
}
