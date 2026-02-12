"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import { useBeforeAfter } from '@/contexts/BeforeAfterContext';

// Base template component with consistent styling
const TemplateCard = ({ 
  title, 
  description,
  children,
  isSelected,
  onClick 
}: { 
  title: string;
  description: string;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div 
    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 h-full ${
      isSelected ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-700 hover:ring-pink-400'
    }`}
    onClick={onClick}
  >
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
      {children}
    </div>
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
      {title}
    </div>
    {isSelected && (
      <div className="absolute top-2 left-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
    )}
  </div>
);

// Template 1: Side by Side (previously Slider)
const SliderTemplate = ({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) => (
  <div className="relative w-full h-full bg-gray-900 aspect-[9/16] flex flex-col">
    {/* Main Content - Side by Side */}
    <div className="flex-1 grid grid-cols-2 bg-gray-800 p-1 gap-0.5">
      {/* Before Image */}
      <div className="relative">
        {beforePhoto ? (
          <Image src={beforePhoto} alt="Before" layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500">Before</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          BEFORE
        </div>
      </div>
      
      {/* After Image */}
      <div className="relative">
        {afterPhoto ? (
          <Image src={afterPhoto} alt="After" layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500">After</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          AFTER
        </div>
      </div>
    </div>
    
    {/* Footer with Logo and QR Code */}
    <div className="p-3 border-t border-gray-700 bg-gray-900">
      <div className="flex justify-between items-center">
        <div className="w-32 h-16 relative">
          <Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" />
        </div>
        <div className="w-16 h-16 relative bg-white p-1 rounded border border-gray-600">
          <Image src={qrCodeUrl} alt="QR Code" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
  </div>
);

// Template 2: Side by Side with Info
const SideBySideTemplate = ({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) => (
  <div className="relative w-full h-full bg-gray-900 aspect-[9/16] flex flex-col">
    {/* Header with Large Logo */}
    <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-center items-center">
      <div className="w-80 h-20 relative">
        <Image 
          src={logoUrl} 
          alt="Logo" 
          layout="fill" 
          objectFit="contain"
        />
      </div>
    </div>
    
    <div className="flex-1 grid grid-cols-2 gap-0.5 bg-gray-800 p-1">
      {/* Before */}
      <div className="bg-gray-900 rounded-l overflow-hidden relative">
        <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          BEFORE
        </div>
        {beforePhoto ? (
          <Image src={beforePhoto} alt="Before" layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Before</span>
          </div>
        )}
      </div>
      
      {/* After */}
      <div className="bg-gray-900 rounded-r overflow-hidden relative">
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          AFTER
        </div>
        {afterPhoto ? (
          <Image src={afterPhoto} alt="After" layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500 text-sm">After</span>
          </div>
        )}
      </div>
    </div>
    
    {/* QR Code Section */}
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-100">Scan to view details</p>
          <p className="text-xs text-gray-400">Point your camera at the QR code</p>
        </div>
        <div className="w-14 h-14 relative bg-white p-1.5 rounded border-2 border-gray-600">
          <Image src={qrCodeUrl} alt="QR Code" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
  </div>
);

// Template 3: Up-Down with Fade
const FadeTemplate = ({ beforePhoto, afterPhoto, qrCodeUrl, logoUrl }: any) => (
  <div className="relative w-full h-full bg-gray-900 aspect-[9/16] flex flex-col">
    {/* Header with Logo and QR Code */}
    <div className="p-4 flex justify-between items-center border-b border-gray-700">
      <div className="w-24 h-8 relative">
        <Image src={logoUrl} alt="Logo" layout="fill" objectFit="contain" />
      </div>
      <div className="w-8 h-8 relative">
        <Image src={qrCodeUrl} alt="QR Code" layout="fill" objectFit="contain" />
      </div>
    </div>
    
    {/* Main Content - Up-Down Layout */}
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Before Image (Top Half) */}
      <div className="relative h-1/2 overflow-hidden">
        {beforePhoto ? (
          <Image 
            src={beforePhoto} 
            alt="Before" 
            layout="fill" 
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500">Before Photo</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          BEFORE
        </div>
      </div>
      
      {/* After Image (Bottom Half) */}
      <div className="relative h-1/2 overflow-hidden">
        {afterPhoto ? (
          <Image 
            src={afterPhoto} 
            alt="After" 
            layout="fill" 
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500">After Photo</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded z-10">
          AFTER
        </div>
      </div>
    </div>
  </div>
);

// ... (keep the rest of the file the same)

interface TemplateSelectionStepProps {
  onContinue: (templateId: string) => void;
  onBack: () => void;
}

export default function TemplateSelectionStep({ onContinue, onBack }: TemplateSelectionStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { beforePhoto, afterPhoto } = useBeforeAfter();
  const qrCodeUrl = '/qr-code.png';
  const logoUrl = '/maxopolis-logo.png';

  const templates = [
    {
      id: 'slider',
      name: 'Slider',
      description: 'Interactive comparison with slider',
      component: SliderTemplate,
    },
    {
      id: 'side-by-side',
      name: 'Side by Side',
      description: 'Classic before/after view',
      component: SideBySideTemplate,
    },
    {
      id: 'fade',
      name: 'Fade',
      description: 'Hover to reveal changes',
      component: FadeTemplate,
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
        <p className="text-gray-400">Select how to display your transformation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {templates.map((template) => {
          const TemplateComponent = template.component;
          return (
            <TemplateCard
              key={template.id}
              title={template.name}
              description={template.description}
              isSelected={selectedTemplate === template.id}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <TemplateComponent 
                beforePhoto={beforePhoto} 
                afterPhoto={afterPhoto}
                qrCodeUrl={qrCodeUrl}
                logoUrl={logoUrl}
              />
            </TemplateCard>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button
          onClick={() => selectedTemplate && onContinue(selectedTemplate)}
          disabled={!selectedTemplate}
          className={`px-6 py-2.5 rounded-lg flex items-center ${
            selectedTemplate
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
