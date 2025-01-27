"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/login")
    } else {
      // 这里可以添加验证 token 的逻辑
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理员仪表板</h1>
      {/* 这里添加管理员仪表板的内容 */}
    </div>
  )
}

