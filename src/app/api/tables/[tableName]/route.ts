import { type NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  const { tableName } = params
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || 20
  const offset = (page - 1) * pageSize

  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?`, [pageSize, offset])
    const [totalResult] = await pool.query(`SELECT COUNT(*) as total FROM \`${tableName}\``)
    const total = (totalResult as any[])[0].total

    return NextResponse.json({ rows, total })
  } catch (error) {
    console.error(`获取表 ${tableName} 数据时出错:`, error)
    return NextResponse.json({ error: "获取表数据失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { tableName: string } }) {
  const { tableName } = params
  const data = await request.json()

  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const columns = Object.keys(data).join(", ")
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ")
    const values = Object.values(data)

    const [result] = await pool.query(`INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`, values)

    return NextResponse.json({ message: "记录添加成功", id: (result as any).insertId })
  } catch (error) {
    console.error(`向表 ${tableName} 添加记录时出错:`, error)
    return NextResponse.json({ error: "添加记录失败" }, { status: 500 })
  }
}

