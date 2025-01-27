"use client"

import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { user, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          生物力学时空数字图谱系统
        </Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">欢迎, {user.username}</span>
              <Button onClick={() => router.push("/admin/tables")} className="mr-2">
                管理员仪表板
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                登出
              </Button>
            </>
          ) : (
            <Button onClick={handleLoginClick}>登录</Button>
          )}
        </div>
      </div>
    </nav>
  )
}

