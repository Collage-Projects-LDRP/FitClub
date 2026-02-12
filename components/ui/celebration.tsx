"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"

interface CelebrationProps {
  show: boolean
  onComplete?: () => void
  duration?: number
}

export function Celebration({ show, onComplete, duration = 3000 }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {/* Confetti particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 1,
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1, 0.5],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {i % 2 === 0 ? (
              <Sparkles className="w-6 h-6 text-yellow-400" />
            ) : (
              <Star className="w-4 h-4 text-purple-400" />
            )}
          </motion.div>
        ))}

        {/* Central celebration text */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-2xl font-bold text-primary">Awesome!</div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
