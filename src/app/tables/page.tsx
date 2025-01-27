"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ErrorBoundary } from "react-error-boundary"
import { Spinner } from "@/components/ui/spinner"
import useSWR from "swr"

interface TableInfo {
  name: string
  description: string
  recordCount: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function TablesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "recordCount">("name")

  const { data: tables = [], error } = useSWR<TableInfo[]>("/api/tables", fetcher)

  if (error) return <div>加载失败，请稍后重试</div>
  if (!tables) return <Spinner />

  const filteredTables = tables
    .filter((table) => table.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else {
        return b.recordCount - a.recordCount
      }
    })

  return (
    <>
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
    </>
  )
}

export default function TablesListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">数据表列表</h1>
      <ErrorBoundary fallback={<div>加载失败，请稍后重试</div>}>
        <Suspense fallback={<Spinner />}>
          <TablesList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

