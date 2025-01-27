import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TableDetailsPage({ params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/tables" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回数据表列表
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6">{tableName} 详情</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">数据表描述</h2>
        <p className="text-gray-600">这里是 {tableName} 表的详细描述。</p>
      </div>
      <Button asChild>
        <Link href={`/tables/${encodeURIComponent(params.tableName)}/all-data`}>ALL DATA</Link>
      </Button>
    </div>
  )
}

