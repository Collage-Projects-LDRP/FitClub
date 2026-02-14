"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

// Helper functions for transitions
const getInitialState = (type: string) => {
  console.log('Getting initial state for:', type);
  switch (type) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-up':
      return { y: '100%', opacity: 1 };
    case 'slide-down':
      return { y: '-100%', opacity: 1 };
    case 'slide-left':
      return { x: '100%', opacity: 1 };
    case 'slide-right':
      return { x: '-100%', opacity: 1 };
    case 'zoom':
      return { scale: 0.8, opacity: 0 };
    default:
      return { opacity: 0 };
  }
};

const getAnimateState = (type: string) => {
  console.log('Getting animate state for:', type);
  return {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1
  };
};

const getExitState = (type: string) => {
  console.log('Getting exit state for:', type);
  switch (type) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-up':
      return { y: '-50%', opacity: 0 };
    case 'slide-down':
      return { y: '50%', opacity: 0 };
    case 'slide-left':
      return { x: '-50%', opacity: 0 };
    case 'slide-right':
      return { x: '50%', opacity: 0 };
    case 'zoom':
      return { scale: 1.2, opacity: 0 };
    default:
      return { opacity: 0 };
  }
};

// Helper functions for transitions
const getTransitionInitial = (type: string, currentStep: number) => {
  if (currentStep !== 0) return { opacity: 1 };

  switch (type) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-up':
      return { y: '100%', opacity: 1 };
    case 'zoom':
      return { scale: 0.5, opacity: 0 };
    case 'slide-left':
      return { x: '100%', opacity: 1 };
    case 'slide-right':
      return { x: '-100%', opacity: 1 };
    default:
      return { opacity: 0 };
  }
};

const getTransitionAnimate = (type: string) => {
  switch (type) {
    case 'fade':
      return { opacity: 1 };
    case 'slide-up':
    case 'slide-left':
    case 'slide-right':
      return { x: 0, y: 0, opacity: 1 };
    case 'zoom':
      return { scale: 1, opacity: 1 };
    default:
      return { opacity: 1 };
  }
};

const getTransitionExit = (type: string) => {
  switch (type) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-up':
      return { y: '-50%', opacity: 0 };
    case 'slide-left':
      return { x: '-50%', opacity: 0 };
    case 'slide-right':
      return { x: '50%', opacity: 0 };
    case 'zoom':
      return { scale: 1.5, opacity: 0 };
    default:
      return { opacity: 0 };
  }
};

import { Trophy, ArrowUp, PlayCircle, Image as ImageIcon, Music, Film, X, Check, ChevronLeft, ChevronRight, Sparkles, Loader2, Dumbbell, Upload, QrCode as QrCodeIcon, Instagram, MessageSquare, Download, Play, ZoomIn, RotateCw, Award, Zap, Activity, Pause, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Logo } from '@/components/logo';
import Image from "next/image";
import { IntroAnimation } from "./components/reel-animation";
import { QRCode, QRCodePreview } from "./components/qr-code";

