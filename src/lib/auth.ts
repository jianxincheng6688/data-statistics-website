import { getPool } from "./db"
import bcrypt from "bcrypt"

export interface User {
  id: number
  username: string
  password: string
  // 添加其他用户属性
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const pool = getPool()
  if (!pool) {
    console.error("数据库连接失败")
    return null
  }

  try {
    const [rows] = (await pool.query("SELECT * FROM users WHERE username = ?", [username])) as [User[], any]
    const user = rows[0]

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (isPasswordValid) {
        return user
      }
    }

    return null
  } catch (error) {
    console.error("认证用户时出错:", error)
    return null
  }
}

export async function createUser(username: string, password: string): Promise<User | null> {
  const pool = getPool()
  if (!pool) {
    console.error("数据库连接失败")
    return null
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = (await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ])) as [any, any]

    if (result.insertId) {
      return {
        id: result.insertId,
        username,
        password: hashedPassword,
      }
    }

    return null
  } catch (error) {
    console.error("创建用户时出错:", error)
    return null
  }
}

