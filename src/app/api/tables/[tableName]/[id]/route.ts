import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` WHERE id = ?`, [id])
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0])
    } else {
      return NextResponse.json({ error: "记录未找到" }, { status: 404 })
    }
  } catch (error) {
    console.error(`Error fetching record from ${tableName}:`, error)
    return NextResponse.json({ error: "获取记录失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params
  const data = await request.json()

  // 从数据中移除 id 字段，因为我们不想更新它
  delete data.id

  try {
    const [result] = await pool.query(`UPDATE \`${tableName}\` SET ? WHERE id = ?`, [data, id])
    if ((result as any).affectedRows > 0) {
      return NextResponse.json({ message: "记录更新成功" })
    } else {
      return NextResponse.json({ error: "记录未找到或未更改" }, { status: 404 })
    }
  } catch (error: any) {
    console.error(`Error updating record in ${tableName}:`, error)
    return NextResponse.json(
      {
        error: "更新记录失败",
        details: error.message,
        sql: error.sql,
        sqlMessage: error.sqlMessage,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tableName: string; id: string } }) {
  const { tableName, id } = params

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "无效的 ID" }, { status: 400 })
  }

  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 删除记录
    const [deleteResult] = await conn.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id])

    if ((deleteResult as any).affectedRows === 0) {
      await conn.rollback()
      return NextResponse.json({ error: "记录未找到" }, { status: 404 })
    }

    // 获取当前最大 ID
    const [maxIdResult] = await conn.query(`SELECT MAX(id) as maxId FROM \`${tableName}\``)
    const maxId = (maxIdResult as any[])[0].maxId || 0

    // 重置自增值
    await conn.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ?`, [maxId + 1])

    await conn.commit()
    return NextResponse.json({ message: "记录删除成功，并重置了自增值" })
  } catch (error: any) {
    await conn.rollback()
    console.error(`Error deleting record from ${tableName}:`, error)
    return NextResponse.json(
      {
        error: "删除记录失败",
        details: error.message,
        sql: error.sql,
        sqlMessage: error.sqlMessage,
      },
      { status: 500 },
    )
  } finally {
    conn.release()
  }
}

