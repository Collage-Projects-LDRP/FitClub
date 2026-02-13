"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Heart, 
  MessageCircle, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Trash2,
  Share2, 
  Image as ImageIcon, 
  Upload 
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import type { DatabaseUser } from "@/lib/database"
import { SharingWizard } from "@/components/photo-sharing/sharing-wizard"
import { PhotoUploadDialog } from "@/components/photo-upload/photo-upload-dialog"

type SortOrder = "newest" | "oldest"
type SharePlatform = 'download' | 'instagram' | 'tiktok'

interface Photo {
  id: string
  url: string
  caption: string
  votes: number
  comments: number
  category: string
}

const samplePhotos: Photo[] = [
  {
    id: "1",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXddFsc2ZN8pvT0JDHluovLkrnIVCWnx3vsg&s",
    caption: "Morning workout session - feeling strong! 💪",
    votes: 45,
    comments: 12,
    category: "Workout",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    caption: "Post-gym selfie. The grind never stops! 🔥",
    votes: 67,
    comments: 23,
    category: "Progress",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    caption: "Beach body ready for summer! ☀️ #SummerReady",
    votes: 156,
    comments: 42,
    category: "Transformation",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=600&fit=crop",
    caption: "Competition prep is paying off! 🏆 #Bodybuilding",
    votes: 210,
    comments: 56,
    category: "Competition",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    caption: "Back day complete! Feeling the pump 💪 #BackDay",
    votes: 78,
    comments: 19,
    category: "Bodybuilding",
  },
  {
    id: "6",
    url: "https://shotkit.com/wp-content/uploads/2021/07/alexi-romano-hip-pop.jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Outdoor",
  },
  {
    id: "7",
    url: "https://www.shutterstock.com/image-photo/man-doing-pullups-fitness-gym-600nw-1996094180.jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Chin-up",
  },
  {
    id: "8",
    url: "https://images.ctfassets.net/8urtyqugdt2l/4wPk3KafRwgpwIcJzb0VRX/4894054c6182c62c1d850628935a4b0b/desktop-best-chest-exercises.jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Bench-Press",
  },
  {
    id: "9",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGtz2RcQ0RtTcxXuSvMBtDw5s8P3O5kI2zw&s",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Squat",
  },
  {
    id: "10",
    url: "https://images.pexels.com/photos/17944268/pexels-photo-17944268.jpeg?cs=srgb&dl=pexels-bi-lal-karadag-582268222-17944268.jpg&fm=jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Overhead-Press",
  },
  {
    id: "11",
    url: "https://flex-web-media-prod.storage.googleapis.com/2025/05/barbell-row-exercise-gym.jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Barbell-Row",
  },
  {
    id: "12",
    url: "https://c8.alamy.com/comp/W1MAGJ/shirtless-muscular-man-doing-dips-exercise-at-the-gym-W1MAGJ.jpg",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Dip",
  },
  {
    id: "13",
    url: "https://cdn.sanity.io/images/263h0ltd/production/071340b632a59d0c502b5213775fdb392b846d93-600x400.jpg?w=1500&q=90&fit=fillmax&auto=format",
    caption: "Beach workout with an amazing view! 🏖️ #FitnessMotivation",
    votes: 134,
    comments: 31,
    category: "Front-Squat",
  },
]

