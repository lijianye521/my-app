import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

// 数据库状态检查API
export async function GET(req: NextRequest) {
  try {
    // 检查数据库连接状态
    const connectionStatus = await checkDatabaseConnection();

    // 返回结果
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: connectionStatus.success ? 'online' : 'offline',
      details: connectionStatus
    });
  } catch (error) {
    console.error('数据库状态检查失败:', error);
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      message: '数据库状态检查失败',
      error: (error as Error).message
    }, { status: 500 });
  }
} 