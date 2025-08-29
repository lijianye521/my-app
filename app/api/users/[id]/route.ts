import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// 删除用户API
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户是否已登录且是管理员
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "未授权访问", success: false },
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
        { error: "没有管理员权限", success: false },
        { status: 403 }
      );
    }

    // 获取要删除的用户ID
    const userId = params.id;
    
    // 不允许删除自己
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "不能删除当前登录的用户", success: false },
        { status: 400 }
      );
    }
    
    // 检查用户是否存在
    const [userRows] = await db.query(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [userId]
    );
    
    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { error: "用户不存在", success: false },
        { status: 404 }
      );
    }
    
    // 删除用户
    await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: "用户删除成功" 
    });
  } catch (error) {
    console.error("删除用户失败:", error);
    return NextResponse.json(
      { error: "删除用户时发生错误", success: false },
      { status: 500 }
    );
  }
}
