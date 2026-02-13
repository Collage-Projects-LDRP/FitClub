"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { loginUser } from "@/app/actions"
import { cn } from "@/lib/utils"

const demoAccounts = [
  {
    username: "BeachVibes",
    category: "Beach Body",
    icon: "🏖️",
    bgGradient: "from-amber-100 to-amber-50",
    borderColor: "border-amber-200"
  },
  {
    username: "BikiniBabe",
    category: "Bikini Model",
    icon: "👙",
    bgGradient: "from-pink-100 to-pink-50",
    borderColor: "border-pink-200"
  },
  {
    username: "SportsStar",
    category: "Athletes Body",
    icon: "🏃",
    bgGradient: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200"
  },
  {
    username: "ProBuilder",
    category: "Pro Bodybuilder",
    icon: "💪",
    bgGradient: "from-rose-100 to-rose-50",
    borderColor: "border-rose-200"
  }
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await loginUser(username.trim())

      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem("user_id", result.userId)
        localStorage.setItem("username", username.trim())

        // Force a storage event to notify other tabs and trigger auth state update
        localStorage.setItem('auth_timestamp', Date.now().toString())

        // Redirect to dashboard after successful login
        router.push("/dashboard")

        // Force a full page reload to ensure all components get the updated auth state
        window.location.href = "/dashboard"
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await loginUser(demoUsername)

      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem("user_id", result.userId)
        localStorage.setItem("username", demoUsername)

        // Force a storage event to notify other tabs and trigger auth state update
        localStorage.setItem('auth_timestamp', Date.now().toString())

        // Redirect to dashboard and force a full page reload
        window.location.href = "/dashboard"
      } else {
        setError(result.error || "Demo login failed")
      }
    } catch (error) {
      console.error("Demo login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80')] bg-cover bg-center opacity-10"></div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <motion.div
            className="w-full space-y-6"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {/* Logo */}
            <motion.div className="text-center" variants={itemVariants}>
              <Link href="/" className="inline-block">
                <Image
                  src="/fitclub-logo.png"
                  alt="FitClub"
                  width={180}
                  height={180}
                  className="mx-auto"
                />
              </Link>
            </motion.div>

            {/* Login Form */}
            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700"
              variants={itemVariants}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="text-gray-300">Enter your username to access your account</p>
              </div>

              {error && (
                <motion.div variants={itemVariants}>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={itemVariants}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 py-6 text-base bg-gray-700 border-gray-600 text-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.form>

              <motion.div className="mt-6" variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-300">Or try a demo account</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {demoAccounts.map((account, index) => (
                    <motion.button
                      key={account.username}
                      type="button"
                      onClick={() => handleDemoLogin(account.username)}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200 text-left",
                        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                        account.borderColor,
                        account.bgGradient ? `bg-gradient-to-r ${account.bgGradient}` : 'bg-white',
                        "h-full"
                      )}
                      variants={itemVariants}
                      custom={index}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{account.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{account.username}</p>
                          <p className="text-xs text-gray-500">{account.category}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  className="mt-6 text-center text-sm text-gray-300"
                  variants={itemVariants}
                >
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.footer
          className="mt-8 text-center text-xs text-gray-400 w-full"
          variants={itemVariants}
        >
          <p> 2024 FitClub. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  )
}
