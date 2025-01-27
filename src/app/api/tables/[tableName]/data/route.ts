import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  const { tableName } = params
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
  const offset = (page - 1) * pageSize

  let query = `SELECT * FROM \`${tableName}\``
  const queryParams: any[] = []

  // 处理搜索条件
  const searchConditions: string[] = []
  searchParams.forEach((value, key) => {
    if (key !== "page" && key !== "pageSize" && value) {
      if (key.toLowerCase() === "id") {
        searchConditions.push(`\`${key}\` = ?`)
        queryParams.push(value)
      } else {
        searchConditions.push(`\`${key}\` = ?`)
        queryParams.push(value)
      }
    }
  })

  if (searchConditions.length > 0) {
    query += ` WHERE ${searchConditions.join(" AND ")}`
  }

  // 添加排序，确保结果一致性
  query += ` ORDER BY ID`

  // 添加分页
  query += ` LIMIT ? OFFSET ?`
  queryParams.push(pageSize, offset)

  try {
    const [columns] = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``)
    const [rows] = await pool.query(query, queryParams)

    // 获取总记录数
    let totalQuery = `SELECT COUNT(*) as total FROM \`${tableName}\``
    if (searchConditions.length > 0) {
      totalQuery += ` WHERE ${searchConditions.join(" AND ")}`
    }
    const [totalResult] = await pool.query(totalQuery, queryParams.slice(0, -2))
    const total = (totalResult as any[])[0].total

    return NextResponse.json({
      columns: (columns as any[]).map((col: any) => col.Field),
      rows,
      total,
    })
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error)
    return NextResponse.json({ error: "获取表数据失败" }, { status: 500 })
  }
}

