"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"

// Export the default categories for use in other components
export const defaultCategories = [
  {
    id: 1,
    name: "Beach Body",
    description: "Summer ready physiques and beach workouts. Athletes who train for that perfect beach body look with outdoor fitness routines.",
    userCount: 3,
    color: "blue",
  },
  { id: 2, name: "Bikini Model", description: "Competition ready bikini physiques. Female athletes competing in bikini divisions with focus on symmetry and conditioning.", userCount: 3, color: "red" },
  { id: 3, name: "Athlete's Body", description: "Athletic performance and sports conditioning. Multi-sport athletes focused on peak performance and functional strength.", userCount: 4, color: "purple" },
  { id: 4, name: "Amateur BodyBuilder", description: "Aspiring bodybuilders building muscle mass. Dedicated athletes working towards their first competitions.", userCount: 3, color: "green" },
  { id: 5, name: "Professional Bodybuilder", description: "Elite level competitive bodybuilders. Seasoned competitors with years of experience and multiple titles.", userCount: 5, color: "orange" },
  { id: 6, name: "Fitness Competitor / Model", description: "Fitness models and competition athletes. Athletes who combine aesthetics with athletic performance.", userCount: 5, color: "gray" },
]

export default function CategoryManagement() {
  const [categories] = useState(defaultCategories)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Yoga"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="categoryDesc">Description</Label>
              <Input
                id="categoryDesc"
                placeholder="Brief description..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4 bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{category.name}</Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-xs text-gray-500">{category.userCount} athletes</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
