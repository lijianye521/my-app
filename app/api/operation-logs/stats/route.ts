import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { OperationLogService } from '@/lib/operation-log-service';

// GET - 获取操作统计数据
export async function GET(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "未授权访问" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // 解析查询参数
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;

    // 获取统计数据
    const stats = await OperationLogService.getOperationStats(userId, days);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        period: `${days}天`,
        userId: userId || '全部用户'
      }
    });

  } catch (error) {
    console.error('获取操作统计失败:', error);
    return NextResponse.json(
      { success: false, message: '获取操作统计失败' },
      { status: 500 }
    );
  }
}
