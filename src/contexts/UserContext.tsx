"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  username: string
}

interface UserContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // 移除从 localStorage 自动加载用户信息的逻辑
  }, [])

  const login = async (username: string, password: string) => {
    // 这里应该是实际的登录逻辑，包括与后端API的交互
    // 为了演示，我们直接设置用户
    const newUser = { username }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

