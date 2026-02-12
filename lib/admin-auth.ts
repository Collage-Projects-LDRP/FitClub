"use server"

import { cookies } from "next/headers"

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "maxopolis2024",
}

export async function adminLogin(username: string, password: string) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const cookieStore = await cookies()
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "authenticated"
}
