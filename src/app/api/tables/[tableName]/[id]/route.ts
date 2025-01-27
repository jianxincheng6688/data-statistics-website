import { type NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params
  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` WHERE id = ?`, [id])
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0])
    } else {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 })
    }
  } catch (error) {
    console.error(`获取表 ${tableName} 中 ID 为 ${id} 的记录时出错:`, error)
    return NextResponse.json({ error: "获取记录失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params
  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
  }

  try {
    const data = await request.json()
    const setClause = Object.keys(data)
      .map((key) => `\`${key}\` = ?`)
      .join(", ")
    const values = [...Object.values(data), id]

    const [result] = await pool.query(`UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`, values)

    if ((result as any).affectedRows > 0) {
      return NextResponse.json({ message: "记录更新成功" })
    } else {
      return NextResponse.json({ error: "记录不存在或未更改" }, { status: 404 })
    }
  } catch (error) {
    console.error(`更新表 ${tableName} 中 ID 为 ${id} 的记录时出错:`, error)
    return NextResponse.json({ error: "更新记录失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params
  const pool = getPool()

  if (!pool) {
    return NextResponse.json({ error: "数据��连接失败" }, { status: 500 })
  }

  try {
    const [result] = await pool.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id])

    if ((result as any).affectedRows > 0) {
      return NextResponse.json({ message: "记录删除成功" })
    } else {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 })
    }
  } catch (error) {
    console.error(`删除表 ${tableName} 中 ID 为 ${id} 的记录时出错:`, error)
    return NextResponse.json({ error: "删除记录失败" }, { status: 500 })
  }
}