const PersonalBestReelCreator = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [showIntro, setShowIntro] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Get user's photos from the dashboard
  const { photos: userPhotos, loading: photosLoading } = useUserPhotos();

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  // Pause music when changing tabs
  useEffect(() => {
    if (audio && isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, [activeTab]);

  const togglePlayPause = (track: MusicTrack) => {
    if (currentTrackId === track.id) {
      // Toggle play/pause for current track
      if (audio) {
        if (isMusicPlaying) {
          audio.pause();
          setIsMusicPlaying(false);
        } else {
          audio.play().catch(error => console.error('Error playing audio:', error));
          setIsMusicPlaying(true);
        }
      }
    } else {
      // Stop current track and play new one
      if (audio) {
        audio.pause();
        audio.src = '';
      }

      const newAudio = new Audio(track.audioUrl);
      newAudio.play().catch(error => console.error('Error playing audio:', error));
      setAudio(newAudio);
      setCurrentTrackId(track.id);
      setIsMusicPlaying(true);

      // Update the reelAssets to show the currently playing track
      setReelAssets(prev => ({
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
      }));
    }
  };

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

  // Log the user photos for debugging
  console.log('User photos:', userPhotos);

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
    // Add some sample photos if userPhotos is empty
    ...(userPhotos && userPhotos.length > 0
      ? userPhotos.map(photo => ({
        id: photo.id,
        url: photo.url,
        aspectRatio: photo.aspectRatio || '9/16',
        isUpload: false,
        label: photo.category || 'Photo',
        date: new Date(photo.createdAt).toLocaleDateString()
      }))
      : [
        {
          id: 'sample1',
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Workout',
          date: new Date().toLocaleDateString()
        },
        {
          id: 'sample2',
          url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Progress',
          date: new Date(Date.now() - 86400000).toLocaleDateString()
        },
        {
          id: 'sample3',
          url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Workout',
          date: new Date(Date.now() - 85400000).toLocaleDateString()
        },
        {
          id: 'sample4',
          url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Workout',
          date: new Date(Date.now() - 84400000).toLocaleDateString()
        },
        {
          id: 'sample5',
          url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Workout',
          date: new Date(Date.now() - 83400000).toLocaleDateString()
        },
        {
          id: 'sample6',
          url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
          aspectRatio: '9/16',
          isUpload: false,
          label: 'Workout',
          date: new Date(Date.now() - 82400000).toLocaleDateString()
        },
      ])
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
      artist: 'Royalty Free Music',
      genre: 'Upbeat',
      duration: '2:30',
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 'motivational',
      title: 'Rise Up',
      artist: 'FitClub',
      genre: 'Motivational',
      duration: '2:45',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 'electronic',
      title: 'Neon Dreams',
      artist: 'FitClub',
      genre: 'Electronic',
      duration: '3:15',
      coverUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=500&fit=crop',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: 'rock',
      title: 'Mountain High',
      artist: 'FitClub',
      genre: 'Rock',
      duration: '2:50',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
  ];

  // Exercise details state
  const [exerciseDetails, setExerciseDetails] = useState({
    exercise: '',
    previousBest: '',
    newBest: '',
    unit: 'reps', // Default unit
    notes: ''
  });

  // Common strength exercises
  const strengthExercises = [
    'chin-up',
    'bench-press',
    'squat',
    'deadlift',
    'overhead-press',
    'barbell-row',
    'pull-up',
    'dip',
    'front-squat',
    'romanian-deadlift',
    'incline-bench-press',
    'other (specify in notes)'
  ];

  // State for multiple selected photos
  const [selectedPhotos, setSelectedPhotos] = useState<Array<{
    id: string;
    url: string;
    type: 'upload' | 'gallery';
    label?: string;
    date?: string;
  }>>([]);

  // Keep the existing personalBestPhoto state for backward compatibility
  const [personalBestPhoto, setPersonalBestPhoto] = useState({
    url: '',
    type: '' as 'upload' | 'gallery' | ''
  });

  // Animation options for personal best
  const [animationStyle, setAnimationStyle] = useState({
    type: 'fade' as 'fade' | 'slide-up' | 'zoom',
    speed: 'normal' as 'slow' | 'normal' | 'fast',
    delay: 0.3
  });

  // Transition effects between steps
  const [transitions, setTransitions] = useState({
    introToImage: 'fade',
    imageToImage: 'fade',
    imageToOutro: 'fade'
  });

  // Track which transition is being previewed and a key to force remount
  const [selectedTransitionType, setSelectedTransitionType] = useState<keyof typeof transitions>('introToImage');
  const [transitionKey, setTransitionKey] = useState(0);

  const transitionOptions = [
    { id: 'fade', name: 'Fade', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'slide-up', name: 'Slide Up', icon: <ArrowUp className="w-4 h-4" /> },
    { id: 'zoom', name: 'Zoom', icon: <ZoomIn className="w-4 h-4" /> },
    { id: 'slide-left', name: 'Slide Left', icon: <ChevronLeft className="w-4 h-4" /> },
    { id: 'slide-right', name: 'Slide Right', icon: <ChevronRight className="w-4 h-4" /> }
  ];

  // Define types for animation variants
  type AnimationVariant = {
    hidden: Record<string, any>;
    visible: {
      [key: string]: any;
      transition: {
        duration: number;
        delay: number;
      };
    };
  };

  type TransitionVariant = {
    initial: Record<string, any>;
    animate: Record<string, any>;
    exit: Record<string, any>;
  };

  // Animation variants
  const animationVariants: {
    [key: string]: AnimationVariant | {
      [key: string]: TransitionVariant;
    };
  } = {
    // Base animations
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    'slide-up': {
      hidden: { y: 50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    'slide-down': {
      hidden: { y: -50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    'slide-left': {
      hidden: { x: 50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    'slide-right': {
      hidden: { x: -50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    zoom: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: animationStyle.speed === 'slow' ? 0.8 : animationStyle.speed === 'fast' ? 0.3 : 0.5,
          delay: animationStyle.delay
        }
      }
    },
    // Transition variants for between steps
    transition: {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      'slide-up': {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 }
      },
      'slide-down': {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 }
      },
      'slide-left': {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
      },
      'slide-right': {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      },
      zoom: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 }
      }
    }
  };

  // Handle file upload for personal best photo
  const handlePersonalBestPhotoUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPersonalBestPhoto({
          url,
          type: 'upload'
        });
        // Also update reelAssets with the new photo URL
        setReelAssets(prev => ({
          ...prev,
          personalBest: {
            ...prev.personalBest,
            url,
            type: 'upload'
          }
        }));
      }
    };
    input.click();
  }, []);

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
    personalBest: { type: 'upload' as 'upload' | 'gallery', url: '' },
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
    { name: 'none', value: 'from-gray-800 to-gray-900', bg: 'bg-gradient-to-br from-gray-800 to-gray-900' },
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
      id: 'personal_best',
      title: 'Success',
      subtitle: 'Personal Best Animation',
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
      title: 'Allmaxnutrition Product',
      subtitle: 'Scan and get 10% discount',
      qrCode: '/qr-code.png',
      icon: <QrCodeIcon className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '5',
      title: 'Allmaxnutrition Product',
      subtitle: 'Scan and get 10% discount',
      qrCode: '/qr-code.png',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: '3',
      title: '',
      subtitle: 'SCAN TO AND GET 10% DISCOUNT',
      qrCode: '/qr-code.png',
      icon: <QrCodeIcon className="w-4 h-4" />,
      color: 'from-amber-500 to-red-600'
    },
    {
      id: '6',
      title: 'Allmaxnutrition Product',
      subtitle: 'Scan and get 10% discount',
      qrCode: '/qr-code.png',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'from-red-500 to-pink-500'
    },
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
    premium: {
      initial: {
        y: '100%',
        opacity: 0,
        scale: 0.5
      },
      animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 20,
          duration: 0.8
        }
      },
      hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
      }
    },
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
    personal_best: {
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

  // Define types for sequence steps
  type SequenceStep =
    | { type: 'intro' | 'details' | 'after' | 'outro'; duration: number }
    | { type: 'photo'; duration: number; photo: { id: string; url: string; type: 'upload' | 'gallery'; label?: string; date?: string } };

  // Define the sequence of steps with their durations in milliseconds
  const sequence: SequenceStep[] = [
    { type: 'intro', duration: 2000 },
    // { type: 'details', duration: 1500 }, // Show exercise details
    ...selectedPhotos.map(photo => ({
      type: 'photo' as const,
      duration: 3000, // 3 seconds per photo
      photo
    })),
    // { type: 'after', duration: 5000 },   // Show personal best photo
    { type: 'outro', duration: 2000 },
  ];

  // Reference to store the interval ID
  const sequenceInterval = React.useRef<NodeJS.Timeout | null>(null);

  // Reset sequence when opening/closing the preview
  useEffect(() => {
    if (showPreview) {
      // When opening preview, ensure we start from intro
      setCurrentStep(0);

      // Clear any existing intervals
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }

      // Store the current audio reference
      let currentAudio: HTMLAudioElement | null = null;

      // Auto-play the sequence when preview opens
      const timer = setTimeout(() => {
        // Start music playback if available
        if (reelAssets.music?.audioUrl) {
          // Create and play new audio
          currentAudio = new Audio(reelAssets.music.audioUrl);
          currentAudio.play().catch(e => console.error('Error playing music:', e));

          // Update audio state
          setAudio(currentAudio);
          setCurrentTrackId(reelAssets.music.id);
          setIsMusicPlaying(true);
        }

        // Start the preview
        setIsPlaying(true);
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        // Pause and clean up audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.src = '';
        }
        setIsMusicPlaying(false);

        // Clear preview interval if it exists
        if (sequenceInterval.current) {
          clearInterval(sequenceInterval.current);
          sequenceInterval.current = null;
        }
      };
    } else {
      // When closing preview, stop playback
      setIsPlaying(false);
      setCurrentStep(0);
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }
    }
  }, [showPreview, reelAssets.music?.audioUrl]); // Only depend on these values

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }
    };
  }, []);

  // Effect to handle the sequence playback when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }

      // Start the sequence from current step
      const currentDuration = sequence[currentStep]?.duration || 3000;

      sequenceInterval.current = setInterval(() => {
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;

          if (nextStep >= sequence.length) {
            if (sequenceInterval.current) {
              clearInterval(sequenceInterval.current);
              sequenceInterval.current = null;
            }
            // Pause music when sequence ends
            if (audio) {
              audio.pause();
              setIsMusicPlaying(false);
            }
            setIsPlaying(false);
            return prevStep;
          }

          return nextStep;
        });
      }, currentDuration);

      return () => {
        if (sequenceInterval.current) {
          clearInterval(sequenceInterval.current);
          sequenceInterval.current = null;
        }
      };
    }
  }, [isPlaying, currentStep, sequence]);

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      // Pause
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }
      // Pause music when preview is manually stopped
      if (audio) {
        audio.pause();
        setIsMusicPlaying(false);
      }
      setIsPlaying(false);
    } else {
      // If we're at the end, restart from the beginning
      const startStep = currentStep >= sequence.length - 1 ? 0 : currentStep;
      setCurrentStep(startStep);

      // Start music if available when replaying
      if (reelAssets.music?.audioUrl) {
        if (audio) {
          audio.currentTime = 0; // Reset to start
          audio.play().catch(e => console.error('Error playing music:', e));
        } else {
          const newAudio = new Audio(reelAssets.music.audioUrl);
          newAudio.play().catch(e => console.error('Error playing music:', e));
          setAudio(newAudio);
          setCurrentTrackId(reelAssets.music.id);
        }
        setIsMusicPlaying(true);
      }

      // Start playing the sequence
      setIsPlaying(true);

      // Clear any existing interval
      if (sequenceInterval.current) {
        clearInterval(sequenceInterval.current);
        sequenceInterval.current = null;
      }

      // Get the current step's duration
      const currentDuration = sequence[startStep]?.duration || 3000;

      // Set up the sequence playback
      sequenceInterval.current = setInterval(() => {
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;

          // If we've reached the end, stop at the last step
          if (nextStep >= sequence.length) {
            if (sequenceInterval.current) {
              clearInterval(sequenceInterval.current);
              sequenceInterval.current = null;
            }
            setIsPlaying(false);
            return prevStep; // Stay on the last step
          }

          // Get the duration for the next step
          const nextDuration = sequence[nextStep]?.duration || 3000;

          // Update the interval for the next step's duration
          if (sequenceInterval.current) {
            clearInterval(sequenceInterval.current);
            sequenceInterval.current = setInterval(arguments.callee, nextDuration);
          }

          return nextStep;
        });
      }, currentDuration);
    }
  }, [isPlaying, currentStep, sequence]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transitions':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Transition Effects</h3>
              <p className="text-sm text-gray-400">Customize the transitions between different sections of your reel</p>
            </div>

            <div className="space-y-6">
              {/* Intro to Image Transition */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Intro to Image Transition</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {transitionOptions.map((transition) => (
                    <button
                      key={`intro-${transition.id}`}
                      onClick={() => {
                        setTransitions(prev => ({
                          ...prev,
                          introToImage: transition.id
                        }));
                        setSelectedTransitionType('introToImage');
                        setTransitionKey(prev => prev + 1);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${transitions.introToImage === transition.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                        } transition-colors`}
                    >
                      <div className="h-8 w-8 flex items-center justify-center mb-1">
                        {transition.icon}
                      </div>
                      <span className="text-xs text-center">{transition.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image to Image Transition */}
              {/* <div className="space-y-3">
                <h4 className="text-sm font-medium">Image to Image Transition</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {transitionOptions.map((transition) => (
                    <button
                      key={`image-to-image-${transition.id}`}
                      onClick={() => {
                        setTransitions(prev => ({
                          ...prev,
                          imageToImage: transition.id
                        }));
                        setSelectedTransitionType('imageToImage');
                        setTransitionKey(prev => prev + 1);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                        transitions.imageToImage === transition.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      } transition-colors`}
                    >
                      <div className="h-8 w-8 flex items-center justify-center mb-1">
                        {transition.icon}
                      </div>
                      <span className="text-xs text-center">{transition.name}</span>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Image to Outro Transition */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Image to Outro Transition</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {transitionOptions.map((transition) => (
                    <button
                      key={`outro-${transition.id}`}
                      onClick={() => {
                        setTransitions(prev => ({
                          ...prev,
                          imageToOutro: transition.id
                        }));
                        setSelectedTransitionType('imageToOutro');
                        setTransitionKey(prev => prev + 1);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${transitions.imageToOutro === transition.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                        } transition-colors`}
                    >
                      <div className="h-8 w-8 flex items-center justify-center mb-1">
                        {transition.icon}
                      </div>
                      <span className="text-xs text-center">{transition.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

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
                          <div className="w-20 h-20 mb-4 flex items-center justify-center flex-col">
                            <Image
                              src="/allmax.png"
                              alt="Allmax Nutrition Logo"
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                            <Image
                              src="/fitclub-logo.png"
                              alt="FitClub Logo"
                              width={80}
                              height={80}
                              className="object-contain"
                            />
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
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
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
                        className={`h-12 rounded-md cursor-pointer transition-all flex items-center justify-center relative ${reelAssets.intro.bgColor === color.value ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : ''
                          } ${color.bg}`}
                        title={color.name}
                      >
                        {index === 0 && (
                          <span className="text-xs font-medium text-white text-shadow-sm">None</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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
                  onClick={() => togglePlayPause(track)}
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
                    {(reelAssets.music.id === track.id || currentTrackId === track.id) && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          {isMusicPlaying && currentTrackId === track.id ? (
                            <Pause className="h-4 w-4 text-white" />
                          ) : (
                            <Play className="h-4 w-4 text-white" />
                          )}
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

      case 'photo':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Personal Best Photos</h3>
              <p className="text-sm text-gray-400">Select multiple images from your gallery or upload new ones</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Select Photos</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photosLoading ? (
                  // Show loading skeleton while photos are loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={`loading-pb-${index}`} className="aspect-[9/16] rounded-lg bg-gray-800/50 animate-pulse"></div>
                  ))
                ) : (
                  galleryPhotos.map((photo) => (
                    <div
                      key={`pb-${photo.id}`}
                      onClick={() => {
                        if (photo.isUpload) {
                          // Handle upload
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files.length > 0) {
                              const newPhotos = Array.from(files).map((file, idx) => ({
                                id: `upload-${Date.now()}-${idx}`,
                                url: URL.createObjectURL(file),
                                type: 'upload' as const,
                                label: file.name,
                                date: new Date().toLocaleDateString()
                              }));
                              setSelectedPhotos(prev => [...prev, ...newPhotos]);
                            }
                          };
                          input.click();
                        } else {
                          // Add gallery photo to selection if not already selected
                          const isAlreadySelected = selectedPhotos.some(p => p.url === photo.url);
                          if (!isAlreadySelected) {
                            setSelectedPhotos(prev => [
                              ...prev,
                              {
                                id: photo.id,
                                url: photo.url,
                                type: 'gallery' as const,
                                label: photo.label,
                                date: photo.date
                              }
                            ]);
                          }
                        }
                      }}
                      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${!photo.isUpload && selectedPhotos.some(p => p.url === photo.url)
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
                              alt={photo.label || 'Photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <div className="text-white text-sm font-medium truncate">{photo.label}</div>
                            {photo.date && (
                              <div className="text-xs text-white/70">{photo.date}</div>
                            )}
                          </div>
                          {selectedPhotos.some(p => p.url === photo.url) && (
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

      case 'details':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Exercise Details</h3>

              {/* Exercise Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Exercise</label>
                <select
                  value={exerciseDetails.exercise}
                  onChange={(e) => setExerciseDetails(prev => ({
                    ...prev,
                    exercise: e.target.value
                  }))}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an exercise</option>
                  {strengthExercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              </div>

              {/* Animation Style */}
              {/* <div className="space-y-2 mt-6">
                <h4 className="text-sm font-medium text-gray-300">Animation Style</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'fade', label: 'Fade', icon: <Sparkles className="h-4 w-4" /> },
                    { id: 'slide-up', label: 'Slide Up', icon: <ArrowUp className="h-4 w-4" /> },
                    { id: 'zoom', label: 'Zoom', icon: <ZoomIn className="h-4 w-4" /> },
                    { id: 'flip', label: '3D Flip', icon: <RotateCw className="h-4 w-4" /> }
                  ].map((anim) => (
                    <button
                      key={anim.id}
                      onClick={() => setAnimationStyle(prev => ({
                        ...prev,
                        type: anim.id as any
                      }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                        animationStyle.type === anim.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      } transition-colors`}
                    >
                      {anim.icon}
                      <span className="text-sm">{anim.label}</span>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Animation Speed */}
              {/* <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Animation Speed</span>
                  <span className="text-xs text-gray-400 capitalize">{animationStyle.speed}</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={animationStyle.speed === 'slow' ? 0 : animationStyle.speed === 'fast' ? 2 : 1}
                    onChange={(e) => {
                      const speedValue = parseInt(e.target.value);
                      setAnimationStyle(prev => ({
                        ...prev,
                        speed: speedValue === 0 ? 'slow' : speedValue === 2 ? 'fast' : 'normal'
                      }));
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div> */}

              {/* Previous Personal Best */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Previous Personal Best</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={exerciseDetails.previousBest}
                      onChange={(e) => setExerciseDetails(prev => ({
                        ...prev,
                        previousBest: e.target.value
                      }))}
                      placeholder="Enter weight or reps"
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Trophy className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={exerciseDetails.unit}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                    className="w-24 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="reps">reps</option>
                    <option value="min">min</option>
                    <option value="sec">sec</option>
                  </select>
                </div>
              </div>

              {/* New Personal Best */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">New Personal Best</label>
                <div className="relative">
                  <input
                    type="number"
                    value={exerciseDetails.newBest}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      newBest: e.target.value
                    }))}
                    placeholder="Enter new weight or reps"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Award className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                </div>
              </div>

              {/* Improvement Display */}
              {exerciseDetails.previousBest && exerciseDetails.newBest && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-gray-200 mb-2">Your Progress</h4>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Improvement:</div>
                    <div className="text-lg font-bold text-green-400">
                      +{(parseFloat(exerciseDetails.newBest) - parseFloat(exerciseDetails.previousBest)).toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (parseFloat(exerciseDetails.newBest) / (parseFloat(exerciseDetails.previousBest) * 1.5)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'outro':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Outro Style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {outroOptions.map((option) => {
                  const isSelected = reelAssets.outro.animation === option.id;
                  const displayTitle = option.title === 'Thank You' ? 'THANKS FOR WATCHING' : option.title.toUpperCase();
                  const displaySubtitle = option.subtitle === 'Call to action' ? 'SUBSCRIBE FOR MORE' : option.subtitle.toUpperCase();

                  return (
                    <div
                      key={option.id}
                      onClick={() => setReelAssets(prev => ({
                        ...prev,
                        outro: {
                          ...prev.outro,
                          animation: option.id,
                          title: displayTitle,
                          subtitle: displaySubtitle,
                          icon: option.icon,
                          color: option.color
                        }
                      }))}
                      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : 'opacity-90 hover:opacity-100'}`}
                    >
                      <div className={`
                          bg-gray-800 rounded-lg overflow-hidden w-full aspect-[9/16]
                          ${isSelected ? 'ring-2 ring-blue-400' : ''}
                        `}>
                        <div className={`w-full h-full relative  bg-gradient-to-br`}>
                          {option.id === '5' || option.id === '6' ? (
                            // Special preview for options 5 and 6
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                              <div className="relative w-full h-full">
                                <QRCode
                                  qrCodePath={option.id === '6' ? '/1qr-code.png' : '/qr-code.png'}
                                  title={displayTitle}
                                  subtitle={displaySubtitle}
                                  outroId={option.id}
                                  className="w-full h-full"
                                />
                              </div>
                            </div>
                          ) : (
                            // Standard preview for other options
                            <div className="h-full flex flex-col items-center justify-center p-2">
                              <div className="relative w-16 h-16 mb-2">
                                <Image
                                  src="/allmax.png"
                                  alt="Allmax"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="text-center px-2">
                                <p className="text-xs font-medium text-white mb-1 line-clamp-1">{displayTitle}</p>
                                <p className="text-[10px] text-gray-300 line-clamp-1">{displaySubtitle}</p>
                              </div>
                              <div className="mt-2 bg-white/90 p-1 rounded">
                                <div className="relative w-10 h-10">
                                  <Image
                                    src={option.qrCode || '/qr-code.png'}
                                    alt="QR Code"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Background Color</h3>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
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
                    className={`relative h-12 rounded-lg overflow-hidden cursor-pointer transition-transform flex items-center justify-center ${reelAssets.outro.bgColor === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105'
                      : 'hover:scale-105'
                      }`}
                  >
                    <div className={`absolute inset-0 ${color.bg} flex items-center justify-center`}>
                      {index === 0 && (
                        <span className="text-xs font-medium text-white text-shadow-sm">None</span>
                      )}
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create Personal Best Reel</h1>
            <p className="text-gray-500 dark:text-gray-400">Celebrate your achievements with a stunning video</p>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
            {/* Left Panel - Selected Option Content */}
            <div className="lg:w-2/5 h-full flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    {activeTab === 'outro' && <Film className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'music' && <Music className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'photo' && <ImageIcon className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'details' && <Dumbbell className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'intro' && <Film className="h-5 w-5 text-blue-500" />}
                    {activeTab === 'transitions' && <Film className="h-5 w-5 text-blue-500" />}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-auto flex items-center justify-center">
                  <div className="w-full max-w-[300px] mx-auto p-4">
                    {activeTab === 'transitions' && (
                      <div className="space-y-6">
                        {/* Single Transition Preview */}
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">
                            {selectedTransitionType === 'introToImage' && 'Intro to Image'}
                            {selectedTransitionType === 'imageToImage' && 'Image to Image'}
                            {selectedTransitionType === 'imageToOutro' && 'Image to Outro'}
                          </h3>
                          <div key={transitionKey} className="relative h-64 rounded-lg overflow-hidden bg-gray-900/50 border-2 border-dashed border-gray-700 flex items-center justify-center">
                            <div className="relative w-full h-full flex items-center justify-center">
                              {selectedTransitionType === 'introToImage' && (
                                <motion.div
                                  key="intro-to-image"
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={getTransitionInitial(transitions.introToImage, 0)}
                                  animate={getTransitionAnimate(transitions.introToImage)}
                                  exit={getTransitionExit(transitions.introToImage)}
                                  transition={{
                                    duration: 0.7,
                                    ease: [0.25, 0.1, 0.25, 1],
                                  }}
                                >
                                  <div className="flex items-center justify-center w-full h-full">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                                      <Image
                                        src="/placeholder-user.jpg"
                                        alt="Intro to Image Transition"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {/* {selectedTransitionType === 'imageToImage' && (
                                <motion.div
                                  key="image-to-image"
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={getTransitionInitial(transitions.imageToImage, 1)}
                                  animate={getTransitionAnimate(transitions.imageToImage)}
                                  exit={getTransitionExit(transitions.imageToImage)}
                                  transition={{
                                    duration: 0.7,
                                    ease: [0.25, 0.1, 0.25, 1],
                                  }}
                                >
                                  <div className="flex items-center justify-center w-full h-full">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                                      <Image
                                        src="/placeholder-user.jpg"
                                        alt="Image to Image Transition"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )} */}

                              {selectedTransitionType === 'imageToOutro' && (
                                <motion.div
                                  key="image-to-outro"
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={getTransitionInitial(transitions.imageToOutro, 0)}
                                  animate={getTransitionAnimate(transitions.imageToOutro)}
                                  exit={getTransitionExit(transitions.imageToOutro)}
                                  transition={{
                                    duration: 0.7,
                                    ease: [0.25, 0.1, 0.25, 1],
                                  }}
                                >
                                  <div className="flex items-center justify-center w-full h-full">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                                      <Image
                                        src="/placeholder-user.jpg"
                                        alt="Image to Outro Transition"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 text-center">
                              <div className="inline-flex items-center gap-1 bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-gray-600">
                                {transitionOptions.find(t => t.id === transitions[selectedTransitionType])?.icon}
                                {transitionOptions.find(t => t.id === transitions[selectedTransitionType])?.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'photo' ? (
                      <div className="w-full">
                        <h3 className="text-center text-lg font-medium mb-4">
                          {selectedPhotos.length === 1 ? 'Selected Photo' : 'Selected Photos'}
                        </h3>
                        {selectedPhotos.length > 0 ? (
                          selectedPhotos.length === 1 ? (
                            // Single photo - full size
                            <div className="relative aspect-[9/16] rounded-lg overflow-hidden border border-gray-700">
                              <img
                                src={selectedPhotos[0].url}
                                alt="Selected photo"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 text-center">
                                {selectedPhotos[0].label || 'Your Photo'}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPhotos([]);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                title="Remove photo"
                              >
                                <X className="h-3.5 w-3.5 text-white" />
                              </button>
                            </div>
                          ) : (
                            // Multiple photos - grid view
                            <div className="grid grid-cols-2 gap-3">
                              {selectedPhotos.map((photo, index) => (
                                <div
                                  key={`preview-${photo.id}-${index}`}
                                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700"
                                >
                                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold z-10">
                                    {index + 1}
                                  </div>
                                  <img
                                    src={photo.url}
                                    alt={`Selected ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center truncate">
                                    {photo.label || `Photo ${index + 1}`}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove photo"
                                  >
                                    <X className="h-3.5 w-3.5 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <ImageIcon className="mx-auto h-10 w-10 mb-2" />
                            <p>No photos selected</p>
                            <p className="text-xs mt-1">Select photos from the right panel</p>
                          </div>
                        )}
                      </div>
                    ) : activeTab === 'intro' && (
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
                              className="relative w-52 h-52 flex items-center justify-center z-10 flex-col gap-5"
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              variants={logoVariants[reelAssets.intro.animation] || logoVariants.transform}
                            >
                              <Image
                                src="/allmax.png"
                                alt="Allmax Nutrition Logo"
                                width={220}
                                height={220}
                                className="object-contain drop-shadow-lg"
                                priority
                              />
                              <div className="w-18 h-18 mb-4 flex items-center justify-center flex-col">Powered by
                                <Image
                                  src="/fitclub-logo.png"
                                  alt="FitClub Logo"
                                  width={160}
                                  height={160}
                                  className="object-contain"
                                />
                              </div>
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
                    {activeTab === 'details' && (
                      <div className="w-full aspect-[9/16] relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        <motion.div
                          className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                          initial="hidden"
                          animate="visible"
                          variants={animationVariants[animationStyle.type]}
                          key={`preview-${animationStyle.type}-${animationStyle.speed}`}
                        >
                          <div className="relative w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                            <Dumbbell className="h-10 w-10 text-blue-400" />
                          </div>

                          <motion.h3
                            className="text-xl font-bold text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: animationStyle.delay + 0.1 }}
                          >
                            {exerciseDetails.exercise || 'Exercise Name'}
                          </motion.h3>

                          <div className="w-full max-w-xs mx-auto space-y-4 mt-4">
                            <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                              <span className="text-sm text-gray-300">Previous</span>
                              <div className="flex items-center">
                                <motion.span
                                  className="text-base font-medium text-gray-300"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: animationStyle.delay + 0.2 }}
                                >
                                  {exerciseDetails.previousBest || '--'}
                                </motion.span>
                                <span className="ml-1 text-xs text-gray-400">
                                  {exerciseDetails.unit}
                                </span>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                              </div>
                              <div className="relative flex justify-center">
                                <span className="px-3 bg-gray-900 text-xs text-gray-400">NEW RECORD</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
                              <span className="text-sm text-white">New Best</span>
                              <div className="flex items-center">
                                <motion.span
                                  className="text-lg font-bold text-white"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    delay: animationStyle.delay + 0.3,
                                    type: 'spring',
                                    stiffness: 300
                                  }}
                                >
                                  {exerciseDetails.newBest || '--'}
                                </motion.span>
                                <span className="ml-1 text-sm text-blue-200">
                                  {exerciseDetails.unit}
                                </span>
                              </div>
                            </div>

                            {exerciseDetails.previousBest && exerciseDetails.newBest && (
                              <motion.div
                                className="mt-4 text-sm text-green-400 bg-green-900/20 rounded-full px-3 py-1 inline-block"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: animationStyle.delay + 0.4 }}
                              >
                                +{Number(exerciseDetails.newBest) - Number(exerciseDetails.previousBest)} reps Personal Best!
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
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
                          <>
                            {reelAssets.outro.animation === '5' || reelAssets.outro.animation === '6' ? (
                              // Special handling for 5th and 6th outro options
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <QRCode
                                  qrCodePath={reelAssets.outro.animation === '6' ? '/1qr-code.png' : '/qr-code.png'}
                                  title={reelAssets.outro.title}
                                  subtitle={reelAssets.outro.subtitle}
                                  outroId={reelAssets.outro.animation}
                                  className="w-full h-full"
                                />
                              </div>
                            ) : (
                              // Standard outro options
                              <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center p-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={`outro-${reelAssets.outro.animation}-${animationKey}`}
                              >
                                <motion.div
                                  className="relative w-32 h-32 flex items-center justify-center z-10 flex-col gap-5"
                                  initial="initial"
                                  animate="animate"
                                  whileHover="hover"
                                  variants={logoVariants[reelAssets.outro.animation] || logoVariants.transform}
                                >
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
                                    outroId={reelAssets.outro.animation}
                                  />
                                </motion.div>
                              </motion.div>
                            )}
                          </>
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
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="intro" className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Intro</span>
                      </TabsTrigger>
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4" />
                        <span>Details</span>
                      </TabsTrigger>
                      <TabsTrigger value="photo" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Photo</span>
                      </TabsTrigger>
                      <TabsTrigger value="transitions" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>Transitions</span>
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
                          className="relative w-52 h-52 flex items-center justify-center z-10 flex-col gap-5"
                          variants={logoVariants[reelAssets.intro.animation] || logoVariants.transform}
                          initial="initial"
                          animate="animate"
                        >
                          <Image
                            src="/allmax.png"
                            alt="Allmax Nutrition Logo"
                            width={220}
                            height={220}
                            className="object-contain drop-shadow-lg"
                          />
                          <div className="mb-4 flex items-center justify-center">
                            <Logo size="sm" isClickable={false} showUnderline={false} />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Details Section */}
                    {/* {((isPlaying && sequence[currentStep].type === 'details') || (!isPlaying && activeTab === 'personalBest')) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
                        <div className="max-w-md w-full">
                          <div className="flex items-center justify-center mb-8">
                            <Dumbbell className="h-10 w-10 text-blue-400 mr-3" />
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                              Exercise Details
                            </h2>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-300 mb-2">Exercise</h3>
                              <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                                <p className="text-xl font-bold">{exerciseDetails.exercise || '--'}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Previous Best</h3>
                                <div className="bg-gray-800/30 rounded-lg p-3">
                                  <p className="text-2xl font-bold">{exerciseDetails.previousBest || '--'}</p>
                                  <p className="text-xs text-gray-400">{exerciseDetails.unit || 'kg'}</p>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">New Best</h3>
                                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
                                  <p className="text-3xl font-bold text-white">{exerciseDetails.newBest || '--'}</p>
                                  <p className="text-xs text-blue-300">{exerciseDetails.unit || 'kg'}</p>
                                </div>
                              </div>
                            </div>
                            
                            {exerciseDetails.notes && (
                              <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Notes</h3>
                                <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300">
                                  {exerciseDetails.notes}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Full-size Image with Overlay Details */}
                    {(isPlaying && sequence[currentStep]?.type === 'photo') && (
                      <div className="absolute inset-0 bg-black overflow-hidden">
                        <AnimatePresence mode="wait" onExitComplete={() => console.log('Animation complete')}>
                          <motion.div
                            key={`${currentStep}-${Date.now()}`}
                            className="absolute inset-0"
                            initial={getInitialState(transitions.introToImage)}
                            animate={getAnimateState(transitions.introToImage)}
                            exit={getExitState(transitions.introToImage)}
                            transition={{
                              duration: 0.7,
                              ease: [0.25, 0.1, 0.25, 1]
                            }}
                            style={{
                              willChange: 'transform',
                              // border: '2px solid red',
                              boxSizing: 'border-box'
                            }}
                            onAnimationStart={() => console.log('Animation started:', transitions.introToImage)}
                            onAnimationComplete={() => console.log('Animation completed')}
                          >
                            <img
                              src={sequence[currentStep].type === 'photo' ? sequence[currentStep].photo.url : ''}
                              alt={sequence[currentStep].type === 'photo' ? (sequence[currentStep].photo.label || 'Selected photo') : 'Photo'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                left: 0
                              }}
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90">
                          {/* Content container */}
                          <div className="relative h-full flex flex-col justify-end p-6 text-white">
                            {/* Personal Best Badge - Top Right */}
                            <div className="absolute top-6 right-6 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                              <Trophy className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
                              <span className="font-medium">PERSONAL BEST</span>
                            </div>

                            {/* Main content - Bottom aligned */}
                            <div className="max-w-2xl mx-auto w-full space-y-6">
                              {/* Exercise Name */}
                              <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                                  {exerciseDetails.exercise || '--'}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
                              </div>

                              {/* Stats Container */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Previous Best */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/60 transition-colors">
                                  <p className="text-xs font-medium text-gray-300 mb-1">PREVIOUS BEST</p>
                                  <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{exerciseDetails.previousBest || '--'}</span>
                                    <span className="ml-2 text-sm text-gray-300 opacity-80">{exerciseDetails.unit || 'reps'}</span>
                                  </div>
                                </div>

                                {/* New Best */}
                                <div className="bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:from-blue-500/50 hover:to-purple-500/50 transition-colors">
                                  <p className="text-xs font-medium text-blue-200 mb-1">NEW BEST</p>
                                  <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white">{exerciseDetails.newBest || '--'}</span>
                                    <span className="ml-2 text-sm text-blue-200 opacity-90">{exerciseDetails.unit || 'reps'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Improvement Badge */}
                              {exerciseDetails.previousBest && exerciseDetails.newBest && (
                                <div className="animate-bounce">
                                  <div className="inline-flex items-center bg-gradient-to-r from-green-600/80 to-emerald-500/80 text-white text-sm font-medium px-5 py-2.5 rounded-full border border-green-400/30 backdrop-blur-sm shadow-lg">
                                    <ArrowUp className="h-4 w-4 mr-2" />
                                    +{Number(exerciseDetails.newBest) - Number(exerciseDetails.previousBest)} {exerciseDetails.unit || 'reps'} Improvement!
                                  </div>
                                </div>
                              )}

                              {/* Notes */}
                              {exerciseDetails.notes && (
                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mt-4 animate-fade-in">
                                  <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-2 text-blue-300" />
                                    NOTES
                                  </p>
                                  <p className="text-white text-opacity-90">{exerciseDetails.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Personal Best Photo Section with Overlay Details */}
                    {((isPlaying && sequence[currentStep]?.type === 'after') || (!isPlaying && (activeTab === 'personalBest' || sequence[currentStep]?.type === 'after'))) && reelAssets.personalBest?.url && (
                      <div className="absolute inset-0 bg-gray-900">
                        {/* Full-screen background image */}
                        <div className="absolute inset-0">
                          <img
                            src={reelAssets.personalBest.url}
                            alt="Personal Best"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90">
                          {/* Content container */}
                          <div className="relative h-full flex flex-col justify-end p-6 text-white">
                            {/* Personal Best Badge - Top Right */}
                            <div className="absolute top-6 right-6 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                              <Trophy className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
                              <span className="font-medium">PERSONAL BEST</span>
                            </div>

                            {/* Main content - Bottom aligned */}
                            <div className="max-w-2xl mx-auto w-full space-y-6">
                              {/* Exercise Name */}
                              <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                                  {exerciseDetails.exercise || '--'}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
                              </div>

                              {/* Stats Container */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Previous Best */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/60 transition-colors">
                                  <p className="text-xs font-medium text-gray-300 mb-1">PREVIOUS BEST</p>
                                  <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{exerciseDetails.previousBest || '--'}</span>
                                    <span className="ml-2 text-sm text-gray-300 opacity-80">{exerciseDetails.unit || 'reps'}</span>
                                  </div>
                                </div>

                                {/* New Best */}
                                <div className="bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:from-blue-500/50 hover:to-purple-500/50 transition-colors">
                                  <p className="text-xs font-medium text-blue-200 mb-1">NEW BEST</p>
                                  <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white">{exerciseDetails.newBest || '--'}</span>
                                    <span className="ml-2 text-sm text-blue-200 opacity-90">{exerciseDetails.unit || 'reps'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Improvement Badge */}
                              {exerciseDetails.previousBest && exerciseDetails.newBest && (
                                <div className="animate-bounce">
                                  <div className="inline-flex items-center bg-gradient-to-r from-green-600/80 to-emerald-500/80 text-white text-sm font-medium px-5 py-2.5 rounded-full border border-green-400/30 backdrop-blur-sm shadow-lg">
                                    <ArrowUp className="h-4 w-4 mr-2" />
                                    +{Number(exerciseDetails.newBest) - Number(exerciseDetails.previousBest)} {exerciseDetails.unit || 'reps'} Improvement!
                                  </div>
                                </div>
                              )}

                              {/* Notes */}
                              {exerciseDetails.notes && (
                                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mt-4 animate-fade-in">
                                  <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-2 text-blue-300" />
                                    NOTES
                                  </p>
                                  <p className="text-white text-opacity-90">{exerciseDetails.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
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

                    {/* Play Again Button - Shows when outro is displayed */}
                    {!isPlaying && activeTab === 'outro' && (
                      <div className="absolute inset-0 flex items-center justify-center z-30">
                        <Button
                          onClick={() => {
                            setCurrentStep(0);
                            // Reset and restart music if available
                            if (reelAssets.music?.audioUrl) {
                              if (audio) {
                                audio.currentTime = 0; // Reset to start
                                audio.play().catch(e => console.error('Error playing music:', e));
                              } else {
                                const newAudio = new Audio(reelAssets.music.audioUrl);
                                newAudio.play().catch(e => console.error('Error playing music:', e));
                                setAudio(newAudio);
                                setCurrentTrackId(reelAssets.music.id);
                              }
                              setIsMusicPlaying(true);
                            }
                            setIsPlaying(true);
                          }}
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105 z-40"
                        >
                          <PlayCircle className="h-6 w-6 mr-2" />
                          Play Again
                        </Button>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {((isPlaying && sequence[currentStep]?.type === 'outro' && !hasFinished) || (!isPlaying && activeTab === 'outro')) && reelAssets.outro.animation && (
                        <motion.div
                          key="outro-content"
                          className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${reelAssets.outro.bgColor
                            ? `bg-gradient-to-br ${reelAssets.outro.bgColor}`
                            : 'bg-black'}`}
                          initial={getInitialState(transitions.imageToOutro)}
                          animate={getAnimateState(transitions.imageToOutro)}
                          exit={getExitState(transitions.imageToOutro)}
                          transition={{
                            duration: 0.7,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          style={{
                            willChange: 'transform',
                            boxSizing: 'border-box'
                          }}
                        >
                          {reelAssets.outro.animation === '5' || reelAssets.outro.animation === '6' ? (
                            // Special handling for 5th and 6th outro options
                            <div className="w-full h-full">
                              <QRCode
                                qrCodePath={reelAssets.outro.animation === '6' ? '/1qr-code.png' : '/qr-code.png'}
                                title={reelAssets.outro.title}
                                subtitle={reelAssets.outro.subtitle}
                                outroId={reelAssets.outro.animation}
                                className="w-full h-full"
                              />
                            </div>
                          ) : (
                            // Standard outro options
                            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                              <QRCode
                                qrCodePath="/qr-code.png"
                                title={reelAssets.outro.title}
                                subtitle={reelAssets.outro.subtitle}
                                outroId={reelAssets.outro.animation}
                                className="w-full h-full max-w-[200px] max-h-[200px]"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                    {!reelAssets.music ? (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-6 text-xs"
                        onClick={() => setActiveTab('music')}
                      >
                        <Music className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                          if (audio) {
                            audio.muted = !audio.muted;
                            // Update state to reflect mute status
                            if (audio.muted) {
                              setIsMusicPlaying(false);
                            } else {
                              // If unmuting and not playing, start playback
                              if (audio.paused) {
                                audio.play().catch(e => console.error('Error playing music:', e));
                              }
                              setIsMusicPlaying(true);
                            }
                          }
                        }}
                      >
                        {audio?.muted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  {reelAssets.music && (
                    <div className="flex items-center gap-3 mt-2">
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
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {reelAssets.music.title || 'No title'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {reelAssets.music.artist || 'Unknown Artist'}
                        </p>
                      </div>
                    </div>
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

export default PersonalBestReelCreator;
