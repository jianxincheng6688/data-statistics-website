import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TableDetailPage({ params }: { params: { tableName: string } }) {
  const { tableName } = params

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{tableName} 表详情</h1>

      <div className="mb-4">
        <Link href="/tables">
          <Button variant="outline">返回上一级</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href={`/tables/${tableName}/all-data`}>
          <Button>ALL DATA</Button>
        </Link>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg min-h-[400px]">
        {/* 这里是未来图表的位置 */}
        <p className="text-center text-gray-500">图表即将到来</p>
      </div>
    </div>
  )
}

