"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type BeforeAfterContextType = {
  beforePhoto: string | null;
  afterPhoto: string | null;
  setBeforePhoto: (photo: string | null) => void;
  setAfterPhoto: (photo: string | null) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  reset: () => void;
};

const STORAGE_KEY = 'beforeAfterData';

const BeforeAfterContext = createContext<BeforeAfterContextType | undefined>(undefined);

type BeforeAfterData = {
  beforePhoto: string | null;
  afterPhoto: string | null;
};

export function BeforeAfterProvider({ children }: { children: ReactNode }) {
  const [beforePhoto, setBeforePhotoState] = useState<string | null>(null);
  const [afterPhoto, setAfterPhotoState] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { beforePhoto: savedBefore, afterPhoto: savedAfter } = JSON.parse(savedData) as BeforeAfterData;
        if (savedBefore) setBeforePhotoState(savedBefore);
        if (savedAfter) setAfterPhotoState(savedAfter);
      }
    } catch (error) {
      console.error('Failed to load before/after data from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever photos change
  useEffect(() => {
    if (!isInitialized) return;
    
    const data: BeforeAfterData = {
      beforePhoto,
      afterPhoto,
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save before/after data to localStorage', error);
    }
  }, [beforePhoto, afterPhoto, isInitialized]);

  const setBeforePhoto = (photo: string | null) => {
    setBeforePhotoState(photo);
  };

  const setAfterPhoto = (photo: string | null) => {
    setAfterPhotoState(photo);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    if (prev === 3) {
      setBeforePhotoState(null);
    }
  };

  const reset = () => {
    setBeforePhotoState(null);
    setAfterPhotoState(null);
    setCurrentStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear before/after data from localStorage', error);
    }
  };

  return (
    <BeforeAfterContext.Provider
      value={{
        beforePhoto,
        afterPhoto,
        setBeforePhoto,
        setAfterPhoto,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        reset,
      }}
    >
      {children}
    </BeforeAfterContext.Provider>
  );
}

export function useBeforeAfter() {
  const context = useContext(BeforeAfterContext);
  if (context === undefined) {
    throw new Error('useBeforeAfter must be used within a BeforeAfterProvider');
  }
  return context;
}
