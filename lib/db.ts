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
  user: process.env.DB_USER || 'root',
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
