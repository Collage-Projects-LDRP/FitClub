"use server"

import { addVote, hasUserVoted } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function voteForUser(votedForId: number) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value

  if (!userId) {
    return { success: false, error: "Not authenticated" }
  }

  const voterId = Number.parseInt(userId)

  if (voterId === votedForId) {
    return { success: false, error: "Cannot vote for yourself" }
  }

  if (hasUserVoted(voterId, votedForId)) {
    return { success: false, error: "Already voted for this user" }
  }

  const result = addVote(voterId, votedForId)

  if (result) {
    revalidatePath("/")
    revalidatePath(`/profile/${votedForId}`)
    revalidatePath("/leaderboard")
    return { success: true }
  }

  return { success: false, error: "Failed to vote" }
}

export async function loginUser(username: string): Promise<{success: true; userId: string} | {success: false; error: string}> {
  try {
    const cookieStore = await cookies()

    // For demo purposes, we'll allow login with any username
    // In a real app, you'd validate credentials against a database
    if (!username || username.trim().length === 0) {
      return { success: false, error: "Username is required" }
    }

    // Generate a simple user ID for demo purposes
    const userId = Math.floor(Math.random() * 10000).toString()

    // Set the user_id cookie
    cookieStore.set({
      name: "user_id",
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Also set the username in a separate cookie
    cookieStore.set({
      name: "username",
      value: username.trim(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true, userId }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}
