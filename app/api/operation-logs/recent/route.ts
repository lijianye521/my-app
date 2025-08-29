import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { OperationLogService } from '@/lib/operation-log-service';

// GET - 获取指定服务的最近操作记录
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
    const serviceCode = searchParams.get('serviceCode');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    if (!serviceCode) {
      return NextResponse.json(
        { success: false, message: "缺少serviceCode参数" },
        { status: 400 }
      );
    }

    // 获取最近操作记录
    const logs = await OperationLogService.getRecentLogs(serviceCode, limit);

    return NextResponse.json({
      success: true,
      data: {
        serviceCode,
        logs,
        count: logs.length
      }
    });

  } catch (error) {
    console.error('获取最近操作记录失败:', error);
    return NextResponse.json(
      { success: false, message: '获取最近操作记录失败' },
      { status: 500 }
    );
  }
}
