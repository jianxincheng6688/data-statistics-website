"use client"

import { useEffect } from "react"
import TableCRUD from "@/components/TableCRUD"

interface TableDetailsClientProps {
  tableName: string
  initialData: any // 根据实际数据结构调整这个类型
}

export default function TableDetailsClient({ tableName, initialData }: TableDetailsClientProps) {
  useEffect(() => {
    console.log("Table Details Page Loaded:", tableName)
  }, [tableName])

  return <TableCRUD tableName={tableName} initialData={initialData} />
}

