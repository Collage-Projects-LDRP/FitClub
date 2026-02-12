import { getUserById, getPhotosForUser } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Trophy, Instagram, Youtube, MessageCircle, Heart, Camera } from "lucide-react"
import VoteButton from "@/components/vote-button"
import MessageComposer from "@/components/profile/message-composer"
import VotedForTab from "@/components/profile/voted-for-tab"
import PhotoSlideshowWithSharing from "@/components/photo-slideshow-with-sharing"
import ProfileImageModal from "@/components/profile/profile-image-modal"
import LogoutButton from "@/components/logout-button"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

const categoryDisplayNames: Record<string, string> = {
  bodybuilder: "Bodybuilding",
  powerlifter: "Powerlifting",
  physique: "Physique",
  crossfit: "CrossFit",
  endurance: "Endurance",
  general: "General Fitness",
  beachbody: "Beach Body",
  yoga: "Yoga",
  functional: "Functional Fitness",
  sports: "Sports",
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const user = getUserById(id)
  const currentUser = await getCurrentUser()

  if (!user) {
    notFound()
  }

  const photos = getPhotosForUser(user.id)
  const isOwnProfile = currentUser?.id === user.id

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Profile Image with Modal */}
                  <ProfileImageModal
                    src={user.profile_image || "/placeholder.svg"}
                    alt={user.username}
                    username={user.username}
                  />

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                    {isOwnProfile && <LogoutButton />}
                  </div>

                  {/* Category Badge - Prominently displayed */}
                  <div className="mb-4">
                    <Badge
                      variant="secondary"
                      className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500"
                    >
                      {categoryDisplayNames[user.physique_category] || user.physique_category}
                    </Badge>
                  </div>

                  <p className="text-gray-300 mb-6">{user.bio}</p>

                  {/* Vote Section */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{user.vote_count || 0}</div>
                      <div className="text-sm text-gray-400">Total Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">{user.monthly_votes || 0}</div>
                      <div className="text-sm text-gray-400">This Month</div>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="space-y-3 mb-6">
                      <VoteButton userId={user.id} initialVoteCount={user.vote_count || 0} />
                      <MessageComposer receiverId={user.id} receiverName={user.username} />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location not specified
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      Fitness enthusiast
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h3 className="font-semibold text-white mb-3">Physical Stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Gender</div>
                        <div className="font-medium capitalize text-white">{user.gender}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Category</div>
                        <div className="font-medium text-white">{categoryDisplayNames[user.physique_category]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h3 className="font-semibold text-white mb-3">Connect</h3>
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Youtube className="w-4 h-4 mr-2" />
                        YouTube
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                <TabsTrigger
                  value="gallery"
                  className="flex items-center text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="voted-for"
                  className="flex items-center text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Voted For
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="flex items-center text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="mt-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    {photos.length > 0 ? (
                      <PhotoSlideshowWithSharing
                        photos={photos}
                        user={user}
                        isOwnProfile={isOwnProfile}
                        currentUser={currentUser}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-400">No photos uploaded yet</p>
                        <p className="text-sm text-gray-500">Photos will appear here when available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voted-for" className="mt-6">
                <VotedForTab userId={user.id} />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Messages</h3>
                      <p className="text-gray-400">
                        {isOwnProfile ? "Your messages will appear here" : `Send a message to ${user.username}`}
                      </p>
                      {!isOwnProfile && (
                        <div className="mt-4">
                          <MessageComposer receiverId={user.id} receiverName={user.username} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
