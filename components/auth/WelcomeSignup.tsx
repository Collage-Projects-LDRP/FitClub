'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Dumbbell, Instagram, Award, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ONBOARDING_STEPS } from '@/types/onboarding';

export default function WelcomeSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'instagram' | 'tiktok' | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();
  const { addBadge, showBadge, addPoints } = useOnboarding();

  const handleEmailSignup = () => {
    setShowSignup(true);
  };

  const handleSocialLogin = async (platform: 'instagram' | 'tiktok') => {
    try {
      setIsSocialLoading(platform);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add points for signing up
      await addPoints(50);

      // Award New Challenger badge
      const badgeAdded = await addBadge('new_challenger');
      if (badgeAdded) {
        await showBadge('new_challenger');
      }

      // Redirect to the category selection step after social login
      router.push('/onboarding?step=category');

    } catch (error) {
      console.error(`${platform} login failed:`, error);
      toast({
        title: "Login Failed",
        description: `Failed to connect with ${platform}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would handle the signup logic here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add points for signing up
      await addPoints(50);

      // Award New Challenger badge
      const badgeAdded = await addBadge('new_challenger');
      if (badgeAdded) {
        await showBadge('new_challenger');
      }

      router.push('/onboarding?step=category');
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Exclude 'streak' and 'complete' steps from progress bar
  const progressSteps = ONBOARDING_STEPS.filter(step => !['streak', 'complete'].includes(step));
  const totalSteps = progressSteps.length;
  const currentStep = 1; // Welcome is the first step

  // Points for each step (excluding the 7th step)
  const stepPoints = {
    'welcome': 50,
    'category': 20,
    'profile': 30,
    'engagement': 60,
    'firstPost': 100,
    'rewards': 0
  };

  // Step labels (excluding the 7th step)
  const stepLabels = {
    'welcome': 'Sign Up',
    'category': 'Category',
    'profile': 'Profile',
    'engagement': 'Engagement',
    'firstPost': 'First Post',
    'rewards': 'Rewards'
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const lineVariants: Variants = {
    hidden: { width: 0 },
    visible: (i: number) => ({
      width: `${(i / (progressSteps.length - 1)) * 100}%`,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const
      }
    })
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* Progress Bar */}
      <div className="pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="relative">
          {/* Animated Connecting Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 -z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial="hidden"
              animate="visible"
              custom={currentStep - 1}
              variants={lineVariants as any}
            />
          </div>

          {/* Steps with Animation */}
          <motion.div
            className="flex justify-between relative z-10"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {progressSteps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isActive = stepNumber === currentStep;
              const points = stepPoints[step as keyof typeof stepPoints];

              return (
                <motion.div
                  key={step}
                  className="relative z-10 flex flex-col items-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium relative ${isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md'
                      : isActive
                        ? 'bg-primary text-white shadow-lg border-2 border-white dark:border-gray-900'
                        : 'bg-gray-700 border-2 border-gray-600 text-gray-300'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      key={isCompleted ? 'completed' : 'not-completed'}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className={isActive ? 'font-bold' : ''}>{stepNumber}</span>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Step Label */}
                  <motion.div
                    className={`mt-2 text-xs font-medium ${isActive
                      ? 'text-primary dark:text-primary-300 font-semibold'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                  >
                    {stepLabels[step as keyof typeof stepLabels]}
                  </motion.div>

                  {/* Points */}
                  <motion.div
                    className={`mt-1 text-xs font-medium ${isActive
                      ? 'text-primary dark:text-red-300 font-semibold'
                      : 'text-gray-500 dark:text-yellow-400'
                      }`}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                  >
                    {points > 0 ? `+${points} MaxPoints` : ''}
                  </motion.div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-6 text-xs font-medium text-primary dark:text-primary-300"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {stepNumber} of {progressSteps.length}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!showSignup ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg space-y-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900 p-4 rounded-full">
                    <Logo size="sm" isClickable={false} showUnderline={false} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-extrabold text-white"
                >
                  Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Fitness</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-300"
                >
                  Join our community of fitness enthusiasts and take your workouts to the next level.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="pt-4 space-y-4"
                >
                  <Button
                    onClick={handleEmailSignup}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Get Started with Email
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="w-full border-t border-gray-700"></div>
                    <span className="px-4 text-sm text-gray-400 bg-gray-900">OR</span>
                    <div className="w-full border-t border-gray-700"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="relative overflow-hidden h-14 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700/50 hover:border-purple-500 group"
                      onClick={() => handleSocialLogin('instagram')}
                      disabled={!!isSocialLoading}
                    >
                      {isSocialLoading === 'instagram' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Instagram className="h-5 w-5 mr-2 text-pink-500 group-hover:scale-110 transition-transform" />
                          <span>Instagram</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="relative overflow-hidden h-14 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700/50 hover:border-purple-500 group"
                      onClick={() => handleSocialLogin('tiktok')}
                      disabled={!!isSocialLoading}
                    >
                      {isSocialLoading === 'tiktok' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <span className="mr-2 text-lg">🎵</span>
                          <span>TikTok</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-sm text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => router.push('/login')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md px-2 py-1"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30"></div>
                  <CardHeader className="relative z-10">
                    <div className="flex justify-center mb-2">
                      <div className="bg-transparent p-2 rounded-lg">
                        <Logo size="sm" isClickable={false} showUnderline={false} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-white">Create Your Account</CardTitle>
                  </CardHeader>
                </div>

                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 h-12 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                          Password
                        </label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 h-12 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      ) : (
                        <>
                          <span className="relative z-10">Create Account</span>
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowSignup(false)}
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        Back to all options
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ArrowLeft icon component since it's not in lucide-react by default
function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
