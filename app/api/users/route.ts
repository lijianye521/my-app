import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// 获取所有用户的API
export async function GET(req: NextRequest) {
  try {
    // 验证用户是否已登录并且是管理员
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

    // 获取所有用户信息
    const [rows] = await db.query("SELECT * FROM users");
    const users = rows as any[];

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json(
      { error: "获取用户列表时发生错误" },
      { status: 500 }
    );
  }
}
