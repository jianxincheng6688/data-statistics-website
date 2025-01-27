import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  try {
    const user = await authenticateUser(username, password)

    if (user) {
      cookies().set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
    }
  } catch (error) {
    console.error("登录时出错:", error)
    return NextResponse.json({ error: "登录失败" }, { status: 500 })
  }
}

