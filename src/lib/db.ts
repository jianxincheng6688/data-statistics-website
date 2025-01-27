import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function getTableColumns(tableName: string): Promise<string[]> {
  try {
    const [columns] = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``)
    return (columns as any[]).map((col: any) => col.Field)
  } catch (error) {
    console.error(`Error fetching columns for table ${tableName}:`, error)
    throw new Error(`Table '${tableName}' doesn't exist or cannot be accessed`)
  }
}

export async function getTableData(tableName: string, page = 1, pageSize = 20, searchFields?: Record<string, string>) {
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

    const [rows] = await pool.query(query, queryParams)
    const [totalResult] = await pool.query(`SELECT COUNT(*) as total FROM \`${tableName}\``)
    const total = Number((totalResult as any[])[0].total)

    return { columns, rows: rows as any[], total }
  } catch (error) {
    console.error(`Error fetching data for table ${tableName}:`, error)
    throw error
  }
}

export async function insertRecord(tableName: string, data: Record<string, any>) {
  try {
    const columns = Object.keys(data).join(", ")
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ")
    const values = Object.values(data)

    const [result] = await pool.query(`INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`, values)
    return result
  } catch (error) {
    console.error(`Error inserting record into table ${tableName}:`, error)
    throw error
  }
}

export async function updateRecord(tableName: string, id: number, data: Record<string, any>) {
  try {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(data), id]

    const [result] = await pool.query(`UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`, values)
    return result
  } catch (error) {
    console.error(`Error updating record in table ${tableName}:`, error)
    throw error
  }
}

export async function deleteRecord(tableName: string, id: number) {
  try {
    const [result] = await pool.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id])
    return result
  } catch (error) {
    console.error(`Error deleting record from table ${tableName}:`, error)
    throw error
  }
}

export async function getTableRecordCount(tableName: string): Promise<number> {
  try {
    const [result] = await pool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``)
    return (result as any[])[0].count
  } catch (error) {
    console.error(`Error getting record count for table ${tableName}:`, error)
    throw error
  }
}

export async function getTables(): Promise<string[]> {
  try {
    const [tables] = await pool.query(`SHOW TABLES`)
    return (tables as any[]).map((table) => Object.values(table)[0] as string)
  } catch (error) {
    console.error("Error fetching tables:", error)
    throw error
  }
}

export async function getTablesExcludingUsers(): Promise<string[]> {
  try {
    const [tables] = await pool.query(
      `
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME != 'users'
    `,
      [process.env.DB_NAME],
    )
    return (tables as any[]).map((table) => table.TABLE_NAME as string)
  } catch (error) {
    console.error("Error fetching tables:", error)
    throw error
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

    const [result] = await pool.query(query, queryParams)

    return tableName ? (result as TableStats[])[0] : (result as TableStats[])
  } catch (error) {
    console.error(`Error fetching stats for table${tableName ? ` ${tableName}` : "s"}:`, error)
    throw error
  }
}

export { pool }

