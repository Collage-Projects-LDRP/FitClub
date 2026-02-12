"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Image as ImageIcon, X, GalleryVertical } from 'lucide-react';
import { usePhotoCreation } from '@/contexts/PhotoCreationContext';
import { TemplateSelectionStep } from './components/TemplateSelectionStep';
import { PhotoSharingStep } from './components/PhotoSharingStep';
import { ProgressBar } from './components/ProgressBar';

type Step = 'photo-selection' | 'template-selection' | 'sharing';

const STEPS = ['Select Photo', 'Choose Template', 'Share'];

export default function PhotoCreationPage() {
  const router = useRouter();
  const { currentStep, selectedPhotos, setSelectedPhotos, selectedTemplate, goToNextStep, goToPreviousStep } = usePhotoCreation();
  const [activeTab, setActiveTab] = useState<'local' | 'website'>('website');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add sample gallery images (replace with your actual gallery images)
  const galleryImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&auto=format&fit=crop",
    // Add more images as needed
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhotos([event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleTabChange = (tab: 'local' | 'website') => {
    // Clear selected photos when switching tabs
    if (selectedPhotos.length > 0) {
      setSelectedPhotos([]);
    }
    setActiveTab(tab);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'photo-selection':
        return (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => handleTabChange('website')}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'website' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <GalleryVertical className="w-4 h-4" />
                Choose From Gallery
              </button>
              <button
                onClick={() => handleTabChange('local')}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'local' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            {/* Upload Area */}
            {activeTab === 'local' && (
              selectedPhotos.length === 0 ? (
                <div 
                  className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                  onClick={handleUploadClick}
                >
                  <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">Click to upload a photo</h3>
                  <p className="text-gray-400 text-sm mb-4">or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (max. 10MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative max-h-[60vh] w-full max-w-md mx-auto overflow-hidden rounded-xl bg-gray-900">
                    <img
                      src={selectedPhotos[0]}
                      alt="Selected photo"
                      className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotos([]);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Gallery Area */}
            {activeTab === 'website' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <motion.div 
                      key={index}
                      onClick={() => setSelectedPhotos([image])}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                        selectedPhotos[0] === image ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-opacity"
                        />
                      </div>
                      {selectedPhotos[0] === image && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Select a photo from our gallery
                </p>
              </div>
            )}
          </div>
        );
      case 'template-selection':
        return <TemplateSelectionStep />;
      case 'sharing':
        return <PhotoSharingStep />;
      default:
        return null;
    }
  };

  const currentStepIndex = ['photo-selection', 'template-selection', 'sharing'].indexOf(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="relative inline-block mb-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30"></div>
              <h2 className="relative text-3xl font-bold text-white">
                Create Your Photo
              </h2>
            </div>
            <p className="mt-2 text-gray-300">
              Select a photo from your device or choose from our gallery
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-8">
          <ProgressBar steps={STEPS} />
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800/50"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep !== 'sharing' && (
            <button
              onClick={() => {
                if (currentStep === 'photo-selection') {
                  router.back();
                } else {
                  goToPreviousStep();
                }
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          )}
          {currentStep !== 'sharing' ? (
            <button
              onClick={goToNextStep}
              disabled={currentStep === 'photo-selection' 
                ? selectedPhotos.length === 0 
                : currentStep === 'template-selection' 
                  ? !selectedTemplate 
                  : false}
              className={`px-6 py-2.5 rounded-lg flex items-center ${
                (currentStep === 'photo-selection' && selectedPhotos.length > 0) ||
                (currentStep === 'template-selection' && selectedTemplate)
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
