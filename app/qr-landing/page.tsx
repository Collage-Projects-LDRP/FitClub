import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Globe, ChevronDown, ArrowRight, Heart, Trophy, Users, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function QRLandingPage() {
  const menuItems = [
    {
      id: 1,
      title: "Vote for Me",
      description: "Support me by casting your vote",
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      href: "/qr-landing/profile/johndoe",
      buttonText: "Vote Now"
    },
    {
      id: 2,
      title: "Challenge Landing",
      description: "Join exciting challenges and win prizes",
      icon: <Trophy className="h-8 w-8 text-amber-500" />,
      href: "/qr-landing/challenge",
      buttonText: "View Challenges"
    },
    {
      id: 3,
      title: "Referral Signup",
      description: "Invite friends and earn rewards",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      href: "/signup",
      buttonText: "Sign Up Now"
    },
    {
      id: 4,
      title: "Buy Product",
      description: "Check out our latest products",
      icon: <ShoppingBag className="h-8 w-8 text-purple-500" />,
      href: "https://allmaxnutrition.com/",
      buttonText: "Shop Now"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* New Gym Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/90"></div>
      </div>
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Content Container */}
        <div className="relative w-full max-w-5xl mx-auto p-6 md:p-8">
          <div className="backdrop-blur-lg bg-gray-900/60 rounded-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                QR Connect
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Unlock a world of possibilities with a single scan
              </p>
            </div>
            
            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {menuItems.map((item, index) => {
                // Define different gradient colors for each card
                const gradients = [
                  'from-blue-600/30 to-cyan-600/40',
                  'from-purple-600/30 to-pink-600/40',
                  'from-amber-600/30 to-orange-600/40',
                  'from-emerald-600/30 to-teal-600/40'
                ];
                
                const hoverGradients = [
                  'group-hover:from-blue-600/40 group-hover:to-cyan-600/50',
                  'group-hover:from-purple-600/40 group-hover:to-pink-600/50',
                  'group-hover:from-amber-600/40 group-hover:to-orange-600/50',
                  'group-hover:from-emerald-600/40 group-hover:to-teal-600/50'
                ];
                
                const glowColors = [
                  'shadow-blue-500/20 group-hover:shadow-blue-500/30',
                  'shadow-purple-500/20 group-hover:shadow-purple-500/30',
                  'shadow-amber-500/20 group-hover:shadow-amber-500/30',
                  'shadow-emerald-500/20 group-hover:shadow-emerald-500/30'
                ];

                return (
                  <Link 
                    key={item.id} 
                    href={item.href}
                    className="block relative group"
                  >
                    <div 
                      className={`relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 h-full transition-all duration-300 transform group-hover:-translate-y-1
                      border border-gray-700/50 ${glowColors[index]} group-hover:shadow-xl`}
                    >
                      {/* Gradient background */}
                      <div className={`absolute inset-0 rounded-2xl ${gradients[index]} ${hoverGradients[index]} bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-all duration-300`}></div>
                      
                      {/* Icon with gradient background */}
                      <div className={`absolute -top-5 left-6 w-14 h-14 rounded-xl ${gradients[index]} flex items-center justify-center backdrop-blur-sm border border-gray-700/50 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      
                      <div className="mt-10 relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors duration-300">{item.description}</p>
                        <div className={`inline-flex items-center px-4 py-2.5 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white font-medium 
                        group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:border-transparent transition-all duration-300`}>
                          {item.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Footer */}
            <footer className="mt-16 pt-6 border-t border-gray-800/50">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {new Date().getFullYear()} QR Connect. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
