import { NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET() {
  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const [tables] = await pool.query(
      `SELECT TABLE_NAME as name FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME != 'users'`,
      [process.env.DB_NAME],
    )

    const tablesInfo = await Promise.all(
      (tables as any[]).map(async ({ name }) => {
        const [countResult] = await pool!.query(`SELECT COUNT(*) as count FROM \`${name}\``)
        const recordCount = (countResult as any[])[0].count

        return {
          name,
          description: `${name} 数据表`,
          recordCount,
        }
      }),
    )

    return NextResponse.json(tablesInfo)
  } catch (error) {
    console.error("获取表格列表失败:", error)
    return NextResponse.json({ error: "获取表格列表失败" }, { status: 500 })
  }
}

