import { getTables } from "@/lib/db"
import Link from "next/link"

export default async function AllDataPage() {
  const tables = await getTables()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">所有数据表</h1>
      <ul>
        {(tables as any[]).map((table: any) => (
          <li key={table.TABLE_NAME}>
            <Link href={`/tables/${encodeURIComponent(table.TABLE_NAME)}/all-data`}>{table.TABLE_NAME}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

