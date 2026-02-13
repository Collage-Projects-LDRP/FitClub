'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Instagram, Loader2, Award, Dumbbell } from 'lucide-react';
import { OnboardingContainer } from '../OnboardingContainer';
import { BadgeType } from '@/types/onboarding';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';
import { toast } from '@/components/ui/use-toast';
import { NavigationButtons } from '../NavigationButtons';

export default function WelcomeStep() {
  const { nextStep, prevStep, addPoints, addBadge, state } = useOnboarding();
  const [isLoading, setIsLoading] = useState<'instagram' | 'tiktok' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.currentStep !== 'welcome') {
      router.push(`/onboarding#${state.currentStep}`);
    }
  }, [state.currentStep, router]);

  const currentStep = getOnboardingStepNumber('welcome');
  const totalSteps = TOTAL_ONBOARDING_STEPS;

  const handleSocialLogin = async (platform: 'instagram' | 'tiktok') => {
    try {
      setIsLoading(platform);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add points and badge
      addPoints(50);
      addBadge('new_challenger');
      
      // Show success toast with badge notification
      toast({
        title: "Achievement Unlocked!",
        description: (
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>You've earned the <span className="font-semibold">New Challenger</span> badge!</span>
          </div>
        ),
        duration: 5000,
      });
      
      // Move to next step
      nextStep();
      
    } catch (error) {
      console.error(`${platform} login failed:`, error);
      setError(`Failed to connect with ${platform}. Please try again.`);
      setIsLoading(null);
    }
  };

  return (
    <OnboardingContainer
      currentStep={1}
      totalSteps={totalSteps}
      title="Welcome to Our Community!"
      description="Let's get you set up in just a few steps"
    >
      <div className="w-full max-w-md text-center mx-auto">
          {/* Animated Dumbbell */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: [0, -15, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: { duration: 0.8, type: 'spring' },
              scale: { duration: 0.5 }
            }}
            className="mb-8 mx-auto w-24 h-24 flex items-center justify-center"
          >
            <Dumbbell className="w-16 h-16 text-purple-400" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              Welcome to FitClub
            </h1>
            <p className="text-lg text-gray-300">
              Your fitness journey starts here
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 max-w-sm mx-auto"
          >
            <Button
              onClick={() => handleSocialLogin('instagram')}
              disabled={!!isLoading}
              className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-lg"
            >
              {isLoading === 'instagram' ? (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <Instagram className="w-6 h-6 mr-2" />
              )}
              {isLoading === 'instagram' ? 'Connecting...' : 'Continue with Instagram'}
            </Button>
            
            <NavigationButtons
              onNext={() => nextStep()}
              onBack={prevStep}
              nextLabel="Continue as Guest"
              showBack={!!prevStep}
              showSkip={false}
              className="mt-6"
            />
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-sm text-gray-400"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </motion.div>
      </div>
    </OnboardingContainer>
  );
}
