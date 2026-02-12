"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, FileText, Utensils } from "lucide-react"

export default function ContentManagement() {
  const content = [
    {
      id: 1,
      title: "Push Pull Legs Split",
      type: "workout",
      author: "FitMike92",
      status: "published",
      date: "2024-01-10",
    },
    {
      id: 2,
      title: "High Protein Smoothie Recipe",
      type: "recipe",
      author: "FitMike92",
      status: "published",
      date: "2024-01-09",
    },
    {
      id: 3,
      title: "Powerlifting Program",
      type: "workout",
      author: "SarahStrong",
      status: "draft",
      date: "2024-01-08",
    },
    { id: 4, title: "Contest Prep Diet", type: "recipe", author: "FlexAlex", status: "published", date: "2024-01-07" },
    {
      id: 5,
      title: "Morning Yoga Routine",
      type: "workout",
      author: "YogaZen",
      status: "published",
      date: "2024-01-06",
    },
  ]

  const staticPages = [
    { id: 1, title: "About Us", slug: "/about", status: "published", lastModified: "2024-01-10" },
    { id: 2, title: "Privacy Policy", slug: "/privacy", status: "published", lastModified: "2024-01-05" },
    { id: 3, title: "Terms of Service", slug: "/terms", status: "published", lastModified: "2024-01-05" },
    { id: 4, title: "FAQ", slug: "/faq", status: "draft", lastModified: "2024-01-03" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              User Content
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {item.type === "workout" ? (
                      <FileText className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Utensils className="w-4 h-4 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">by {item.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Static Pages
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staticPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{page.title}</p>
                    <p className="text-xs text-gray-500">{page.slug}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
