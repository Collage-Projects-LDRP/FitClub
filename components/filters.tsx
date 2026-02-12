"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    router.push(`/?${params.toString()}`)
  }

  const handleGenderChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete("gender")
    } else {
      params.set("gender", value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Category:</label>
        <Select onValueChange={handleCategoryChange} defaultValue={searchParams.get("category") || "all"}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="bodybuilder">Bodybuilder</SelectItem>
            <SelectItem value="powerlifter">Powerlifter</SelectItem>
            <SelectItem value="physique">Physique</SelectItem>
            <SelectItem value="endurance">Endurance</SelectItem>
            <SelectItem value="crossfit">CrossFit</SelectItem>
            <SelectItem value="better-me">Better Me</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Gender:</label>
        <Select onValueChange={handleGenderChange} defaultValue={searchParams.get("gender") || "all"}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
