"use client";

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReelCreation } from '@/contexts/ReelCreationContext';
import { useRouter } from 'next/navigation';
import { Play, Pause, ArrowLeft, ArrowRight, Download, Share2, Instagram, Music, VolumeX, Volume2, RotateCcw } from 'lucide-react';

export function PreviewStep() {
  const { state, goToPreviousStep, reset } = useReelCreation();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentSection, setCurrentSection] = useState<'intro' | 'photo' | 'outro'>('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isCreatingAnother, setIsCreatingAnother] = useState(false);

  // Build ordered sections once
  const sections = useMemo(() => (
    [
      state.selectedIntro && 'intro',
      ...Array(state.selectedPhotos?.length || 0).fill('photo'),
      state.selectedOutro && 'outro'
    ].filter(Boolean) as Array<'intro' | 'photo' | 'outro'>
  ), [state.selectedIntro, state.selectedPhotos, state.selectedOutro]);

  // Keep current section aligned with available sections (so Intro/Outro show when selected)
  useEffect(() => {
    if (sections.length === 0) return;

    // If current section no longer exists (or on first render), jump to first available
    if (!sections.includes(currentSection)) {
      setCurrentSection(sections[0]);
      setCurrentSectionIndex(0);
      setCurrentPhotoIndex(0);
      return;
    }

    // Otherwise, keep index in sync
    const idx = sections.indexOf(currentSection);
    if (idx !== currentSectionIndex) {
      setCurrentSectionIndex(idx);
    }
  }, [sections, currentSection, currentSectionIndex]);

  // Per-section durations (ms)
  const DURATIONS = {
    intro: 2000,
    photo: 3000,
    outro: 2000,
  } as const;

  const getCurrentSectionLabel = () => {
    switch (currentSection) {
      case 'intro':
        return 'Intro';
      case 'photo':
        return `Photo ${currentPhotoIndex + 1} of ${state.selectedPhotos?.length || 0}`;
      case 'outro':
        return 'Outro';
      default:
        return '';
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted((m) => !m);
  };

  const handleShare = (platform: 'instagram' | 'tiktok') => {
    console.log(`Sharing to ${platform}`);
    alert(`Sharing to ${platform} would be implemented here`);
  };

  const handleDownload = () => {
    console.log('Downloading video');
    alert('Download functionality would be implemented here');
  };

  const handleCreateAnother = async () => {
    try {
      setIsCreatingAnother(true);
      reset();
      router.push('/reel-creation');
    } catch (error) {
      console.error('Error creating another reel:', error);
    } finally {
      setIsCreatingAnother(false);
    }
  };

  // Restart the preview from the beginning
  const handlePlayAgain = () => {
    // Figure out the first available section
    const firstSection: 'intro' | 'photo' | 'outro' | null = state.selectedIntro
      ? 'intro'
      : (state.selectedPhotos?.length || 0) > 0
      ? 'photo'
      : state.selectedOutro
      ? 'outro'
      : null;

    if (!firstSection) return;

    setCurrentSection(firstSection);
    const idx = sections.indexOf(firstSection);
    setCurrentSectionIndex(idx >= 0 ? idx : 0);
    setCurrentPhotoIndex(0);
    setIsPlaying(true);
  };

  // Helpers to move between frames
  const nextFrame = () => {
    if (currentSection === 'intro') {
      if ((state.selectedPhotos?.length || 0) > 0) {
        setCurrentSection('photo');
        setCurrentSectionIndex(sections.indexOf('photo'));
        setCurrentPhotoIndex(0);
      } else if (state.selectedOutro) {
        setCurrentSection('outro');
        setCurrentSectionIndex(sections.indexOf('outro'));
      } else {
        // Loop
        setCurrentSection('intro');
        setCurrentSectionIndex(0);
        setCurrentPhotoIndex(0);
      }
      return;
    }

    if (currentSection === 'photo') {
      const total = state.selectedPhotos?.length || 0;
      if (currentPhotoIndex < total - 1) {
        setCurrentPhotoIndex((i) => i + 1);
      } else if (state.selectedOutro) {
        setCurrentSection('outro');
        setCurrentSectionIndex(sections.indexOf('outro'));
      } else {
        // Loop back to intro
        setCurrentSection('intro');
        setCurrentSectionIndex(0);
        setCurrentPhotoIndex(0);
      }
      return;
    }

    if (currentSection === 'outro') {
      // Loop
      if (state.selectedIntro) {
        setCurrentSection('intro');
        setCurrentSectionIndex(0);
        setCurrentPhotoIndex(0);
      } else if ((state.selectedPhotos?.length || 0) > 0) {
        setCurrentSection('photo');
        setCurrentSectionIndex(sections.indexOf('photo'));
        setCurrentPhotoIndex(0);
      } else {
        setCurrentSection('outro');
      }
    }
  };

  const prevFrame = () => {
    if (currentSection === 'intro') {
      if (state.selectedOutro) {
        setCurrentSection('outro');
        setCurrentSectionIndex(sections.indexOf('outro'));
      } else if ((state.selectedPhotos?.length || 0) > 0) {
        setCurrentSection('photo');
        setCurrentSectionIndex(sections.indexOf('photo'));
        setCurrentPhotoIndex(Math.max(0, (state.selectedPhotos?.length || 1) - 1));
      }
      return;
    }

    if (currentSection === 'photo') {
      if (currentPhotoIndex > 0) {
        setCurrentPhotoIndex((i) => i - 1);
      } else if (state.selectedIntro) {
        setCurrentSection('intro');
        setCurrentSectionIndex(0);
      }
      return;
    }

    if (currentSection === 'outro') {
      if ((state.selectedPhotos?.length || 0) > 0) {
        setCurrentSection('photo');
        setCurrentSectionIndex(sections.indexOf('photo'));
        setCurrentPhotoIndex(Math.max(0, (state.selectedPhotos?.length || 1) - 1));
      } else if (state.selectedIntro) {
        setCurrentSection('intro');
        setCurrentSectionIndex(0);
      }
    }
  };

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;

    const duration = DURATIONS[currentSection];
    const timer = setTimeout(() => {
      nextFrame();
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSection, currentPhotoIndex, state.selectedPhotos]);

  // Build progress indicators with hover tooltips and click handlers
  const progressIndicators = sections.map((section, index) => {
    const isActive = index === currentSectionIndex || (section === 'photo' && currentSection === 'photo');
    const photoNumber = sections.slice(0, index + 1).filter((s) => s === 'photo').length;
    const label = section === 'intro' ? 'Intro' : section === 'photo' ? `Photo ${photoNumber}` : 'Outro';

    // Handle click on indicator to jump to section
    const handleClick = () => {
      if (section === 'photo') {
        // For photo sections, find the actual photo index to show
        const photoIndices = sections
          .slice(0, index + 1)
          .filter(s => s === 'photo');
        const targetPhotoIndex = photoIndices.length - 1;
        
        setCurrentSection('photo');
        setCurrentSectionIndex(sections.indexOf('photo', index));
        setCurrentPhotoIndex(targetPhotoIndex);
      } else {
        // For intro/outro
        setCurrentSection(section as 'intro' | 'outro');
        setCurrentSectionIndex(sections.indexOf(section));
      }
      setIsPlaying(false); // Pause when jumping sections
    };

    return (
      <button 
        key={index} 
        onClick={handleClick}
        className="relative flex-1 mx-0.5 group/indicator focus:outline-none"
        aria-label={`Go to ${label}`}
      >
        {/* Bar */}
        <div className={`h-1 w-full rounded-full transition-colors duration-200 ${
          isActive ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
        }`} />
        {/* Tooltip */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[10px] leading-none rounded bg-black/80 text-white opacity-0 group-hover/indicator:opacity-100 transition-opacity duration-150 shadow pointer-events-none">
          {label}
        </div>
      </button>
    );
  });

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4">
      {/* Left Side - Reel Preview */}
      <div className="lg:w-1/2 xl:w-2/5 flex flex-col items-center group">
        <div className={`relative w-full mx-auto group ${
          currentSection === 'intro' || currentSection === 'outro' ? 'max-w-[300px]' : 'max-w-[300px]'
        }`}>
          <div className="relative w-full aspect-[9/16] bg-black rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
            {/* Phone notch (always shown with outer frame) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20"></div>

            <div className={`relative w-full h-full bg-black ${currentSection === 'photo' ? 'rounded-[32px]' : ''} overflow-hidden`}>
              {/* Content Area */}
              <div className="relative w-full h-full overflow-hidden">
                {/* Intro Section */}
                {state.selectedIntro && (
                  <div 
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      currentSection === 'intro' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    {/* Solid background to avoid any bleed-through */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900" />
                    {/* Render the actual selected intro preview if provided */}
                    {state.selectedIntro.preview ? (
                      <div className="relative w-full h-full flex items-center justify-center transform scale-[1.6] md:scale-[1.5] transition-transform duration-300">
                        {state.selectedIntro.preview}
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center transform scale-[1.6] md:scale-[1.5] transition-transform duration-300">
                        <div className="text-center p-6">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{state.selectedIntro.name}</h3>
                          <p className="text-gray-300 text-lg">Your awesome intro</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Photo Slideshow - render only the active photo to avoid bleed */}
                {currentSection === 'photo' && state.selectedPhotos && state.selectedPhotos.length > 0 && (
                  <div 
                    className="absolute inset-0 opacity-100 z-0 transition-opacity duration-700"
                    style={{
                      backgroundImage: `url(${state.selectedPhotos[currentPhotoIndex]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Music Overlay */}
                    {state.selectedMusic?.id !== 'no-music' && (
                      <div className="absolute bottom-4 left-0 right-0 px-4">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center max-w-xs mx-auto">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                            <Music className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {state.selectedMusic?.name || 'No music'}
                            </p>
                            <p className="text-gray-300 text-xs truncate">
                              {state.selectedMusic?.artist}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Outro Section */}
                {state.selectedOutro && (
                  <div 
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      currentSection === 'outro' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    {/* Solid background to avoid any bleed-through */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                    {/* Render the actual selected outro preview if provided */}
                    {state.selectedOutro.preview ? (
                      <div className="relative w-full h-full flex items-center justify-center transform scale-[1.6] md:scale-[1.5] transition-transform duration-300">
                        {state.selectedOutro.preview}
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center transform scale-[1.6] md:scale-[1.5] transition-transform duration-300">
                        <div className="text-center p-6">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-2xl">👋</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{state.selectedOutro.name}</h3>
                          <p className="text-gray-300 text-lg">Thanks for watching!</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Current Section Indicator (bottom, visible on hover) */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gradient-to-t from-black/60 to-transparent -mx-4 -mb-3 px-4 pt-6 pb-3">
                  <div className="flex justify-center space-x-1">
                    {progressIndicators}
                  </div>
                </div>
              </div>
              
              {/* Play/Pause & Prev/Next Controls (visible on hover) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center gap-3">
                  {/* <button
                    onClick={prevFrame}
                    className="p-2 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition-all"
                    title="Previous"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button> */}
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-black/50 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  {/* <button
                    onClick={nextFrame}
                    className="p-2 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition-all"
                    title="Next"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button> */}
                </div>
              </div>
              
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-20">
                <button
                  onClick={handlePlayAgain}
                  className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  title="Play Again"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="text-white text-sm font-medium">
                  {getCurrentSectionLabel()}
                </div>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sharing Options */}
      <div className="lg:w-1/2 xl:w-3/5 p-4 bg-gray-900/30 rounded-2xl border border-gray-800 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6">Share Your Reel</h2>
        
        <div className="space-y-4 flex-1">
          {/* Instagram Share */}
          <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
               onClick={() => handleShare('instagram')}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Share to Instagram</h3>
                <p className="text-sm text-gray-400">Post to your Instagram feed</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* TikTok Share */}
          <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
               onClick={() => handleShare('tiktok')}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Share to TikTok</h3>
                <p className="text-sm text-gray-400">Post to your TikTok profile</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* Download */}
          <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
               onClick={handleDownload}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Download Reel</h3>
                <p className="text-sm text-gray-400">Save to your device</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="mt-6 pt-4 border-t border-gray-800 space-y-3">
          <button
            onClick={handleCreateAnother}
            disabled={isCreatingAnother}
            className={`w-full py-2.5 px-4 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center ${
              isCreatingAnother ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isCreatingAnother ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Another Reel'
            )}
          </button>
          <button
            onClick={goToPreviousStep}
            className="w-full py-2.5 px-4 text-white border border-gray-700 rounded-xl hover:bg-gray-800/50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
