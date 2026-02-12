'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Award, UserCheck, Users, Sparkles, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

type BadgeType = 'new_challenger' | 'fully_pumped_profile' | 'community_starter' | 'category_champion' | 'first_post';

const BADGE_POINTS = {
  new_challenger: 50,
  fully_pumped_profile: 30,
  community_starter: 60,
  category_champion: 20,
  first_post: 100
};

type BadgeDetails = {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
};

const BADGE_DETAILS: Record<BadgeType, Omit<BadgeDetails, 'icon'>> = {
  new_challenger: {
    title: 'New Challenger',
    description: 'Welcome to the fitness community! Your journey begins now.',
    gradient: 'from-yellow-400 to-orange-500',
    iconColor: 'text-yellow-400',
  },
  fully_pumped_profile: {
    title: 'Fully Pumped Profile',
    description: 'Great job completing your profile! You\'re all set to get started.',
    gradient: 'from-blue-400 to-indigo-600',
    iconColor: 'text-blue-400',
  },
  community_starter: {
    title: 'Community Starter',
    description: 'You\'ve made your first connection! Keep engaging with the community.',
    gradient: 'from-purple-400 to-pink-500',
    iconColor: 'text-purple-400',
  },
  category_champion: {
    title: 'Category Champion',
    description: 'Great choice! You\'ve selected your fitness category. Let\'s get started!',
    gradient: 'from-green-400 to-emerald-500',
    iconColor: 'text-green-400',
  },
  first_post: {
    title: 'First Post!',
    description: 'Congratulations on your first post! Keep sharing your fitness journey with the community!',
    gradient: 'from-blue-500 to-indigo-600',
    iconColor: 'text-blue-400',
  },
};

const getBadgeIcon = (type: BadgeType, className: string = '') => {
  const baseClass = 'w-12 h-12 mb-4';
  switch (type) {
    case 'new_challenger':
      return <Zap className={cn(baseClass, 'text-yellow-400', className)} />;
    case 'fully_pumped_profile':
      return <UserCheck className={cn(baseClass, 'text-blue-400', className)} />;
    case 'community_starter':
      return <Users className={cn(baseClass, 'text-purple-400', className)} />;
    case 'category_champion':
      return <Award className={cn(baseClass, 'text-green-400', className)} />;
    case 'first_post':
      return <ImagePlus className={cn(baseClass, 'text-blue-400', className)} />;
    default:
      return <Award className={cn(baseClass, className)} />;
  }
};

type BadgePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  badgeType: BadgeType;
  totalPoints?: number;
};

export function BadgePopup({ isOpen, onClose, onContinue, badgeType, totalPoints = 0 }: BadgePopupProps) {
  const [show, setShow] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const badge = BADGE_DETAILS[badgeType];
  const Icon = getBadgeIcon(badgeType);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const handleContinue = () => {
    setShow(false);
    setTimeout(onContinue, 300);
  };

  if (!show || !badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md z-10"
        >
          {/* Badge Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>

            <div className="relative z-10 p-8 text-center">
              {/* Animated badge */}
              <motion.div
                animate={isAnimating ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} rounded-full blur-lg opacity-30`} />
                  <div className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${badge.gradient} shadow-lg`}>
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full">
                      {React.cloneElement(Icon as React.ReactElement, { className: 'w-10 h-10' })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="mt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Achievement Unlocked!</span>
                  </div>
                  
                  {/* Received Points */}
                  <div className="text-green-400 text-sm font-medium mb-2">
                    +{BADGE_POINTS[badgeType]} MaxPoints Received! 🎉
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{badge.title}</h3>
                <p className="text-gray-300 mb-4 text-center">{badge.description}</p>
                
                {/* Total Points Display */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-gray-300 mb-1">Your Total Points</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {totalPoints}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">MaxPoints</p>
                </div>
                
                <Button
                  onClick={handleContinue}
                  className={`w-full bg-gradient-to-r ${badge.gradient} hover:opacity-90 transition-opacity text-white font-medium py-2 px-6 rounded-full shadow-lg`}
                  size="lg"
                >
                  Awesome!
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
