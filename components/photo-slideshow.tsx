"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Photo } from "@/lib/database"

interface PhotoSlideshowProps {
  photos: Photo[]
}

export default function PhotoSlideshow({ photos }: PhotoSlideshowProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openSlideshow = (index: number) => {
    setCurrentIndex(index)
    setSelectedPhoto(index)
  }

  const closeSlideshow = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextPhoto()
    if (e.key === "ArrowLeft") prevPhoto()
    if (e.key === "Escape") closeSlideshow()
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative cursor-pointer group" onClick={() => openSlideshow(index)}>
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={photo.caption}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {photo.caption && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{photo.caption}</p>}
          </div>
        ))}
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={closeSlideshow}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0" onKeyDown={handleKeyDown}>
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={closeSlideshow}
            >
              <X className="w-4 h-4" />
            </Button>

            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {selectedPhoto !== null && (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={photos[currentIndex].url || "/placeholder.svg"}
                  alt={photos[currentIndex].caption}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {selectedPhoto !== null && photos[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-center">{photos[currentIndex].caption}</p>
              </div>
            )}

            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
