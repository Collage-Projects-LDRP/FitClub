"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Share2, Instagram, TwitterIcon as TikTok, Download, Heart, ChevronLeft, ChevronRight, X } from "lucide-react"
import ProfileQRCode from "./profile-qr-code"

interface GalleryWithSharingProps {
  photos: string[]
  userId: string
  username: string
}

export default function GalleryWithSharing({ photos, userId, username }: GalleryWithSharingProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [showQROverlay, setShowQROverlay] = useState(false)

  const openSlideshow = (index: number) => {
    setSelectedPhoto(index)
  }

  const closeSlideshow = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedPhoto !== null) {
      if (e.key === "ArrowRight") nextPhoto()
      if (e.key === "ArrowLeft") prevPhoto()
      if (e.key === "Escape") closeSlideshow()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!photos || photos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Yet</h3>
          <p className="text-gray-500">Photos will appear here once uploaded.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <Card key={index} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`${username} photo ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                  crossOrigin="anonymous"
                  onClick={() => openSlideshow(index)}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        openSlideshow(index)
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>

                {/* Vote Count Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    <Heart className="w-3 h-3 mr-1" />
                    {Math.floor(Math.random() * 50) + 10}
                  </Badge>
                </div>
              </div>

              {/* Photo Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4 mr-1" />
                      Vote
                    </Button>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Share Photo</h3>

                        <div className="space-y-3">
                          <Button className="w-full justify-start bg-transparent" variant="outline">
                            <Instagram className="w-4 h-4 mr-2" />
                            Share to Instagram Story
                          </Button>

                          <Button className="w-full justify-start bg-transparent" variant="outline">
                            <TikTok className="w-4 h-4 mr-2" />
                            Share to TikTok
                          </Button>

                          <Button className="w-full justify-start bg-transparent" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download with QR Code
                          </Button>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">QR Code Preview</h4>
                          <div className="flex justify-center">
                            <ProfileQRCode userId={userId} username={username} size={120} />
                          </div>
                          <p className="text-sm text-gray-500 text-center mt-2">Scan to vote for {username}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slideshow Modal */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeSlideshow}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center px-16">
              <Image
                src={photos[selectedPhoto] || "/placeholder.svg"}
                alt={`${username} photo ${selectedPhoto + 1}`}
                width={800}
                height={1000}
                className="max-w-full max-h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {selectedPhoto + 1} / {photos.length}
            </div>

            {/* Photo Indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedPhoto ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
