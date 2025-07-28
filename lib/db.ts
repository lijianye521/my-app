import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env if present
config();

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root2',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stock_lab',
};

// Create connection pool without specifying database for initialization
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.query(`USE \`${dbConfig.database}\``);
    const initSqlPath = path.join(process.cwd(), 'database', 'init.sql');
    const sql = await fs.readFile(initSqlPath, 'utf8');
    // mysql2 by default does not support multiple statements without this option
    await connection.query(sql);
  } finally {
    connection.release();
  }
}

export async function getDb() {
  // Ensure DB and tables exist
  await initializeDatabase();
  // Return a pool configured with the database name
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  });
}

// 新增或更新平台/服务信息
export async function savePlatformService(data: {
  id: string;
  name: string;
  description: string;
  iconName: string;
  url: string;
  color: string;
  type: 'platform' | 'service';
  isNew: boolean;
}) {
  const db = await getDb();
  
  try {
    if (data.isNew) {
      // 新增记录
      await db.query(
        `INSERT INTO platform_services 
        (service_code, service_name, service_description, service_type, icon_name, color_class, service_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.description, data.type, data.iconName, data.color, data.url]
      );
    } else {
      // 更新记录
      await db.query(
        `UPDATE platform_services 
        SET service_name = ?, 
            service_description = ?, 
            icon_name = ?, 
            color_class = ?, 
            service_url = ? 
        WHERE service_code = ?`,
        [data.name, data.description, data.iconName, data.color, data.url, data.id]
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('数据库操作失败:', error);
    return { success: false, error };
  }
}

// 删除平台/服务信息
export async function deletePlatformService(id: string) {
  const db = await getDb();
  
  try {
    await db.query('DELETE FROM platform_services WHERE service_code = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除失败:', error);
    return { success: false, error };
  }
}

// 更新平台/服务排序
export async function updatePlatformServiceOrder(items: {id: string, sortOrder: number}[], type: 'platform' | 'service') {
  const db = await getDb();
  
  try {
    // 开启事务
    await db.query('START TRANSACTION');
    
    // 批量更新排序
    for (const item of items) {
      await db.query(
        `UPDATE platform_services 
         SET sort_order = ? 
         WHERE service_code = ? AND service_type = ?`,
        [item.sortOrder, item.id, type]
      );
    }
    
    // 提交事务
    await db.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    // 回滚事务
    await db.query('ROLLBACK');
    console.error('更新排序失败:', error);
    return { success: false, error };
  }
}
