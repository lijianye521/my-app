import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

// 修改用户密码API
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { password } = body;
    
    if (!password) {
      return NextResponse.json(
        { error: "密码不能为空" },
        { status: 400 }
      );
    }
    
    // 获取用户ID
    const userId = params.id;
    
    // 检查用户是否存在
    const [userRows] = await db.query(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [userId]
    );
    
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 更新密码
    await db.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: "密码修改成功" 
    });
  } catch (error) {
    console.error("修改密码失败:", error);
    return NextResponse.json(
      { error: "修改密码时发生错误" },
      { status: 500 }
    );
  }
}
