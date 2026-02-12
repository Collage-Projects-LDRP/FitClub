"use client";

import { useReelCreation } from '@/contexts/ReelCreationContext';
import { motion } from 'framer-motion';

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function NavigationButtons({
  onNext,
  onBack,
  nextDisabled = false,
  backDisabled = false,
  nextLabel = 'Next',
  backLabel = 'Back',
}: NavigationButtonsProps) {
  const { state, goToNextStep, goToPreviousStep } = useReelCreation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goToPreviousStep();
    }
  };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBack}
        disabled={state.currentStep === 0 || backDisabled}
        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
          state.currentStep === 0 || backDisabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {backLabel}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={nextDisabled}
        className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors ${
          nextDisabled
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {nextLabel} {state.currentStep < state.steps.length - 1 ? '→' : '✓'}
      </motion.button>
    </div>
  );
}
