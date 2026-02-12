"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)

      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }

      // Call server-side logout
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Server logout failed:", error)
        // Continue with client-side logout even if server fails
      }

      // Navigate to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      variant="outline"
      className="flex items-center space-x-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
    >
      {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </Button>
  )
}
