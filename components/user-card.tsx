import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Star } from "lucide-react"
import type { User } from "@/lib/database"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/profile/${user.id}`}>
      <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={user.profile_image || "/placeholder.svg"}
              alt={user.username}
              width={300}
              height={400}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            {user.rank && user.rank <= 3 && (
              <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-bold text-lg">{user.username}</h3>
              <p className="text-gray-300 text-sm">Rank #{user.rank || "N/A"}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{user.location || "Location not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{user.age || "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-400 font-semibold">{user.votes || user.vote_count || 0} votes</span>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {user.physique_category?.replace("-", " ") || "General"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Also export as default for compatibility
export default UserCard
