"use client";

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePhotoCreation } from '@/contexts/PhotoCreationContext';
import { Play, Pause, ArrowLeft, Download, Share2, Instagram, Copy } from 'lucide-react';

export function PhotoSharingStep() {
  const { selectedPhotos, selectedTemplate, goToPreviousStep, reset } = usePhotoCreation();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShare = async (platform: 'instagram' | 'copy') => {
    try {
      if (platform === 'instagram') {
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    if (!selectedTemplate) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    const qrCode = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      
      qrCode.onload = () => {
        const { qrPosition } = selectedTemplate;
        const x = qrPosition.left || (img.width - (typeof qrPosition.width === 'number' ? qrPosition.width : 0) - (qrPosition.right as number || 0));
        const y = qrPosition.top || (img.height - (typeof qrPosition.height === 'number' ? qrPosition.height : 0) - (qrPosition.bottom as number || 0));
        
        ctx.drawImage(
          qrCode,
          x,
          y,
          Number(qrPosition.width) || 100,
          Number(qrPosition.height) || 100
        );
        
        const link = document.createElement('a');
        link.download = 'photo-with-qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      qrCode.src = selectedTemplate.preview;
    };
    
    img.src = selectedPhotos[0];
  };

  const handleCreateAnother = () => {
    reset();
    // This will take the user back to the first step
    window.location.href = '/photo-creation';
  };

  const handleShareTikTok = () => {
    window.open('https://www.tiktok.com/upload?lang=en', '_blank');
  };

  if (!selectedPhotos.length || !selectedTemplate) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left Side - Photo Preview */}
      <div className="lg:w-1/2 xl:w-2/5 flex flex-col items-center">
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden">
            {/* Photo with QR Code */}
            {selectedPhotos[0] && selectedTemplate && (
              <div className="relative w-full h-full">
                <img
                  src={selectedPhotos[0]}
                  alt="Selected photo"
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute"
                  style={{
                    left: selectedTemplate.qrPosition.left || 'auto',
                    right: selectedTemplate.qrPosition.right || 'auto',
                    top: selectedTemplate.qrPosition.top || 'auto',
                    bottom: selectedTemplate.qrPosition.bottom || 'auto',
                    width: selectedTemplate.qrPosition.width || 'auto',
                    height: selectedTemplate.qrPosition.height || 'auto',
                  }}
                >
                  <img
                    src={selectedTemplate.preview}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Sharing Options */}
      <div className="lg:w-1/2 xl:w-3/5 p-6 bg-gray-900/30 rounded-2xl border border-gray-800 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6">Share Your Photo</h2>
        
        <div className="space-y-4 flex-1">
          {/* Instagram Share */}
          <div 
            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            onClick={() => handleShare('instagram')}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Share to Instagram</h3>
                <p className="text-sm text-gray-400">Post to your Instagram feed</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* TikTok Share */}
          <div 
            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            onClick={handleShareTikTok}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Share to TikTok</h3>
                <p className="text-sm text-gray-400">Post to your TikTok profile</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* Copy Link */}
          <div 
            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            onClick={() => handleShare('copy')}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Copy Photo Link</h3>
                <p className="text-sm text-gray-400">Copy a shareable link to your photo</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* Download */}
          <div 
            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            onClick={handleDownload}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Download Photo</h3>
                <p className="text-sm text-gray-400">Save to your device</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-800 space-y-3">
          <button
            onClick={handleCreateAnother}
            className="w-full py-2.5 px-4 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            Create Another Photo
          </button>
          <button
            onClick={goToPreviousStep}
            className="w-full py-2.5 px-4 text-white border border-gray-700 rounded-xl hover:bg-gray-800/50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
