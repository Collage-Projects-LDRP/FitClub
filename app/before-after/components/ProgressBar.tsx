"use client";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      {/* Step labels */}
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-sm font-medium transition-colors ${
              index <= currentStep 
                ? 'text-purple-400' 
                : 'text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Progress line */}
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
