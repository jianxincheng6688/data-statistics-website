"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

interface TableInfo {
  name: string
  description: string
  recordCount: number
}

export default function TablesListPage() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "recordCount">("name")

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/tables")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "获取表格列表失败")
      }
      const data = await response.json()
      setTables(data)
    } catch (error) {
      console.error("获取表格列表时出错:", error)
      setError((error as Error).message || "获取表格列表失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const filteredTables = tables
    .filter((table) => table.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else {
        return b.recordCount - a.recordCount
      }
    })

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
        <Button onClick={fetchTables} className="mt-4">
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">数据表列表</h1>
      <div className="mb-6 flex justify-between items-center">
        <Input
          type="text"
          placeholder="搜索数据表..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div>
          <span className="mr-2">排序方式：</span>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            onClick={() => setSortBy("name")}
            className="mr-2"
          >
            名称
          </Button>
          <Button variant={sortBy === "recordCount" ? "default" : "outline"} onClick={() => setSortBy("recordCount")}>
            记录数量
          </Button>
        </div>
      </div>
      {filteredTables.length === 0 ? (
        <div className="text-center">没有找到匹配的数据表</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <Card key={table.name}>
              <CardHeader>
                <CardTitle>{table.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{table.description}</p>
                <p className="mt-2 text-sm">记录数量: {table.recordCount}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/tables/${table.name}`}>
                  <Button>查看详情</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

