"use client";

import { useState, useEffect } from 'react';
import { useReelCreation } from '@/contexts/ReelCreationContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { Check, Play, Zap, Sparkles, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample intro templates with enhanced previews
const INTRO_TEMPLATES = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and professional intro with smooth animations',
    duration: 5,
    hasLogoAnimation: true,
    gradient: 'from-purple-600 to-pink-600',
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>

          {/* Screen content */}
          <div className="relative w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 rounded-[32px] overflow-hidden">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Logo size="md" isClickable={false} showUnderline={false} />
            </motion.div>
            <motion.div
              className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'dynamic-splash',
    name: 'Dynamic Splash',
    description: 'Energetic intro with vibrant colors',
    duration: 4,
    hasLogoAnimation: true,
    gradient: 'from-blue-600 to-cyan-500',
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>

          <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-cyan-800 rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-64 h-64 rounded-full border-2 border-white/20"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Logo size="md" isClickable={false} showUnderline={false} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Glowing effect with dark theme',
    duration: 5,
    hasLogoAnimation: true,
    gradient: 'from-pink-600 to-purple-900',
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>

          <div className="relative w-full h-full bg-gray-900 rounded-[32px] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(45deg, #ff0080, #7928ca)',
                  'linear-gradient(45deg, #7928ca, #ff0080)',
                  'linear-gradient(45deg, #ff0080, #7928ca)'
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                opacity: 0.3,
                filter: 'blur(20px)'
              }}
            />
            <motion.div
              className="relative z-10 w-full h-full flex items-center justify-center"
              animate={{
                filter: [
                  'drop-shadow(0 0 10px rgba(255, 0, 128, 0.7))',
                  'drop-shadow(0 0 20px rgba(121, 40, 202, 0.7))',
                  'drop-shadow(0 0 10px rgba(255, 0, 128, 0.7))'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Logo size="md" isClickable={false} showUnderline={false} />
            </motion.div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional and clean business style',
    duration: 4,
    hasLogoAnimation: false,
    gradient: 'from-gray-700 to-gray-900',
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>

          <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-gray-600"></div>
              ))}
            </div>
            <motion.div
              className="relative z-10 w-full h-full flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 w-4/5">
                <div className="mb-4">
                  <Logo size="sm" isClickable={false} showUnderline={false} />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"></div>
                <p className="text-gray-300 text-sm">FITCLUB</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }
];

export function IntroSelectionStep() {
  const { state, selectIntro, goToNextStep } = useReelCreation();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(state.selectedIntro?.id || null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (state.selectedIntro) {
      setSelectedId(state.selectedIntro.id);
    }
  }, [state.selectedIntro]);

  const handleSelect = (intro: typeof INTRO_TEMPLATES[0]) => {
    selectIntro(intro);
    setSelectedId(intro.id);
  };

  const handleContinue = () => {
    if (selectedId) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose an Intro</h2>
        <p className="text-gray-400">Select a style that matches your content</p>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        <div className="flex space-x-4 pb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          {INTRO_TEMPLATES.map((intro) => (
            <motion.div
              key={intro.id}
              className={`flex-shrink-0 w-64 relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${selectedId === intro.id ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-700'
                }`}
              onClick={() => handleSelect(intro)}
              onMouseEnter={() => setHoveredId(intro.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 9:16 Aspect Ratio Container */}
              <div className="relative pt-[177.78%] w-full">
                <div className="absolute inset-0">
                  {intro.preview}
                </div>

                {/* Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${selectedId === intro.id ? 'opacity-100' : ''
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    {selectedId === intro.id ? (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <Play className="h-5 w-5 text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {intro.duration}s
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-gray-900/80 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">{intro.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{intro.description}</p>
                  </div>
                  {intro.hasLogoAnimation && (
                    <div className="flex-shrink-0 flex items-center space-x-1 text-amber-400">
                      <Zap className="h-3 w-3" fill="currentColor" />
                      <span className="text-xs">Animated</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${selectedId
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
