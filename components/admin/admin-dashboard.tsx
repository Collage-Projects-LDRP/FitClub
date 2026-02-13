"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminLogout } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { getAllUsers } from "@/lib/database"
import { defaultCategories } from "./category-management"
import { 
  Shield, 
  LogOut, 
  Users, 
  Vote, 
  Trophy, 
  FileText, 
  LayoutDashboard,
  UserCheck,
  BarChart2,
  Activity
} from 'lucide-react'
import UserManagement from "./user-management"
import VoteManagement from "./vote-management"
import ContentManagement from "./content-management"
import CategoryManagement from "./category-management"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userCount, setUserCount] = useState<number>(0)
  const [categoryCount, setCategoryCount] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch real user count from the database
    const users = getAllUsers()
    setUserCount(users.length)
    
    // Get the actual number of categories
    setCategoryCount(defaultCategories.length)
  }, [])

  const handleLogout = async () => {
    await adminLogout()
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    })
    router.push("/admin/login")
  }

  const stats = [
    { name: 'Total Users', value: userCount.toLocaleString(), icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Active Votes', value: '568', icon: Vote, change: '+5%', changeType: 'increase' },
    { name: 'Categories', value: categoryCount.toString(), icon: Trophy, change: '+2', changeType: 'neutral' },
    { name: 'Content', value: '1,845', icon: FileText, change: '+124', changeType: 'increase' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white">FitClub Admin</h1>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
                      <span className={`text-sm mt-1 inline-flex items-center ${
                        stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 
                        stat.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="votes" 
                className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <Vote className="w-4 h-4 mr-2" />
                Votes
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Votes</CardTitle>
                    <Vote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">568</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Active categories</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Content Items</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,845</div>
                    <p className="text-xs text-muted-foreground">Total posts & workouts</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="flex-col h-24">
                      <UserCheck className="w-6 h-6 mb-2 text-indigo-600" />
                      <span>Manage Users</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-24">
                      <Trophy className="w-6 h-6 mb-2 text-green-600" />
                      <span>Categories</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-24">
                      <FileText className="w-6 h-6 mb-2 text-amber-600" />
                      <span>Content</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-24">
                      <BarChart2 className="w-6 h-6 mb-2 text-purple-600" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            John Doe <span className="text-gray-500">created a new post</span>
                          </p>
                          <p className="text-xs text-gray-500">2 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Jane Smith <span className="text-gray-500">updated profile</span>
                          </p>
                          <p className="text-xs text-gray-500">10 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Mike Johnson <span className="text-gray-500">voted in competition</span>
                          </p>
                          <p className="text-xs text-gray-500">25 min ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Server Load</span>
                        <span className="text-sm font-semibold text-green-600">Normal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Database</span>
                        <span className="text-sm font-semibold text-green-600">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Last Backup</span>
                        <span className="text-sm font-semibold">Today, 02:00 AM</span>
                      </div>
                      <div className="pt-4 mt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">App Version</span>
                          <span className="text-sm font-semibold">v1.0.0</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="votes">
              <VoteManagement />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
