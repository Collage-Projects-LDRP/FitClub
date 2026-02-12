'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, ImagePlus, Instagram, Link as LinkIcon, Move, ZoomIn, ZoomOut, Music2} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useState, useRef, useEffect } from 'react';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  mediaUrl: string | null;
}

export const SharePopup = ({ isOpen, onClose, onShare, mediaUrl }: SharePopupProps) => {
  const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const circleRadius = 178; // 356px diameter / 2

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return;
      
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;
      
      // Calculate new position relative to the center of the container
      const newX = (e.clientX - containerCenterX) / scale;
      const newY = (e.clientY - containerCenterY) / scale;
      
      // Limit the position to keep the image within the circle
      const distance = Math.sqrt(newX * newX + newY * newY);
      const maxDistance = circleRadius * 0.95; // Slight margin from edge
      
      if (distance > maxDistance) {
        const angle = Math.atan2(newY, newX);
        setImgPosition({
          x: Math.cos(angle) * maxDistance,
          y: Math.sin(angle) * maxDistance
        });
      } else {
        setImgPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    
    // Get mouse position relative to container center
    const mouseX = e.clientX - containerCenterX;
    const mouseY = e.clientY - containerCenterY;
    
    // Calculate zoom direction and amount
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, scale + delta), 3);
    
    // Calculate new position to zoom toward cursor
    const scaleChange = newScale / scale;
    const newX = imgPosition.x * scaleChange + (1 - scaleChange) * mouseX;
    const newY = imgPosition.y * scaleChange + (1 - scaleChange) * mouseY;
    
    setScale(newScale);
    
    // Update position to zoom toward cursor
    const distance = Math.sqrt(newX * newX + newY * newY);
    const maxDistance = circleRadius * 0.95 * newScale;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(newY, newX);
      setImgPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    } else {
      setImgPosition({ x: newX, y: newY });
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.2, 3);
    const scaleChange = newScale / scale;
    
    // Adjust position to zoom toward center
    const newX = imgPosition.x * scaleChange;
    const newY = imgPosition.y * scaleChange;
    
    setScale(newScale);
    
    // Keep image within bounds
    const distance = Math.sqrt(newX * newX + newY * newY);
    const maxDistance = circleRadius * 0.95 * newScale;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(newY, newX);
      setImgPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    } else {
      setImgPosition({ x: newX, y: newY });
    }
  };
  
  const zoomOut = () => {
    const newScale = Math.max(scale - 0.2, 0.5);
    const scaleChange = newScale / scale;
    
    // Adjust position to zoom toward center
    const newX = imgPosition.x * scaleChange;
    const newY = imgPosition.y * scaleChange;
    
    setScale(newScale);
    setImgPosition({ x: newX, y: newY });
  };

  const resetPosition = () => {
    setImgPosition({ x: 0, y: 0 });
    setScale(1);
  };

  // Calculate image size based on scale
  const imageSize = `${100 * scale}%`;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 max-w-3xl w-[95%] sm:w-full overflow-hidden border-0 bg-transparent">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
          <DialogTitle className="sr-only">Share Your Content</DialogTitle>
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Share Your Content</h2>
                  <p className="text-sm text-blue-100 mt-1">Spread your amazing content across platforms</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Media Preview Section */}
            <div 
              className="relative overflow-hidden" 
              style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                  backgroundImage: 'url(/pp.png)',
                  aspectRatio: '9/16',
                }}
              >
                {/* Rounded area indicator (visual guide) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full"></div>
                </div>
              </div>
              {mediaUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative overflow-hidden rounded-full border-4 border-red-500 shadow-2xl"
                    style={{
                      width: '196px',
                      height: '196px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(4px)',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <div 
                      className="absolute inset-0"
                      onWheel={handleWheel}
                      onMouseDown={handleMouseDown}
                      style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                        overflow: 'hidden',
                        borderRadius: '50%'
                      }}
                    >
                      <img 
                        ref={imageRef}
                        src={mediaUrl} 
                        alt="Preview" 
                        className="absolute"
                        draggable="false"
                        style={{
                          width: imageSize,
                          height: imageSize,
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${imgPosition.x}px), calc(-50% + ${imgPosition.y}px))`,
                          transformOrigin: 'center center',
                          userSelect: 'none',
                          pointerEvents: 'none',
                          minWidth: '100%',
                          minHeight: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 max-w-xs">
                    <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-6">
                      <ImagePlus className="w-10 h-10 text-blue-400 dark:text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Media Selected</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Upload an image or video to get started</p>
                  </div>
                </div>
              )}
              {/* QR Code */}
              <div className="absolute bottom-4 right-4 p-2 rounded-lg shadow-md">
                <img 
                  src="/1qr-code.png" 
                  alt="Scan QR code" 
                  className="w-20 h-20 object-cover"
                />
                <p className="text-xs text-center mt-1 dark:text-gray-300">-</p>
              </div>
            </div>

            {/* Sharing Options Section */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <div className="max-w-sm mx-auto">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Share Your Content</h1>
                <div className="flex justify-between items-center mb-6">     
                  <h6 className="text-xl font-bold text-gray-800 dark:text-white">Position Control</h6>
                  {mediaUrl && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={zoomIn}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={zoomOut}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={resetPosition}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Reset"
                      >
                        <Move className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Social Buttons */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={() => onShare('instagram')}
                    className="group w-full flex items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900/50 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4 text-left">
                      <p className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Instagram</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Share as post or story</p>
                    </div>
                    <div className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => onShare('tiktok')}
                    className="group w-full flex items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                      <Music2 className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div className="ml-4 text-left">
                      <p className="font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">TikTok</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Share as post or story</p>
                    </div>
                    <div className="ml-auto text-gray-300 group-hover:text-gray-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </button>
                </div>
                
                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 font-medium">OR SHARE VIA LINK</span>
                  </div>
                </div>

                {/* Copy Link */}
                <div className="mb-6">
                  <div className="flex rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <div className="flex items-center pl-4 text-gray-400">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={mediaUrl || 'No media selected'}
                      className="flex-1 min-w-0 block w-full px-3 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 focus:ring-0 focus:outline-none"
                      placeholder="No media selected"
                    />
                    <button
                      onClick={() => {
                        if (mediaUrl) {
                          navigator.clipboard.writeText(mediaUrl);
                          toast({
                            title: "Link copied!",
                            description: "The link has been copied to your clipboard.",
                          });
                        }
                      }}
                      disabled={!mediaUrl}
                      className="px-5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">Copy</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:ml-2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                >
                  Done Sharing
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
