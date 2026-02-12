"use client";

import { usePhotoCreation } from '@/contexts/PhotoCreationContext';

interface ProgressBarProps {
  steps: string[];
}

export function ProgressBar({ steps }: ProgressBarProps) {
  const { currentStep } = usePhotoCreation();
  
  // Map the current step to an index
  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case 'photo-selection':
        return 0;
      case 'template-selection':
        return 1;
      case 'sharing':
        return 2;
      default:
        return 0;
    }
  };
  
  const currentStepIndex = getCurrentStepIndex();
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-sm font-medium transition-colors ${
              index <= currentStepIndex 
                ? 'text-purple-400' 
                : 'text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${(currentStepIndex + 1) * (100 / steps.length)}%`
          }}
        />
      </div>
    </div>
  );
}
