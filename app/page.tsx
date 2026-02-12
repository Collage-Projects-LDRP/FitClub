export const dynamic = "force-dynamic"

import { getAllUsers } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import NetflixStyleHome from "@/components/netflix-style-home"

export default async function HomePage() {
  const users = getAllUsers()
  const currentUser = await getCurrentUser()

  return <NetflixStyleHome users={users} currentUser={currentUser} />
}
