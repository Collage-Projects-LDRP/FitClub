"use client";

import { useReelCreation } from '@/contexts/ReelCreationContext';

interface ProgressBarProps {
  steps: string[];
}

interface ProgressBarState {
  currentStep: number;
}

export function ProgressBar({ steps }: ProgressBarProps) {
  const { state } = useReelCreation();
  
  return (
    <div className="mb-12">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-sm font-medium transition-colors ${
              index <= state.currentStep 
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
            width: `${(state.currentStep + 1) * (100 / steps.length)}%`
          }}
        />
      </div>
    </div>
  );
}
