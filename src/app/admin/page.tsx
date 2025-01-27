"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export default function AdminPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // 或者返回一个加载指示器
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理员仪表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">管理数据表</h2>
          <p className="mb-4">查看和管理所有数据表</p>
          <button
            onClick={() => router.push("/admin/tables")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            进入
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">系统日志</h2>
          <p className="mb-4">查看系统操作日志</p>
          <button
            onClick={() => router.push("/admin/logs")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            查看
          </button>
        </div>
        {/* 可以根据需要添加更多管理选项 */}
      </div>
    </div>
  )
}

