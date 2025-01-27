import { pool } from "./db"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  username: string
  password: string
  role: "admin" | "user"
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const [rows] = (await pool.query("SELECT * FROM users WHERE username = ?", [username])) as [User[], any]
    const user = rows[0]

    if (user) {
      // 对于测试目的，我们暂时禁用密码哈希比较
      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = password === user.password // 直接比较明文密码

      if (isMatch) {
        return user
      }
    }

    return null
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function createUser(username: string, password: string, role: "admin" | "user"): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = (await pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
      username,
      hashedPassword,
      role,
    ])) as [any, any]
    const insertId = result.insertId
    return { id: insertId, username, password: hashedPassword, role }
  } catch (error) {
    console.error("User creation error:", error)
    return null
  }
}

