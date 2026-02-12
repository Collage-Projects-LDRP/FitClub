"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { claimReward, getCurrentUser } from "@/lib/database"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { Gift, Zap, Check, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

interface RewardCardProps {
  reward: {
    id: number
    name: string
    description: string
    points_required: number
    image_url: string
    stock: number
    category: string
  }
}

export function RewardCard({ reward }: RewardCardProps) {
  const { toast } = useToast()
  const [isClaiming, setIsClaiming] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  
  const fallbackImage = "https://placehold.co/400x200/1e293b/ffffff?text=Reward+Image"

  const canClaim = currentUser && currentUser.reward_points >= reward.points_required && reward.stock > 0

  const handleClaim = async () => {
    if (isClaiming) return
    
    setIsClaiming(true)
    try {
      const result = await claimReward(reward.id)
      
      if (result.success) {
        toast({
          title: "Reward Claimed!",
          description: `You've successfully claimed ${reward.name}. ${result.message || ''}`,
        })
        
        // Update local user points
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            reward_points: currentUser.reward_points - reward.points_required
          })
        }
        
        // Close the dialog
        setIsOpen(false)
      } else {
        throw new Error(result.error || 'Failed to claim reward')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to claim reward",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 bg-muted">
        {!imageError ? (
          <Image
            src={reward.image_url || fallbackImage}
            alt={reward.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">Image not available</span>
          </div>
        )}
        <Badge 
          className={`absolute top-2 right-2 ${reward.stock > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive'}`}
        >
          {reward.stock > 0 ? `${reward.stock} left` : 'Out of stock'}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{reward.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {reward.points_required.toLocaleString()} pts
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={canClaim ? "default" : "outline"} 
              className="w-full"
              disabled={reward.stock <= 0}
            >
              {canClaim ? "Claim Reward" : "View Details"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{reward.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative h-48 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                {!imageError ? (
                  <Image
                    src={reward.image_url || fallbackImage}
                    alt={reward.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <Gift className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Cost</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{reward.points_required} points</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Availability</span>
                  <span className={`text-sm font-medium ${reward.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {reward.stock > 0 ? `${reward.stock} remaining` : 'Out of stock'}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                </div>
              </div>
              {!currentUser && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    You need to be signed in to claim this reward.
                  </p>
                </div>
              )}
              {currentUser && currentUser.reward_points < reward.points_required && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You need {reward.points_required - currentUser.reward_points} more points to claim this reward.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isClaiming}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleClaim} 
                disabled={!canClaim || isClaiming || reward.stock <= 0}
                className="gap-2"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4" />
                    Claim Reward
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
