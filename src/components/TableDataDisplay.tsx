"use client"

import { useState, useEffect, useCallback } from "react"
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

interface TableData {
  columns: string[]
  rows: any[]
  total: number
}

export default function TableDataDisplay({ tableName, initialData }: { tableName: string; initialData: TableData }) {
  const [data, setData] = useState<TableData>(initialData)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchFields, setSearchFields] = useState<Record<string, string>>({})
  const [jumpToPage, setJumpToPage] = useState("")

  // 过滤掉ID字段
  const visibleColumns = data.columns.filter((column) => column.toLowerCase() !== "id")

  const fetchData = useCallback(
    async (page: number) => {
      const queryParams = new URLSearchParams({
        ...searchFields,
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await fetch(`/api/tables/${tableName}/data?${queryParams}`)
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      } else {
        console.error("Failed to fetch data:", await response.text())
      }
    },
    [searchFields, pageSize, tableName],
  )

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, pageSize, searchFields, fetchData]) // Added fetchData to dependencies

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData(1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchFields({ ...searchFields, [name]: value.trim() })
  }

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNumber = Number.parseInt(jumpToPage)
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
    setJumpToPage("")
  }

  const totalPages = Math.ceil(data.total / pageSize)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
        {visibleColumns.map((field) => (
          <Input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            onChange={handleInputChange}
            className="w-auto text-sm"
          />
        ))}
        <Button type="submit" size="sm">
          搜索
        </Button>
      </form>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((header) => (
                <TableHead key={header} className="text-xs">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, index) => (
              <TableRow key={index}>
                {visibleColumns.map((column) => (
                  <TableCell key={column} className="text-sm py-2">
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2),
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="页码"
            className="w-16 text-sm"
          />
          <Button type="submit" disabled={!jumpToPage} size="sm">
            跳转
          </Button>
        </form>
      </div>
    </div>
  )
}

