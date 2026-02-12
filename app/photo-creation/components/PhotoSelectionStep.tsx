"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, Check, Plus } from 'lucide-react';

interface PhotoSelectionStepProps {
  selectedPhotos: string[];
  onSelectPhotos: (photos: string[]) => void;
  onContinue: () => void;
}

export function PhotoSelectionStep({ selectedPhotos, onSelectPhotos, onContinue }: PhotoSelectionStepProps) {
  const [activeTab, setActiveTab] = useState<'local' | 'website'>('local');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxPhotos = 10;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos: string[] = [];
      
      // Process up to maxPhotos files
      const remainingSlots = maxPhotos - selectedPhotos.length;
      const filesToProcess = files.slice(0, remainingSlots);
      
      if (filesToProcess.length === 0) return;

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
            
            // Update parent state when all files are processed
            if (newPhotos.length === filesToProcess.length) {
              onSelectPhotos([...selectedPhotos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...selectedPhotos];
    newPhotos.splice(index, 1);
    onSelectPhotos(newPhotos);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isMaxPhotosReached = selectedPhotos.length >= maxPhotos;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('local')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'local'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Local Gallery
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'website'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Website Gallery
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            {selectedPhotos.length} / {maxPhotos} photos selected
          </span>
          <span className="text-sm font-medium text-purple-400">
            {Math.min((selectedPhotos.length / maxPhotos) * 100, 100)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${Math.min((selectedPhotos.length / maxPhotos) * 100, 100)}%`,
              backgroundColor: isMaxPhotosReached ? '#EC4899' : ''
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-70"></div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'local' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Upload Button */}
            {!isMaxPhotosReached && (
              <motion.div 
                onClick={handleUploadClick}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm text-gray-400 text-center">
                  Click to upload photos
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Max {maxPhotos} photos
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </motion.div>
            )}

            {/* Selected Photos */}
            <AnimatePresence>
              {selectedPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={photo}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Image className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Website Gallery</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Browse and select photos from our website gallery.
              Coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={selectedPhotos.length === 0}
          className={`px-6 py-2.5 rounded-lg ${
            selectedPhotos.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          } transition-all`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
