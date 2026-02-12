'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ONBOARDING_STEPS } from '@/types/onboarding';
import { NavigationButtons } from '../NavigationButtons';
import { Dumbbell, Flame, Trophy, Award, Shirt, Sparkles, Users, ArrowRight, Check, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';
import { BadgePopup } from '../BadgePopup';

const categories = [
  { id: 'beachBody', name: 'Beach Body', description: 'Summer ready physiques and beach workouts with outdoor fitness routines.', icon: <Flame className="w-6 h-6" />, color: 'from-orange-400 to-pink-500', bgColor: 'bg-gradient-to-br from-orange-50 to-pink-50', userCount: 3, animation: 'animate-float' },
  { id: 'bikiniModel', name: 'Bikini Model', description: 'Competition ready bikini physiques with focus on symmetry and conditioning.', icon: <Shirt className="w-6 h-6" />, color: 'from-pink-400 to-purple-500', bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50', userCount: 3, animation: 'animate-pulse' },
  { id: 'betterMe', name: 'Better Me', description: 'Personal growth and self-improvement journey focusing on health and wellness.', icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-400 to-green-500', bgColor: 'bg-gradient-to-br from-teal-50 to-green-50', userCount: 4, animation: 'animate-pulse' },
  { id: 'athletesBody', name: "Athlete's Body", description: 'Multi-sport athletes focused on peak performance and functional strength.', icon: <Trophy className="w-6 h-6" />, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50', userCount: 4, animation: 'animate-bounce' },
  { id: 'amateurBodybuilder', name: 'Amateur BodyBuilder', description: 'Aspiring bodybuilders working towards their first competitions.', icon: <Dumbbell className="w-6 h-6" />, color: 'from-green-400 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50', userCount: 3, animation: 'animate-ping' },
  { id: 'powerlifter', name: 'Powerlifter', description: 'Strength athletes focused on the big three: squat, bench press, and deadlift.', icon: <Award className="w-6 h-6" />, color: 'from-red-400 to-rose-500', bgColor: 'bg-gradient-to-br from-red-50 to-rose-50', userCount: 2, animation: 'animate-pulse' },
  { id: 'fitnessmodel', name: 'Fitness Model', description: 'High-intensity functional training combining weightlifting, cardio, and bodyweight exercises.', icon: <Sparkles className="w-6 h-6" />, color: 'from-purple-400 to-indigo-500', bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50', userCount: 3, animation: 'animate-bounce' },
];

const gymTypes = [
  { id: 'commercial', name: 'Commercial Gym', icon: '🏢' },
  { id: 'home', name: 'Home Gym', icon: '🏠' },
  { id: 'crossfit', name: 'CrossFit Box', icon: '💪' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
];

const trainingStyles = [
  { id: 'bodybuilding', name: 'Bodybuilding' },
  { id: 'powerlifting', name: 'Powerlifting' },
  { id: 'calisthenics', name: 'Calisthenics' },
  { id: 'hiit', name: 'HIIT' },
  { id: 'functional', name: 'Functional Training' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const CategoryStep = () => {
  const router = useRouter();
  const { nextStep, updateUserData, addPoints, state, goToStep, completeStep, points } = useOnboarding();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGymType, setSelectedGymType] = useState<string | null>(null);
  const [selectedTrainingStyles, setSelectedTrainingStyles] = useState<string[]>([]);
  const [personalGoal, setPersonalGoal] = useState('');
  // Track if we're showing the category selection or details
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (state.userData.category) {
      const categoryExists = categories.some(cat => cat.id === state.userData.category);
      if (categoryExists) setSelectedCategory(state.userData.category);
    }
  }, [state.userData.category]);

  const handleContinue = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!showDetails) {
      if (!selectedCategory) {
        toast({
          title: "Please select a category",
          description: "You need to select a fitness category to continue",
          variant: "destructive"
        });
        return;
      }
      
      setIsLoading(true);
      try {
        await updateUserData({ 
          category: selectedCategory,
          // Store personalGoal in goals array if it exists
          goals: personalGoal ? [...(state.userData.goals || []), personalGoal] : state.userData.goals
        });
        
        // Mark the category step as complete
        completeStep('category');
        
        // Add points for completing the category selection
        addPoints(70, 'Completed category selection');
        
        // Show badge popup
        setShowBadge(true);
        
      } catch (error) {
        console.error('Error saving category:', error);
        toast({
          title: "Error",
          description: "There was an error saving your selection. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!selectedGymType || selectedTrainingStyles.length === 0) {
        toast({
          title: "Incomplete information",
          description: "Please fill in all required fields to continue",
          variant: "destructive"
        });
        return;
      }
      
      setIsLoading(true);
      try {
        await updateUserData({
          gymType: selectedGymType || undefined,
          trainingStyles: selectedTrainingStyles,
          // Store personalGoal in goals array if not already stored
          goals: personalGoal && !state.userData.goals?.includes(personalGoal) 
            ? [...(state.userData.goals || []), personalGoal] 
            : state.userData.goals
        });
        
        // Add points for completing the category selection
        await addPoints(50);
        
        // Complete the current step first
        completeStep('category');
        
        // Then navigate to the engagement step
        goToStep('engagement');
      } catch (error) {
        console.error('Error saving category details:', error);
        toast({
          title: "Error",
          description: "There was an error saving your details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTrainingStyle = (styleId: string) => {
    setSelectedTrainingStyles((prev: string[]) => 
      prev.includes(styleId) 
        ? prev.filter((id: string) => id !== styleId) 
        : [...prev, styleId]
    );
  };

  const handleBack = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      router.push('/signup');
    }
  };

  const handleSkip = () => {
    // Skip to the next step
    nextStep();
  };

  const currentStep = getOnboardingStepNumber('category');
  const totalSteps = TOTAL_ONBOARDING_STEPS;

  return (
    <div>
      <BadgePopup 
        isOpen={showBadge} 
        onClose={() => {
          setShowBadge(false);
          nextStep();
        }}
        onContinue={() => {
          setShowBadge(false);
          nextStep();
        }}
        badgeType="category_champion"
        totalPoints={points}
      />
      <OnboardingContainer
        currentStep={currentStep}
        totalSteps={totalSteps}
        title={!showDetails ? 'Select Your Fitness Category' : 'Tell Us More'}
        description={
          !showDetails
            ? 'Choose the category that best describes your fitness goals.'
            : 'Help us personalize your experience by sharing more about your fitness journey.'
        }
        className="max-w-6xl w-full"
      >
        {!showDetails ? (
          <div>
            <div className="w-full">
              <div className="text-center mb-6">
                <p className="text-lg text-muted-foreground">Select the category and get 20 MaxPoints!</p>
              </div>
            </div>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <motion.div 
                  key={category.id} 
                  variants={item} 
                  whileHover={{ y: -3, transition: { duration: 0.2 } }} 
                  onClick={() => setSelectedCategory(category.id)} 
                  className={cn(
                    'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col h-full',
                    'bg-white dark:bg-card hover:shadow-md',
                    selectedCategory === category.id 
                      ? 'border-primary ring-2 ring-primary/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mt-1',
                        `bg-gradient-to-br ${category.color} text-white`
                      )}>
                        {React.cloneElement(category.icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{category.name}</h3>
                        <p className="text-muted-foreground text-sm">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      <span>{category.userCount}K+ members</span>
                    </div>
                    {selectedCategory === category.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <NavigationButtons
              onNext={handleContinue}
              onBack={handleBack}
              onSkip={handleSkip}
              isNextDisabled={isLoading || !selectedCategory}
              isNextLoading={isLoading}
              showBack={true}
              showSkip={true}
              nextLabel={isLoading ? 'Saving...' : 'Continue'}
            />
          </div>
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">Tell Us More</h1>
                <p className="text-lg text-muted-foreground">Help us personalize your experience</p>
              </div>
              <div className="space-y-8">
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <label className="block text-sm font-medium text-foreground mb-3">Your Personal Goal</label>
                  <input 
                    type="text" 
                    value={personalGoal} 
                    onChange={(e) => setPersonalGoal(e.target.value)} 
                    placeholder="E.g., Lose 10kg, Run a marathon, Build muscle" 
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-foreground bg-transparent" 
                  />
                  <p className="mt-2 text-sm text-muted-foreground">What do you want to achieve with your fitness journey?</p>
                </div>
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <label className="block text-sm font-medium text-foreground mb-3">Where Do You Train?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {gymTypes.map((gym) => (
                      <button 
                        key={gym.id} 
                        type="button" 
                        onClick={() => setSelectedGymType(gym.id)} 
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                          selectedGymType === gym.id 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/10' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
                        }`}
                      >
                        <span className="text-3xl mb-2">{gym.icon}</span>
                        <span className="font-medium">{gym.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <label className="block text-sm font-medium text-foreground mb-3">Training Style</label>
                  <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                  <div className="flex flex-wrap gap-3">
                    {trainingStyles.map((style) => (
                      <button 
                        key={style.id} 
                        type="button" 
                        onClick={() => toggleTrainingStyle(style.id)} 
                        className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                          selectedTrainingStyles.includes(style.id) 
                            ? 'bg-primary text-primary-foreground border-primary shadow-md dark:text-white' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-foreground'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <NavigationButtons 
                  onNext={handleContinue}
                  onBack={handleBack}
                  onSkip={handleSkip}
                  isNextDisabled={!personalGoal.trim() || selectedTrainingStyles.length === 0 || !selectedGymType}
                  isNextLoading={isLoading}
                  showBack={true}
                  showSkip={true}
                  nextLabel={isLoading ? 'Saving...' : 'Continue'}
                />
              </div>
            </div>
          )}
        </OnboardingContainer>
      </div>
    );
  };

export default CategoryStep;
