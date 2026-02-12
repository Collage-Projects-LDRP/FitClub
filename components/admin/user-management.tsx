"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { getAllUsers, addUser, updateUser, deleteUser, User } from "@/lib/database"
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import Image from "next/image"

type NewUser = {
  username: string
  physique_category: string
  bio: string
  profile_image: string
  gender: string
  age: number | null
  country: string
  state: string
  city: string
  location: string
  votes: number
  rank: number | null
  reward_points: number
  total_earned_points: number
}

export default function UserManagement() {
  const [users, setUsers] = useState(getAllUsers())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    physique_category: "fitness-model",
    bio: "",
    profile_image: "",
    gender: "female",
    age: null,
    country: "",
    state: "",
    city: "",
    location: "",
    votes: 0,
    rank: null,
    reward_points: 0,
    total_earned_points: 0
  })
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || user.physique_category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id)
    setIsEditing(true)
    setNewUser({
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      bio: user.bio || '',
      physique_category: user.physique_category,
      gender: user.gender || 'other',
      age: user.age || null,
      country: user.country || '',
      state: user.state || '',
      city: user.city || '',
      location: user.location || '',
      votes: user.votes || 0,
      rank: user.rank || null,
      reward_points: user.reward_points || 0,
      total_earned_points: user.total_earned_points || 0
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    
    setIsLoading(true)
    try {
      const success = await deleteUser(userToDelete)
      if (success) {
        // Update local state
        const updatedUsers = getAllUsers()
        setUsers(updatedUsers)
        
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Basic validation
      if (!newUser.username) {
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Please enter a username",
          variant: "destructive"
        })
        return
      }

      // Generate a simple profile image if none provided
      const profileImage = newUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=random`
      
      // Create user object with the specified structure
      const userToAdd = {
        ...newUser,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Auto-increment ID
        email: `${newUser.username.toLowerCase().replace(/\s+/g, '')}@example.com`,
        profile_image: profileImage,
        created_at: new Date().toISOString(),
        vote_count: Math.floor(Math.random() * 1000),
        monthly_votes: Math.floor(Math.random() * 100),
        votes: Math.floor(Math.random() * 1000),
        rank: null, // Will be set based on votes
        reward_points: 0,
        total_earned_points: 0,
        // Set default values for required fields if not provided
        age: newUser.age || 25,
        country: newUser.country || "United States",
        state: newUser.state || "",
        city: newUser.city || "",
        location: newUser.location || `${newUser.city || ''}${newUser.city && newUser.state ? ', ' : ''}${newUser.state || ''}`.trim(),
        gender: newUser.gender || "other",
        // Ensure all required fields are present
        physique_category: newUser.physique_category || "fitness-model"
      }

      // In a real app, you would call an API here
      // For now, we'll use the mock database function
      console.log("Adding user:", userToAdd)
      let result;
      
      if (isEditing && editingUserId) {
        // Update existing user
        result = await updateUser(editingUserId, userToAdd)
      } else {
        // Add new user
        result = await addUser(userToAdd)
      }
      
      if (result) {
        // Update local state
        const updatedUsers = getAllUsers()
        setUsers(updatedUsers)
        
        // Reset form and state
        setNewUser({
          username: "",
          physique_category: "fitness-model",
          bio: "",
          profile_image: "",
          gender: "female",
          age: null,
          country: "",
          state: "",
          city: "",
          location: "",
          votes: 0,
          rank: null,
          reward_points: 0,
          total_earned_points: 0
        })
        
        setIsDialogOpen(false)
        setIsEditing(false)
        setEditingUserId(null)
        setIsLoading(false)
        
        toast({
          title: "Success",
          description: `User "${result.username}" ${isEditing ? 'updated' : 'added'} successfully`,
        })
      } else {
        throw new Error("Failed to add user")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Management
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false)
              setEditingUserId(null)
              // Reset form when closing dialog
              setNewUser({
                username: "",
                physique_category: "fitness-model",
                bio: "",
                profile_image: "",
                gender: "female",
                age: null,
                country: "",
                state: "",
                city: "",
                location: "",
                votes: 0,
                rank: null,
                reward_points: 0,
                total_earned_points: 0
              })
            }
            setIsDialogOpen(open)
          }}>
            <DialogTrigger asChild>
              <Button className="ml-auto">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit' : 'Add New'} User</DialogTitle>
              </DialogHeader>
                <form onSubmit={handleSubmitUser} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newUser.physique_category}
                        onValueChange={(value) => setNewUser({...newUser, physique_category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beach-body">Beach Body</SelectItem>
                          <SelectItem value="bikini-model">Bikini Model</SelectItem>
                          <SelectItem value="athletes-body">Athlete Body</SelectItem>
                          <SelectItem value="amateur-bodybuilder">Amateur Bodybuilder</SelectItem>
                          <SelectItem value="professional-bodybuilder">Professional Bodybuilder</SelectItem>
                          <SelectItem value="fitness-model">Fitness Model</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={newUser.gender}
                        onValueChange={(value) => setNewUser({...newUser, gender: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={newUser.age || ''}
                        onChange={(e) => setNewUser({...newUser, age: e.target.value ? parseInt(e.target.value) : null})}
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newUser.country}
                        onChange={(e) => setNewUser({...newUser, country: e.target.value})}
                        placeholder="Enter country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newUser.state}
                        onChange={(e) => setNewUser({...newUser, state: e.target.value})}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newUser.city}
                        onChange={(e) => setNewUser({...newUser, city: e.target.value})}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={newUser.bio}
                        onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                        placeholder="Enter bio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image URL (optional)</Label>
                      <Input
                        id="profileImage"
                        type="url"
                        value={newUser.profile_image}
                        onChange={(e) => setNewUser({...newUser, profile_image: e.target.value})}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isEditing ? 'Update' : 'Add'} User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteUser}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by username or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Category Filter</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="beach-body">Beach Body</SelectItem>
                  <SelectItem value="bikini-model">Bikini Model</SelectItem>
                  <SelectItem value="athletes-body">Athlete Body</SelectItem>
                  <SelectItem value="amateur-bodybuilder">Amateur Bodybuilder</SelectItem>
                  <SelectItem value="professional-bodybuilder">Professional Bodybuilder</SelectItem>
                  <SelectItem value="fitness-model">Fitness Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Votes</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={user.profile_image || "/placeholder.svg"}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          crossOrigin="anonymous"
                        />
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{user.physique_category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Total: {user.vote_count || 0}</div>
                        <div className="text-gray-500">Monthly: {user.monthly_votes || 0}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
