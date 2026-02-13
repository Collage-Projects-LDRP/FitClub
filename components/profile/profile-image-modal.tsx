"use client"
import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, Share2 } from "lucide-react"

interface ProfileImageModalProps {
  src: string
  alt: string
  username: string
}

export default function ProfileImageModal({ src, alt, username }: ProfileImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = src
    link.download = `${username}-profile-image.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Profile`,
          text: `Check out ${username}'s profile on FitClub!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-32 h-32 mx-auto mb-4 cursor-pointer group">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className="rounded-full object-cover transition-transform group-hover:scale-105"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">View Full Size</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-gray-900 border-gray-700">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Main Image */}
          <div className="relative max-w-full max-h-full">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          </div>

          {/* User Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
            {username}'s Profile Picture
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
