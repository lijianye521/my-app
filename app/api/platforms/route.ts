import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    
    // 获取平台数据
    const [platformRows] = await db.query(
      "SELECT * FROM platform_services WHERE service_type = 'platform' ORDER BY sort_order"
    );
    
    // 获取服务数据
    const [serviceRows] = await db.query(
      "SELECT * FROM platform_services WHERE service_type = 'service' ORDER BY sort_order"
    );

    // 转换数据格式
    const platforms = (platformRows as any[]).map((item) => ({
      id: item.service_code,
      name: item.service_name,
      description: item.service_description,
      iconName: item.icon_name,
      status: item.is_visible ? "运行中" : "停用",
      url: item.service_url,
      color: item.color_class,
      urlType: item.url_type,
      otherInformation: item.other_information,
    }));

    const services = (serviceRows as any[]).map((item) => ({
      id: item.service_code,
      name: item.service_name,
      description: item.service_description,
      iconName: item.icon_name,
      url: item.service_url,
      color: item.color_class,
      urlType: item.url_type,
      otherInformation: item.other_information,
    }));
    
    return NextResponse.json({
      platforms,
      services
    });
  } catch (error) {
    console.error("获取平台和服务数据失败:", error);
    return NextResponse.json(
      { message: "获取数据失败" },
      { status: 500 }
    );
  }
}

// 处理平台/服务排序更新
export async function PUT(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }
    
    const { items, type } = await request.json();
    
    if (!items || !Array.isArray(items) || !type) {
      return NextResponse.json(
        { message: "无效的请求数据" },
        { status: 400 }
      );
    }
    
    const result = await updatePlatformServiceOrder(items, type);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "更新排序失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("更新排序失败:", error);
    return NextResponse.json(
      { success: false, message: "更新排序过程中发生错误" },
      { status: 500 }
    );
  }
}

// 处理POST请求 - 添加或更新平台/服务
export async function POST(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // 验证必填字段
    if (!data.id || !data.name || !data.url || !data.iconName || !data.color || !data.type || !data.urlType) {
      return NextResponse.json(
        { message: "缺少必要字段" },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    if (data.isNew) {
      // 新增记录
      await db.query(
        `INSERT INTO platform_services 
        (service_code, service_name, service_description, service_type, icon_name, color_class, service_url, url_type, other_information) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.description || '', data.type, data.iconName, data.color, data.url, data.urlType, data.otherInformation || null]
      );
    } else {
      // 更新记录
      await db.query(
        `UPDATE platform_services 
        SET service_name = ?, 
            service_description = ?, 
            icon_name = ?, 
            color_class = ?, 
            service_url = ?, 
            url_type = ?, 
            other_information = ? 
        WHERE service_code = ?`,
        [data.name, data.description || '', data.iconName, data.color, data.url, data.urlType, data.otherInformation || null, data.id]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('处理POST请求失败:', error);
    return NextResponse.json(
      { success: false, message: '处理POST请求失败' },
      { status: 500 }
    );
  }
}

// 处理DELETE请求 - 删除平台/服务
export async function DELETE(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "缺少ID参数" },
        { status: 400 }
      );
    }
    
    // 调用删除函数
    const db = await getDb();
    
    // 删除记录
    await db.query(
      "DELETE FROM platform_services WHERE service_code = ?",
      [id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('处理删除请求失败:', error);
    return NextResponse.json(
      { success: false, message: '处理删除请求失败' },
      { status: 500 }
    );
  }
}

// 从db.ts导入此函数
async function updatePlatformServiceOrder(items: {id: string, sortOrder: number}[], type: 'platform' | 'service') {
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
