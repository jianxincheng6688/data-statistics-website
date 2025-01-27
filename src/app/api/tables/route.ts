import { NextResponse } from "next/server"
import { getTablesExcludingUsers, getTableRecordCount } from "@/lib/db"

export async function GET() {
  try {
    const tables = await getTablesExcludingUsers()
    const tablesInfo = await Promise.all(
      tables.map(async (name) => ({
        name,
        description: `${name} 数据表`,
        recordCount: await getTableRecordCount(name),
      })),
    )
    return NextResponse.json(tablesInfo)
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: "获取表格列表失败" }, { status: 500 })
  }
}

