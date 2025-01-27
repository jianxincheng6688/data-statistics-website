"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface TableInfo {
  name: string
  recordCount: number
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      fetchTables()
    }
  }, [user, router])

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables")
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      } else {
        console.error("Failed to fetch tables")
      }
    } catch (error) {
      console.error("Error fetching tables:", error)
    }
  }

  if (!user) {
    return null // 或者显示一个加载指示器
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理数据表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.name}>
            <CardHeader>
              <CardTitle>{table.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">记录数量: {table.recordCount}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/admin/tables/${table.name}`}>
                <Button>管理表格</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

