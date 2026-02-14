"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Edit, Trash2, Camera, Heart, MessageCircle } from "lucide-react"

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
    id?: string | number // Allow both for compatibility
    name?: string
    email?: string
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ caption: "", category: "" })

  const handleUpload = () => {
    // Simulate photo upload
    const newPhotoData: Photo = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Photo Gallery</h2>
          <p className="text-gray-600">Manage your fitness journey</p>
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

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto?.url || "/placeholder.svg"}
                alt={selectedPhoto?.caption || "Photo"}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div>
              <Label htmlFor="edit-caption">Caption</Label>
              <Textarea
                id="edit-caption"
                value={selectedPhoto?.caption || ""}
                onChange={(e) => selectedPhoto && setSelectedPhoto({ ...selectedPhoto, caption: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={selectedPhoto?.category || ""}
                onChange={(e) => selectedPhoto && setSelectedPhoto({ ...selectedPhoto, category: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (selectedPhoto) {
                    setPhotos(photos.map((p) => (p.id === selectedPhoto.id ? selectedPhoto : p)))
                    setSelectedPhoto(null)
                    setIsEditDialogOpen(false)
                  }
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
    </div>
  )
}
