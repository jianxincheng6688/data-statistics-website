import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10)
  const offset = (page - 1) * pageSize

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?`, [pageSize, offset])
    const [totalResult] = await pool.query(`SELECT COUNT(*) as total FROM \`${tableName}\``)
    const total = (totalResult as any[])[0].total

    return NextResponse.json({
      data: rows,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error)
    return NextResponse.json({ error: "获取表数据失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { tableName: string } }) {
  const tableName = decodeURIComponent(params.tableName)
  const data = await request.json()

  // 确保不包含 ID 字段
  delete data.id

  try {
    const [result] = await pool.query(`INSERT INTO \`${tableName}\` SET ?`, [data])
    return NextResponse.json({ id: (result as any).insertId, message: "记录创建成功" })
  } catch (error) {
    console.error(`Error inserting record into ${tableName}:`, error)
    return NextResponse.json({ error: "创建记录失败" }, { status: 500 })
  }
}

