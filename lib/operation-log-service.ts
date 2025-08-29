/**
 * 用户操作日志服务
 * 负责记录用户的增删改操作，并自动清理超过30天的历史记录
 */

import { getDb } from './db';

export interface OperationLogData {
  userId: number;
  operationType: 'add' | 'update' | 'delete' | 'access';
  serviceCode?: string;
  operationDetail?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogQueryOptions {
  userId?: number;
  operationType?: string;
  serviceCode?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export class OperationLogService {
  
  /**
   * 记录用户操作日志
   */
  static async logOperation(data: OperationLogData): Promise<boolean> {
    try {
      const db = await getDb();
      
      // 记录操作日志
      await db.query(
        `INSERT INTO user_operation_logs 
        (user_id, operation_type, service_code, operation_detail, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.userId,
          data.operationType,
          data.serviceCode || null,
          data.operationDetail ? JSON.stringify(data.operationDetail) : null,
          data.ipAddress || null,
          data.userAgent || null
        ]
      );

      // 记录日志后，触发清理过期记录
      await this.cleanExpiredLogs();

      return true;
    } catch (error) {
      console.error('记录操作日志失败:', error);
      return false;
    }
  }

  /**
   * 清理超过30天的操作日志
   */
  static async cleanExpiredLogs(): Promise<number> {
    try {
      const db = await getDb();
      
      // 删除超过30天的记录
      const result = await db.query(
        `DELETE FROM user_operation_logs 
         WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`
      );

      const deletedCount = Array.isArray(result) ? result[0].affectedRows || 0 : 0;
      
      if (deletedCount > 0) {
        console.log(`已清理 ${deletedCount} 条超过30天的操作日志`);
      }

      return deletedCount;
    } catch (error) {
      console.error('清理过期日志失败:', error);
      return 0;
    }
  }

  /**
   * 查询操作日志
   */
  static async getLogs(options: LogQueryOptions = {}) {
    try {
      const db = await getDb();
      
      // 构建查询条件
      let whereConditions: string[] = [];
      let queryParams: any[] = [];

      if (options.userId) {
        whereConditions.push('user_id = ?');
        queryParams.push(options.userId);
      }

      if (options.operationType) {
        whereConditions.push('operation_type = ?');
        queryParams.push(options.operationType);
      }

      if (options.serviceCode) {
        whereConditions.push('service_code = ?');
        queryParams.push(options.serviceCode);
      }

      if (options.startDate) {
        whereConditions.push('created_at >= ?');
        queryParams.push(options.startDate);
      }

      if (options.endDate) {
        whereConditions.push('created_at <= ?');
        queryParams.push(options.endDate);
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ') 
        : '';

      const limit = options.limit || 100;
      const offset = options.offset || 0;

      // 查询总数
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM user_operation_logs uol
        LEFT JOIN users u ON uol.user_id = u.id
        ${whereClause}
      `;
      
      const countResult = await db.query(countQuery, queryParams);
      const total = Array.isArray(countResult) ? countResult[0][0]?.total || 0 : 0;

      // 查询日志列表
      const listQuery = `
        SELECT 
          uol.id,
          uol.operation_type,
          uol.service_code,
          uol.operation_detail,
          uol.ip_address,
          uol.user_agent,
          uol.created_at,
          u.username,
          u.nickname
        FROM user_operation_logs uol
        LEFT JOIN users u ON uol.user_id = u.id
        ${whereClause}
        ORDER BY uol.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(limit, offset);
      const listResult = await db.query(listQuery, queryParams);
      const logs = Array.isArray(listResult) ? listResult[0] : [];

      // 解析操作详情JSON
      const processedLogs = logs.map((log: any) => ({
        ...log,
        operation_detail: log.operation_detail ? 
          this.safeJsonParse(log.operation_detail) : null
      }));

      return {
        total,
        logs: processedLogs,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('查询操作日志失败:', error);
      return {
        total: 0,
        logs: [],
        page: 1,
        pageSize: options.limit || 100,
        totalPages: 0
      };
    }
  }

  /**
   * 获取指定服务的最近操作记录
   */
  static async getRecentLogs(serviceCode: string, limit: number = 10) {
    try {
      const db = await getDb();
      
      const query = `
        SELECT 
          uol.operation_type,
          uol.operation_detail,
          uol.created_at,
          u.username,
          u.nickname
        FROM user_operation_logs uol
        LEFT JOIN users u ON uol.user_id = u.id
        WHERE uol.service_code = ?
        ORDER BY uol.created_at DESC
        LIMIT ?
      `;

      const result = await db.query(query, [serviceCode, limit]);
      const logs = Array.isArray(result) ? result[0] : [];

      return logs.map((log: any) => ({
        ...log,
        operation_detail: log.operation_detail ? 
          this.safeJsonParse(log.operation_detail) : null
      }));
    } catch (error) {
      console.error('获取最近操作记录失败:', error);
      return [];
    }
  }

  /**
   * 获取用户操作统计
   */
  static async getOperationStats(userId?: number, days: number = 7) {
    try {
      const db = await getDb();
      
      let whereCondition = 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)';
      let queryParams = [days];

      if (userId) {
        whereCondition += ' AND user_id = ?';
        queryParams.push(userId);
      }

      const query = `
        SELECT 
          operation_type,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM user_operation_logs
        ${whereCondition}
        GROUP BY operation_type, DATE(created_at)
        ORDER BY date DESC, operation_type
      `;

      const result = await db.query(query, queryParams);
      return Array.isArray(result) ? result[0] : [];
    } catch (error) {
      console.error('获取操作统计失败:', error);
      return [];
    }
  }

  /**
   * 安全的JSON解析
   */
  private static safeJsonParse(jsonString: string) {
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString;
    }
  }

  /**
   * 从请求中提取IP地址
   */
  static getClientIP(request: Request): string {
    // 尝试从各种请求头中获取真实IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (clientIP) {
      return clientIP;
    }
    
    // 如果都没有，返回默认值
    return 'unknown';
  }

  /**
   * 从请求中提取User-Agent
   */
  static getUserAgent(request: Request): string {
    return request.headers.get('user-agent') || 'unknown';
  }
}

// 导出便捷方法
export const logOperation = OperationLogService.logOperation.bind(OperationLogService);
export const cleanExpiredLogs = OperationLogService.cleanExpiredLogs.bind(OperationLogService);
export const getLogs = OperationLogService.getLogs.bind(OperationLogService);
export const getRecentLogs = OperationLogService.getRecentLogs.bind(OperationLogService);
export const getOperationStats = OperationLogService.getOperationStats.bind(OperationLogService);
