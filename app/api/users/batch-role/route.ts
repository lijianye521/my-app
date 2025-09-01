import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// 批量设置用户角色API
export async function PUT(req: NextRequest) {
  try {
    // 验证当前用户是否已登录且是管理员
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const db = await getDb();
    
    // 查询用户是否是管理员
    const [adminRows] = await db.query(
      "SELECT role FROM users WHERE id = ? LIMIT 1",
      [session.user.id]
    );
    
    const adminResult = adminRows as any[];
    const isAdmin = adminResult[0]?.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "没有管理员权限" },
        { status: 403 }
      );
    }

    // 获取请求体
    const body = await req.json();
    const { userIds, role } = body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "请选择要修改的用户" },
        { status: 400 }
      );
    }

    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: "角色参数无效，只能设置为admin或user" },
        { status: 400 }
      );
    }

    // 批量更新用户角色
    const placeholders = userIds.map(() => '?').join(',');
    const [result] = await db.query(
      `UPDATE users SET role = ?, updated_at = NOW() WHERE id IN (${placeholders})`,
      [role, ...userIds]
    );

    const updateResult = result as any;
    const affectedRows = updateResult.affectedRows || 0;

    // 获取更新后的用户信息用于日志
    const [updatedUsers] = await db.query(
      `SELECT id, username, role FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    const users = updatedUsers as any[];
    console.log(`批量设置用户角色为${role}:`, users.map(u => `${u.username}(ID:${u.id})`).join(', '));

    return NextResponse.json({
      success: true,
      message: `成功将${affectedRows}个用户的角色设置为${role === 'admin' ? '管理员' : '普通用户'}`,
      affectedRows,
      updatedUsers: users
    });

  } catch (error: any) {
    console.error("批量设置用户角色失败:", error);
    return NextResponse.json(
      { error: error.message || "批量设置角色过程中发生错误" },
      { status: 500 }
    );
  }
}
