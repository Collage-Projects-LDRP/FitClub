"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Save, Upload } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  bio?: string;
  category?: string;
  profileImage?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

interface ProfileManagementProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
}

export default function ProfileManagement({ user, onUserUpdate }: ProfileManagementProps) {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    bio: "",
    category: "general",
    profileImage: "/placeholder-user.jpg",
    instagramUrl: "",
    tiktokUrl: ""
  });

  // Initialize profile with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        ...user
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUserUpdate(profile);
    toast({
      title: "Profile updated!",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const updatedProfile = {
          ...profile,
          profileImage: imageUrl
        };
        setProfile(updatedProfile);
        onUserUpdate(updatedProfile);
        toast({
          title: "Image uploaded!",
          description: "Your profile image has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src={profile.profileImage || "/placeholder-user.jpg"}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full w-24 h-24 object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{profile.username}</h3>
              <p className="text-sm text-gray-400">Edit your profile information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                value={profile.instagramUrl || ''}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                value={profile.tiktokUrl || ''}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@username"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={profile.category}
                onValueChange={(value) => setProfile({...profile, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
