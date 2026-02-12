import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface OnboardingContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  skippedSteps?: number[];
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  className,
  skippedSteps = [],
  ...props
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("mx-auto px-4 py-8 w-full max-w-4xl", className)} {...props}>
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
          
          {/* Steps */}
          <div className="flex justify-between relative z-10">
          {Array.from({ length: 6 }).map((_, index) => {
            const step = index + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;
            
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative ${
                  isCompleted 
                    ? skippedSteps.includes(step)
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 shadow-md'
                      : 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md'
                    : isActive 
                      ? 'bg-primary text-white shadow-lg border-2 border-white dark:border-gray-900' 
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className={isActive ? 'font-bold' : ''}>{step}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className={`mt-2 text-xs font-medium ${
                  isActive 
                    ? 'text-primary dark:text-primary-300 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step === 1 ? 'Sign Up' : 
                   step === 2 ? 'Category' : 
                   step === 3 ? 'Profile' : 
                   step === 4 ? 'Engagement' : 
                   step === 5 ? 'First Post' : 
                   step === 6 ? 'Rewards' : 
                   `Step ${step}`}
                </div>
                <div className={`mt-2 text-xs font-medium ${
                  isActive 
                    ? 'text-primary dark:text-red-300 font-semibold' 
                    : 'text-gray-500 dark:text-yellow-400'
                }`}>
                  {step === 1 ? '+50 MaxPoints' : 
                   step === 2 ? '+20 MaxPoints' : 
                   step === 3 ? '+30 MaxPoints' : 
                   step === 4 ? '+60 MaxPoints' : 
                   step === 5 ? '+100 MaxPoints' : 
                   step === 6 ? '' : 
                   `Step ${step}`}
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-6 text-xs font-medium text-primary dark:text-primary-300">
                    {step} of {totalSteps}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
      
      {/* Main Content with Border */}
      <div className="bg-gradient-to-br from-white/95 to-gray-50 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
