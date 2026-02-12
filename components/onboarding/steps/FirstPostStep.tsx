'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useState, useRef, useEffect } from 'react';
import { ImagePlus, Video, X, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { NavigationButtons } from '../NavigationButtons';
import { OnboardingContainer } from '../OnboardingContainer';
import { getOnboardingStepNumber, TOTAL_ONBOARDING_STEPS } from '@/lib/onboarding';
import { BadgePopup } from '../BadgePopup';

export default function FirstPostStep() {
  const { nextStep, prevStep, addPoints, addBadge, updateUserData, points } = useOnboarding();
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = async () => {
    if (!media) {
      toast({
        title: "No Media Selected",
        description: "Please select a photo or video to post.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPosting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add points and badge
      await addPoints(100);
      await addBadge('community_starter');
      
      // Update user data to mark that they've made their first post
      await updateUserData({
        lastActive: new Date().toISOString(),
        showBadge: {
          badgeId: 'first_post',
          onClose: () => {}
        }
      });
      
      // Show success state and badge
      setIsPosted(true);
      // Add a small delay to ensure state updates before showing the badge
      setTimeout(() => {
        setShowBadge(true);
      }, 100);
      
      toast({
        title: "Success!",
        description: "Your post has been published successfully!",
      });
      
    } catch (error) {
      console.error('Error posting:', error);
      toast({
        title: "Error",
        description: "There was an error posting your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const currentStep = getOnboardingStepNumber('firstPost');
  const totalSteps = TOTAL_ONBOARDING_STEPS;
  
  return (
    <>
      <BadgePopup 
        isOpen={showBadge} 
        onClose={() => {
          setShowBadge(false);
          nextStep();
        }}
        onContinue={() => {
          setShowBadge(false);
          nextStep();
        }}
        badgeType="first_post"
        totalPoints={points}
      />
      <OnboardingContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Share Your First Epic Moment"
      description="Post your first transformation, workout, or progress photo"
      skippedSteps={[currentStep]} // Mark current step as skipped if user skips
    >
      <div className="space-y-6 w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Post a photo or video to start your fitness journey and earn 100 MaxPoints!
          </p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border space-y-6">
          {!previewUrl ? (
            <>
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={handleClickUpload}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Upload Photo or Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to browse (JPG, PNG, MP4)
                  </p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaChange}
                accept="image/*,video/*"
                className="hidden"
                disabled={isPosting || isPosted}
              />
              <NavigationButtons 
                onBack={prevStep}
                onSkip={() => nextStep()}
                onNext={handleClickUpload}
                nextLabel="Upload Media"
                isNextDisabled={isPosting}
                showBack={true}
                showSkip={true}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                {media?.type.startsWith('image/') ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full max-h-[400px] object-cover rounded-lg"
                    />
                    <button
                      onClick={removeMedia}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                      disabled={isPosting || isPosted}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <video 
                      src={previewUrl}
                      className="w-full max-h-[400px] object-cover rounded-lg"
                      controls
                    />
                    <button
                      onClick={removeMedia}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                      disabled={isPosting || isPosted}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!isPosted && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="caption" className="block text-sm font-medium mb-2">
                      Add a caption (optional)
                    </label>
                    <textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="What's this about?"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors min-h-[100px]"
                      disabled={isPosting}
                    />
                  </div>

                  <Button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="w-full py-6 text-lg font-medium"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post & Earn 100 MaxPoints'
                    )}
                  </Button>

                  <NavigationButtons
                    onNext={handlePost}
                    onBack={prevStep}
                    onSkip={() => nextStep()}
                    nextLabel={isPosting ? 'Posting...' : 'Post'}
                    isNextDisabled={isPosting}
                    isNextLoading={isPosting}
                    showBack={true}
                    showSkip={true}
                    className="mt-4"
                  />
                </div>
              )}

              {isPosted && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Posted successfully! Taking you to the next step...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </OnboardingContainer>
    </>
  );
}