export default function GalleryPage() {
  const [user, setUser] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [isSharingWizardOpen, setIsSharingWizardOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const sortedAndFilteredPhotos = [...photos].sort((a, b) => {
    return sortOrder === "newest" 
      ? new Date(b.id).getTime() - new Date(a.id).getTime()
      : new Date(a.id).getTime() - new Date(b.id).getTime()
  }).filter(photo => 
    photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeletePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this photo?")) {
      setPhotos(photos.filter(photo => photo.id !== photoId))
    }
  }

  const handleEditPhoto = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPhoto(photo)
    setEditCaption(photo.caption)
  }

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPhoto) {
      setPhotos(photos.map(photo => 
        photo.id === editingPhoto.id 
          ? { ...photo, caption: editCaption } 
          : photo
      ))
      setEditingPhoto(null)
    }
  }

  const handleShare = (platform: SharePlatform) => {
    if (!selectedPhoto) return
    
    if (platform === 'download') {
      const a = document.createElement('a')
      a.href = selectedPhoto.url
      a.download = `fitclub-share-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      const url = platform === 'instagram' 
        ? 'https://www.instagram.com/'
        : 'https://www.tiktok.com/upload?lang=en'
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-100 dark:bg-slate-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white shadow-xl mb-4 border border-gray-200/30 dark:border-gray-600/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Your <span className="text-blue-300">Fitness Gallery</span>
                </h1>
                <p className="text-gray-200 text-lg">
                  Track progress, share achievements, and get inspired
                </p>
                
                {/* Stats */}
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                  {[
                    { value: photos.length, label: 'Your Photos' },
                    { value: '1.2K', label: 'Community Posts' },
                    { value: '98%', label: 'Success Rate' },
                    // { value: '24/7', label: 'Support' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center bg-white/5 px-4 py-2.5 rounded-lg backdrop-blur-sm">
                      <span className="font-bold text-blue-300 text-lg">{stat.value}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-gray-200">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
                <PhotoUploadDialog 
                  onUploadSuccess={(newPhoto) => {
                    setPhotos(prev => [newPhoto, ...prev])
                  }}
                >
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Progress
                  </Button>
                </PhotoUploadDialog>
                {/* <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push('/community')}
                  className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 font-medium px-8 py-6 text-base hover:border-white/30 transition-all transform hover:-translate-y-0.5"
                >
                  View Community
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Sort and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 relative z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-3 py-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-lg px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            >
              {sortOrder === "newest" ? (
                <>
                  <ArrowDown size={18} className="text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">Newest First</span>
                </>
              ) : (
                <>
                  <ArrowUp size={18} className="text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">Oldest First</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Photo Grid */}
        {sortedAndFilteredPhotos.length > 0 ? (
          <div className="border-4 border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {sortedAndFilteredPhotos.map((photo) => (
              <Card key={photo.id} className="relative group overflow-hidden border-4 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                <div className="relative aspect-square overflow-hidden border-b border-gray-200 dark:border-gray-600">
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                    <div className="flex flex-wrap justify-center gap-3">
                      {/* Share Button */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/90 text-gray-900 hover:bg-white w-10 h-10 rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoto(photo);
                          setIsSharingWizardOpen(true);
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      
                      {/* Like Button */}
                      {/* <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/90 text-gray-900 hover:bg-white w-10 h-10 rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedPhotos = photos.map(p => 
                            p.id === photo.id 
                              ? { ...p, votes: p.votes + 1 } 
                              : p
                          );
                          setPhotos(updatedPhotos);
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button> */}
                      
                      {/* Edit Button */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/90 text-gray-900 hover:bg-white w-10 h-10 rounded-full shadow-lg"
                        onClick={(e) => handleEditPhoto(photo, e)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {/* Delete Button */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/90 text-red-600 hover:bg-red-50 hover:text-red-700 w-10 h-10 rounded-full shadow-lg"
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm line-clamp-2">{photo.caption}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                        <span className="inline-flex items-center">
                          <Heart className="w-3 h-3 mr-1" /> {photo.votes}
                        </span>
                        <span className="inline-flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" /> {photo.comments}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {photo.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        ) : (
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your gallery is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Start your fitness journey by sharing your first progress photo!
            </p>
            <Button className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Photo
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        )}

        {selectedPhoto && (
          <SharingWizard
            isOpen={isSharingWizardOpen}
            onClose={() => setIsSharingWizardOpen(false)}
            photoUrl={selectedPhoto.url}
            onShare={handleShare}
          />
        )}
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Photo Caption</h3>
            <form onSubmit={saveEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter caption"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingPhoto(null)}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
