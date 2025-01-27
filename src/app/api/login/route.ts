import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getPool } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()
  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])

    if (Array.isArray(rows) && rows.length > 0) {
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

