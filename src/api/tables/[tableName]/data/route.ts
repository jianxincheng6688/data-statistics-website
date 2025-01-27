import { type NextRequest, NextResponse } from "next/server"
import { getTableData } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  const { tableName } = params
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || 20

  const searchFields: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key !== "page" && key !== "pageSize") {
      searchFields[key] = value
    }
  })

  try {
    const result = await getTableData(tableName, page, pageSize, searchFields)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error)
    return NextResponse.json({ error: "获取表数据失败" }, { status: 500 })
  }
}

