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
  connectTimeout: 30000, // 增加连接超时时间到30秒
});

// 打印数据库连接信息
console.log(`数据库连接配置: ${dbConfig.host}:${dbConfig.port}, 用户: ${dbConfig.user}, 数据库: ${dbConfig.database}`);

export async function checkDatabaseConnection() {
  let connection;
  try {
    console.log('尝试连接数据库...');
    connection = await pool.getConnection();
    console.log('数据库连接成功!');
    
    // 获取数据库状态信息
    const [serverStatus] = await connection.query('SHOW STATUS LIKE "Threads_connected"');
    const [version] = await connection.query('SELECT VERSION() as version');
    
    console.log(`数据库版本: ${(version as any)[0].version}`);
    console.log(`当前连接数: ${(serverStatus as any)[0].Value}`);
    
    return {
      success: true,
      message: '数据库连接正常',
      host: dbConfig.host,
      database: dbConfig.database,
      version: (version as any)[0].version,
      connections: (serverStatus as any)[0].Value
    };
  } catch (error) {
    console.error('数据库连接失败:', error);
    return {
      success: false,
      message: '数据库连接失败',
      error: (error as Error).message
    };
  } finally {
    if (connection) connection.release();
  }
}

export async function initializeDatabase() {
  let retries = 3;
  let lastError = null;

  while (retries > 0) {
    try {
      console.log(`尝试连接数据库 (剩余尝试次数: ${retries})...`);
      const connection = await pool.getConnection();
      
      try {
        console.log(`创建数据库(如不存在): ${dbConfig.database}`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        await connection.query(`USE \`${dbConfig.database}\``);
        const initSqlPath = path.join(process.cwd(), 'database', 'init.sql');
        const sql = await fs.readFile(initSqlPath, 'utf8');
        console.log('初始化数据库表结构...');
        await connection.query(sql);
        console.log('数据库初始化完成');
        return; // 成功后直接返回
      } finally {
        connection.release();
      }
    } catch (error: any) {
      lastError = error;
      console.error(`数据库连接尝试 ${4 - retries}/3 失败:`, error.message || error);
      retries--;
      if (retries > 0) {
        // 等待一段时间再重试
        console.log(`将在 5 秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  // 所有重试都失败后抛出最后一个错误
  console.error('所有数据库连接尝试均失败，请检查数据库配置和网络连接。');
  throw lastError;
}

export async function getDb() {
  // Ensure DB and tables exist
  await initializeDatabase();
  // Return a pool configured with the database name
  console.log(`创建连接池: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
    connectTimeout: 30000, // 增加连接超时时间到30秒
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
