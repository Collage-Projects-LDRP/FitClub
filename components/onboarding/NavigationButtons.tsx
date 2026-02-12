"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationButtonsProps {
  onNext?: React.FormEventHandler<HTMLButtonElement>
  onBack?: () => void
  onSkip?: () => void
  nextLabel?: string
  backLabel?: string
  skipLabel?: string
  isNextDisabled?: boolean
  isNextLoading?: boolean
  showBack?: boolean
  showSkip?: boolean
  className?: string
}

export function NavigationButtons({
  onNext,
  onBack,
  onSkip,
  nextLabel = "Continue",
  backLabel = "Back",
  skipLabel = "Skip",
  isNextDisabled = false,
  isNextLoading = false,
  showBack = true,
  showSkip = true,
  className,
}: NavigationButtonsProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 w-full mt-8", className)}>
      <div className="flex items-center gap-2">
        {showBack && onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isNextLoading}
            className="flex items-center gap-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showSkip && onSkip && (
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={isNextLoading}
            className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {skipLabel}
          </Button>
        )}
        
        {onNext && (
          <Button
            type="submit"
            onClick={onNext}
            disabled={isNextDisabled || isNextLoading}
            className="px-6 bg-primary hover:bg-primary/90"
          >
            {isNextLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
