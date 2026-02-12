import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, isDemo, name, email } = await request.json()

    // For demo users, we'll create a session without database validation
    if (!isDemo) {
      return NextResponse.json(
        { error: "Only demo logins are currently supported" },
        { status: 400 }
      )
    }

    // Create response
    const response = NextResponse.json(
      { 
        message: "Logged in successfully",
        user: {
          id: `demo-${Date.now()}`,
          username,
          name,
          email,
          isDemo: true
        }
      },
      { status: 200 }
    )

    // Set authentication cookies that match what getCurrentUser expects
    response.cookies.set("user_id", `demo-${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    response.cookies.set("username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to process login" },
      { status: 500 }
    )
  }
}
