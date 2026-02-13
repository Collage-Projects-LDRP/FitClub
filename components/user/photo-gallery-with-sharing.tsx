"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Instagram, Share2, Edit, Trash2, QrCode, Info, Camera, Heart, MessageCircle } from "lucide-react"
import { SharingWizard } from "@/components/photo-sharing/sharing-wizard"
import { Switch } from "@/components/ui/switch"
import { ImageIcon } from "lucide-react"
import { QROverlayEditor } from "@/components/profile/qr-overlay-editor"

interface Photo {
  id: string
  url: string
  caption: string
  votes: number
  comments: number
  category: string
}

interface PhotoGalleryWithSharingProps {
  user?: {
    id?: string
    name?: string
    email?: string
    // Add other user properties as needed
  } | null
}

const samplePhotos: Photo[] = [
  {
    id: "1",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXddFsc2ZN8pvT0JDHluovLkrnIVCWnx3vsg&s",
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
    url: "https://shotkit.com/wp-content/uploads/2021/07/alexi-romano-hip-pop.jpg",
    caption: "Outdoor training session by the beach 🌊",
    votes: 56,
    comments: 15,
    category: "Outdoor",
  },
  {
    id: "7",
    url: "https://www.shutterstock.com/image-photo/man-doing-pullups-fitness-gym-600nw-1996094180.jpg",
    caption: "Chin-up training session 🌊",
    votes: 56,
    comments: 15,
    category: "Chin-up",
  },
  {
    id: "8",
    url: "https://images.ctfassets.net/8urtyqugdt2l/4wPk3KafRwgpwIcJzb0VRX/4894054c6182c62c1d850628935a4b0b/desktop-best-chest-exercises.jpg",
    caption: "Bench-Press training session 🌊",
    votes: 56,
    comments: 15,
    category: "Bench-Press",
  },
  {
    id: "9",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGtz2RcQ0RtTcxXuSvMBtDw5s8P3O5kI2zw&s",
    caption: "Squat training session 🌊",
    votes: 56,
    comments: 15,
    category: "Squat",
  },  
  {
    id: "10",
    url: "https://images.pexels.com/photos/17944268/pexels-photo-17944268.jpeg?cs=srgb&dl=pexels-bi-lal-karadag-582268222-17944268.jpg&fm=jpg",
    caption: "Overhead-Press training session 🌊",
    votes: 56,
    comments: 15,
    category: "Overhead-Press",
  },
  {
    id: "11",
    url: "https://flex-web-media-prod.storage.googleapis.com/2025/05/barbell-row-exercise-gym.jpg",
    caption: "Barbell-Row training session 🌊",
    votes: 56,
    comments: 15,
    category: "Barbell-Row",
  },
  {
    id: "12",
    url: "https://c8.alamy.com/comp/W1MAGJ/shirtless-muscular-man-doing-dips-exercise-at-the-gym-W1MAGJ.jpg",
    caption: "Dips training session 🌊",
    votes: 56,
    comments: 15,
    category: "Dips",
  },
  {
    id: "13",
    url: "https://cdn.sanity.io/images/263h0ltd/production/071340b632a59d0c502b5213775fdb392b846d93-600x400.jpg?w=1500&q=90&fit=fillmax&auto=format",
    caption: "Front-Squat training session 🌊",
    votes: 56,
    comments: 15,
    category: "Front-Squat",
  },
]

