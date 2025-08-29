import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { OperationLogService } from "@/lib/operation-log-service";

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
    
    // 获取用户ID (假设session.user有id字段，否则需要查询数据库)
    let userId;
    if (session.user?.email) {
      const [userRows] = await db.query(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        [session.user.email, session.user.email]
      );
      userId = (userRows as any[])[0]?.id;
    }

    // 记录操作详情
    const operationDetail: any = {
      serviceCode: data.id,
      serviceName: data.name,
      serviceType: data.type,
      url: data.url,
      iconName: data.iconName,
      color: data.color,
      urlType: data.urlType
    };

    if (data.isNew) {
      // 新增记录
      await db.query(
        `INSERT INTO platform_services 
        (service_code, service_name, service_description, service_type, icon_name, color_class, service_url, url_type, other_information) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.description || '', data.type, data.iconName, data.color, data.url, data.urlType, data.otherInformation || null]
      );

      // 记录新增操作日志
      if (userId) {
        await OperationLogService.logOperation({
          userId,
          operationType: 'add',
          serviceCode: data.id,
          operationDetail,
          ipAddress: OperationLogService.getClientIP(request),
          userAgent: OperationLogService.getUserAgent(request)
        });
      }
    } else {
      // 查询更新前的数据
      const [oldDataRows] = await db.query(
        "SELECT * FROM platform_services WHERE service_code = ?",
        [data.id]
      );
      const oldData = (oldDataRows as any[])[0];

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

      // 记录更新操作日志，包含变更内容
      if (userId && oldData) {
        const changes: any = {};
        if (oldData.service_name !== data.name) changes.name = { old: oldData.service_name, new: data.name };
        if (oldData.service_description !== (data.description || '')) changes.description = { old: oldData.service_description, new: data.description || '' };
        if (oldData.icon_name !== data.iconName) changes.iconName = { old: oldData.icon_name, new: data.iconName };
        if (oldData.color_class !== data.color) changes.color = { old: oldData.color_class, new: data.color };
        if (oldData.service_url !== data.url) changes.url = { old: oldData.service_url, new: data.url };
        if (oldData.url_type !== data.urlType) changes.urlType = { old: oldData.url_type, new: data.urlType };
        if (oldData.other_information !== (data.otherInformation || null)) changes.otherInformation = { old: oldData.other_information, new: data.otherInformation || null };

        await OperationLogService.logOperation({
          userId,
          operationType: 'update',
          serviceCode: data.id,
          operationDetail: { ...operationDetail, changes },
          ipAddress: OperationLogService.getClientIP(request),
          userAgent: OperationLogService.getUserAgent(request)
        });
      }
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

    // 获取用户ID
    let userId;
    if (session.user?.email) {
      const [userRows] = await db.query(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        [session.user.email, session.user.email]
      );
      userId = (userRows as any[])[0]?.id;
    }

    // 查询要删除的记录详情，用于日志记录
    const [deleteDataRows] = await db.query(
      "SELECT * FROM platform_services WHERE service_code = ?",
      [id]
    );
    const deleteData = (deleteDataRows as any[])[0];
    
    // 删除记录
    await db.query(
      "DELETE FROM platform_services WHERE service_code = ?",
      [id]
    );

    // 记录删除操作日志
    if (userId && deleteData) {
      await OperationLogService.logOperation({
        userId,
        operationType: 'delete',
        serviceCode: id,
        operationDetail: {
          deletedData: {
            serviceCode: deleteData.service_code,
            serviceName: deleteData.service_name,
            serviceType: deleteData.service_type,
            url: deleteData.service_url,
            iconName: deleteData.icon_name,
            color: deleteData.color_class,
            urlType: deleteData.url_type,
            description: deleteData.service_description,
            otherInformation: deleteData.other_information
          }
        },
        ipAddress: OperationLogService.getClientIP(request),
        userAgent: OperationLogService.getUserAgent(request)
      });
    }
    
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
