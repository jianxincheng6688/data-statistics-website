import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool && process.env.NODE_ENV !== "production") {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: true,
      },
    })
  }
  return pool
}

export async function getTableColumns(tableName: string): Promise<string[]> {
  if (!getPool()) return []
  try {
    const [columns] = await getPool()!.query(`SHOW COLUMNS FROM \`${tableName}\``)
    return (columns as any[]).map((col: any) => col.Field)
  } catch (error) {
    console.error(`获取表 ${tableName} 的列时出错:`, error)
    return []
  }
}

export async function getTableData(tableName: string, page = 1, pageSize = 20, searchFields?: Record<string, string>) {
  if (!getPool()) return { columns: [], rows: [], total: 0 }
  try {
    const columns = await getTableColumns(tableName)
    const offset = (page - 1) * pageSize

    let query = `SELECT * FROM \`${tableName}\``
    const queryParams: any[] = []

    if (searchFields && Object.keys(searchFields).length > 0) {
      const searchConditions = Object.entries(searchFields)
        .filter(([_, value]) => value !== "")
        .map(([key, _]) => `\`${key}\` LIKE ?`)

      if (searchConditions.length > 0) {
        query += ` WHERE ${searchConditions.join(" AND ")}`
        queryParams.push(
          ...Object.values(searchFields)
            .filter((value) => value !== "")
            .map((value) => `%${value}%`),
        )
      }
    }

    query += ` LIMIT ? OFFSET ?`
    queryParams.push(pageSize, offset)

    const [rows] = await getPool()!.query(query, queryParams)
    const [totalResult] = await getPool()!.query(`SELECT COUNT(*) as total FROM \`${tableName}\``)
    const total = Number((totalResult as any[])[0].total)

    return { columns, rows: rows as any[], total }
  } catch (error) {
    console.error(`获取表 ${tableName} 的数据时出错:`, error)
    return { columns: [], rows: [], total: 0 }
  }
}

export async function insertRecord(tableName: string, data: Record<string, any>) {
  if (!getPool()) return null
  try {
    const columns = Object.keys(data).join(", ")
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ")
    const values = Object.values(data)

    const [result] = await getPool()!.query(
      `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`,
      values,
    )
    return result
  } catch (error) {
    console.error(`向表 ${tableName} 插入记录时出错:`, error)
    throw error
  }
}

export async function updateRecord(tableName: string, id: number, data: Record<string, any>) {
  if (!getPool()) return null
  try {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(data), id]

    const [result] = await getPool()!.query(`UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`, values)
    return result
  } catch (error) {
    console.error(`更新表 ${tableName} 中的记录时出错:`, error)
    throw error
  }
}

export async function deleteRecord(tableName: string, id: number) {
  if (!getPool()) return null
  try {
    const [result] = await getPool()!.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id])
    return result
  } catch (error) {
    console.error(`从表 ${tableName} 删除记录时出错:`, error)
    throw error
  }
}

export async function getTableRecordCount(tableName: string): Promise<number> {
  if (!getPool()) return 0
  try {
    const [result] = await getPool()!.query(`SELECT COUNT(*) as count FROM \`${tableName}\``)
    return (result as any[])[0].count
  } catch (error) {
    console.error(`获取表 ${tableName} 的记录数时出错:`, error)
    throw error
  }
}

export async function getTables(): Promise<string[]> {
  if (!getPool()) return []
  try {
    const [tables] = await getPool()!.query(`SHOW TABLES`)
    return (tables as any[]).map((table) => Object.values(table)[0] as string)
  } catch (error) {
    console.error("获取表列表时出错:", error)
    throw error
  }
}

export async function getTablesExcludingUsers(): Promise<string[]> {
  if (!getPool()) return []
  try {
    const [tables] = await getPool()!.query(
      `
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME != 'users'
    `,
      [process.env.DB_NAME],
    )
    return (tables as any[]).map((table) => table.TABLE_NAME as string)
  } catch (error) {
    console.error("获取表列表（不包括users表）时出错:", error)
    return []
  }
}

interface TableStats {
  name: string
  recordCount: number
  dataSize: number
  indexSize: number
  totalSize: number
  lastUpdated: string
}

export async function getTableStats(tableName?: string): Promise<TableStats | TableStats[]> {
  if (!getPool()) return []
  try {
    let query = `
      SELECT 
        TABLE_NAME as name,
        TABLE_ROWS as recordCount,
        DATA_LENGTH as dataSize,
        INDEX_LENGTH as indexSize,
        (DATA_LENGTH + INDEX_LENGTH) as totalSize,
        UPDATE_TIME as lastUpdated
      FROM
        information_schema.TABLES
      WHERE
        TABLE_SCHEMA = ?
    `
    const queryParams = [process.env.DB_NAME]

    if (tableName) {
      query += ` AND TABLE_NAME = ?`
      queryParams.push(tableName)
    }

    const [result] = await getPool()!.query(query, queryParams)

    return tableName ? (result as TableStats[])[0] : (result as TableStats[])
  } catch (error) {
    console.error(`获取表${tableName ? ` ${tableName}` : "s"}的统计信息时出错:`, error)
    throw error
  }
}

export { pool }

