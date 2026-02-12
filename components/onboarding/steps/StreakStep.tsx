'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { NavigationButtons } from '../NavigationButtons';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';
import { Flame, CheckCircle } from 'lucide-react';

export default function StreakStep() {
  const { nextStep } = useOnboarding();
  const currentStep = getOnboardingStepNumber('streak');
  const totalSteps = TOTAL_ONBOARDING_STEPS;
  const [currentDay, setCurrentDay] = useState(1);
  
  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userStreak', JSON.stringify({
        day: currentDay,
        lastActive: new Date().toISOString(),
      }));
    }
    nextStep();
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Daily Streak Started!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Come back tomorrow to continue your streak and earn bonus MaxPoints
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow">
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                day === 1 ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {day === 1 ? <CheckCircle className="w-5 h-5" /> : day}
              </div>
              <span className="text-xs">Day {day}</span>
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleComplete}
        className="w-full py-6 text-lg"
      >
        Complete Onboarding
      </Button>
    </div>
  );
}
