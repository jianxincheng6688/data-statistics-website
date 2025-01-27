import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const authToken = cookies().get("auth")?.value

  if (!authToken) {
    return NextResponse.json({ success: false, message: "未登录" }, { status: 200 })
  }

  try {
    const { id, username, role } = JSON.parse(Buffer.from(authToken, "base64").toString("utf-8"))
    return NextResponse.json({ success: true, user: { id, username, role } })
  } catch (error) {
    console.error("Token parsing error:", error)
    return NextResponse.json({ success: false, message: "无效的令牌" }, { status: 200 })
  }
}

