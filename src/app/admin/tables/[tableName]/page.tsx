"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import TableCRUD from "@/components/TableCRUD"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TablePageProps {
  params: {
    tableName: string
  }
}

export default function TablePage({ params }: TablePageProps) {
  const { tableName } = params
  const { user } = useUser()
  const router = useRouter()
  const [initialData, setInitialData] = useState<{ columns: string[]; rows: any[]; total: number } | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      fetchInitialData()
    }
  }, [user, router]) // Removed unnecessary dependency: tableName

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`/api/tables/${tableName}/data?page=1&pageSize=20`)
      if (response.ok) {
        const data = await response.json()
        setInitialData(data)
      } else {
        console.error("Failed to fetch initial data")
      }
    } catch (error) {
      console.error("Error fetching initial data:", error)
    }
  }

  if (!user || !initialData) {
    return <div>加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/admin/tables">
          <Button variant="outline">返回管理数据表</Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">{tableName} 表格数据</h1>
      <TableCRUD tableName={tableName} initialData={initialData} />
    </div>
  )
}

