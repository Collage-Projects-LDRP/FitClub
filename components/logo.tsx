import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    textClassName?: string
    showUnderline?: boolean
    isClickable?: boolean
    size?: "sm" | "md" | "lg" | "xl"
}

export function Logo({
    className,
    textClassName,
    showUnderline = true,
    isClickable = true,
    size = "md"
}: LogoProps) {
    const sizeClasses = {
        sm: "text-xl md:text-2xl",
        md: "text-3xl md:text-4xl",
        lg: "text-4xl md:text-5xl",
        xl: "text-5xl md:text-6xl"
    }

    const content = (
        <div className={cn("flex flex-col items-start leading-none", className)}>
            <span className={cn(
                "font-black tracking-tighter text-white uppercase italic pr-1.5",
                sizeClasses[size],
                textClassName
            )}>
                Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Club</span>
            </span>
            {showUnderline && (
                <div className={cn(
                    "h-1 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-transparent rounded-full opacity-50 transition-opacity duration-300",
                    isClickable && "group-hover:opacity-100"
                )} />
            )}
        </div>
    )

    if (isClickable) {
        return (
            <Link href="/" className="flex items-center group">
                <div className="transition-transform duration-300 group-hover:scale-105">
                    {content}
                </div>
            </Link>
        )
    }

    return content
}
