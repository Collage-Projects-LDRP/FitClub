'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Gift, Award, Star, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { NavigationButtons } from '../NavigationButtons';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';

import React from 'react';

interface Reward {
  id: string;
  name: string;
  points: number;
  icon: React.ReactNode;
  unlocked: boolean;
  description: string;
}

export default function RewardsStep() {
  const { nextStep, prevStep, state, updateUserData } = useOnboarding();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);

  // Initialize rewards
  useEffect(() => {
    const initializeRewards = () => {
      // Debug log to check user data
      console.log('User data in RewardsStep:', state.userData);
      
      const rewardsList: Reward[] = [
        { 
          id: 'welcome', 
          name: 'Welcome Bonus', 
          points: 50, 
          icon: <Gift className="w-5 h-5" />, 
          unlocked: true,
          description: 'For joining our fitness community!'
        },
        { 
          id: 'category', 
          name: 'Category Selection', 
          points: 20, 
          icon: <Award className="w-5 h-5" />, 
          unlocked: !!state.userData.category,
          description: 'For choosing your fitness category'
        },
        { 
          id: 'profile', 
          name: 'Profile Completion', 
          points: 30, 
          icon: <Star className="w-5 h-5" />, 
          unlocked: state.completedSteps.includes('profile'),
          description: 'For completing your profile'
        },
        { 
          id: 'engagement', 
          name: 'Community Engagement', 
          points: 30, 
          icon: <Zap className="w-5 h-5" />, 
          unlocked: (state.userData.completedMissions?.length || 0) > 0,
          description: 'For engaging with the community'
        },
        { 
          id: 'firstPost', 
          name: 'First Post', 
          points: 100, 
          icon: <Award className="w-5 h-5" />, 
          unlocked: !!(state.userData as any).firstPostAt || !!(state.userData as any).hasPosted,
          description: 'For making your first post'
        },
      ];
      
      console.log('Calculated rewards:', rewardsList.map(r => `${r.name}: ${r.unlocked ? 'unlocked' : 'locked'}`));

      setRewards(rewardsList);
      setTotalEarned(rewardsList.reduce((sum, r) => r.unlocked ? sum + r.points : sum, 0));
      setIsLoading(false);
    };

    initializeRewards();
  }, [state.userData]);

  // Handle the final step of onboarding
  const handleCompleteOnboarding = async () => {
    setIsCompleting(true);
    
    try {
      // Mark onboarding as complete in the database
      await updateUserData({
        // Add any user data that needs to be updated on completion
        lastActive: new Date().toISOString()
      });
      
      // Mark as complete in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'true');
      }
      
      // Show success message
      toast({
        title: "Onboarding Complete!",
        description: "You're all set to start your fitness journey.",
      });
      
      // Define demo profiles with their details
      const demoProfiles = [
        { 
          username: 'beachvibes', 
          name: 'Beach Vibes', 
          email: 'beach@example.com',
          id: 'demo-beachvibes-1'
        },
        { 
          username: 'bikinibabe', 
          name: 'Bikini Babe', 
          email: 'bikini@example.com',
          id: 'demo-bikinibabe-1'
        },
        { 
          username: 'sportstar', 
          name: 'Sport Star', 
          email: 'sport@example.com',
          id: 'demo-sportstar-1'
        },
        { 
          username: 'pro-builder', 
          name: 'Pro Builder', 
          email: 'pro@example.com',
          id: 'demo-probuilder-1'
        }
      ];
      
      // Select a random demo profile
      const demoProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];
      
      try {
        // Call the server-side login function
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: demoProfile.username,
            isDemo: true, // Indicate this is a demo login
            name: demoProfile.name,
            email: demoProfile.email,
          }),
          credentials: 'include' // Important for cookies to be set
        });

        const data = await loginResponse.json();
        
        if (!loginResponse.ok) {
          throw new Error(data.error || 'Failed to log in with demo account');
        }

        // Set client-side state
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_id', demoProfile.id);
          localStorage.setItem('username', demoProfile.username);
          localStorage.setItem('user_email', demoProfile.email);
          localStorage.setItem('user_name', demoProfile.name);
          localStorage.setItem('isDemoUser', 'true');
          
          // Redirect with a query parameter to indicate we're coming from signup
          window.location.href = '/dashboard?from=signup';
          return; // Prevent further execution
        }
      } catch (error) {
        console.error('Error during demo login:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to log in with demo account. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "There was an error completing your onboarding. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  const currentStep = getOnboardingStepNumber('rewards');
  const totalSteps = TOTAL_ONBOARDING_STEPS;

  return (
    <OnboardingContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="🎉 Your Rewards"
      description={`You've earned ${totalEarned} MaxPoints so far!`}
    >

      <div className="space-y-4 mb-8 w-full max-w-4xl mx-auto">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`p-4 rounded-lg border-2 flex items-center justify-between ${
              reward.unlocked
                ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                reward.unlocked
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {reward.icon}
              </div>
              <div>
                <h3 className="font-medium">
                  {reward.name}
                  {reward.unlocked && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      +{reward.points} MaxPoints
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reward.description}
                </p>
              </div>
            </div>
            {reward.unlocked ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <span className="text-sm text-muted-foreground">Locked</span>
            )}
          </div>
        ))}
      </div>

      <NavigationButtons
        onNext={handleCompleteOnboarding}
        onBack={prevStep}
        nextLabel={isCompleting ? 'Completing...' : 'Start Your Journey'}
        isNextLoading={isCompleting}
        showBack={!!prevStep}
        showSkip={false}
        className="mt-8"
      />
    </OnboardingContainer>
  );
}
