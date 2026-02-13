"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Dumbbell,
  Trophy,
  Users,
  Heart,
  Shield,
} from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    // Simulate newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscribed!",
      description: "Thanks for joining the FitClub community!",
    })

    setEmail("")
    setIsSubscribing(false)
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/fitclub-logo.png"
                alt="FitClub"
                width={180}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate fitness community where athletes showcase their physiques, share knowledge, and inspire each
              other to reach new heights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Athletes
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Join Community
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Workout Plans
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </li>
              <li>
                <Link href="/qr-landing" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  QR Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=bodybuilder" className="text-gray-400 hover:text-white transition-colors">
                  Bodybuilding
                </Link>
              </li>
              <li>
                <Link href="/?category=powerlifter" className="text-gray-400 hover:text-white transition-colors">
                  Powerlifting
                </Link>
              </li>
              <li>
                <Link href="/?category=physique" className="text-gray-400 hover:text-white transition-colors">
                  Physique
                </Link>
              </li>
              <li>
                <Link href="/?category=endurance" className="text-gray-400 hover:text-white transition-colors">
                  Endurance
                </Link>
              </li>
              <li>
                <Link href="/?category=crossfit" className="text-gray-400 hover:text-white transition-colors">
                  CrossFit
                </Link>
              </li>
              <li>
                <Link href="/?category=general" className="text-gray-400 hover:text-white transition-colors">
                  General Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-4">Get the latest updates, workout tips, and community highlights.</p>

            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-r-none bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" disabled={isSubscribing} className="rounded-l-none bg-red-600 hover:bg-red-700">
                  {isSubscribing ? "..." : "Subscribe"}
                </Button>
              </div>
            </form>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                hello@fitclub.com
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                1-800-FITCLUB
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Los Angeles, CA
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              2024 FitClub. All rights reserved. An AllMax Community.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
