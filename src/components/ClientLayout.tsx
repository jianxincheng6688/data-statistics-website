"use client"

import type React from "react"
import { UserProvider } from "@/contexts/UserContext"
import Navbar from "@/components/Navbar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <Navbar />
      {children}
    </UserProvider>
  )
}

