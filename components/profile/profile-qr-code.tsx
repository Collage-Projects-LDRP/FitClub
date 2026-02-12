"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode } from "lucide-react"
import { generateUserQRCode } from "@/lib/qr-generator"

interface ProfileQRCodeProps {
  userId: number
  username: string
}

export default function ProfileQRCode({ userId, username }: ProfileQRCodeProps) {
  const qrCodeSvg = generateUserQRCode(userId, username)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          Scan to Vote
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
            <img src={qrCodeSvg || "/placeholder.svg"} alt={`QR Code for ${username}`} className="w-32 h-32" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Vote for {username}</strong>
        </p>
        <p className="text-xs text-gray-500">Scan this QR code to quickly vote for this athlete on Maxopolis</p>
      </CardContent>
    </Card>
  )
}
