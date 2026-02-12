"use client";

import { motion } from 'framer-motion';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useReelCreation } from '@/contexts/ReelCreationContext';
import { Upload, Image as ImageIcon, X, Check, ArrowLeft } from 'lucide-react';

// Sample photos matching the user dashboard
const SAMPLE_PHOTOS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    caption: "Morning workout session - feeling strong! 💪",
    votes: 45,
    comments: 12,
    category: "Workout",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    caption: "Post-gym selfie. The grind never stops! 🔥",
    votes: 67,
    comments: 23,
    category: "Progress",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    caption: "Beach body ready for summer! ☀️",
    votes: 89,
    comments: 34,
    category: "Beach Body",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=300&fit=crop&crop=face",
    caption: "Competition prep is paying off 🏆",
    votes: 123,
    comments: 45,
    category: "Competition",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    caption: "Back day complete! Feeling the pump 💥",
    votes: 78,
    comments: 19,
    category: "Bodybuilding",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop",
    caption: "Outdoor training session by the beach 🌊",
    votes: 56,
    comments: 15,
    category: "Outdoor",
  },
];

export function PhotoSelectionStep() {
  const { state, goToNextStep, goToPreviousStep, addPhotos, removePhoto } = useReelCreation();
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'local' | 'website'>('website');
  const [selectedWebsitePhotos, setSelectedWebsitePhotos] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected photos from context to website gallery selection
  useEffect(() => {
    const selectedIds = new Set<string>();
    state.selectedPhotos.forEach(photoUrl => {
      const photo = SAMPLE_PHOTOS.find(p => p.url === photoUrl);
      if (photo) {
        selectedIds.add(photo.id);
      }
    });
    setSelectedWebsitePhotos(selectedIds);
  }, []); // Empty dependency array means this runs once on mount

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileUrls = files.map(file => URL.createObjectURL(file));
      addPhotos(fileUrls);
      setLocalFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    // Get the photo URL before removing it
    const photoUrl = state.selectedPhotos[index];
    
    // Remove from context
    removePhoto(index);
    
    // Check if it's a local file or from website gallery
    const isFromWebsite = SAMPLE_PHOTOS.some(photo => photo.url === photoUrl);
    
    if (isFromWebsite) {
      // Find the photo ID from SAMPLE_PHOTOS that matches the URL
      const photo = SAMPLE_PHOTOS.find(p => p.url === photoUrl);
      if (photo) {
        setSelectedWebsitePhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photo.id);
          return newSet;
        });
      }
    } else {
      // For local files, remove from localFiles state
      setLocalFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleWebsitePhoto = (photoId: string) => {
    const newSelection = new Set(selectedWebsitePhotos);
    // Only toggle if the photo is not already selected
    if (!newSelection.has(photoId)) {
      newSelection.add(photoId);
      // Add the photo to context
      const photo = SAMPLE_PHOTOS.find(p => p.id === photoId);
      if (photo) {
        addPhotos([photo.url]);
      }
    }
    // Don't remove if already selected - only allow removing via the X button
    setSelectedWebsitePhotos(newSelection);
  };

  const handleContinue = () => {
    goToNextStep();
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
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
                Add Photos to Your Reel
              </h2>
            </div>
            <p className="mt-2 text-gray-300">
              Select photos from your device or choose from our gallery
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
        <button
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === 'website'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('website')}
          >
            <div className="flex items-center justify-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Choose From Gallery</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === 'local'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('local')}
          >
            <div className="flex items-center justify-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Photos</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          {activeTab === 'local' ? (
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <h3 className="text-lg font-medium text-white">Drag and drop photos here</h3>
                  <p className="text-sm text-gray-400">or click to browse files</p>
                  <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG up to 10MB</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {state.selectedPhotos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Selected Photos ({state.selectedPhotos.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {state.selectedPhotos.map((photoUrl, index) => {
                      // Check if the photo is from the website gallery or a local file
                      const isFromWebsite = SAMPLE_PHOTOS.some(p => p.url === photoUrl);
                      const photoSrc = isFromWebsite 
                        ? photoUrl 
                        : localFiles[index] 
                          ? URL.createObjectURL(localFiles[index])
                          : photoUrl; // Fallback to URL if file not found

                      return (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-500">
                            <img
                              src={photoSrc}
                              alt={`Selected ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{index + 1}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {SAMPLE_PHOTOS.map((photo) => (
                  <motion.div 
                    key={photo.id}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                      selectedWebsitePhotos.has(photo.id) ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-700'
                    }`}
                    onClick={() => toggleWebsitePhoto(photo.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    {selectedWebsitePhotos.has(photo.id) && (
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
              {state.selectedPhotos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Selected Photos ({state.selectedPhotos.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {state.selectedPhotos.map((photoUrl, index) => {
                      // Check if the photo is from the website gallery or a local file
                      const isFromWebsite = SAMPLE_PHOTOS.some(p => p.url === photoUrl);
                      const photoSrc = isFromWebsite 
                        ? photoUrl 
                        : localFiles[index] 
                          ? URL.createObjectURL(localFiles[index])
                          : photoUrl; // Fallback to URL if file not found

                      return (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-500">
                            <img
                              src={photoSrc}
                              alt={`Selected ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{index + 1}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPreviousStep}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={handleContinue}
            disabled={state.selectedPhotos.length === 0}
            className={`px-6 py-2.5 rounded-lg flex items-center ${
              state.selectedPhotos.length > 0
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
        </div>
      </div>
    </div>
  );
}
