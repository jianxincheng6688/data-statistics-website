import { TableDataDisplay } from "../TableDataDisplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TableDataPage({ params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)

  return (
    <div className="container mx-auto p-4 max-w-full">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href={`/tables/${encodeURIComponent(params.tableName)}`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回表详情
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6">{tableName} 数据</h1>
      <TableDataDisplay tableName={params.tableName} />
    </div>
  )
}

