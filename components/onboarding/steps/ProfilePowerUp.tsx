'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Dumbbell, Home, Building, Mountain, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const gymTypes = [
  { id: 'home', name: 'Home Gym', icon: <Home className="w-5 h-5" /> },
  { id: 'commercial', name: 'Commercial Gym', icon: <Building className="w-5 h-5" /> },
  { id: 'outdoor', name: 'Outdoor', icon: <Mountain className="w-5 h-5" /> },
];

const trainingStyles = [
  { id: 'strength', name: 'Strength Training' },
  { id: 'hiit', name: 'HIIT' },
  { id: 'bodybuilding', name: 'Bodybuilding' },
  { id: 'crossfit', name: 'CrossFit' },
  { id: 'calisthenics', name: 'Calisthenics' },
  { id: 'powerlifting', name: 'Powerlifting' },
];

const fitnessGoals = [
  { id: 'lose_weight', name: 'Lose Weight' },
  { id: 'build_muscle', name: 'Build Muscle' },
  { id: 'get_stronger', name: 'Get Stronger' },
  { id: 'improve_endurance', name: 'Improve Endurance' },
  { id: 'general_fitness', name: 'General Fitness' },
];

interface ProfileData {
  goal: string;
  gymType: string;
  trainingStyles: string[];
}

function ProfilePowerUp({ onComplete }: { onComplete: (data: ProfileData) => void }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [selectedGymType, setSelectedGymType] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      onComplete({
        goal,
        gymType: selectedGymType,
        trainingStyles: selectedStyles,
      });
    }
  };

  const toggleTrainingStyle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleGoalSelect = (goalId: string) => {
    setGoal(goalId);
  };

  const handleGymTypeSelect = (gymTypeId: string) => {
    setSelectedGymType(gymTypeId);
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !goal;
      case 2: return !selectedGymType;
      case 3: return selectedStyles.length === 0;
      default: return false;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          {step === 1 && 'What\'s your main fitness goal?'}
          {step === 2 && 'Where do you usually work out?'}
          {step === 3 && 'What\'s your training style?'}
        </h2>
        <p className="text-muted-foreground">
          {step === 1 && 'Select your primary fitness objective'}
          {step === 2 && 'Choose your preferred workout environment'}
          {step === 3 && 'Select all that apply (you can change this later)'}
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 gap-3">
            {fitnessGoals.map((item) => (
              <button
                key={item.id}
                onClick={() => handleGoalSelect(item.id)}
                className={cn(
                  'p-4 border rounded-lg text-left transition-all',
                  'hover:border-primary hover:bg-primary/5',
                  goal === item.id ? 'border-primary bg-primary/5' : 'border-border',
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{item.name}</span>
                  {goal === item.id && <Check className="h-5 w-5 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gymTypes.map((gym) => (
              <button
                key={gym.id}
                onClick={() => handleGymTypeSelect(gym.id)}
                className={cn(
                  'p-6 border rounded-xl flex flex-col items-center justify-center space-y-2 transition-all',
                  'hover:border-primary hover:bg-primary/5',
                  selectedGymType === gym.id ? 'border-primary bg-primary/5' : 'border-border',
                )}
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {gym.icon}
                </div>
                <span className="font-medium">{gym.name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trainingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleTrainingStyle(style.id)}
                className={cn(
                  'p-4 border rounded-lg transition-all text-left',
                  'hover:border-primary hover:bg-primary/5',
                  selectedStyles.includes(style.id) ? 'border-primary bg-primary/5' : 'border-border',
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{style.name}</span>
                  {selectedStyles.includes(style.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : null}
          disabled={step === 1}
          className={step === 1 ? 'invisible' : ''}
        >
          Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Step {step} of 3
          </span>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled() || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {step === 3 ? 'Finishing...' : 'Continuing...'}
              </div>
            ) : (
              <>
                {step === 3 ? 'Finish' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePowerUp;
