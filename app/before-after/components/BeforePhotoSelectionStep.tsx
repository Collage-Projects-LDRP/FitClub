"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, GalleryVertical } from 'lucide-react';
import { useBeforeAfter } from '@/contexts/BeforeAfterContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforePhotoSelectionStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function BeforePhotoSelectionStep({ onContinue, onBack }: BeforePhotoSelectionStepProps) {
  const { beforePhoto, setBeforePhoto } = useBeforeAfter();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(beforePhoto);
  const [activeTab, setActiveTab] = useState<'local' | 'website'>('website');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when context changes
  useEffect(() => {
    setSelectedPhoto(beforePhoto);
  }, [beforePhoto]);

  // Sample gallery images - replace with your actual gallery data or API call
  const websiteGallery = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      caption: "Morning workout session - feeling strong! 💪"
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
      caption: "Post-gym selfie. The grind never stops! 🔥"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
      caption: "Beach body ready for summer! ☀️"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=300&fit=crop&crop=face",
      caption: "Competition prep is paying off 🏆"
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
      caption: "Back day complete! Feeling the pump 💥"
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop",
      caption: "Outdoor training session by the beach 🌊"
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const photoUrl = event.target.result as string;
          setSelectedPhoto(photoUrl);
          setBeforePhoto(photoUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tab: 'local' | 'website') => {
    if (activeTab === 'website' && tab === 'local' && selectedPhoto) {
      // Clear selected photo when switching from website to local gallery
      setSelectedPhoto(null);
      setBeforePhoto(null);
    }
    setActiveTab(tab);
  };

  const handleGallerySelect = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setBeforePhoto(photoUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setBeforePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h3 className="text-xl font-semibold text-white">Select Before Photo</h3>
        <div className="w-10"></div> {/* For alignment */}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center space-x-2 ${
            activeTab === 'website' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => handleTabChange('website')}
        >
          <GalleryVertical className="w-4 h-4" />
          <span>Choose From Gallery</span>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center space-x-2 ${
            activeTab === 'local' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => handleTabChange('local')}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="min-h-0">
        {activeTab === 'local' ? (
          <div className="text-center">
            {selectedPhoto ? (
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative w-full h-auto">
                  <img 
                    src={selectedPhoto} 
                    alt="Selected" 
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Upload Photo</h3>
                <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {websiteGallery.map((photo) => (
                <motion.div 
                  key={photo.id}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                    selectedPhoto === photo.url ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-700'
                  }`}
                  onClick={() => handleGallerySelect(photo.url)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedPhoto === photo.url && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedPhoto}
          className={`px-6 py-2.5 rounded-lg flex items-center ${
            selectedPhoto
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
  );
}
