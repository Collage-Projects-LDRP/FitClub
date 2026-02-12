'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ArrowRight, Instagram, Upload, Sparkles, Film, Share2, Check, CheckCircle, Gift, ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import type { Variants, Transition } from 'framer-motion';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

type WizardStep = 1 | 2 | 3;

interface WelcomeReelWizardProps {
  user: {
    id?: string | number;
    username?: string;
    email?: string;
    profile_image?: string;
  };
  onClose?: () => void;
}

const reelImages: Array<{
  id: number;
  src: string;
  alt: string;
  transition: Variants & { transition?: Transition };
}> = [
  { 
    id: 1, 
    src: '/reel-images/1.jpg', 
    alt: 'Fitness Training',
    transition: {
      enter: { x: 1000, opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: -1000, opacity: 0 },
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    }
  },
  { 
    id: 2, 
    src: '/reel-images/2.jpg', 
    alt: 'Workout Session',
    transition: {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.5 }
    }
  },
  { 
    id: 3, 
    src: '/reel-images/3.jpg', 
    alt: 'Gym Equipment',
    transition: {
      enter: { rotateY: 90, opacity: 0 },
      center: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 },
      transition: { type: "spring" as const, stiffness: 200, damping: 20 }
    }
  },
  { 
    id: 4, 
    src: '/reel-images/4.jpg', 
    alt: 'Personal Training',
    transition: {
      enter: { scale: 0.5, opacity: 0 },
      center: { scale: 1, opacity: 1 },
      exit: { scale: 1.5, opacity: 0 },
      transition: { duration: 0.5 }
    }
  },
  { 
    id: 5, 
    src: '/reel-images/5.jpg', 
    alt: 'Fitness Motivation',
    transition: {
      enter: { rotateX: 90, opacity: 0 },
      center: { rotateX: 0, opacity: 1 },
      exit: { rotateX: -90, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  },
  { 
    id: 6, 
    src: '/reel-images/6.jpg', 
    alt: 'Group Exercise',
    transition: {
      enter: { rotateY: 90, rotateX: 45, opacity: 0 },
      center: { rotateY: 0, rotateX: 0, opacity: 1 },
      exit: { rotateY: -90, rotateX: -45, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  },
  { 
    id: 7, 
    src: '/reel-images/7.jpg', 
    alt: 'Fitness Goals',
    transition: {
      enter: { y: 100, opacity: 0 },
      center: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 },
      transition: { 
        y: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.4 }
      }
    }
  }
];

const WelcomeReelWizard = ({ user }: WelcomeReelWizardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const controls = useAnimation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Howl | null>(null);

  // Initialize Howler sound
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-music-EVoxDUt8L7duT4plLTy5uMpy8qHP59.mp3'],
      loop: true,
      volume: 0.5,
      onplay: () => setIsMusicPlaying(true),
      onpause: () => setIsMusicPlaying(false),
      onstop: () => setIsMusicPlaying(false),
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  // Toggle music play/pause
  const toggleMusic = () => {
    if (!soundRef.current) return;

    if (isMusicPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMutedState = !isMuted;
    soundRef.current.mute(newMutedState);
    setIsMuted(newMutedState);
  };

  // Sync music with reel playback when mute state changes
  useEffect(() => {
    if (!soundRef.current) return;
    
    if (isPlaying && !isMuted) {
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [isMuted]);

  const togglePlayPause = () => {
    if (isPlaying) {
      // Pause both the reel and music
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.pause();
      }
    } else {
      // Start auto-rotation and play music if not muted
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === reelImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      
      // Start music if not muted
      if (soundRef.current && !isMuted) {
        soundRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Auto-rotate images every 3 seconds when isPlaying is true
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          if (prevIndex < reelImages.length - 1) {
            return prevIndex + 1;
          } else {
            // When we reach the last image, clear the interval
            // and let the play again button handle the next steps
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prevIndex;
          }
        });
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Handle showing play again button after last image is shown for 1 second
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (currentImageIndex === reelImages.length - 1) {
      // Only show play again button after 3 seconds on the last image
      timeoutId = setTimeout(() => {
        setShowPlayAgain(true);
        // Stop the music when play again button appears
        if (soundRef.current) {
          soundRef.current.pause();
          soundRef.current.seek(0); // Reset to beginning
        }
      }, 3000);
    } else {
      setShowPlayAgain(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentImageIndex]);

  const nextImage = () => {
    if (currentImageIndex < reelImages.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
      
      // If auto-playing, reset the interval
      if (isPlaying && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setCurrentImageIndex(prevIndex => 
            prevIndex < reelImages.length - 1 ? prevIndex + 1 : prevIndex
          );
        }, 3000);
      }
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prevIndex => prevIndex - 1);
      
      // If auto-playing, reset the interval
      if (isPlaying && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setCurrentImageIndex(prevIndex => 
            prevIndex < reelImages.length - 1 ? prevIndex + 1 : prevIndex
          );
        }, 3000);
      }
    }
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [direction, setDirection] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('WelcomeReelWizard mounted, isOpen:', isOpen);
    // Force the popup to be open when component mounts
    setIsOpen(true);
    
    // Add a keydown listener for the Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('WelcomeReelWizard unmounting');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Format user data for display
  const safeUser = {
    id: user?.id?.toString() || 'user',
    username: user?.username || 'user',
    email: user?.email || '',
    profile_image: user?.profile_image || ''
  };

  // Reel preview template
  const ReelPreview: React.FC = () => (
    <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl overflow-hidden shadow-xl">
      {uploadedImage ? (
        <img 
          src={uploadedImage} 
          alt="Your reel" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400">Your reel preview will appear here</p>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  const handleClose = () => {
    // Stop and clean up music when closing
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3) as WizardStep);
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1) as WizardStep);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to read the file',
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleShare = async (platform: 'instagram' | 'tiktok') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Success!',
        description: `Shared on ${platform === 'instagram' ? 'Instagram' : 'TikTok'}! 100 points added to your account.`,
      });
      setIsOpen(false);
    }, 1500);
  };

  // Single step for the popup
  const steps = [
    { id: 1, title: 'Share & Earn', icon: <Share2 size={16} /> },
  ] as const;

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-indigo-900/30"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMxZDE4MmEiLz48cGF0aCBkPSJNMzAgMzBMMzAgMzAiIHN0cm9rZT0iIzMxM2M1MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=')] opacity-10"></div>
            <div className="relative p-4 sm:p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Welcome to AllMax! 🎉</h2>
                  <p className="text-purple-300 text-sm">Share your profile to unlock rewards</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key="share-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="min-h-[300px] flex flex-col"
              >
                <div className="flex flex-col md:flex-row gap-5 items-center">
                  {/* Left side - Text Content */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Share Your Welcome Reel! 🎥</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Introduce yourself to the community with a welcome reel and connect with like-minded people!
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm font-medium">First Impressions Matter</p>
                            <p className="text-xs text-gray-400">Stand out with a personal welcome</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm font-medium">Build Your Network</p>
                            <p className="text-xs text-gray-400">Connect with fitness enthusiasts</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm font-medium">Earn Welcome Points</p>
                            <p className="text-xs text-gray-400">Get 100 points for your first share</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-5">
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg border border-purple-500/20">
                          <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-1.5">
                              <Gift size={16} />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">Welcome Bonus</p>
                              <p className="text-xs text-purple-300">100 points for sharing your reel</p>
                            </div>
                          </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleShare('instagram')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            <Instagram size={18} />
                            <span>{isLoading ? 'Sharing...' : 'Share on Instagram'}</span>
                          </button>
                          <button
                            onClick={() => handleShare('tiktok')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-white"
                            >
                              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.57-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                            </svg>
                            <span>{isLoading ? 'Sharing...' : 'Share on TikTok'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Reel Preview */}
                  <div className="w-full md:w-1/2">
                    <div className="relative max-w-xs mx-auto">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg"></div>
                      <div className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        {/* Reel Preview with Image Carousel */}
                        <div 
                          className="aspect-[9/16] w-full max-w-[280px] mx-auto bg-gray-900 rounded-xl overflow-hidden relative group"
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          {/* Play/Pause Button - Only show if not on last image */}
                          {currentImageIndex < reelImages.length - 1 && (
                            <motion.div 
                              className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            >
                              <motion.button
                                onClick={togglePlayPause}
                                className="bg-black/60 rounded-full p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                whileHover={{ 
                                  scale: 1.1,
                                  transition: { type: 'spring', stiffness: 500, damping: 20 }
                                }}
                                whileTap={{ 
                                  scale: 0.95,
                                  transition: { type: 'spring', stiffness: 500, damping: 20 }
                                }}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-6 h-6" />
                                ) : (
                                  <Play className="w-6 h-6" />
                                )}
                              </motion.button>
                            </motion.div>
                          )}

                          {/* Play Again Button - Only show on last image after delay */}
                          {showPlayAgain && (
                            <motion.div 
                              className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ 
                                opacity: 1,
                                transition: { duration: 0.3 }
                              }}
                              exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            >
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(0);
                                  setShowPlayAgain(false);
                                  setIsPlaying(true);
                                  // Restart auto-play
                                  if (intervalRef.current) clearInterval(intervalRef.current);
                                  intervalRef.current = setInterval(() => {
                                    setCurrentImageIndex(prev => 
                                      prev < reelImages.length - 1 ? prev + 1 : prev
                                    );
                                  }, 3000);
                                  // Restart music if not muted
                                  if (soundRef.current && !isMuted) {
                                    soundRef.current.play();
                                  }
                                }}
                                className="pointer-events-auto bg-black/70 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                                whileHover={{ 
                                  scale: 1.15, 
                                  rotate: 180,
                                  transition: { type: 'spring', stiffness: 500, damping: 20 }
                                }}
                                whileTap={{ 
                                  scale: 0.9,
                                  transition: { type: 'spring', stiffness: 500, damping: 20 }
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: 1,
                                  transition: { 
                                    type: 'spring', 
                                    stiffness: 500, 
                                    damping: 20 
                                  }
                                }}
                                exit={{ 
                                  opacity: 0, 
                                  scale: 0.8,
                                  transition: { duration: 0.2 }
                                }}
                                title="Play again"
                                aria-label="Play again"
                              >
                                <RefreshCw className="w-5 h-5" />
                              </motion.button>
                            </motion.div>
                          )}
                          <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                              key={currentImageIndex}
                              custom={direction}
                              variants={reelImages[currentImageIndex].transition}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={reelImages[currentImageIndex].transition.transition}
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              dragElastic={1}
                              onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -10000) {
                                  setDirection(1);
                                  nextImage();
                                } else if (swipe > 10000) {
                                  setDirection(-1);
                                  prevImage();
                                }
                              }}
                              className="absolute inset-0 w-full h-full transform-style-preserve-3d"
                              style={{
                                backfaceVisibility: 'hidden',
                                transformStyle: 'preserve-3d'
                              }}
                            >
                              <img 
                                src={reelImages[currentImageIndex].src} 
                                alt={reelImages[currentImageIndex].alt}
                                className="w-full h-full object-cover"
                              />
                              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <p className="text-white font-medium">Welcome to AllMax</p>
                                <p className="text-xs text-gray-300">@{user?.username || 'fitness'} • {currentImageIndex + 1}/{reelImages.length}</p>
                              </div> */}
                            </motion.div>
                          </AnimatePresence>
                          
                          {/* Navigation Arrows */}
                          {/* <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDirection(-1);
                              prevImage();
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDirection(1);
                              nextImage();
                            }}
                            disabled={currentImageIndex === reelImages.length - 1}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-colors z-10 ${
                              currentImageIndex === reelImages.length - 1 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-black/70'
                            }`}
                            aria-label="Next image"
                          >
                            <ChevronRight size={20} />
                          </button> */}
                          
                          {/* Dots indicator */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10">
                            {reelImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setDirection(index > currentImageIndex ? 1 : -1);
                                  setCurrentImageIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex 
                                    ? 'bg-white w-4' 
                                    : 'bg-white/50 hover:bg-white/70'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>

                          {/* Music Controls */}
                          <div className="absolute top-2 right-2 z-20 flex space-x-2">
                            {/* <button
                              onClick={toggleMusic}
                              className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                              aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
                            >
                              {isMusicPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button> */}
                            <button
                              onClick={toggleMute}
                              className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                              aria-label={isMuted ? 'Unmute' : 'Mute'}
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
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <div className="mt-6 flex justify-center pb-4">
              <button
                onClick={handleClose}
                className="px-4 py-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                I'll do this later
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeReelWizard;
