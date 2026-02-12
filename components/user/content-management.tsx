"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, FileText, Utensils } from "lucide-react"

export default function ContentManagement() {
  const [content, setContent] = useState([
    {
      id: 1,
      title: "My Push Pull Legs Routine",
      type: "workout",
      description: "6-day training split for muscle building",
      status: "published",
    },
    {
      id: 2,
      title: "Post-Workout Protein Smoothie",
      type: "recipe",
      description: "High protein recovery drink",
      status: "draft",
    },
  ])

  const [newContent, setNewContent] = useState({
    title: "",
    type: "workout",
    description: "",
    content: "",
  })

  const handleSubmit = () => {
    const content = {
      id: Date.now(),
      ...newContent,
      status: "draft",
    }
    setContent((prev) => [...prev, content])
    setNewContent({ title: "", type: "workout", description: "", content: "" })
    toast({
      title: "Content created!",
      description: "Your content has been saved as a draft.",
    })
  }

  const handleDelete = (id: number) => {
    setContent(content.filter((item) => item.id !== id))
    toast({
      title: "Content deleted",
      description: "Content has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Content title..."
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={newContent.type} onValueChange={(value) => setNewContent({ ...newContent, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="recipe">Recipe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description..."
              value={newContent.description}
              onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your workout routine or recipe details..."
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              rows={6}
            />
          </div>

          <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Content ({content.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.type === "workout" ? (
                    <FileText className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Utensils className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
