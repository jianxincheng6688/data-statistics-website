import { NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET() {
  console.log("开始处理 /api/tables 请求")

  const pool = getPool()

  if (!pool) {
    console.error("数据库连接失败")
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    console.log("正在查询数据库表")
    const [tables] = await pool.query(
      `SELECT TABLE_NAME as name FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME != 'users'`,
      [process.env.DB_NAME],
    )
    console.log("查询到的表:", tables)

    if (!Array.isArray(tables) || tables.length === 0) {
      console.log("未找到任何表")
      return NextResponse.json([])
    }

    const tablesInfo = await Promise.all(
      (tables as any[]).map(async ({ name }) => {
        console.log(`正在获取表 ${name} 的记录数`)
        const [countResult] = await pool!.query(`SELECT COUNT(*) as count FROM \`${name}\``)
        const recordCount = (countResult as any[])[0].count

        return {
          name,
          description: `${name} 数据表`,
          recordCount,
        }
      }),
    )

    console.log("成功获取所有表信息")
    return NextResponse.json(tablesInfo)
  } catch (error) {
    console.error("获取表格列表失败:", error)
    return NextResponse.json({ error: "获取表格列表失败", details: (error as Error).message }, { status: 500 })
  }
}