export default function PhotoGalleryWithSharing({ user }: PhotoGalleryWithSharingProps) {
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isQREditorOpen, setIsQREditorOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [isSharingWizardOpen, setIsSharingWizardOpen] = useState(false)
  const [sharingPhoto, setSharingPhoto] = useState<Photo | null>(null)
  const [shareOptions, setShareOptions] = useState({
    showQR: true,
    showWatermark: true,
    platform: "" as "instagram" | "tiktok" | "",
    qrPosition: { x: 80, y: 10 }, // Percentage from top-left
    watermarkPosition: { x: 80, y: 90 }, // Percentage from top-left
    qrType: 'default' as 'default' | 'rounded' | 'dots' | 'classy'
  })
  const [newPhoto, setNewPhoto] = useState({ caption: "", category: "" })

  const [dragging, setDragging] = useState<{type: 'qr' | 'watermark' | null, startX: number, startY: number}>({
    type: null,
    startX: 0,
    startY: 0
  });

  const handleShare = (platform: "instagram" | "tiktok" | "qr", photo: Photo) => {
    // Always use the new sharing wizard for all sharing options
    setSharingPhoto(photo)
    setIsSharingWizardOpen(true)
  }

  const handleShareComplete = (platform: string) => {
    if (!sharingPhoto) return
    
    const baseUrl = `${window.location.origin}/photo/${sharingPhoto.id}`
    setShareUrl(baseUrl)
    
    if (platform === 'download') {
      // Handle download
      const a = document.createElement('a')
      a.href = sharingPhoto.url
      a.download = `fitclub-share-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      // Handle social sharing
      setShareOptions(prev => ({
        ...prev,
        platform: platform as "instagram" | "tiktok"
      }))
      setIsShareDialogOpen(true)
    }
    
    setIsSharingWizardOpen(false)
  }

  const handleShareToPlatform = async () => {
    if (!selectedPhoto || !shareOptions.platform) return
    
    // Create a canvas to generate the final image with QR code and watermark
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = async () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Draw the original image
      ctx.drawImage(img, 0, 0)
      
      // Add watermark if enabled
      if (shareOptions.showWatermark) {
        const watermark = new Image()
        watermark.crossOrigin = 'anonymous'
        
        watermark.onload = () => {
          // Draw watermark in bottom right corner
          const watermarkWidth = img.width * 0.3
          const watermarkHeight = (watermark.height * watermarkWidth) / watermark.width
          const margin = 20
          const x = (img.width * shareOptions.watermarkPosition.x) / 100 - watermarkWidth - margin
          const y = (img.height * shareOptions.watermarkPosition.y) / 100 - watermarkHeight - margin
          
          ctx.globalAlpha = 0.8
          ctx.drawImage(
            watermark,
            x,
            y,
            watermarkWidth,
            watermarkHeight
          )
          ctx.globalAlpha = 1.0
          
          // Add QR code if enabled
          addQRCode()
        }
        
        // Use the logo image as watermark
        watermark.src = '/fitclub-logo.png'
      } else {
        addQRCode()
      }
      
      function addQRCode() {
        if (!shareOptions.showQR || !ctx) return
        
        // Add QR code in top right corner
        const qrSize = Math.min(img.width, img.height) * 0.2
        const qrImg = new Image()
        qrImg.crossOrigin = 'anonymous'
        
        qrImg.onload = () => {
          // Draw white background for QR code
          const padding = 5
          const qrWithPadding = qrSize + (padding * 2)
          const x = (img.width * shareOptions.qrPosition.x) / 100 - qrWithPadding - 10
          const y = (img.height * shareOptions.qrPosition.y) / 100 - qrWithPadding - 10
          
          ctx.fillStyle = 'white'
          ctx.fillRect(
            x,
            y,
            qrWithPadding,
            qrWithPadding
          )
          
          // Draw QR code
          ctx.drawImage(
            qrImg,
            x + padding,
            y + padding,
            qrSize,
            qrSize
          )
          
          // Open the final image in a new tab for sharing
          openSharePreview()
        }
        
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
      }
      
      function openSharePreview() {
        const finalImage = canvas.toDataURL('image/jpeg', 0.9)
        const shareWindow = window.open('', '_blank')
        
        if (shareWindow) {
          shareWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Share on ${shareOptions.platform.charAt(0).toUpperCase() + shareOptions.platform.slice(1)}</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center;
                    background: #f5f5f5;
                  }
                  .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  }
                  h1 { 
                    color: #333; 
                    text-align: center;
                    margin-bottom: 20px;
                  }
                  .preview { 
                    max-width: 100%; 
                    margin: 20px 0; 
                    text-align: center;
                  }
                  .preview img { 
                    max-width: 100%; 
                    max-height: 70vh;
                    border-radius: 8px; 
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                  }
                  .actions { 
                    display: flex; 
                    gap: 10px; 
                    justify-content: center;
                    margin-top: 20px;
                    flex-wrap: wrap;
                  }
                  button { 
                    background: #4f46e5; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 4px; 
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                  }
                  button:hover {
                    background: #4338ca;
                  }
                  .btn-instagram { background: #e1306c; }
                  .btn-instagram:hover { background: #c13584; }
                  .btn-tiktok { background: #000; }
                  .btn-tiktok:hover { background: #333; }
                  .btn-download { background: #10b981; }
                  .btn-download:hover { background: #059669; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Share on ${shareOptions.platform.charAt(0).toUpperCase() + shareOptions.platform.slice(1)}</h1>
                  <p style="text-align: center; color: #666; margin-bottom: 20px;">
                    Right-click the image to save it, or use the buttons below to share directly.
                  </p>
                  
                  <div class="preview">
                    <img src="${finalImage}" alt="Preview with ${shareOptions.showQR ? 'QR code' : ''}${shareOptions.showQR && shareOptions.showWatermark ? ' and ' : ''}${shareOptions.showWatermark ? 'watermark' : ''}" />
                  </div>
                  
                  <div class="actions">
                    <a href="${shareOptions.platform === 'instagram' ? 'https://www.instagram.com/' : 'https://www.tiktok.com/upload?lang=en'}" target="_blank" class="btn-${shareOptions.platform}" style="text-decoration: none;">
                      <button>Open ${shareOptions.platform.charAt(0).toUpperCase() + shareOptions.platform.slice(1)}</button>
                    </a>
                    <a href="${finalImage}" download="fitclub-share-${Date.now()}.jpg">
                      <button class="btn-download">Download Image</button>
                    </a>
                    <button onclick="window.close()">Close</button>
                  </div>
                </div>
              </body>
            </html>
          `)
          shareWindow.document.close()
        }
      }
    }
    
    img.src = selectedPhoto.url
  }

  const handleUpload = () => {
    // Simulate photo upload
    const newPhotoData: Photo = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      caption: newPhoto.caption,
      votes: 0,
      comments: 0,
      category: newPhoto.category,
    }

    setPhotos([newPhotoData, ...photos])
    setNewPhoto({ caption: "", category: "" })
    setIsUploadOpen(false)
  }

  const handleDelete = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId))
  }

  const updatePosition = (element: 'qr' | 'watermark', axis: 'x' | 'y', value: number) => {
    if (element === 'qr') {
      setShareOptions(prev => ({
        ...prev,
        qrPosition: { ...prev.qrPosition, [axis]: value }
      }));
    } else {
      setShareOptions(prev => ({
        ...prev,
        watermarkPosition: { ...prev.watermarkPosition, [axis]: value }
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'qr' | 'watermark') => {
    e.stopPropagation();
    setDragging({
      type,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.type) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update position based on drag
    if (dragging.type === 'qr') {
      setShareOptions(prev => ({
        ...prev,
        qrPosition: {
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y))
        }
      }));
    } else {
      setShareOptions(prev => ({
        ...prev,
        watermarkPosition: {
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y))
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging({ type: null, startX: 0, startY: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Photo Gallery</h2>
          <p className="text-gray-600">Manage and share your fitness journey</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">Photo</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <Input id="photo-upload" type="file" accept="image/*" className="hidden" />
                </div>
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption for your photo..."
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Workout, Progress, Competition"
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                />
              </div>

              <Button onClick={handleUpload} className="w-full">
                Upload Photo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Social Sharing Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-purple-900 mb-2">Social Media Sharing</h3>
              <p className="text-sm text-purple-700 mb-3">
                Share your photos to Instagram and TikTok with custom QR code overlays. When people scan the QR code,
                they'll be taken directly to your FitClub profile where they can vote for your content!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQREditorOpen(true)}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Customize QR Overlay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="relative group overflow-hidden">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                {/* Share Button */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/90 text-gray-900 hover:bg-white w-12 h-12 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSharingPhoto(photo);
                    setIsSharingWizardOpen(true);
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                
                {/* Info/Edit Button */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/90 text-gray-900 hover:bg-white w-12 h-12 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(photo);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-5 h-5" />
                </Button>
                
                {/* Delete Button */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-red-500/90 text-white hover:bg-red-600 w-12 h-12 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this photo?')) {
                      handleDelete(photo.id);
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-sm line-clamp-2">{photo.caption}</p>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span className="inline-flex items-center">
                      <Heart className="w-3 h-3 mr-1" /> {photo.votes}
                    </span>
                    <span className="inline-flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" /> {photo.comments}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {photo.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sharing Wizard Dialog */}
      {sharingPhoto && (
        <SharingWizard
          isOpen={isSharingWizardOpen}
          onClose={() => setIsSharingWizardOpen(false)}
          photoUrl={sharingPhoto.url}
          onShare={(platform) => {
            if (platform === 'download') {
              // Handle download
              const a = document.createElement('a');
              a.href = sharingPhoto.url;
              a.download = `fitclub-share-${Date.now()}.jpg`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              // Handle social sharing
              setShareOptions(prev => ({
                ...prev,
                platform: platform as "instagram" | "tiktok"
              }));
              setIsShareDialogOpen(true);
            }
          }}
        />
      )}

      {/* QR Overlay Editor Dialog */}
      <Dialog open={isQREditorOpen} onOpenChange={setIsQREditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize QR Code Overlay</DialogTitle>
          </DialogHeader>
          <QROverlayEditor />
        </DialogContent>
      </Dialog>

      {/* Photo Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto?.url || "/placeholder.svg"}
                alt={selectedPhoto?.caption}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div>
              <Label htmlFor="edit-caption">Caption</Label>
              <Textarea
                id="edit-caption"
                value={selectedPhoto?.caption}
                onChange={(e) => setSelectedPhoto({ ...selectedPhoto, caption: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={selectedPhoto?.category}
                onChange={(e) => setSelectedPhoto({ ...selectedPhoto, category: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setPhotos(photos.map((p) => (p.id === selectedPhoto?.id ? selectedPhoto : p)))
                  setSelectedPhoto(null)
                  setIsEditDialogOpen(false)
                }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sharing Wizard Dialog */}
      <SharingWizard 
        isOpen={isSharingWizardOpen}
        onClose={() => setIsSharingWizardOpen(false)}
        photoUrl={sharingPhoto?.url || ''}
        onShare={handleShareComplete}
      />
      
      {/* Old Share Dialog (keeping for reference but not rendered) */}
      <Dialog open={false} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-4xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <div 
              className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {selectedPhoto && (
                <>
                  <img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {shareOptions.showQR && (
                    <div 
                      className="absolute cursor-move bg-white p-2 rounded-md shadow-lg"
                      style={{
                        left: `${shareOptions.qrPosition.x}%`,
                        top: `${shareOptions.qrPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        touchAction: 'none'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'qr')}
                    >
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(shareUrl)}`} 
                        alt="QR Code"
                        className="w-16 h-16 pointer-events-none"
                      />
                    </div>
                  )}
                  
                  {shareOptions.showWatermark && (
                    <div 
                      className="absolute cursor-move bg-black/70 text-white px-3 py-1.5 rounded-md flex items-center gap-2"
                      style={{
                        left: `${shareOptions.watermarkPosition.x}%`,
                        top: `${shareOptions.watermarkPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        touchAction: 'none'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'watermark')}
                    >
                      <img 
                        src="/fitclub-logo.png" 
                        alt="FitClub" 
                        className="w-5 h-5" 
                      />
                      <span className="text-sm">@fitclub</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Options */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Customize Share</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-qr" className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      Show QR Code
                    </Label>
                    <Switch
                      id="show-qr"
                      checked={shareOptions.showQR}
                      onCheckedChange={(checked) => 
                        setShareOptions(prev => ({ ...prev, showQR: checked }))
                      }
                    />
                  </div>
                  
                  {shareOptions.showQR && (
                    <div className="space-y-2 pl-6">
                      <Label>QR Code Position</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-500">X:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={shareOptions.qrPosition.x}
                            onChange={(e) => updatePosition('qr', 'x', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm text-gray-500">{Math.round(shareOptions.qrPosition.x)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-500">Y:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={shareOptions.qrPosition.y}
                            onChange={(e) => updatePosition('qr', 'y', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm text-gray-500">{Math.round(shareOptions.qrPosition.y)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-watermark" className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Show Watermark
                    </Label>
                    <Switch
                      id="show-watermark"
                      checked={shareOptions.showWatermark}
                      onCheckedChange={(checked) => 
                        setShareOptions(prev => ({ ...prev, showWatermark: checked }))
                      }
                    />
                  </div>
                  
                  {shareOptions.showWatermark && (
                    <div className="space-y-2 pl-6">
                      <Label>Watermark Position</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-500">X:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={shareOptions.watermarkPosition.x}
                            onChange={(e) => updatePosition('watermark', 'x', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm text-gray-500">{Math.round(shareOptions.watermarkPosition.x)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-500">Y:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={shareOptions.watermarkPosition.y}
                            onChange={(e) => updatePosition('watermark', 'y', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-12 text-sm text-gray-500">{Math.round(shareOptions.watermarkPosition.y)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Share URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      // Add toast notification here if you have one
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="space-y-2 pl-6">
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white flex justify-between items-end">
                    <div>
                      <h3 className="font-medium">{selectedPhoto?.caption}</h3>
                      <p className="text-sm text-gray-300">{selectedPhoto?.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare('instagram', selectedPhoto!);
                        }}
                      >
                        <Instagram className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare('tiktok', selectedPhoto!);
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare('qr', selectedPhoto!);
                        }}
                      >
                        <QrCode className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sharing Wizard Dialog */}
      <SharingWizard 
        isOpen={isSharingWizardOpen}
        onClose={() => setIsSharingWizardOpen(false)}
        photoUrl={sharingPhoto?.url || ''}
        onShare={handleShareComplete}
      />
    </div>
  )
}
