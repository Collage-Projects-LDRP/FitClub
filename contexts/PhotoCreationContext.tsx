"use client";

import { createContext, useContext, ReactNode, useState } from 'react';

type PhotoCreationStep = 'photo-selection' | 'template-selection' | 'sharing';

export interface Template {
  id: string;
  name: string;
  qrPosition: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
    width: string | number;
    height: string | number;
  };
  preview: string;
}

interface PhotoCreationContextType {
  currentStep: PhotoCreationStep;
  selectedPhotos: string[];
  selectedTemplate: Template | null;
  setSelectedPhotos: (photos: string[]) => void;
  setSelectedTemplate: (template: Template | null) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  reset: () => void;
  templates: Template[];
}

const PhotoCreationContext = createContext<PhotoCreationContextType | undefined>(
  undefined
);

export const TEMPLATES: Template[] = [
  {
    id: 'bottom-right',
    name: 'Bottom Right',
    qrPosition: {
      bottom: '10px',
      right: '10px',
      width: '25%',
      height: '25%',
    },
    preview: '/qr-code.png',
  },
  {
    id: 'top-right',
    name: 'Top Right',
    qrPosition: {
      top: '10px',
      right: '10px',
      width: '25%',
      height: '25%',
    },
    preview: '/qr-code.png',
  },
  {
    id: 'center',
    name: 'Centered',
    qrPosition: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '25%',
      height: '25%',
    },
    preview: '/qr-code.png',
  },
  {
    id: 'top-left',
    name: 'Top Left',
    qrPosition: {
      top: '20px',
      left: '20px',
      width: '25%',
      height: '25%',
    },
    preview: '/qr-code.png',
  },
];

export function PhotoCreationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<PhotoCreationStep>('photo-selection');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const steps: PhotoCreationStep[] = ['photo-selection', 'template-selection', 'sharing'];

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const reset = () => {
    setCurrentStep('photo-selection');
    setSelectedPhotos([]);
    setSelectedTemplate(null);
  };

  return (
    <PhotoCreationContext.Provider
      value={{
        currentStep,
        selectedPhotos,
        selectedTemplate,
        setSelectedPhotos,
        setSelectedTemplate,
        goToNextStep,
        goToPreviousStep,
        reset,
        templates: TEMPLATES,
      }}
    >
      {children}
    </PhotoCreationContext.Provider>
  );
}

export function usePhotoCreation() {
  const context = useContext(PhotoCreationContext);
  if (context === undefined) {
    throw new Error('usePhotoCreation must be used within a PhotoCreationProvider');
  }
  return context;
}
