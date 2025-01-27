import { type NextRequest, NextResponse } from "next/server"
import { getTableColumns } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)

  try {
    const columns = await getTableColumns(tableName)
    return NextResponse.json(columns)
  } catch (error) {
    console.error(`Error fetching columns for table ${tableName}:`, error)
    return NextResponse.json({ error: "获取表列信息失败" }, { status: 500 })
  }
}

