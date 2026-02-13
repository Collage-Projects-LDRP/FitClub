"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReelCreation } from '@/contexts/ReelCreationContext';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

// Sample outro templates with QR code animations
const OUTRO_TEMPLATES = [
  {
    id: 'slide-up',
    name: 'Slide Up QR',
    description: 'QR code slides up with a clean animation',
    duration: 5,
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        {/* Phone frame */}
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>
          
          {/* Screen content */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-[32px] overflow-hidden">
            {/* QR Code with animation */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="relative">
                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: 0.5
                    }
                  }}
                />
                
                {/* QR Code */}
                <div className="relative w-32 h-32 bg-white p-3 rounded-lg z-10">
                  <Image
                    src="/qr-code.png"
                    alt="QR Code"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Bottom text */}
            <motion.div 
              className="absolute bottom-8 left-0 right-0 text-center px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-white font-medium mb-1">
                <Image 
                  src="/fitclub-logo.png" 
                  alt="Logo" 
                  width={200} 
                  height={200} 
                  className="mx-auto"
                />
              </p>
              <p className="text-purple-400 text-sm">@yourusername</p>
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'fade-in',
    name: 'Fade In QR',
    description: 'QR code fades in with a subtle scale effect',
    duration: 4,
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>
          
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-[32px] overflow-hidden">
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: [0.2, 0, 0.2, 1],
                scale: {
                  type: 'spring',
                  damping: 10,
                  stiffness: 100,
                  restDelta: 0.001
                }
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: 0.5
                    }
                  }}
                />
                
                <div className="relative w-32 h-32 bg-white p-3 rounded-lg z-10">
                  <Image
                    src="/qr-code.png"
                    alt="QR Code"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 left-0 right-0 text-center px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-white font-medium mb-1">
              <Image 
                  src="/fitclub-logo.png" 
                  alt="Logo" 
                  width={200} 
                  height={200} 
                  className="mx-auto"
                />
              </p>
              <p className="text-purple-400 text-sm">@yourusername</p>
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slide-in',
    name: 'Slide In QR',
    description: 'QR code slides in from the right with bounce',
    duration: 5,
    preview: (
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"></div>
          
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-[32px] overflow-hidden">
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                mass: 0.5,
                restDelta: 0.001
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/50"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: 0.5
                    }
                  }}
                />
                
                <div className="relative w-32 h-32 bg-white p-3 rounded-lg z-10">
                  <Image
                    src="/qr-code.png"
                    alt="QR Code"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 left-0 right-0 text-center px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-white font-medium mb-1">
                <Image 
                  src="/fitclub-logo.png" 
                  alt="Logo" 
                  width={200} 
                  height={200} 
                  className="mx-auto"
                />
              </p>
              <p className="text-purple-400 text-sm">@yourusername</p>
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'no-outro',
    name: 'No Outro',
    description: 'End your video without an outro',
    duration: 0,
    preview: (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[40px] p-2 border-2 border-gray-700 shadow-2xl flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✕</span>
            </div>
            <h3 className="text-xl font-medium text-white">No Outro</h3>
            <p className="text-sm text-gray-400 mt-1">End without a QR code</p>
          </div>
        </div>
      </div>
    ),
  },
];

export function OutroSelectionStep() {
  const { state, selectOutro, goToNextStep, goToPreviousStep } = useReelCreation();
  const [selectedId, setSelectedId] = useState<string | null>(state.selectedOutro?.id || null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({});

  // Initialize animation states
  useEffect(() => {
    const initialStates = OUTRO_TEMPLATES.reduce((acc, outro) => {
      acc[outro.id] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setAnimationStates(initialStates);
  }, []);

  const handleSelect = (outro: typeof OUTRO_TEMPLATES[0]) => {
    selectOutro(outro);
    setSelectedId(outro.id);
    // Reset animation state for the selected outro
    setAnimationStates(prev => ({
      ...prev,
      [outro.id]: false
    }));
  };

  const handleHover = (id: string) => {
    setHoveredId(id);
    // Only reset animation if it's not already playing
    if (!animationStates[id]) {
      setAnimationStates(prev => ({
        ...prev,
        [id]: true
      }));
    }
  };

  const handleAnimationComplete = (id: string) => {
    // Mark animation as complete
    setAnimationStates(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const handleContinue = () => {
    if (selectedId) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose an Outro</h2>
        <p className="text-gray-400">Select a style that matches your content</p>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        <div className="flex space-x-4 pb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          {OUTRO_TEMPLATES.map((outro) => (
            <motion.div
              key={outro.id}
              className={`flex-shrink-0 w-64 relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                selectedId === outro.id ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-700'
              }`}
              onClick={() => handleSelect(outro)}
              onMouseEnter={() => handleHover(outro.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 9:16 Aspect Ratio Container */}
              <div className="relative pt-[177.78%] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${outro.id}-${animationStates[outro.id] ? 'active' : 'inactive'}`}
                    className="absolute inset-0"
                    initial={false}
                    animate={hoveredId === outro.id || selectedId === outro.id ? 'active' : 'inactive'}
                    variants={{
                      active: { opacity: 1 },
                      inactive: { opacity: 1 }
                    }}
                    onAnimationComplete={() => handleAnimationComplete(outro.id)}
                  >
                    {outro.preview}
                  </motion.div>
                </AnimatePresence>
                
                {/* Overlay */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    selectedId === outro.id ? 'opacity-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {selectedId === outro.id ? (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {outro.duration}s
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-gray-900/80 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">{outro.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{outro.description}</p>
                  </div>
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
          onClick={goToPreviousStep}
          className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
            selectedId
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
