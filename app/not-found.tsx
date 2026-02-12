import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">The page you're looking for doesn't exist.</p>
          <div className="flex justify-center">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
