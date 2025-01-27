"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext"

const AdminSettingsPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [user, router])

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理员设置</h1>
      {/* 这里添加管理员设置的内容 */}
      <p>欢迎，{user?.username}！</p>
      {/* 可以添加更多设置选项，如更改密码、系统配置等 */}
    </div>
  )
}

export default AdminSettingsPage

