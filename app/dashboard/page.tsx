export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import UserDashboard from "@/components/user/user-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <UserDashboard />
}
