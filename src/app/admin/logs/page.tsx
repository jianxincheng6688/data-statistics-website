"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export default function AdminLogsPage() {
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [user, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>管理员日志页面</h1>
      {/* 这里添加日志内容 */}
    </div>
  )
}

