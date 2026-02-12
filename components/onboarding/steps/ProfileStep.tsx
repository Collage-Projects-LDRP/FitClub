'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/components/ui/use-toast';
import { ONBOARDING_STEPS } from '@/types/onboarding';
import { useState } from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';

interface ProfileStepProps {
  handleProfileComplete: (data: any) => void;
}

type GymType = 'home' | 'commercial' | 'outdoor';
type TrainingStyle = 'strength' | 'hiit' | 'cardio' | 'bodyweight' | 'crossfit' | 'other';

export default function ProfileStep({ handleProfileComplete }: ProfileStepProps) {
  const { 
    nextStep, 
    prevStep, 
    goToStep, 
    completeStep, 
    updateUserData, 
    addPoints, 
    showBadge,
    addBadge,
    state
  } = useOnboarding();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [personalGoal, setPersonalGoal] = useState('');
  const [gymType, setGymType] = useState<GymType>('home');
  const [trainingStyle, setTrainingStyle] = useState<TrainingStyle>('strength');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trainingStyles = [
    { value: 'strength', label: 'Strength Training' },
    { value: 'loose-weight', label: 'Loose Weight' },
    { value: 'gain-weight', label: 'Gain Weight' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'crossfit', label: 'CrossFit' },
    { value: 'other', label: 'Other' },
  ];


  const currentStep = getOnboardingStepNumber('profile');
  const totalSteps = TOTAL_ONBOARDING_STEPS;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && username.trim() && personalGoal.trim()) {
      handleFormSubmit(e);
    }
  };

  const handleSkip = () => {
    // Add any skip logic here
    nextStep();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Store user data in the context
      updateUserData({
        // Store in goals array since these fields aren't in the base type
        goals: [
          ...(state.userData.goals || []),
          `Name: ${name}`,
          `Username: ${username}`,
          `Bio: ${bio}`,
          `Goal: ${personalGoal}`,
          `Gym Type: ${gymType}`,
          `Training Style: ${trainingStyle}`
        ].filter(Boolean)
      });

      // Add points for completing the profile (30 points for fully_pumped_profile badge)
      await addPoints(30);

      // Show the badge
      await showBadge('fully_pumped_profile');

      // Mark the profile step as complete
      completeStep('profile');

      // Navigate to the next step (engagement)
      goToStep('engagement');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Complete Your Profile"
      description="Tell us more about yourself to personalize your experience"
      className="max-w-6xl w-full"
    >
    <p className="text-center text-lg text-muted-foreground">Complete your profile and get 30 MaxPoints!</p>
      <form onSubmit={handleFormSubmit} className="space-y-6 bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            // required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio (Optional)</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="personalGoal">Your Personal Fitness Goal</Label>
          <Input
            id="personalGoal"
            value={personalGoal}
            onChange={(e) => setPersonalGoal(e.target.value)}
            placeholder="e.g., Build muscle, Lose weight, Run a 5K, etc."
            // required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Where do you usually work out?</Label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setGymType('home')}
              className={`p-4 border rounded-lg transition-colors ${gymType === 'home' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
            >
              🏠 Home Gym
            </button>
            <button
              type="button"
              onClick={() => setGymType('commercial')}
              className={`p-4 border rounded-lg transition-colors ${gymType === 'commercial' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
            >
              🏢 Commercial Gym
            </button>
            <button
              type="button"
              onClick={() => setGymType('outdoor')}
              className={`p-4 border rounded-lg transition-colors ${gymType === 'outdoor' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
            >
              🌳 Outdoor
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trainingStyle">Preferred Training Style</Label>
          <Select 
            value={trainingStyle} 
            onValueChange={(value: TrainingStyle) => setTrainingStyle(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your training style" />
            </SelectTrigger>
            <SelectContent>
              {trainingStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <NavigationButtons 
          onNext={handleNext}
          onBack={prevStep}
          onSkip={handleSkip}
          isNextDisabled={!name.trim() || !username.trim() || !personalGoal.trim()}
          isNextLoading={isSubmitting}
          showBack={true}
          showSkip={true}
          skipLabel="Skip"
          nextLabel={isSubmitting ? 'Saving...' : 'Save & Continue'}
          className="mt-8"
        />
      </form>
    </OnboardingContainer>
  );
}
