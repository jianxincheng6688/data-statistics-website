import Link from "next/link"
import { getTableData } from "@/lib/db"
import TableDataDisplay from "@/components/TableDataDisplay"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AllDataPage({ params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)
  const data = await getTableData(tableName)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href={`/tables/${encodeURIComponent(tableName)}/details`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回表详情
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6">{tableName} 所有数据</h1>
      <TableDataDisplay tableName={tableName} initialData={data} />
    </div>
  )
}

