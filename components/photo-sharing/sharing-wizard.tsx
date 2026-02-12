"use client"

  import { useState, useEffect, useRef, useCallback } from 'react';
  import { Button } from '@/components/ui/button';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';
  import { Loader2, Check, X, Download, ArrowLeft, ArrowRight, Share2, Package2 } from 'lucide-react';
  import { getRewards } from "@/lib/database"
  import { QRCodeSVG } from 'qrcode.react'
  import { Instagram, Facebook, Twitter } from 'lucide-react';

  interface SharingWizardProps {
    isOpen: boolean
    onClose: () => void
    photoUrl: string
    onShare: (platform: string) => void
  }

  const VOTE_QR: ProductQR = {
    id: 'vote',
    name: 'Vote for Me',
    preview: 'https://yourwebsite.com/vote',
    points_required: 0
  }

  // Type for product QR codes from the reward store
  interface ProductQR {
    id: string;
    name: string;
    preview: string;
    points_required: number;
    imageUrl?: string; // Optional product image URL
  }

  export function SharingWizard({ isOpen, onClose, photoUrl, onShare }: SharingWizardProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedPromotionType, setSelectedPromotionType] = useState('vote')
    const [selectedQRType, setSelectedQRType] = useState<string>('vote')
    const [qrPosition, setQrPosition] = useState({ x: 50, y: 50 })
    const [productImagePosition, setProductImagePosition] = useState({ x: 30, y: 20 })
    const [products, setProducts] = useState<ProductQR[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAllProducts, setShowAllProducts] = useState(false)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const PRODUCTS_TO_SHOW = 3 // Number of products to show initially
    const imageRef = useRef<HTMLImageElement>(null)
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [activeDrag, setActiveDrag] = useState<null | 'product' | 'qr'>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [showRightSection, setShowRightSection] = useState(true);
    

    // Default QR code for vote promotion
    const voteQRValue = 'https://yourwebsite.com/vote'

    // Reset to step 1 when the wizard is opened
    useEffect(() => {
      if (isOpen) {
        setCurrentStep(1);
      }
    }, [isOpen]);

    // Add this useEffect near the top of your component, after the state declarations
    useEffect(() => {
      if (isOpen) {
        // Reset all relevant states
        setSelectedQRType('vote');
        setQrPosition({ x: 50, y: 50 });
        setProductImagePosition({ x: 30, y: 20 });
        setSelectedPromotionType('vote');
        setIsCustomizing(false);
        // Add any other state resets you need
      }
    }, [isOpen]); // This effect runs whenever isOpen changes

    // Load products from reward store
    useEffect(() => {
      if (isOpen) {
        const loadProducts = async () => {
          try {
            setIsLoading(true)
            setError(null)
            // Get all rewards with type 'product' from the database
            const allRewards = getRewards()
            const productRewards = allRewards.filter(
              (reward) => reward.category === 'product' && reward.stock > 0
            )
            
            // Transform to QR code format with product images
            const productQRs: ProductQR[] = productRewards.map((product) => ({
              id: `product-${product.id}`,
              name: product.name,
              // Store the product URL for QR code generation
              preview: `https://yourwebsite.com/products/${product.id}`,
              // Store the product image URL
              imageUrl: product.image_url || '/placeholder-product.png',
              points_required: product.points_required
            }))
            
            setProducts(productQRs)
            // Set the first product as default if available
            if (productQRs.length > 0) {
              setSelectedPromotionType(productQRs[0].id);
            }
          } catch (err) {
            console.error('Failed to load products:', err)
            setError('Failed to load products. Please try again.')
            setProducts([])
          } finally {
            setIsLoading(false)
          }
        }
        
        loadProducts()
      }
    }, [isOpen])
    
    const handleDownload = () => {
      // Close the wizard when downloading
      onClose()
      // Trigger the download action in the parent component
      onShare('download')
    }

    const handleNext = () => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      }
    }
    
    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }
  
    const handleShareClick = () => {
      setShowRightSection(!showRightSection);
    };
    
    // Update image dimensions when loaded
    const handleImageLoad = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight
        });
      }
    };

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!activeDrag || !previewContainerRef.current) return;
      
      const container = previewContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - container.left) / container.width) * 100;
      const y = ((e.clientY - container.top) / container.height) * 100;
      
      if (activeDrag === 'product') {
        setProductImagePosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y))
        });
      } else {
        setQrPosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y))
        });
      }
    }, [activeDrag]);

    // Clean up event listeners
    useEffect(() => {
      if (isCustomizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => setActiveDrag(null));
      }
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', () => setActiveDrag(null));
      };
    }, [isCustomizing, handleMouseMove]);

    // Handle QR code position changes
    const handleQrPositionChange = (axis: 'x' | 'y', value: number) => {
      setQrPosition(prev => ({
        ...prev,
        [axis]: Math.max(0, Math.min(100, value)) // Ensure value stays within 0-100%
      }));
    };

    // Handle product image position changes
    const handleProductImagePositionChange = (axis: 'x' | 'y', value: number) => {
      setProductImagePosition(prev => ({
        ...prev,
        [axis]: Math.max(0, Math.min(100, value)) // Ensure value stays within 0-100%
      }));
    };

    // Calculate slider max values based on element size and container
    const getSliderMax = (axis: 'x' | 'y', elementSize = 80) => {
      if (!imageRef.current || imageSize.width === 0 || imageSize.height === 0) return 100;
      
      // Calculate the maximum position to keep the element fully visible
      if (axis === 'x') {
        return 100 - (elementSize / imageSize.width * 100);
      } else {
        return 100 - (elementSize / imageSize.height * 100);
      }
    };

    const handlePositionChange = (e: React.MouseEvent<HTMLDivElement>) => {
      if (currentStep !== 2) return;
      
      const container = e.currentTarget;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the displayed image dimensions within the container
      const containerAspect = containerRect.width / containerRect.height;
      const imageAspect = imageSize.width / imageSize.height;
      
      let displayedWidth, displayedHeight, offsetX = 0, offsetY = 0;
      
      if (containerAspect > imageAspect) {
        // Container is wider than the image (pillarboxed)
        displayedHeight = containerRect.height;
        displayedWidth = displayedHeight * imageAspect;
        offsetX = (containerRect.width - displayedWidth) / 2;
      } else {
        // Container is taller than the image (letterboxed)
        displayedWidth = containerRect.width;
        displayedHeight = displayedWidth / imageAspect;
        offsetY = (containerRect.height - displayedHeight) / 2;
      }
      
      // Calculate position relative to the actual image
      let x = ((e.clientX - containerRect.left - offsetX) / displayedWidth) * 100;
      let y = ((e.clientY - containerRect.top - offsetY) / displayedHeight) * 100;
      
      // Calculate element size as percentage of image dimensions
      const elementSize = 80; // Size of the QR code/product image in pixels
      const elementWidthPercent = (elementSize / imageSize.width) * 100;
      const elementHeightPercent = (elementSize / imageSize.height) * 100;
      
      // Constrain position to keep element fully within image bounds
      x = Math.max(elementWidthPercent / 2, Math.min(100 - elementWidthPercent / 2, x));
      y = Math.max(elementHeightPercent / 2, Math.min(100 - elementHeightPercent / 2, y));
      
      setQrPosition({ x, y });
      setProductImagePosition(prev => ({
        ...prev,
        x: selectedPromotionType === 'product' ? x : prev.x,
        y: selectedPromotionType === 'product' ? y : prev.y
      }));
    };

    // Reset customizing state when QR type changes
    useEffect(() => {
      setIsCustomizing(false);
    }, [selectedQRType]);

    // Handle QR type change
    const handleQRTypeChange = (type: string) => {
      setSelectedQRType(type);
      // Reset to default positions when changing QR type
      setProductImagePosition({ x: 30, y: 70 });
      setQrPosition({ x: 70, y: 30 });
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent 
          className="max-w-6xl w-full h-[90vh] max-h-[800px] flex flex-col p-0 overflow-hidden"
          onInteractOutside={(e) => {
            // Prevent closing when clicking outside
            e.preventDefault();
          }}
        >
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <DialogTitle className="text-2xl font-bold text-center">Share Your Photo</DialogTitle>
            <DialogDescription className="text-center">
              Customize and share your photo with QR code
            </DialogDescription>
          </DialogHeader>
    
          <div className="flex flex-1 overflow-hidden w-full">
            {/* Left Section - Image Preview */}
            <div className="w-1/3 h-full flex items-center justify-center bg-black-50 p-4">
              <div 
                ref={previewContainerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onMouseDown={() => isCustomizing && setActiveDrag(null)}
                style={{
                  maxWidth: '400px',
                  maxHeight: '500px',
                  aspectRatio: '3/4',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white'
                }}
              >
                <img 
                  ref={imageRef}
                  src={photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center'
                  }}
                  onLoad={handleImageLoad}
                />
                
                {/* Product Image Overlay */}
                {selectedQRType === 'product' && selectedPromotionType !== 'vote' && (
                  <div 
                    className={`absolute cursor-move ${isCustomizing ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      top: `${productImagePosition.y}%`,
                      left: `${productImagePosition.x}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 5,
                      maxWidth: '30%',
                      maxHeight: '30%',
                      padding: '4px',
                      backgroundColor: isCustomizing ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseDown={(e) => {
                      if (!isCustomizing) return;
                      e.stopPropagation();
                      setActiveDrag('product');
                    }}
                  >
                    <img
                      src={products.find(p => p.id === selectedPromotionType)?.imageUrl || ''}
                      alt="Product"
                      className="w-full h-full object-contain"
                      style={{ maxWidth: '100px', maxHeight: '100px', minWidth: '100px', minHeight: '100px' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                )}
                
                {/* QR Code Overlay */}
                {selectedQRType && (
                  <div 
                    className={`absolute ${isCustomizing ? 'cursor-move ring-2 ring-green-500' : ''}`}
                    style={{
                      top: `${qrPosition.y}%`,
                      left: `${qrPosition.x}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      backgroundColor: 'white',
                      padding: '8px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseDown={(e) => {
                      if (!isCustomizing) return;
                      e.stopPropagation();
                      setActiveDrag('qr');
                    }}
                  >
                    <QRCodeSVG 
                      value={selectedQRType === 'vote' ? voteQRValue : selectedQRType} 
                      size={100}
                      level="H"
                      includeMargin={false}
                    />
                    <p className="text-[10px] font-semibold mt-1.5 text-center text-gray-700 tracking-tight leading-tight">
                        {selectedQRType === 'vote' 
                          ? 'SCAN TO VOTE' 
                          : 'SCAN FOR 20% OFF'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showRightSection ? (
    <div className="w-2/3 h-full overflow-y-auto p-6">
      {/* Your existing right section content */}
  
            {/* Right Section - QR Code Options */}
            <div className="w-auto flex flex-col gap-4 overflow-y-auto pr-2">
              {/* Option Buttons */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">QR Code Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={selectedQRType === 'vote' ? 'default' : 'outline'}
                    className={`flex-1 ${selectedQRType === 'vote' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                    onClick={() => handleQRTypeChange('vote')}
                  >
                    <div className="flex items-center justify-center w-full gap-2">
                      <QRCodeSVG 
                        value="VOTE" 
                        size={18} 
                        level="H" 
                        className={selectedQRType === 'vote' ? 'text-primary-foreground' : 'text-primary'} 
                      />
                      <span>Vote for Me</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant={selectedQRType === 'product' ? 'default' : 'outline'}
                    className={`flex-1 ${selectedQRType === 'product' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                    onClick={() => handleQRTypeChange('product')}
                  >
                    <div className="flex items-center justify-center w-full gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={selectedQRType === 'product' ? 'text-primary-foreground' : 'text-primary'}
                      >
                        <path d="M22 9H2l10 10L22 9z"/>
                        <path d="M2 9l3 9h14l3-9"/>
                        <path d="M12 9V5"/>
                      </svg>
                      <span>Product</span>
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* QR Code Type Selection */}
              {selectedQRType === 'vote' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">QR Code Position</h3>
                  <p className="text-sm text-muted-foreground">Choose a position for your QR code</p>
                  
                  {!isCustomizing ? (
                    <div className="grid grid-cols-3 gap-4">
                      {/* Position 1: Custom */}
                      <div 
                        className={`relative border-2 ${isCustomizing ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary'} rounded-lg overflow-hidden transition-colors cursor-pointer group`}
                        onClick={() => {
                          const newState = !isCustomizing;
                          setIsCustomizing(newState);
                          if (newState) {
                            // Reset to default positions when entering custom mode
                            setProductImagePosition({ x: 30, y: 70 });
                            setQrPosition({ x: 70, y: 30 });
                          }
                        }}
                      >
                        <div className="relative w-full aspect-square bg-muted/10 flex items-center justify-center">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity"
                          />
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground z-10">
                            {isCustomizing ? (
                              <>
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                                  </svg>
                                </div>
                                <span className="text-sm font-medium text-primary">Customizing...</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                                </svg>
                                <span className="text-sm font-medium group-hover:text-primary">Custom Position</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="p-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            {isCustomizing ? 'Drag elements to position' : 'Click to set custom position'}
                          </p>
                        </div>
                      </div>
                      {/* Position 2: Top Left */}
                      <div 
                        className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setQrPosition({ x: 16, y: 14 })}
                      >
                        <div className="relative w-full aspect-square bg-muted/30">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute w-1/4 h-1/4 left-2 top-2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center">
                            <QRCodeSVG value="VOTE" size={44} level="H" className="opacity-70" />
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium">Top Left</h4>
                          <p className="text-xs text-muted-foreground">QR placed in top left corner</p>
                        </div>
                      </div>

                      {/* Position 3: Top Right */}
                      <div 
                        className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setQrPosition({ x: 84, y: 14 })}
                      >
                        <div className="relative w-full aspect-square bg-muted/30">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute w-1/4 h-1/4 right-2 top-2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center">
                            <QRCodeSVG value="VOTE" size={44} level="H" className="opacity-70" />
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium">Top Right</h4>
                          <p className="text-xs text-muted-foreground">QR placed in top right corner</p>
                        </div>
                      </div>

                      {/* Position 4: Bottom Left */}
                      <div 
                        className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setQrPosition({ x: 16, y: 86 })}
                      >
                        <div className="relative w-full aspect-square bg-muted/30">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute w-1/4 h-1/4 left-2 bottom-2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center">
                            <QRCodeSVG value="VOTE" size={44} level="H" className="opacity-70" />
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium">Bottom Left</h4>
                          <p className="text-xs text-muted-foreground">QR placed in bottom left corner</p>
                        </div>
                      </div>

                      {/* Position 6: Bottom Right */}
                      <div 
                        className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setQrPosition({ x: 84, y: 86 })}
                      >
                        <div className="relative w-full aspect-square bg-muted/30">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute w-1/4 h-1/4 right-2 bottom-2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center">
                            <QRCodeSVG value="VOTE" size={44} level="H" className="opacity-70" />
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium">Bottom Right</h4>
                          <p className="text-xs text-muted-foreground">QR placed in bottom right corner</p>
                        </div>
                      </div>

                      {/* Position 7: Center */}
                      <div 
                        className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                        onClick={() => setQrPosition({ x: 50, y: 50 })}
                      >
                        <div className="relative w-full aspect-square bg-muted/30">
                          <img 
                            src={photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute w-1/4 h-1/4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center">
                            <QRCodeSVG value="VOTE" size={44} level="H" className="opacity-70" />
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium">Center</h4>
                          <p className="text-xs text-muted-foreground">QR placed in the center</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        {/* Image Container */}
                        {/* <div className="relative w-1/2 h-auto bg-muted/20 rounded-lg overflow-hidden border border-border">
                          <img 
                            src={photoUrl}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain"
                            ref={imageRef}
                            onLoad={handleImageLoad}
                          />
                          <div 
                            className="absolute border-2 border-primary border-dashed rounded-md bg-white/80 p-2 cursor-move"
                            style={{
                              width: '70px',
                              height: '70px',
                              left: `${qrPosition.x}%`,
                              top: `${qrPosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10,
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startLeft = qrPosition.x;
                              const startTop = qrPosition.y;

                              const onMouseMove = (e: MouseEvent) => {
                                if (!imageRef.current) return;
                                
                                const container = imageRef.current.getBoundingClientRect();
                                const x = Math.max(0, Math.min(100, startLeft + ((e.clientX - startX) / container.width) * 100));
                                const y = Math.max(0, Math.min(100, startTop + ((e.clientY - startY) / container.height) * 100));
                                setQrPosition({ x, y });
                              };

                              const onMouseUp = () => {
                                document.removeEventListener('mousemove', onMouseMove);
                                document.removeEventListener('mouseup', onMouseUp);
                              };

                              document.addEventListener('mousemove', onMouseMove);
                              document.addEventListener('mouseup', onMouseUp, { once: true });
                            }}
                          >
                            <QRCodeSVG 
                              value={voteQRValue} 
                              size={64} 
                              level="H"
                              className="w-full h-full"
                            />
                          </div>
                        </div> */}

                        {/* Position Controls */}
                        <div className="w-full space-y-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Position Controls</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Horizontal (X)</span>
                                  <span>{Math.round(qrPosition.x)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={qrPosition.x}
                                  onChange={(e) => setQrPosition({...qrPosition, x: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Vertical (Y)</span>
                                  <span>{Math.round(qrPosition.y)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={qrPosition.y}
                                  onChange={(e) => setQrPosition({...qrPosition, y: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Quick Positions</h4>
                            <div className="grid grid-cols-5 gap-2">
                              {[
                                { name: 'Top Left', x: 16, y: 14 },
                                { name: 'Top Right', x: 84, y: 14 },
                                { name: 'Bottom Left', x: 16, y: 86 },
                                { name: 'Bottom Right', x: 84, y: 86 },
                                { name: 'Center', x: 50, y: 50 },
                              ].map((pos, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => setQrPosition({ x: pos.x, y: pos.y })}
                                >
                                  {pos.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsCustomizing(false)}
                        >
                          Back to Templates
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Drag the QR code or use the sliders to position it
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* {!isCustomizing && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setIsCustomizing(true)}
                      >
                        Custom Position
                      </Button>
                    </div>
                  )} */}
                </div>
              )}

              {selectedQRType === 'product' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Select a Product</h3>
                    {products.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="text-sm text-primary hover:bg-transparent"
                      >
                        {showAllProducts ? 'Show Less' : `Show All (${products.length})`}
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    {products.slice(0, showAllProducts ? products.length : 3).map((product) => (
                      <div
                        key={product.id}
                        className={`relative border rounded-lg overflow-hidden transition-all cursor-pointer hover:border-primary ${
                          selectedPromotionType === product.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPromotionType(product.id)}
                      >
                        <div className="relative aspect-square bg-muted/20">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/30">
                              <Package2 className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          {/* <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                            {product.points_required} pts
                          </div> */}
                        </div>
                        <div className="p-3 border-t">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          {/* <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {product.preview}
                          </p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedQRType === 'product' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Product Layout</h3>
                  <p className="text-sm text-muted-foreground">Choose a layout for your product image and QR code</p>
                  
                  {!isCustomizing ? (
                    <div className="grid grid-cols-3 gap-4">
                    {/* Position 1: Custom */}
                    <div 
                      className={`relative border-2 ${isCustomizing ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary'} rounded-lg overflow-hidden transition-colors cursor-pointer group`}
                      onClick={() => {
                        const newState = !isCustomizing;
                        setIsCustomizing(newState);
                        if (newState) {
                          // Reset to default positions when entering custom mode
                          setProductImagePosition({ x: 30, y: 70 });
                          setQrPosition({ x: 70, y: 30 });
                        }
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/10 flex items-center justify-center">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity"
                        />
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground z-10">
                          {isCustomizing ? (
                            <>
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-primary">Customizing...</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                              </svg>
                              <span className="text-sm font-medium group-hover:text-primary">Custom Position</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="p-2 border-t">
                        <p className="text-xs text-muted-foreground text-center">
                          {isCustomizing ? 'Drag elements to position' : 'Click to set custom position'}
                        </p>
                      </div>
                    </div>
                    {/* Template 2: QR Top Right, Image Top Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 12 });
                        setQrPosition({ x: 84, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Poroduct</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Right</h4>
                        <p className="text-xs text-muted-foreground">QR top right, image top left</p>
                      </div>
                    </div>

                    {/* Template 3: QR Bottom Right, Image Top Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 12 });
                        setQrPosition({ x: 84, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Bottom Right</h4>
                        <p className="text-xs text-muted-foreground">QR bottom right, image top right</p>
                      </div>
                    </div>

                    {/* Template 4: QR Bottom Left, Image Bottom Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 89 });
                        setQrPosition({ x: 16, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Bottom Left</h4>
                        <p className="text-xs text-muted-foreground">QR bottom left, image bottom right</p>
                      </div>
                    </div>

                    {/* Template 5: QR Top Left, Image Bottom Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 89 });
                        setQrPosition({ x: 16, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Top Left</h4>
                        <p className="text-xs text-muted-foreground">QR top left, image bottom left</p>
                      </div>
                    </div>

                    {/* Template 6: Image Top Right, QR Top Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 12 });
                        setQrPosition({ x: 16, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">Image Right</h4>
                        <p className="text-xs text-muted-foreground">Image top right, QR top left</p>
                      </div>
                    </div>

                    {/* Template 7: Image Bottom Right, QR Top Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 89 });
                        setQrPosition({ x: 84, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">Image Bottom Right</h4>
                        <p className="text-xs text-muted-foreground">Image bottom right, QR top right</p>
                      </div>
                    </div>

                    {/* Template 8: Image Bottom Left, QR Bottom Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 89 });
                        setQrPosition({ x: 84, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">Image Bottom Left</h4>
                        <p className="text-xs text-muted-foreground">Image bottom left, QR bottom right</p>
                      </div>
                    </div>

                    {/* Template 9: Image Top Left, QR Bottom Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 12 });
                        setQrPosition({ x: 16, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">Image Top Left</h4>
                        <p className="text-xs text-muted-foreground">Image top left, QR bottom left</p>
                      </div>
                    </div>
                    {/* Template 10: QR Bottom Right, Image Top Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 12 });
                        setQrPosition({ x: 84, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Right</h4>
                        <p className="text-xs text-muted-foreground">QR bottom right, image top left</p>
                      </div>
                    </div>
                    {/* Template 11: QR Top Left, Image Bottom Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 89 });
                        setQrPosition({ x: 16, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Left</h4>
                        <p className="text-xs text-muted-foreground">QR top left, image bottom right</p>
                      </div>
                    </div>
                    {/* Template 12: QR Bottom Left, Image Top Right */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 89, y: 12 });
                        setQrPosition({ x: 16, y: 86 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Left</h4>
                        <p className="text-xs text-muted-foreground">QR bottom left, image top right</p>
                      </div>
                    </div>
                    {/* Template 13: QR Top Right, Image Bottom Left */}
                    <div 
                      className="relative border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setProductImagePosition({ x: 11, y: 89 });
                        setQrPosition({ x: 84, y: 14 });
                      }}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <img 
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-1/3 h-1/3 left-2 bottom-1/4 translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 flex items-center justify-center p-1">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">Product</div>
                        </div>
                        <div className="absolute w-1/4 h-1/4 right-2 top-1/4 -translate-y-1/2 border-2 border-primary border-dashed rounded-md bg-white/80 p-1">
                          <QRCodeSVG value="PROD" size={64} level="H" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <h4 className="font-medium">QR Right</h4>
                        <p className="text-xs text-muted-foreground">QR top right, image bottom left</p>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        {/* Image Container */}
                        {/* <div className="relative w-1/2 h-auto bg-muted/20 rounded-lg overflow-hidden border border-border">
                          <img 
                            src={photoUrl}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain"
                            ref={imageRef}
                            onLoad={handleImageLoad}
                          />
                          <div 
                            className="absolute border-2 border-primary border-dashed rounded-md bg-white/80 p-2 cursor-move"
                            style={{
                              width: '70px',
                              height: '70px',
                              left: `${productImagePosition.x}%`,
                              top: `${productImagePosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10,
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startLeft = productImagePosition.x;
                              const startTop = productImagePosition.y;

                              const onMouseMove = (e: MouseEvent) => {
                                if (!imageRef.current) return;
                                
                                const container = imageRef.current.getBoundingClientRect();
                                const x = Math.max(0, Math.min(100, startLeft + ((e.clientX - startX) / container.width) * 100));
                                const y = Math.max(0, Math.min(100, startTop + ((e.clientY - startY) / container.height) * 100));
                                setProductImagePosition({ x, y });
                              };

                              const onMouseUp = () => {
                                document.removeEventListener('mousemove', onMouseMove);
                                document.removeEventListener('mouseup', onMouseUp);
                              };

                              document.addEventListener('mousemove', onMouseMove);
                              document.addEventListener('mouseup', onMouseUp, { once: true });
                            }}
                          >
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">
                              Product
                            </div>
                          </div>
                          
                          <div 
                            className="absolute border-2 border-primary border-dashed rounded-md bg-white/80 p-2 cursor-move"
                            style={{
                              width: '70px',
                              height: '70px',
                              left: `${qrPosition.x}%`,
                              top: `${qrPosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10,
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startLeft = qrPosition.x;
                              const startTop = qrPosition.y;

                              const onMouseMove = (e: MouseEvent) => {
                                if (!imageRef.current) return;
                                
                                const container = imageRef.current.getBoundingClientRect();
                                const x = Math.max(0, Math.min(100, startLeft + ((e.clientX - startX) / container.width) * 100));
                                const y = Math.max(0, Math.min(100, startTop + ((e.clientY - startY) / container.height) * 100));
                                setQrPosition({ x, y });
                              };

                              const onMouseUp = () => {
                                document.removeEventListener('mousemove', onMouseMove);
                                document.removeEventListener('mouseup', onMouseUp);
                              };

                              document.addEventListener('mousemove', onMouseMove);
                              document.addEventListener('mouseup', onMouseUp, { once: true });
                            }}
                          >
                            <QRCodeSVG 
                              value={voteQRValue} 
                              size={64} 
                              level="H"
                              className="w-full h-full"
                            />
                          </div>
                        </div> */}

                        {/* Position Controls */}
                        <div className="w-full space-y-6">
                          {/* QR Code Position Controls */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">QR Code Position</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Horizontal (X)</span>
                                  <span>{Math.round(qrPosition.x)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={qrPosition.x}
                                  onChange={(e) => setQrPosition({...qrPosition, x: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Vertical (Y)</span>
                                  <span>{Math.round(qrPosition.y)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={qrPosition.y}
                                  onChange={(e) => setQrPosition({...qrPosition, y: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Product Image Position Controls */}
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Product Image Position</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Horizontal (X)</span>
                                  <span>{Math.round(productImagePosition.x)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={productImagePosition.x}
                                  onChange={(e) => setProductImagePosition({...productImagePosition, x: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Vertical (Y)</span>
                                  <span>{Math.round(productImagePosition.y)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={productImagePosition.y}
                                  onChange={(e) => setProductImagePosition({...productImagePosition, y: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsCustomizing(false)}
                        >
                          Back to Templates
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Drag the QR code and Product image or use the sliders to position it
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div className="flex justify-between items-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCustomizing(false)}
                    >
                      Back to Templates
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Drag the QR code and Product image or use the sliders to position it
                    </div>
                  </div> */}
                </div>
              )}
              
              
            </div>

            </div>
  ) : (
    <div className="w-2/3 h-full p-6 bg-primary/5 flex flex-col items-center justify-center">
              <div className="text-center mb-8 max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Share Your Creation</h3>
                <p className="text-muted-foreground">Spread the word with your audience and get more engagement</p>
              </div>
              
              <div className="w-full max-w-md space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-3 px-4 py-6 hover:shadow-md transition-all duration-200 border-input"
                    onClick={() => onShare('instagram')}
                  >
                    <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-xl">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium text-foreground">Instagram</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-3 px-4 py-6 hover:shadow-md transition-all duration-200 border-input"
                    onClick={() => onShare('tiktok')}
                  >
                    <div className="bg-black p-2.5 rounded-xl">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-white">TikTok</span>
                </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-gray-50 text-sm text-gray-400">or save to device</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full h-16 justify-center gap-3 px-6 py-4 hover:shadow-md transition-all duration-200 border-dashed border-input hover:border-blue-300"
                  onClick={handleDownload}
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-white">Download HD Image</span>
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <p>Your creation is ready to shine! ✨</p>
              </div>
              {/* <Button 
                variant="ghost" 
                className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowRightSection(true)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Editor
              </Button> */}
            </div>
          )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t m-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!showRightSection && (
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowRightSection(true)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Editor
              </Button>
            )}
            {showRightSection && (
              <Button 
                onClick={() => setShowRightSection(false)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
