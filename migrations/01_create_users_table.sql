CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建一个初始管理员用户（密码为'admin123'）
INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$XKXqOZDrWGZOZUBONqFXXOZZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin');

