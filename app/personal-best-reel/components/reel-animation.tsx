'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Variants, Transition } from 'framer-motion';
import { Logo } from '@/components/logo';

// Import the logos - adjust the paths as needed
const leftLogo = '/fitclub-logo.png'; // Left side logo
const rightLogo = 'https://www.allmaxnutrition.com/cdn/shop/files/logo-white_198x_9f614dcb-81f7-4460-8097-1190cf32eb03_400x.webp?v=1674804703'; // Right side logo

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    } as Transition,
  },
};

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    } as Transition
  },
};

const gradientVariants: Variants = {
  initial: {
    backgroundPosition: '0% 50%',
  },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 10,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    } as Transition,
  },
};

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial mount
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Auto-complete after 3 seconds
    const completionTimer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completionTimer);
    };
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0"
            variants={gradientVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(-45deg, #6a11cb, #2575fc, #4a00e0, #8e2de2)'
            }}
          />

          {/* Left Logo */}
          <motion.div
            className="absolute left-4 md:left-8 -translate-y-1/2 z-20"
            variants={item}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Logo size="lg" isClickable={false} showUnderline={false} />
          </motion.div>

          {/* Center Content */}
          <motion.div
            className="relative z-10 text-center p-8 max-w-2xl mx-auto"
            variants={container}
            initial="hidden"
            animate={showContent ? "show" : "hidden"}
          >
            <motion.div
              variants={item}
              className="mb-8 flex justify-center"
              initial={{ scale: 0.8 }}
              animate={{
                scale: [0.8, 1.1, 1],
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }}
            >
              <div className="relative w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <div className="text-3xl font-bold text-white">PB</div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
              variants={item}
            >
              Celebrate Your Achievements
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 mb-8"
              variants={item}
            >
              Create Stunning Personal Best Reels
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="h-1.5 bg-white/20 rounded-full overflow-hidden max-w-md mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>

          {/* Right Logo */}
          <motion.div
            className="absolute right-4 md:right-8 -translate-y-1/2 w-64 h-64 md:w-64 md:h-64 z-20"
            variants={item}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src={rightLogo}
              alt="Right Logo"
              fill
              className="object-contain object-right"
              priority
            />
          </motion.div>

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: Math.random() * 6 + 4 + 'px',
                  height: Math.random() * 6 + 4 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [0, -Math.random() * 100 - 50],
                  x: [(Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OutroAnimation() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
          }
        }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <div className="text-2xl text-white">✓</div>
        </motion.div>

        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
          Amazing Progress!
        </h2>
        <p className="text-gray-200 mb-6 text-lg">Your transformation is ready to share with the world</p>

        <div className="bg-white/10 p-4 rounded-xl inline-block mb-6 backdrop-blur-sm">
          <div className="bg-white p-2 rounded-lg">
            <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-gray-400 text-sm text-center p-2">QR Code Preview</div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm">Scan to see your transformation</p>
        <p className="text-indigo-200 font-medium mt-2">@yourusername</p>
      </motion.div>
    </motion.div>
  );
}
