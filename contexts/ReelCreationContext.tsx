"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type ReelIntro = {
  id: string;
  name: string;
  description: string;
  duration: number;
  preview: React.ReactNode;
};

type ReelOutro = {
  id: string;
  name: string;
  description: string;
  duration: number;
  preview: React.ReactNode;
};

type MusicTrack = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  category: string;
  previewUrl: string;
};

type ReelCreationState = {
  currentStep: number;
  selectedIntro: ReelIntro | null;
  selectedOutro: ReelOutro | null;
  selectedMusic: MusicTrack | null;
  selectedPhotos: string[];
  steps: string[];
};

type ReelCreationContextType = {
  state: ReelCreationState;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  selectIntro: (intro: ReelIntro) => void;
  selectOutro: (outro: ReelOutro) => void;
  selectMusic: (music: MusicTrack) => void;
  addPhotos: (photos: string[]) => void;
  removePhoto: (index: number) => void;
  reset: () => void;
};

const initialState: ReelCreationState = {
  currentStep: 0,
  selectedIntro: null,
  selectedOutro: null,
  selectedMusic: null,
  selectedPhotos: [],
  steps: [
    'Choose Intro',
    'Add Photos',
    'Choose Outro',
    'Add Music',
    'Preview'
  ],
};

const ReelCreationContext = createContext<ReelCreationContextType | null>(null);

export function ReelCreationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReelCreationState>(initialState);

  const goToNextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1),
    }));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const selectIntro = useCallback((intro: ReelIntro) => {
    setState(prev => ({
      ...prev,
      selectedIntro: intro,
    }));
  }, []);

  const selectOutro = useCallback((outro: ReelOutro) => {
    setState(prev => ({
      ...prev,
      selectedOutro: outro,
    }));
  }, []);

  const selectMusic = useCallback((music: MusicTrack) => {
    setState(prev => ({
      ...prev,
      selectedMusic: music,
    }));
  }, []);

  const addPhotos = useCallback((photos: string[]) => {
    setState(prev => ({
      ...prev,
      selectedPhotos: [...prev.selectedPhotos, ...photos],
    }));
  }, []);

  const removePhoto = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      selectedPhotos: prev.selectedPhotos.filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(() => ({
    state,
    goToNextStep,
    goToPreviousStep,
    selectIntro,
    selectOutro,
    selectMusic,
    addPhotos,
    removePhoto,
    reset,
  }), [
    state,
    goToNextStep,
    goToPreviousStep,
    selectIntro,
    selectOutro,
    selectMusic,
    addPhotos,
    removePhoto,
    reset,
  ]);

  return (
    <ReelCreationContext.Provider value={value}>
      {children}
    </ReelCreationContext.Provider>
  );
}

export function useReelCreation() {
  const context = useContext(ReelCreationContext);
  if (!context) {
    throw new Error('useReelCreation must be used within a ReelCreationProvider');
  }
  return context;
}
