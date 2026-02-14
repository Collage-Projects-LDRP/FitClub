"use client";

import { Button } from '@/components/ui/button';
import { Share2, Download, Instagram, ArrowLeft, Copy } from 'lucide-react';
import { useState } from 'react';
import { useBeforeAfter } from '@/contexts/BeforeAfterContext';
import Image from 'next/image';
import { Logo } from '@/components/logo';

interface SharingStepProps {
  onBack: () => void;
  onComplete: () => void;
  selectedTemplate?: 'slider' | 'side-by-side' | 'fade';
}

// Minimal template renderers to mirror TemplateSelectionStep visual layouts
function SliderTemplatePreview({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) {
  return (
    <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative">
          {beforePhoto ? (
            <Image src={beforePhoto} alt="Before" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500">Before</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">BEFORE</div>
        </div>
        <div className="relative">
          {afterPhoto ? (
            <Image src={afterPhoto} alt="After" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500">After</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">AFTER</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900/80 border-t border-gray-700 flex items-center justify-between">
        <div className="flex-1">
          <Logo size="sm" isClickable={false} showUnderline={false} />
        </div>
        {qrCodeUrl && (
          <div className="relative w-16 h-16 bg-white p-1 rounded border border-gray-600">
            <Image src={qrCodeUrl} alt="QR Code" fill className="object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}

function SideBySideTemplatePreview({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) {
  return (
    <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-center items-center">
        <Logo size="md" isClickable={false} />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-0.5 bg-gray-800 p-1">
        <div className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">BEFORE</div>
          {beforePhoto ? (
            <Image src={beforePhoto} alt="Before" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Before</span>
            </div>
          )}
        </div>
        <div className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">AFTER</div>
          {afterPhoto ? (
            <Image src={afterPhoto} alt="After" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500 text-sm">After</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-100">Scan to view details</p>
            <p className="text-xs text-gray-400">Point your camera at the QR code</p>
          </div>
          {qrCodeUrl && (
            <div className="relative w-14 h-14 bg-white p-1.5 rounded border-2 border-gray-600">
              <Image src={qrCodeUrl} alt="QR Code" fill className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FadeTemplatePreview({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) {
  return (
    <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <Logo size="sm" isClickable={false} showUnderline={false} />
        </div>
        <div className="relative w-8 h-8">{qrCodeUrl && <Image src={qrCodeUrl} alt="QR Code" fill className="object-contain" />}</div>
      </div>
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="relative h-1/2 overflow-hidden">
          {beforePhoto ? (
            <Image src={beforePhoto} alt="Before" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500">Before Photo</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">BEFORE</div>
        </div>
        <div className="relative h-1/2 overflow-hidden">
          {afterPhoto ? (
            <Image src={afterPhoto} alt="After" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500">After Photo</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">AFTER</div>
        </div>
      </div>
    </div>
  );
}

export default function SharingStep({ onBack, onComplete, selectedTemplate = 'side-by-side' }: SharingStepProps) {
  // Note: qrCodeUrl and logoUrl may come from previous steps or be static assets
  const { beforePhoto, afterPhoto /*, qrCodeUrl, logoUrl*/, reset } = useBeforeAfter();
  // Use fallbacks if these aren't in context
  const qrCodeUrl = '/qr-code.png';
  const logoUrl = '/fitclub-logo.png';

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const handleShareInstagram = () => window.open('https://www.instagram.com/direct/inbox/', '_blank');
  const handleShareTikTok = () => window.open('https://www.tiktok.com/upload?lang=en', '_blank');

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'slider':
        return (
          <SliderTemplatePreview
            beforePhoto={beforePhoto}
            afterPhoto={afterPhoto}
            qrCodeUrl={qrCodeUrl}
            logoUrl={logoUrl}
          />
        );
      case 'fade':
        return (
          <FadeTemplatePreview
            beforePhoto={beforePhoto}
            afterPhoto={afterPhoto}
            qrCodeUrl={qrCodeUrl}
            logoUrl={logoUrl}
          />
        );
      case 'side-by-side':
      default:
        return (
          <SideBySideTemplatePreview
            beforePhoto={beforePhoto}
            afterPhoto={afterPhoto}
            qrCodeUrl={qrCodeUrl}
            logoUrl={logoUrl}
          />
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Side - Preview */}
      <div className="lg:w-1/2 xl:w-2/5 flex flex-col items-center">
        <div className="relative w-full max-w-md mx-auto">
          {renderTemplate()}
        </div>
      </div>

      {/* Right Side - Sharing Options */}
      <div className="lg:w-1/2 xl:w-3/5 flex flex-col">
        <div className="flex-1 bg-gray-900/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Share Your Transformation</h2>

          <div className="space-y-4 max-w-md mx-auto">
            <div
              className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={handleShareInstagram}
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

            <div
              className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={handleCopyLink}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">Copy Link</h3>
                  <p className="text-sm text-gray-400">Copy a shareable link</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
              </div>
            </div>
          </div>

          <div
            className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer mt-4"
            onClick={handleDownload}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Download</h3>
                <p className="text-sm text-gray-400">Save to your device</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
            <button
              onClick={() => {
                reset();
                window.location.href = '/before-after';
              }}
              className="w-full py-3 px-4 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Create Another Transformation
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 px-4 text-white border border-gray-700 rounded-xl hover:bg-gray-800/50 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
