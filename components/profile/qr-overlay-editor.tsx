"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Instagram, Music } from "lucide-react"

interface QROverlayEditorProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  platform: "instagram" | "tiktok"
  onExport: (imageBlob: Blob, caption: string) => void
}

interface QRSettings {
  size: number
  opacity: number
  x: number
  y: number
  template: string
}

export default function QROverlayEditor({ isOpen, onClose, imageUrl, platform, onExport }: QROverlayEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrSettings, setQRSettings] = useState<QRSettings>({
    size: 100,
    opacity: 90,
    x: 20,
    y: 20,
    template: "default",
  })

  const [caption, setCaption] = useState("")

  // Generate platform-specific captions
  const generateCaption = useCallback(() => {
    const baseText = "Check out my fitness journey on Maxopolis! Scan the QR code to vote for me."

    if (platform === "instagram") {
      return `${baseText}\n\n#Maxopolis #FitnessVote #ScanToVote #FitnessMotivation #FitnessJourney #BodyBuilding #FitLife`
    } else {
      return `${baseText}\n\n#Maxopolis #FitnessVote #TikTokFitness #FitnessTok #BodyBuilding #FitnessMotivation #ScanToVote`
    }
  }, [platform])

  // Initialize caption when component opens
  useState(() => {
    if (isOpen && !caption) {
      setCaption(generateCaption())
    }
  })

  const updateQRSettings = (key: keyof QRSettings, value: number | string) => {
    setQRSettings((prev) => ({ ...prev, [key]: value }))
  }

  const generateQRCode = useCallback(async () => {
    // Simple QR code generation using a placeholder
    // In a real app, you'd use a proper QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://maxopolis.com/vote/123")}`

    try {
      const response = await fetch(qrUrl)
      if (!response.ok) {
        throw new Error("Failed to generate QR code")
      }
      return qrUrl
    } catch (error) {
      console.error("QR generation error:", error)
      // Return a fallback QR code as data URL
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
    }
  }, [])

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 800

    try {
      // Load and draw the main image
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

      // Draw main image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Generate and draw QR code
      const qrDataUrl = await generateQRCode()
      const qrImg = new Image()
      qrImg.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        qrImg.onload = resolve
        qrImg.onerror = reject
        qrImg.src = qrDataUrl
      })

      // Apply QR settings
      ctx.globalAlpha = qrSettings.opacity / 100
      const qrSize = (qrSettings.size / 100) * 200
      const qrX = (qrSettings.x / 100) * (canvas.width - qrSize)
      const qrY = (qrSettings.y / 100) * (canvas.height - qrSize)

      // Draw QR code with background
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      // Add platform-specific styling
      if (platform === "instagram") {
        ctx.globalAlpha = 0.8
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "rgba(131, 58, 180, 0.1)")
        gradient.addColorStop(1, "rgba(253, 29, 29, 0.1)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalAlpha = 1
    } catch (error) {
      console.error("Canvas drawing error:", error)
      // Draw a simple fallback
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#333"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Image Preview", canvas.width / 2, canvas.height / 2)
    }
  }, [imageUrl, qrSettings, platform, generateQRCode])

  // Redraw canvas when settings change
  useState(() => {
    if (isOpen) {
      drawCanvas()
    }
  })

  const handleExport = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onExport(blob, caption)
          }
        },
        "image/jpeg",
        0.9,
      )
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const templates = [
    { id: "default", name: "Default" },
    { id: "corner", name: "Corner Placement" },
    { id: "center", name: "Center Overlay" },
    { id: "bottom", name: "Bottom Banner" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {platform === "instagram" ? <Instagram className="h-5 w-5 text-pink-500" /> : <Music className="h-5 w-5" />}
            {platform === "instagram" ? "Instagram" : "TikTok"} QR Overlay Editor
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <h3 className="font-medium">Preview</h3>
            <Card>
              <CardContent className="p-4">
                <canvas ref={canvasRef} className="w-full h-auto border rounded-lg" style={{ maxHeight: "400px" }} />
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">QR Code Settings</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={qrSettings.template} onValueChange={(value) => updateQRSettings("template", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Size: {qrSettings.size}%</Label>
                  <Input
                    id="size"
                    type="range"
                    min="50"
                    max="200"
                    value={qrSettings.size}
                    onChange={(e) => updateQRSettings("size", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="opacity">Opacity: {qrSettings.opacity}%</Label>
                  <Input
                    id="opacity"
                    type="range"
                    min="10"
                    max="100"
                    value={qrSettings.opacity}
                    onChange={(e) => updateQRSettings("opacity", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="x-position">X Position: {qrSettings.x}%</Label>
                    <Input
                      id="x-position"
                      type="range"
                      min="0"
                      max="100"
                      value={qrSettings.x}
                      onChange={(e) => updateQRSettings("x", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="y-position">Y Position: {qrSettings.y}%</Label>
                    <Input
                      id="y-position"
                      type="range"
                      min="0"
                      max="100"
                      value={qrSettings.y}
                      onChange={(e) => updateQRSettings("y", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Caption</h3>
              <div className="space-y-2">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                  placeholder="Enter your caption..."
                />
                <Button variant="outline" size="sm" onClick={() => setCaption(generateCaption())}>
                  Generate {platform === "instagram" ? "Instagram" : "TikTok"} Caption
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export & Share
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Named export for compatibility
export { QROverlayEditor }
