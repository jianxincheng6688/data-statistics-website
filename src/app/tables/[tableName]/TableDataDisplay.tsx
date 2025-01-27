"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2 } from "lucide-react"

interface TableData {
  columns: string[]
  rows: any[]
  total: number
}

export function TableDataDisplay({ tableName }: { tableName: string }) {
  const [data, setData] = useState<TableData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFields, setSearchFields] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = (id: string, column?: string, value?: string) => {
    if (column && value !== undefined) {
      const newData = [...data!.rows]
      const index = newData.findIndex((row) => row.id === id)
      newData[index][column] = value
      setData({ ...data!, rows: newData })
    } else {
      setEditingId(id)
    }
  }

  const handleSave = (id: string) => {
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    // ... 删除逻辑
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData(1)
  }

  const fetchData = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        ...searchFields,
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await fetch(`/api/tables/${tableName}/data?${queryParams}`)
      if (!response.ok) {
        throw new Error(`获取数据失败: ${response.status} ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取数据时发生未知错误")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, searchFields])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) return null

  return (
    <div className="max-w-full mx-auto px-4 py-6">
      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
        {data.columns.map((field) => (
          <Input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            onChange={handleInputChange}
            className="w-auto text-sm"
          />
        ))}
        <Button type="submit" disabled={isLoading} size="sm">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          搜索
        </Button>
      </form>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((header) => (
                <TableHead key={header} className="text-xs">
                  {header}
                </TableHead>
              ))}
              <TableHead className="text-xs">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, index) => (
              <TableRow key={index}>
                {data.columns.map((column) => (
                  <TableCell key={column} className="text-sm py-2">
                    {editingId === row.id ? (
                      <Input
                        type="text"
                        value={row[column]}
                        onChange={(e) => handleEdit(row.id, column, e.target.value)}
                        className="w-full p-1 text-sm"
                      />
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-sm py-2">
                  {editingId === row.id ? (
                    <Button onClick={() => handleSave(row.id)} className="text-green-600 hover:text-green-800 mr-2">
                      保存
                    </Button>
                  ) : (
                    <Button onClick={() => handleEdit(row.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                      编辑
                    </Button>
                  )}
                  <Button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
    </div>
  )
}

