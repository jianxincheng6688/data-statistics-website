import Link from "next/link"
import { getTableData } from "@/lib/db"
import TableDetailsClient from "../TableDetailsClient"

export default async function TableManagePage({ params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)
  const data = await getTableData(tableName)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link
        href={`/tables/${encodeURIComponent(params.tableName)}/details`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; 返回表详情
      </Link>
      <h1 className="text-3xl font-bold mb-6">{tableName} 表管理</h1>
      <TableDetailsClient tableName={tableName} initialData={data} />
    </div>
  )
}

