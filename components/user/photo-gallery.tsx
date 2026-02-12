"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Upload, Trash2, Edit } from "lucide-react"
import Image from "next/image"

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=500&fit=crop",
      caption: "Back day progress shot",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=500&fit=crop",
      caption: "Chest and arms pump",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
      caption: "Stage ready physique",
    },
  ])

  const [newCaption, setNewCaption] = useState("")

  const handleUpload = () => {
    const newPhoto = {
      id: photos.length + 1,
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
      caption: newCaption || "New photo",
    }
    setPhotos([...photos, newPhoto])
    setNewCaption("")
    toast({
      title: "Photo uploaded!",
      description: "Your photo has been added to your gallery.",
    })
  }

  const handleDelete = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id !== id))
    toast({
      title: "Photo deleted",
      description: "Photo has been removed from your gallery.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo">Select Photo</Label>
              <Input id="photo" type="file" accept="image/*" />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                placeholder="Add a caption for your photo..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
            </div>
            <Button onClick={handleUpload} className="bg-purple-600 hover:bg-purple-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Photos ({photos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <Image
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <Button size="sm" variant="secondary">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDelete(photo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{photo.caption}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
