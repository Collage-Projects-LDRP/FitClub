import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/header"
import { OnboardingProvider } from "@/contexts/OnboardingContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Maxopolis - Fitness Community Platform",
  description: "Join the ultimate fitness community. Vote, share, and connect with amazing physiques.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark bg-gray-900 text-white min-h-screen flex flex-col`}>
        <AuthProvider>
          <OnboardingProvider>
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 w-full overflow-hidden">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </OnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
