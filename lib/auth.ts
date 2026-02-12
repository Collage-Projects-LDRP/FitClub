"use server"

import { cookies } from "next/headers"
import { getUserByUsername } from "./database"

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value
    const username = cookieStore.get("username")?.value

    if (!userId || !username) return null

    // Check if this is a demo user
    const isDemoUser = userId.startsWith('demo-') || username.startsWith('demo')

    // Return a plain object without any getters/setters
    const user = {
      id: isDemoUser ? userId : Number.parseInt(userId),
      username: username,
      email: isDemoUser ? `${username}@demo.maxopolis.com` : `${username}@maxopolis.com`,
      isDemo: isDemoUser
    }

    return JSON.parse(JSON.stringify(user)) // Ensures a clean, plain object
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

export async function login(username: string) {
  const user = getUserByUsername(username)
  if (!user) return null

  const cookieStore = await cookies()
  cookieStore.set("user_id", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  cookieStore.set("username", user.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return user
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user_id")
  cookieStore.delete("username")
}
