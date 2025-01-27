"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TableCRUDProps {
  tableName: string
  initialData: {
    columns: string[]
    rows: any[]
    total: number
  }
}

export default function TableCRUD({ tableName, initialData }: TableCRUDProps) {
  const [data, setData] = useState(initialData)
  const [newRecord, setNewRecord] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingRecord, setEditingRecord] = useState<Record<string, any> | null>(null)
  const [searchFields, setSearchFields] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  const visibleColumns = data.columns.filter((column) => column.toLowerCase() !== "id")

  const validateAndConvertData = (data: Record<string, any>) => {
    const convertedData: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase() === "id") continue
      if (typeof value === "string" && value.trim() === "") {
        convertedData[key] = null
      } else if (!isNaN(Number(value))) {
        convertedData[key] = Number(value)
      } else {
        convertedData[key] = value
      }
    }
    return convertedData
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isNewRecord: boolean) => {
    const { name, value } = e.target
    if (isNewRecord) {
      setNewRecord({ ...newRecord, [name]: value })
    } else if (editingRecord) {
      setEditingRecord({ ...editingRecord, [name]: value })
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchFields({ ...searchFields, [name]: value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData()
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSend = validateAndConvertData(newRecord)
    try {
      const response = await fetch(`/api/tables/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })
      if (response.ok) {
        setNewRecord({})
        fetchData()
      } else {
        const errorData = await response.json()
        console.error("Failed to add record:", errorData.error)
        alert(`添加记录失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error adding record:", error)
      alert("添加记录时发生错误，请查看控制台以获取更多信息。")
    }
  }

  const handleEditRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRecord || editingId === null) return

    const validatedData = validateAndConvertData(editingRecord)

    try {
      const response = await fetch(`/api/tables/${tableName}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })
      if (response.ok) {
        setEditingId(null)
        setEditingRecord(null)
        await fetchData()
      } else {
        const errorData = await response.json()
        console.error("Failed to edit record:", errorData.error)
        alert(`编辑记录失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error editing record:", error)
      alert("编辑记录时发生错误，请查看控制台以获取更多信息。")
    }
  }

  const handleDeleteRecord = async (id: number) => {
    if (!confirm("确定要删除这条记录吗？")) return

    try {
      const response = await fetch(`/api/tables/${tableName}/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        await fetchData()
      } else {
        const errorData = await response.json()
        console.error("删除记录失败:", errorData.error)
        alert(`删除记录失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error("删除记录时出错:", error)
      alert("删除记录时出错，请查看控制台以获取更多信息。")
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        ...searchFields,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await fetch(`/api/tables/${tableName}/data?${queryParams}`)
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      } else {
        console.error("Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [searchFields, currentPage, pageSize, tableName])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>查询记录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleColumns.map((column) => (
              <div key={column}>
                <Input
                  id={`search-${column}`}
                  name={column}
                  placeholder={column}
                  value={searchFields[column] || ""}
                  onChange={handleSearchInputChange}
                />
              </div>
            ))}
            <Button type="submit" className="mt-4">
              查询
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>添加新记录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleColumns.map((column) => (
              <div key={column}>
                <Input
                  id={column}
                  name={column}
                  placeholder={column}
                  value={newRecord[column] || ""}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
            ))}
            <Button type="submit" className="mt-4">
              添加
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>数据表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row) => (
                  <TableRow key={row.ID}>
                    {visibleColumns.map((column) => (
                      <TableCell key={`${row.ID}-${column}`}>
                        {editingId === row.ID ? (
                          <Input
                            name={column}
                            value={editingRecord?.[column] || ""}
                            onChange={(e) => handleInputChange(e, false)}
                          />
                        ) : (
                          row[column]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {editingId === row.ID ? (
                        <>
                          <Button onClick={handleEditRecord} variant="outline" size="sm" className="mr-2">
                            保存
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null)
                              setEditingRecord(null)
                            }}
                            variant="outline"
                            size="sm"
                          >
                            取消
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setEditingId(row.ID)
                              setEditingRecord({ ...row })
                            }}
                            variant="outline"
                            size="sm"
                            className="mr-2"
                          >
                            编辑
                          </Button>
                          <Button onClick={() => handleDeleteRecord(row.ID)} variant="destructive" size="sm">
                            删除
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {[...Array(Math.ceil(data.total / pageSize))].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.total / pageSize)))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

