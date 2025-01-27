import { getTables } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const tables = await getTables()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理仪表板</h1>
      <ul>
        {(tables as any[]).map((table: any) => (
          <li key={table.TABLE_NAME}>
            <Link href={`/tables/${encodeURIComponent(table.TABLE_NAME)}/manage`}>{table.TABLE_NAME}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

