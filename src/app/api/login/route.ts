import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { pool } from "@/lib/db"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])

    if (Array.isArray(rows) && rows.length > 0) {
      cookies().set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
      })

      return NextResponse.json({ message: "登录成功" })
    } else {
      console.log("Login failed for username:", username)
      return NextResponse.json({ message: "用户名或密码错误" }, { status: 401 })
    }
  } catch (error) {
    console.error("登录错误:", error)
    return NextResponse.json({ message: "登录过程中发生错误" }, { status: 500 })
  }
}

