"use client";

import { ReelCreationProvider, useReelCreation } from '@/contexts/ReelCreationContext';
import { IntroSelectionStep } from './components/IntroSelectionStep';
import { PhotoSelectionStep } from './components/PhotoSelectionStep';
import { OutroSelectionStep } from './components/OutroSelectionStep';
import { MusicSelectionStep } from './components/MusicSelectionStep';
import { PreviewStep } from './components/PreviewStep';
import { ProgressBar } from './components/ProgressBar';

function ReelCreationContent() {
  const { state } = useReelCreation();
  const { currentStep, steps } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroSelectionStep />;
      case 1:
        return <PhotoSelectionStep />;
      case 2:
        return <OutroSelectionStep />;
      case 3:
        return <MusicSelectionStep />;
      case 4:
        return <PreviewStep />;
      default:
        return <IntroSelectionStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30"></div>
            <h2 className="relative text-3xl font-bold text-white">
              Create Your Reel
            </h2>
          </div>
          <p className="text-gray-300">
            {currentStep === 0 && 'Choose an intro for your reel'}
            {currentStep === 1 && 'Select photos for your reel'}
            {currentStep === 2 && 'Choose an outro for your reel'}
            {currentStep === 3 && 'Select music for your reel'}
            {currentStep === 4 && 'Preview your reel'}
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800/50">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default function ReelCreationPage() {
  return (
    <ReelCreationProvider>
      <ReelCreationContent />
    </ReelCreationProvider>
  );
}

// This is a temporary fix to avoid the error in the ProgressBar component
// In a real implementation, you would move the ProgressBar component to a separate file
// and import it at the top of the file

function ProgressBar({ steps, currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-sm font-medium ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${(currentStep + 1) * (100 / steps.length)}%`
          }}
        />
      </div>
    </div>
  );
}
