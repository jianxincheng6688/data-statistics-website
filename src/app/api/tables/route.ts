import { NextResponse } from "next/server"
import { getTablesExcludingUsers, getTableRecordCount } from "@/lib/db"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    // 在生产环境中，在构建过程中返回模拟数据
    return NextResponse.json([
      { name: "表1", description: "示例表1", recordCount: 100 },
      { name: "表2", description: "示例表2", recordCount: 200 },
    ])
  }

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
    console.error("获取表格列表失败:", error)
    return NextResponse.json({ error: "获取表格列表失败" }, { status: 500 })
  }
}

