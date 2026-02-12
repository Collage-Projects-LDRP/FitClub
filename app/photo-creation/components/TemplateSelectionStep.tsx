"use client";

import { motion } from 'framer-motion';
import { usePhotoCreation, type Template } from '@/contexts/PhotoCreationContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

export function TemplateSelectionStep() {
  const {
    selectedPhotos,
    selectedTemplate,
    setSelectedTemplate,
    templates,
  } = usePhotoCreation();

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  if (selectedPhotos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
        <p className="text-gray-400 mt-2">
          Select a template for your QR code placement
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                : 'hover:ring-1 hover:ring-gray-600'
            }`}
          >
            <div className="relative aspect-[3/4] bg-gray-800">
              <img
                src={selectedPhotos[0]}
                alt="Selected photo"
                className="w-full h-full object-cover"
              />
              <img
                src={template.preview}
                alt="QR Code"
                className="absolute object-contain"
                style={{
                  ...(template.qrPosition.transform ? {} : {
                    top: template.qrPosition.top,
                    right: template.qrPosition.right,
                    bottom: template.qrPosition.bottom,
                    left: template.qrPosition.left,
                  }),
                  width: template.qrPosition.width,
                  height: template.qrPosition.height,
                  ...(template.qrPosition.transform && {
                    transform: template.qrPosition.transform,
                    top: template.qrPosition.top,
                    left: template.qrPosition.left,
                    right: 'auto',
                    bottom: 'auto',
                  }),
                }}
              />
              {selectedTemplate?.id === template.id && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-800/50 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white text-center">{template.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Removed duplicate navigation buttons */}
    </div>
  );
}
