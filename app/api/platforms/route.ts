import { NextRequest, NextResponse } from 'next/server';
import { savePlatformService, deletePlatformService, getDb } from '@/lib/db';

// 获取平台/服务列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const db = await getDb();
    const [rows] = await db.query(
      'SELECT * FROM platform_services WHERE ? IS NULL OR service_type = ? ORDER BY sort_order', 
      [type, type]
    );
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('获取数据失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败', error },
      { status: 500 }
    );
  }
}

// 处理POST请求 - 新增或更新平台/服务
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 验证必填字段
    if (!data.id || !data.name || !data.url || !data.iconName || !data.color || !data.type) {
      return NextResponse.json(
        { success: false, message: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 保存到数据库
    const result = await savePlatformService({
      id: data.id,
      name: data.name,
      description: data.description || '',
      iconName: data.iconName,
      url: data.url,
      color: data.color,
      type: data.type,
      isNew: data.isNew
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: '保存成功' });
    } else {
      return NextResponse.json(
        { success: false, message: '数据库操作失败', error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('处理请求失败:', error);
    return NextResponse.json(
      { success: false, message: '处理请求失败', error },
      { status: 500 }
    );
  }
}

// 处理DELETE请求 - 删除平台/服务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少ID参数' },
        { status: 400 }
      );
    }

    // 从数据库删除
    const result = await deletePlatformService(id);

    if (result.success) {
      return NextResponse.json({ success: true, message: '删除成功' });
    } else {
      return NextResponse.json(
        { success: false, message: '删除失败', error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('处理删除请求失败:', error);
    return NextResponse.json(
      { success: false, message: '处理删除请求失败', error },
      { status: 500 }
    );
  }
}
