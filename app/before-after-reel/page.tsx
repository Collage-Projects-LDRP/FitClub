"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, PlayCircle, Upload, Image as ImageIcon, Music, Sparkles, Film, X, Share2, Download, ImagePlus, MessageSquare, Instagram, QrCode as QrCodeIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Logo } from '@/components/logo';
import { IntroAnimation, OutroAnimation, ComparisonAnimation } from "./components/reel-animation";
import { QRCode, QRCodePreview } from "./components/qr-code";

const BeforeAfterReelCreator = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [showIntro, setShowIntro] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Get user's photos from the dashboard
  const { photos: userPhotos, loading: photosLoading } = useUserPhotos();

  // Define the gallery photo type
  type GalleryPhoto = {
    id: string;
    url: string;
    aspectRatio: string;
    isUpload: boolean;
    label: string;
    date?: string;
    icon?: React.ReactNode;
  };

  // Format user photos for the gallery
  const galleryPhotos: GalleryPhoto[] = [
    {
      id: 'upload',
      url: '',
      aspectRatio: '9/16',
      isUpload: true,
      label: 'Upload New',
      icon: <Upload className="h-6 w-6 text-gray-400" />
    },
    // Map user's photos to gallery format
    ...(userPhotos?.map(photo => ({
      id: photo.id,
      url: photo.url,
      aspectRatio: photo.aspectRatio || '9/16',
      isUpload: false,
      label: photo.category || 'Photo',
      date: new Date(photo.createdAt).toLocaleDateString()
    })) || [])
  ];

  // Define music track type with required properties
  type MusicTrack = {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: string;
    coverUrl: string;  // Make coverUrl required
    audioUrl: string;   // Make audioUrl required
  };

  // Available music tracks with placeholder URLs
  const musicTracks: MusicTrack[] = [
    {
      id: 'upbeat',
      title: 'Upbeat Vibes',
      artist: 'FitClub',
      genre: 'Upbeat',
      duration: '2:30',
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop',
      audioUrl: 'https://example.com/music/upbeat-vibes.mp3'
    },
    {
      id: 'motivational',
      title: 'Rise Up',
      artist: 'FitClub',
      genre: 'Motivational',
      duration: '2:45',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
      audioUrl: 'https://example.com/music/rise-up.mp3'
    },
    {
      id: 'electronic',
      title: 'Neon Dreams',
      artist: 'FitClub',
      genre: 'Electronic',
      duration: '3:15',
      coverUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=500&fit=crop',
      audioUrl: 'https://example.com/music/neon-dreams.mp3'
    },
    {
      id: 'rock',
      title: 'Mountain High',
      artist: 'FitClub',
      genre: 'Rock',
      duration: '2:50',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
      audioUrl: 'https://example.com/music/mountain-high.mp3'
    },
  ];

  const [reelAssets, setReelAssets] = useState({
    intro: {
      type: 'default' as const,
      url: '/default-intro.mp4',
      bgColor: 'from-gray-800 to-gray-900',
      animation: undefined as string | undefined,
      title: '',
      subtitle: '',
      color: '',
      icon: undefined as React.ReactNode
    },
    before: { type: 'upload' as 'upload' | 'gallery', url: '' },
    after: { type: 'upload' as 'upload' | 'gallery', url: '' },
    outro: {
      type: 'default' as 'default' | 'custom',
      url: '',
      bgColor: 'from-gray-800 to-gray-900',
      animation: undefined as string | undefined,
      title: 'THANKS FOR WATCHING',
      subtitle: 'Follow for more',
      color: '',
      icon: undefined as React.ReactNode
    },
    music: {
      id: '',
      title: 'No Music Selected',
      artist: 'Select a track below',
      genre: '',
      duration: '0:00',
      coverUrl: '/placeholder-music.jpg',
      audioUrl: ''
    },
  });

  const colorOptions = [
    { name: 'Purple', value: 'from-purple-500 to-pink-500', bg: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'Blue', value: 'from-blue-500 to-cyan-500', bg: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { name: 'Green', value: 'from-green-500 to-teal-500', bg: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { name: 'Red', value: 'from-red-500 to-pink-500', bg: 'bg-gradient-to-br from-red-500 to-pink-500' },
    { name: 'Orange', value: 'from-orange-500 to-yellow-500', bg: 'bg-gradient-to-br from-orange-500 to-yellow-500' },
    { name: 'Indigo', value: 'from-indigo-500 to-purple-500', bg: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
  ];

  const introOptions = [
    {
      id: 'transform',
      title: 'Transform',
      subtitle: 'Down to Up Animation',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'progress',
      title: 'Progress',
      subtitle: 'Small to Big Animation',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'before_after',
      title: 'Journey',
      subtitle: 'Left to Right Animation',
      icon: <Film className="w-4 h-4" />,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'custom',
      title: 'Custom',
      subtitle: 'Big to Small Animation',
      icon: <Upload className="w-4 h-4" />,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const outroOptions = [
    {
      id: '1',
      title: 'Vote For Me',
      subtitle: 'Scan to vote for me',
      qrCode: '/qr-code.png',
      icon: <QrCodeIcon className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '2',
      title: 'Referral Signup',
      subtitle: 'Scan to SignUp',
      qrCode: '/qr-code.png',
      icon: <Instagram className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      title: 'Allmaxnutrition Product',
      subtitle: 'Scan to buy',
      qrCode: '/qr-code.png',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: '4',
      title: 'Challenge',
      subtitle: 'Scan to challenge',
      qrCode: '/qr-code.png',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'from-red-500 to-pink-500'
    }
  ];

  // Animation variants for the intro options
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  } as const;

  // Enhanced animation variants for logo in each intro option
  const logoVariants: Record<string, any> = {
    transform: {
      initial: {
        y: '100%',
        scale: 0.5,
        opacity: 0
      },
      animate: {
        y: 0,
        scale: [0.5, 1.2, 1], // Scale up then settle
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 18,
          duration: 0.8,
          scale: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          },
          y: {
            type: 'spring',
            stiffness: 400,
            damping: 18
          }
        }
      },
      hover: {
        scale: 1.1,
        transition: {
          duration: 0.3,
          type: 'spring',
          stiffness: 400
        }
      }
    },
    progress: {
      initial: { y: -30, opacity: 0, scale: 0.8 },
      animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
          duration: 0.5
        }
      },
      hover: {
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 }
      }
    },
    before_after: {
      initial: { x: -50, opacity: 0, rotate: -20 },
      animate: {
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 250,
          damping: 15,
          duration: 0.5
        }
      },
      hover: {
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.3 }
      }
    },
    custom: {
      initial: { scale: 1.5, opacity: 0, rotate: 0 },
      animate: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
          duration: 0.5
        }
      },
      hover: {
        scale: 1.1,
        rotate: 15,
        transition: {
          duration: 0.3
        }
      }
    }
  };

  const itemVariants = {
    hidden: { y: 5, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const selectIntro = (option: typeof introOptions[number]) => {
    // First, reset the animation state
    setSelectedOption(null);

    // Force animation restart by updating the key
    setAnimationKey(prev => prev + 1);

    // Then update the selected option and assets
    setReelAssets(prev => ({
      ...prev,
      intro: {
        ...prev.intro, // Keep the existing bgColor
        animation: option.id,
        title: option.title,
        subtitle: option.subtitle,
        color: option.color,
        icon: option.icon
        // Don't update bgColor here - it will be handled by the color picker
      }
    }));

    // After a small delay, set the selected option to trigger the animation
    setTimeout(() => {
      setSelectedOption(option.id);
    }, 20);
  };
  const [showPreview, setShowPreview] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequenceTimeout, setSequenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hasFinished, setHasFinished] = useState(false);

  // Define the sequence of steps
  const sequence = [
    { type: 'intro', duration: 1500 },
    { type: 'before', duration: 1500 },
    { type: 'after', duration: 1500 },
    { type: 'comparison', duration: 3000 },
    { type: 'outro', duration: 1500 },
  ];

  // Reset sequence when opening/closing the preview
  useEffect(() => {
    if (showPreview) {
      // When opening preview, ensure we start from intro
      setCurrentStep(0);

      // Clear any existing timeouts
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
        setSequenceTimeout(null);
      }
    } else {
      // When closing preview, stop playback
      setIsPlaying(false);
      setCurrentStep(0);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
        setSequenceTimeout(null);
      }
    }
  }, [showPreview]);


  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, [sequenceTimeout]);

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
        setSequenceTimeout(null);
      }
    } else {
      // Play from the beginning if we're at the end
      if (currentStep === sequence.length - 1 || hasFinished) {
        setCurrentStep(0);
        setHasFinished(false);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, sequenceTimeout, currentStep, hasFinished]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    setCurrentStep(0);
    setHasFinished(false);
    setIsPlaying(true);
  }, []);

  // Handle the sequence playback
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timeouts
    if (sequenceTimeout) {
      clearTimeout(sequenceTimeout);
    }

    // Set a timeout to move to the next step
    const timeout = setTimeout(() => {
      setCurrentStep(prevStep => {
        // If we've reached the end
        if (prevStep >= sequence.length - 1) {
          setIsPlaying(false);
          setHasFinished(true);
          return prevStep;
        }
        return prevStep + 1;
      });
    }, sequence[currentStep].duration);

    setSequenceTimeout(timeout);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isPlaying, currentStep]);

  const handleFileUpload = (type: 'before' | 'after') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setReelAssets(prev => ({
          ...prev,
          [type]: { ...prev[type], url }
        }));
      }
    };
    input.click();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {/* <h3 className="text-base font-medium">Choose Intro</h3> */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-300">Intro Style</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    {introOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => selectIntro(option)}
                        className={`cursor-pointer transition-all ${reelAssets.intro.animation === option.id
                          ? 'ring-2 ring-blue-500'
                          : 'opacity-90 hover:opacity-100 border border-gray-700'
                          } bg-gray-800 rounded-lg overflow-hidden w-full aspect-[9/16]`}
                      >
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                          <div className="mb-4 flex items-center justify-center">
                            <Logo size="sm" isClickable={false} showUnderline={false} />
                          </div>
                          <h4 className="text-white font-medium text-center">{option.title}</h4>
                          <p className="text-white/70 text-sm text-center mt-1">{option.subtitle}</p>
                          {reelAssets.intro.animation === option.id && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            </div>
                          )}
                        </div>
                      </div>

                    ))}
                  </div>
                </div>

                {/* Background Color Section */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-3 text-gray-300">Background Color</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {colorOptions.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => setReelAssets(prev => ({
                          ...prev,
                          intro: {
                            ...prev.intro,
                            bgColor: color.value
                          }
                        }))}
                        className={`h-12 rounded-md cursor-pointer transition-all ${reelAssets.intro.bgColor === color.value ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : ''
                          } ${color.bg}`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'before':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Before Photo</h3>
              <p className="text-sm text-gray-400">Select an image from your gallery or upload a new one</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photosLoading ? (
                  // Show loading skeleton while photos are loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={`loading-${index}`} className="aspect-[9/16] rounded-lg bg-gray-800/50 animate-pulse"></div>
                  ))
                ) : (
                  galleryPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        if (photo.isUpload) {
                          handleFileUpload('before');
                        } else {
                          setReelAssets(prev => ({
                            ...prev,
                            before: {
                              ...prev.before,
                              url: photo.url,
                              type: 'gallery'
                            }
                          }));
                        }
                      }}
                      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${!photo.isUpload && reelAssets.before.url === photo.url
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 transform scale-[1.02]'
                        : 'hover:scale-[1.02] hover:shadow-lg'
                        }`}
                    >
                      {photo.isUpload ? (
                        <div className="absolute inset-0 border-2 border-dashed border-gray-500 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-500 transition-colors bg-gray-900/50">
                          <Upload className="h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-400 transition-colors" />
                          <span className="text-xs text-center text-gray-300 group-hover:text-white">Upload New</span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-gray-800">
                            <img
                              src={photo.url}
                              alt={photo.label || 'Gallery photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <div className="text-white text-sm font-medium truncate">{photo.label}</div>
                            {photo.date && (
                              <div className="text-xs text-white/70">{photo.date}</div>
                            )}
                          </div>
                          {reelAssets.before.url === photo.url && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'after':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add After Photo</h3>
              <p className="text-sm text-gray-400">Select an image from your gallery or upload a new one</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photosLoading ? (
                  // Show loading skeleton while photos are loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={`loading-after-${index}`} className="aspect-[9/16] rounded-lg bg-gray-800/50 animate-pulse"></div>
                  ))
                ) : (
                  galleryPhotos.map((photo) => (
                    <div
                      key={`after-${photo.id}`}
                      onClick={() => {
                        if (photo.isUpload) {
                          handleFileUpload('after');
                        } else {
                          setReelAssets(prev => ({
                            ...prev,
                            after: {
                              ...prev.after,
                              url: photo.url,
                              type: 'gallery'
                            }
                          }));
                        }
                      }}
                      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${!photo.isUpload && reelAssets.after.url === photo.url
                        ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900 transform scale-[1.02]'
                        : 'hover:scale-[1.02] hover:shadow-lg'
                        }`}
                    >
                      {photo.isUpload ? (
                        <div className="absolute inset-0 border-2 border-dashed border-gray-500 rounded-xl flex flex-col items-center justify-center p-4 hover:border-green-500 transition-colors bg-gray-900/50">
                          <Upload className="h-8 w-8 text-gray-400 mb-2 group-hover:text-green-400 transition-colors" />
                          <span className="text-xs text-center text-gray-300 group-hover:text-white">Upload New</span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-gray-800">
                            <img
                              src={photo.url}
                              alt={photo.label || 'Gallery photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <div className="text-white text-sm font-medium truncate">{photo.label}</div>
                            {photo.date && (
                              <div className="text-xs text-white/70">{photo.date}</div>
                            )}
                          </div>
                          {reelAssets.after.url === photo.url && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Music</h3>
            <div className="space-y-2">
              {musicTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setReelAssets(prev => ({
                    ...prev,
                    music: {
                      ...track,
                      title: track.title,
                      artist: track.artist,
                      genre: track.genre,
                      duration: track.duration,
                      coverUrl: track.coverUrl,
                      audioUrl: track.audioUrl
                    }
                  }))}
                  className={`w-full p-4 rounded-lg border transition-colors text-left flex items-center gap-3 ${reelAssets.music.id === track.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <Music className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {reelAssets.music.id === track.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Play className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {track.artist} • {track.genre}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {track.duration}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'outro':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Outro Style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {outroOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setReelAssets(prev => ({
                      ...prev,
                      outro: {
                        ...prev.outro,
                        animation: option.id,
                        title: option.title === 'Thank You' ? 'THANKS FOR WATCHING' : option.title.toUpperCase(),
                        subtitle: option.subtitle === 'Call to action' ? 'SUBSCRIBE FOR MORE' : option.subtitle.toUpperCase(),
                        icon: option.icon,
                        color: option.color
                      }
                    }))}
                    className={`cursor-pointer transition-all ${reelAssets.outro.animation === option.id
                      ? 'scale-105'
                      : 'opacity-80 hover:opacity-100'
                      }`}
                  >
                    <div className={`
                      bg-gray-800 p-1 rounded-lg 
                      ${reelAssets.outro.animation === option.id ? 'ring-2 ring-white/50' : ''} 
                      overflow-hidden w-full aspect-[9/16]
                    `}>
                      <div className="w-full h-full rounded-md flex flex-col items-center justify-center p-4 bg-gray-800">
                        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                          <div className="absolute inset-0 bg-white/5 rounded-lg flex items-center justify-center">
                            {React.cloneElement(option.icon, { className: 'w-8 h-8 text-white/30' })}
                          </div>
                          <QRCodePreview
                            qrCodePath={option.qrCode}
                            className="scale-75"
                          />
                        </div>
                        <h4 className="text-white font-medium text-sm text-center">{option.title}</h4>
                        <p className="text-white/70 text-xs text-center mt-1">{option.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Background Color</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {colorOptions.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setReelAssets(prev => ({
                      ...prev,
                      outro: {
                        ...prev.outro,
                        bgColor: color.value,
                        color: color.value // Also update the text color to match
                      }
                    }))}
                    className={`relative h-12 rounded-lg overflow-hidden cursor-pointer transition-transform ${reelAssets.outro.bgColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : 'hover:scale-105'
                      }`}
                  >
                    <div className={`absolute inset-0 ${color.bg} flex items-center justify-center`}>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create Before & After Reel</h1>
            <p className="text-gray-500 dark:text-gray-400">Showcase your transformation with a stunning video</p>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
            {/* Left Panel - Selected Option Content */}
            <div className="lg:w-2/5 h-full flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    {activeTab === 'outro' && <Film className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'before' && <ImageIcon className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'after' && <ImageIcon className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'music' && <Music className="h-5 w-5 text-blue-500" />}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden flex items-center justify-center">
                  <div className="w-full max-w-[300px] mx-auto p-4">
                    {activeTab === 'intro' && (
                      <div className={`w-full aspect-[9/16] relative rounded-lg overflow-hidden bg-gradient-to-br ${reelAssets.intro.bgColor}`}>
                        {reelAssets.intro.animation ? (
                          <motion.div
                            className="absolute inset-0 flex flex-col items-center justify-center p-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={`preview-${reelAssets.intro.animation}-${animationKey}`}
                          >
                            <motion.div
                              className="relative w-32 h-32 flex items-center justify-center z-10"
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              variants={logoVariants[reelAssets.intro.animation] || logoVariants.transform}
                            >
                              <Image
                                src="/fitclub-logo.png"
                                alt="Website Logo"
                                width={120}
                                height={120}
                                className="object-contain drop-shadow-lg"
                                priority
                              />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="text-center">
                              <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <Film className="h-12 w-12 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-white">No Intro Selected</h3>
                              <p className="text-sm text-gray-300 mt-1">Choose an intro style to preview</p>
                            </div>
                          </div>
                        )}
                        {reelAssets.intro.url ? (
                          <video
                            src={reelAssets.intro.url}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center flex-col p-6 text-center">
                            <Film className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Default intro will be used
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'before' && (
                      <div className="w-full relative">
                        {reelAssets.before.url ? (
                          <div className="flex flex-col space-y-4 w-full">
                            <h3 className="text-center text-lg font-medium text-gray-100">
                              Before Photo
                            </h3>
                            <div className="relative w-full max-w-2xl mx-auto">
                              <div className="relative w-full h-0 pb-[177.78%] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg overflow-hidden">
                                <img
                                  src={reelAssets.before.url}
                                  alt="Before preview"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 text-white py-3 text-center font-bold text-base md:text-lg">
                                  BEFORE
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
                            <ImageIcon className="h-16 w-16 text-blue-400 mb-4" />
                            <p className="text-sm text-gray-400 text-center">
                              Upload a before photo to get started
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'after' && (
                      <div className="w-full relative">
                        {reelAssets.after.url ? (
                          <div className="flex flex-col space-y-4 w-full">
                            <h3 className="text-center text-lg font-medium text-gray-100">
                              After Photo
                            </h3>
                            <div className="relative w-full max-w-2xl mx-auto">
                              <div className="relative w-full h-0 pb-[177.78%] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg overflow-hidden">
                                <img
                                  src={reelAssets.after.url}
                                  alt="After preview"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 text-white py-3 text-center font-bold text-base md:text-lg">
                                  AFTER
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
                            <ImageIcon className="h-16 w-16 text-green-400 mb-4" />
                            <p className="text-sm text-gray-400 text-center">
                              Upload an after photo to complete your transformation
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'music' && (
                      <div className="w-full flex flex-col items-center p-6">
                        <div className="relative w-full max-w-xs">
                          {/* Album Art */}
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
                            {reelAssets.music.coverUrl ? (
                              <img
                                src={reelAssets.music.coverUrl}
                                alt={reelAssets.music.title || 'Album cover'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music className="h-16 w-16 text-white" />
                              </div>
                            )}
                            {/* Play/Pause Button */}
                            <button
                              className="absolute inset-0 m-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                              onClick={() => {
                                // Toggle play/pause logic would go here
                                console.log('Play/Pause clicked');
                              }}
                            >
                              <Play className="h-8 w-8 text-white ml-1" />
                            </button>
                          </div>

                          {/* Track Info */}
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-white truncate">
                              {reelAssets.music.title || 'No Music Selected'}
                            </h3>
                            <p className="text-sm text-gray-300 mb-2">
                              {reelAssets.music.artist || 'Select a track below'}
                            </p>
                            {reelAssets.music.genre && (
                              <span className="inline-block px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full">
                                {reelAssets.music.genre}
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-6 space-y-2">
                            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: '30%' }} // This would be dynamic in a real player
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>1:23</span>
                              <span>-0:45</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'outro' && (
                      <div className={`w-full aspect-[9/16] relative rounded-lg overflow-hidden bg-gradient-to-br ${reelAssets.outro.bgColor || 'from-gray-800 to-gray-900'}`}>
                        {reelAssets.outro.animation ? (
                          <motion.div
                            className="absolute inset-0 flex flex-col items-center justify-center p-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={`outro-${reelAssets.outro.animation}-${animationKey}`}
                          >
                            <motion.div
                              className="relative w-32 h-32 flex items-center justify-center z-10"
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              variants={logoVariants[reelAssets.outro.animation] || logoVariants.transform}
                            >
                              <Image
                                src="/fitclub-logo.png"
                                alt="Website Logo"
                                width={120}
                                height={120}
                                className="object-contain drop-shadow-lg"
                                priority
                              />
                            </motion.div>

                            <motion.div
                              className="text-center mt-6 w-full"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <QRCode
                                qrCodePath="/qr-code.png"
                                title={reelAssets.outro.title}
                                subtitle={reelAssets.outro.subtitle}
                              />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="text-center">
                              <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <Film className="h-12 w-12 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-white">No Outro Selected</h3>
                              <p className="text-sm text-gray-300 mt-1">Choose an outro style to preview</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Options */}
            <div className="lg:w-3/5 h-full">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="intro" className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Intro</span>
                      </TabsTrigger>
                      <TabsTrigger value="before" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Before</span>
                      </TabsTrigger>
                      <TabsTrigger value="after" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>After</span>
                      </TabsTrigger>
                      <TabsTrigger value="music" className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span>Music</span>
                      </TabsTrigger>
                      <TabsTrigger value="outro" className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Outro</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="h-full">
                    {renderTabContent()}
                  </div>
                </CardContent>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      // Reset to intro and open preview
                      setCurrentStep(0);
                      setShowPreview(true);

                      // Start playing automatically after a small delay to ensure the preview is ready
                      setTimeout(() => {
                        setIsPlaying(true);
                      }, 100);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Reel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onOpenChange={setShowPreview}
        modal={true}
      >
        <DialogContent
          className="max-w-5xl w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <DialogTitle>Preview & Share Your Reel</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Preview Section */}
            <div className="w-[55%] p-6 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-auto">
              <div className="w-full max-w-[320px] mx-auto my-auto">
                {/* Mobile Frame */}
                <div className="relative mx-auto w-full max-w-[320px] bg-black shadow-2xl border-8 border-black rounded-[40px] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>

                  {/* Screen Content - 9:16 aspect ratio container */}
                  <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
                    {/* Show the current step in the sequence */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          onClick={togglePlay}
                        >
                          <PlayCircle className="h-8 w-8 text-white" />
                        </Button>
                      </div>
                    )}

                    {isPlaying && sequence[currentStep].type === 'intro' && reelAssets.intro.animation && (
                      <div className={`absolute inset-0 flex items-center justify-center ${reelAssets.intro.bgColor ? `bg-gradient-to-br ${reelAssets.intro.bgColor}` : 'bg-black'}`}>
                        <motion.div
                          className="relative w-48 h-48 flex items-center justify-center z-10"
                          variants={logoVariants[reelAssets.intro.animation] || logoVariants.transform}
                          initial="initial"
                          animate="animate"
                        >
                          <Image
                            src="/fitclub-logo.png"
                            alt="Logo"
                            width={180}
                            height={180}
                            className="object-contain drop-shadow-lg"
                          />
                        </motion.div>
                      </div>
                    )}

                    {((isPlaying && sequence[currentStep].type === 'before') || (!isPlaying && activeTab === 'before')) && reelAssets.before.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="relative w-full h-full">
                          <img
                            src={reelAssets.before.url}
                            alt="Before"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white py-3 text-center font-bold text-lg">
                            BEFORE
                          </div>
                        </div>
                      </div>
                    )}

                    {isPlaying && sequence[currentStep].type === 'comparison' && reelAssets.before.url && reelAssets.after.url && (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${reelAssets.intro.bgColor ? `bg-gradient-to-br ${reelAssets.intro.bgColor}` : 'bg-black'}`}>
                        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
                          {/* Logo - Centered at the top */}
                          <motion.div
                            className="relative z-10 mb-6 md:mb-10"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          >
                            <Image
                              src="/fitclub-logo.png"
                              alt="Logo"
                              width={150}
                              height={50}
                              className="h-10 md:h-12 w-auto object-contain drop-shadow-lg"
                            />
                          </motion.div>

                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4">
                            <motion.div
                              className="relative w-full flex justify-center"
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <div className="relative w-full max-w-[200px] md:max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                                <img
                                  src={reelAssets.before.url}
                                  alt="Before"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4">
                                  <h3 className="text-xl md:text-2xl font-bold text-white text-center tracking-wider">BEFORE</h3>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="relative w-full flex justify-center"
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              <div className="relative w-full max-w-[200px] md:max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                                <img
                                  src={reelAssets.after.url}
                                  alt="After"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4">
                                  <h3 className="text-xl md:text-2xl font-bold text-white text-center tracking-wider">AFTER</h3>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Watermark */}
                          <motion.div
                            className="absolute -bottom-8 right-0 text-white/50 text-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            @yourusername
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {((isPlaying && sequence[currentStep].type === 'after') || (!isPlaying && activeTab === 'after')) && reelAssets.after.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="relative w-full h-full">
                          <img
                            src={reelAssets.after.url}
                            alt="After"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white py-3 text-center font-bold text-lg">
                            AFTER
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Play Again Button - Shows when reel has finished */}
                    {hasFinished && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <div className="text-center">
                          <Button
                            onClick={handlePlayAgain}
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105"
                          >
                            <PlayCircle className="h-6 w-6 mr-2" />
                            Play Again
                          </Button>
                        </div>
                      </div>
                    )}

                    {((isPlaying && sequence[currentStep].type === 'outro' && !hasFinished) || (!isPlaying && activeTab === 'outro')) && reelAssets.outro.animation && (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${reelAssets.outro.bgColor ? `bg-gradient-to-br ${reelAssets.outro.bgColor}` : 'bg-black'}`}>
                        <motion.div
                          className="relative w-32 h-32 flex items-center justify-center z-10"
                          variants={logoVariants[reelAssets.outro.animation] || logoVariants.transform}
                          initial="initial"
                          animate="animate"
                        >
                          <Image
                            src="/fitclub-logo.png"
                            alt="Logo"
                            width={120}
                            height={120}
                            className="object-contain drop-shadow-lg"
                          />
                        </motion.div>
                        <motion.div
                          className="text-center mt-6 w-full"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >

                          <div className="mt-4 p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                            <div className="text-center">
                              {/* <p className="text-sm text-gray-300 mb-2">SCAN TO FOLLOW</p> */}
                              <div className="flex justify-center">
                                <QRCode
                                  qrCodePath="/qr-code.png"
                                  title=""
                                  subtitle=""
                                  className="w-22 h-22 p-2 bg-white rounded-lg"
                                />
                              </div>
                              {/* <p className="text-xs text-gray-400 mt-2">@yourusername</p> */}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                              {reelAssets.outro.title || 'Thanks for Watching'}
                            </h2>
                            <p className="text-gray-300 mb-4">
                              {reelAssets.outro.subtitle || 'Follow for more'}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {isPlaying && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {sequence.map((_, index) => (
                          <button
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-6 bg-white' : 'w-2 bg-white/50'
                              }`}
                            onClick={() => {
                              // Allow jumping to specific step
                              if (sequenceTimeout) clearTimeout(sequenceTimeout);
                              setCurrentStep(index);
                              playSequence();
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options Section */}
            <div className="w-[45%] p-6 overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-6">Share Your Reel</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share via</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-3 px-4 py-6 hover:shadow-md transition-all duration-200 border-input"
                      onClick={() => window.open('https://www.tiktok.com', '_blank')}
                    >
                      <div className="bg-black p-2.5 rounded-xl">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      </div>
                      <span className="font-medium text-white">TikTok</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-4 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                      onClick={() => window.open('https://www.instagram.com/stories/upload/', '_blank')}
                    >
                      <Instagram className="h-8 w-8 mb-1 text-pink-600" />
                      <span className="text-xs font-medium">Instagram</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => {
                        navigator.clipboard.writeText('https://example.com/reel/abc123');
                        // Add toast notification here if needed
                      }}
                    >
                      <MessageSquare className="h-8 w-8 mb-1 text-blue-500" />
                      <span className="text-xs font-medium">Copy Link</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-4 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => {
                        // Add download functionality here
                      }}
                    >
                      <Download className="h-8 w-8 mb-1 text-green-500" />
                      <span className="text-xs font-medium">Save Video</span>
                    </Button>
                  </div>
                </div>


                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium mb-2">Reel Details</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>15 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>12.5 MB</span>
                    </div>
                  </div>
                </div>
                {/* Music Player Section - Compact */}
                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Music</h3>
                    {!reelAssets.music && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-6 text-xs"
                        onClick={() => setActiveTab('music')}
                      >
                        <Music className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                  {reelAssets.music ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex-shrink-0 overflow-hidden">
                        {reelAssets.music.coverUrl ? (
                          <img
                            src={reelAssets.music.coverUrl}
                            alt={reelAssets.music.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{reelAssets.music.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {reelAssets.music.artist || 'Unknown Artist'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"

                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">No music selected</p>
                  )}
                </div>

                {/* Done Button */}
                <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowPreview(false)}
                      className="px-6"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeforeAfterReelCreator;
