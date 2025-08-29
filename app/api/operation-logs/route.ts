import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { OperationLogService } from '@/lib/operation-log-service';

// GET - 查询操作日志
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
    const queryOptions = {
      userId: searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined,
      operationType: searchParams.get('operationType') || undefined,
      serviceCode: searchParams.get('serviceCode') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    // 获取日志数据
    const result = await OperationLogService.getLogs(queryOptions);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('查询操作日志失败:', error);
    return NextResponse.json(
      { success: false, message: '查询操作日志失败' },
      { status: 500 }
    );
  }
}

// DELETE - 手动清理过期日志
export async function DELETE(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "未授权访问" },
        { status: 401 }
      );
    }

    // 执行清理
    const deletedCount = await OperationLogService.cleanExpiredLogs();

    return NextResponse.json({
      success: true,
      message: `已清理 ${deletedCount} 条过期日志记录`,
      deletedCount
    });

  } catch (error) {
    console.error('清理过期日志失败:', error);
    return NextResponse.json(
      { success: false, message: '清理过期日志失败' },
      { status: 500 }
    );
  }
}
