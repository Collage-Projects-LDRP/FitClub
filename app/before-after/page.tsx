"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBeforeAfter } from '@/contexts/BeforeAfterContext';
import BeforePhotoSelectionStep from './components/BeforePhotoSelectionStep';
import AfterPhotoSelectionStep from './components/AfterPhotoSelectionStep';
import TemplateSelectionStep from './components/TemplateSelectionStep';
import SharingStep from './components/SharingStep';
import ProgressBar from './components/ProgressBar';

const STEPS = ['Before Photo', 'After Photo', 'Select Template', 'Share'];

export default function BeforeAfterPage() {
  const router = useRouter();
  const { beforePhoto, afterPhoto, reset } = useBeforeAfter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<'slider' | 'side-by-side' | 'fade' | null>(null);
  const [showSharingStep, setShowSharingStep] = useState(false);

  // Reset the before photo when the component mounts (when navigating back from dashboard)
  useEffect(() => {
    reset();
  }, []);

  const handleBeforeContinue = () => {
    setCurrentStep(1);
  };

  const handleAfterContinue = () => {
    setCurrentStep(2);
  };

  const handleTemplateSelect = (templateId: 'slider' | 'side-by-side' | 'fade') => {
    setSelectedTemplate(templateId);
    setShowSharingStep(true);
    setCurrentStep(3); // Move to Share step
  };

  const handleBack = () => {
    if (showSharingStep) {
      setShowSharingStep(false);
      setCurrentStep(2);
    } else if (currentStep === 0) {
      // Navigate to dashboard page when on first step and back is clicked
      router.push('/dashboard');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
              Create Before & After
            </h2>
          </div>
          <p className="text-gray-400 mt-2">Showcase your transformation with a stunning before and after comparison</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          {showSharingStep ? (
            <SharingStep
              onBack={handleBack}
              onComplete={() => router.push('/dashboard')}
              selectedTemplate={selectedTemplate ?? 'side-by-side'}
            />
          ) : (
            <>
              {currentStep === 0 && (
                <BeforePhotoSelectionStep
                  onContinue={handleBeforeContinue}
                  onBack={handleBack}
                />
              )}
              {currentStep === 1 && (
                <AfterPhotoSelectionStep
                  onContinue={handleAfterContinue}
                  onBack={handleBack}
                />
              )}
              {currentStep === 2 && (
                <TemplateSelectionStep
                  onContinue={handleTemplateSelect}
                  onBack={handleBack}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
