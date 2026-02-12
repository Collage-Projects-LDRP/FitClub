'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Video, 
  Image as ImageIcon, 
  GitCompare, 
  Upload, 
  ImagePlus, 
  Sparkles, 
  Check, 
  Plus, 
  Music,
  X,
  Play,
  Pause,
  Search,
  Link
} from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IntroSelection } from '@/components/video/IntroSelection'; // Import the IntroSelection component
import { useRouter } from 'next/navigation';

type ContentType = 'video' | 'photo' | 'before-after' | 'reel' | 'preview' | null;

export default function SocialSharePage() {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>(null);
  const [websiteUrl, setWebsiteUrl] = useState('https://yourwebsite.com');
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Photo state
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [useWebsiteGallery, setUseWebsiteGallery] = useState(true);
  
  // Before/After state
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [useWebsiteGalleryBA, setUseWebsiteGalleryBA] = useState(true);

  // Gradient backgrounds for cards
  const cardGradients = {
    video: 'from-purple-500 to-pink-500',
    photo: 'from-blue-500 to-cyan-400',
    'before-after': 'from-amber-500 to-orange-500',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File[]>>) => {
    if (e.target.files) {
      setter(Array.from(e.target.files));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setSelectedPhotos(prev => [...prev, ...newPhotos]);
    }
  }; 

  const handleGenerate = () => {
    // Implementation for generating the content
    console.log('Generating content...');
  };

  const handleReelComplete = (data: {
    introType: string;
    photos: string[];
    outroType: string | null;
    musicId: string | null;
  }) => {
    // Save the reel data to state or context
    console.log('Reel created:', data);
    
    // In a real app, you would save this to your database
    // and then navigate to the preview page
    setContentType('preview');
  };

  useEffect(() => {
    if (contentType === 'photo' && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/photo-creation');
    } else if (contentType === 'before-after' && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/before-after');
    }
  }, [contentType, isRedirecting, router]);

  const renderContentTypeSelector = () => (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Amazing Content
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500 mb-4">
            Social Media Content Creator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning content for all your social media platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              type: 'video',
              icon: <Video className="w-8 h-8" />,
              title: 'Video/Reels',
              description: 'Create engaging short videos with dynamic content',
              gradient: 'from-purple-600 to-pink-600',
              features: ['4K Quality', 'Smooth Transitions', 'Custom Branding'],
              img: 'reels.jpg'
            },
            {
              type: 'photo',
              icon: <ImageIcon className="w-8 h-8" />,
              title: 'Share Photo',
              description: 'Enhance and share beautiful photos',
              gradient: 'from-blue-500 to-cyan-400',
              features: ['AI Enhance', '100+ Filters', 'Custom Frames'],
              img: 'photo-share.jpg'
            },
            {
              type: 'before-after',
              icon: <GitCompare className="w-8 h-8" />,
              title: 'Before & After',
              description: 'Showcase transformations',
              gradient: 'from-amber-500 to-orange-500',
              features: ['Side-by-Side', 'Swipe Effect', 'Custom Overlays'],
              img: 'before-after.jpg'
            },
          ].map((item) => (
            <div 
              key={item.type}
              className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setContentType(item.type as ContentType)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`} />
              <div className="p-6 flex flex-col h-full relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 text-white`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
                <div className="space-y-1 mt-3">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <div className={`relative w-full max-w-xs aspect-[4/6] rounded-xl overflow-hidden bg-gradient-to-r ${item.gradient} p-0.5`}>
                    <div className="w-full h-full bg-white dark:bg-gray-950 flex items-center justify-center p-1">
                      {item.img ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={`/${item.img}`}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            priority={false}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-12 h-12 opacity-30" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className={`w-full mt-6 bg-gradient-to-r ${item.gradient} text-white hover:opacity-90 transition-opacity`}
                  size="lg"
                >
                  Get Started
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm text-sm text-muted-foreground border border-border">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            All content includes our premium styling and branding options
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackButton = () => (
    <Button 
      variant="ghost" 
      className="mb-6 group transition-all hover:bg-background/80 hover:shadow-sm"
      onClick={() => setContentType(null)}
    >
      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
      Back to Templates
    </Button>
  );

  const renderUploadArea = ({
    title,
    description,
    accept,
    onChange,
    multiple = false,
    file,
    icon = <Upload className="w-8 h-8 text-muted-foreground" />,
    className = ""
  }: {
    title: string;
    description: string;
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    multiple?: boolean;
    file: File | File[] | null;
    icon?: React.ReactNode;
    className?: string;
  }) => (
    <div className={`border-2 border-dashed border-border/50 rounded-xl overflow-hidden p-6 text-center transition-all hover:border-primary/30 hover:bg-primary/5 ${className}`}>
      <Input 
        type="file" 
        accept={accept} 
        multiple={multiple}
        className="hidden" 
        id={`file-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}
        onChange={onChange}
      />
      <label 
        htmlFor={`file-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="cursor-pointer flex flex-col items-center justify-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h4 className="font-medium text-lg mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          {multiple ? 'Select Files' : 'Select File'}
        </Button>
        {file && (
          <div className="mt-4 text-sm text-green-600 font-medium">
            {Array.isArray(file) 
              ? `${file.length} file${file.length > 1 ? 's' : ''} selected`
              : file.name}
          </div>
        )}
      </label>
    </div>
  );

  const renderVideoContent = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/reel-creation';
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading reel creator...</p>
      </div>
    );
  };

  const renderPhotoContent = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading photo editor...</p>
      </div>
    </div>
  );

  const renderBeforeAfterContent = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading before & after creator...</p>
    </div>
  );

  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      
      <div className="max-w-6xl mx-auto">
        {!contentType ? (
          renderContentTypeSelector()
        ) : (
          <div className="max-w-5xl mx-auto">
            {contentType === 'video' && renderVideoContent()}
            {contentType === 'photo' && renderPhotoContent()}
            {contentType === 'before-after' && renderBeforeAfterContent()}
            {contentType === 'reel' && renderReelContent()}
          </div>
        )}
      </div>
    </div>
  );
}
