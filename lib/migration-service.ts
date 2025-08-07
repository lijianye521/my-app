import { Sequelize } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { DbConfig } from './db';
// 直接导入mysql2
import mysql2 from 'mysql2';

const execPromise = util.promisify(exec);

// 数据库迁移服务
export class MigrationService {
  private sequelize: Sequelize;
  private dbConfig: DbConfig;

  constructor(dbConfig: DbConfig) {
    this.dbConfig = dbConfig;
    this.sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.user,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql',
        dialectModule: mysql2, // 明确指定使用mysql2模块
        dialectOptions: {
          supportBigNumbers: true,
          bigNumberStrings: true
        },
        logging: console.log,
      }
    );
  }

  // 连接到数据库
  async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('数据库连接成功');
    } catch (error) {
      console.error('数据库连接失败:', error);
      throw error;
    }
  }

  // 检查数据库是否存在
  async databaseExists(): Promise<boolean> {
    try {
      const [results] = await this.sequelize.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${this.dbConfig.database}'`
      );
      return (results as any[]).length > 0;
    } catch (error) {
      console.error('检查数据库是否存在失败:', error);
      return false;
    }
  }

  // 创建迁移表
  async createMigrationTable(): Promise<void> {
    try {
      await this.sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`SequelizeMeta\` (
          \`name\` VARCHAR(255) NOT NULL,
          PRIMARY KEY (\`name\`),
          UNIQUE INDEX \`name\` (\`name\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='迁移记录表';
      `);
      console.log('迁移表创建成功或已存在');
    } catch (error) {
      console.error('创建迁移表失败:', error);
      throw error;
    }
  }

  // 运行迁移
  async runMigrations(): Promise<void> {
    try {
      console.log('开始运行数据库迁移...');
      // 修改命令，指定使用mysql方言
      const { stdout, stderr } = await execPromise('npx sequelize-cli db:migrate --env development');
      
      if (stderr) {
        console.error('迁移过程中出现错误:', stderr);
      }
      
      console.log('迁移输出:', stdout);
      console.log('数据库迁移完成');
    } catch (error) {
      console.error('运行迁移失败:', error);
      throw error;
    }
  }

  // 创建新的迁移文件
  async createMigration(name: string): Promise<void> {
    try {
      console.log(`创建迁移文件: ${name}`);
      const { stdout, stderr } = await execPromise(`npx sequelize-cli migration:generate --name ${name}`);
      
      if (stderr) {
        console.error('创建迁移文件过程中出现错误:', stderr);
      }
      
      console.log('迁移文件创建输出:', stdout);
      console.log('迁移文件创建完成');
    } catch (error) {
      console.error('创建迁移文件失败:', error);
      throw error;
    }
  }

  // 回滚最近的迁移
  async undoMigration(): Promise<void> {
    try {
      console.log('回滚最近的迁移...');
      const { stdout, stderr } = await execPromise('npx sequelize-cli db:migrate:undo --env development');
      
      if (stderr) {
        console.error('回滚迁移过程中出现错误:', stderr);
      }
      
      console.log('回滚输出:', stdout);
      console.log('迁移回滚完成');
    } catch (error) {
      console.error('回滚迁移失败:', error);
      throw error;
    }
  }

  // 获取已应用的迁移列表
  async getAppliedMigrations(): Promise<string[]> {
    try {
      const [results] = await this.sequelize.query('SELECT name FROM SequelizeMeta');
      return (results as any[]).map(row => row.name);
    } catch (error) {
      console.error('获取已应用迁移列表失败:', error);
      return [];
    }
  }

  // 关闭连接
  async close(): Promise<void> {
    await this.sequelize.close();
  }
} 