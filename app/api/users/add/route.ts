import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { logOperation } from "@/lib/operation-log-service";

export async function POST(req: Request) {
  try {
    // 验证用户是否已登录并且是管理员
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "未授权访问" },
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
        { success: false, message: "没有管理员权限" },
        { status: 403 }
      );
    }

    const { username, password, nickname, email, role = 'user' } = await req.json();
    
    // 参数验证
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "用户名和密码是必填项" },
        { status: 400 }
      );
    }
    
    // 检查用户名是否已存在
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    
    const users = existingUsers as any[];
    
    if (users.length > 0) {
      return NextResponse.json(
        { success: false, message: "用户名已存在" },
        { status: 409 }
      );
    }
    
    // 密码加密
    const hashedPassword = await hash(password, 10);
    
    // 创建新用户
    const [result] = await db.query(
      "INSERT INTO users (username, password, nickname, email, role) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, nickname || null, email || null, role]
    );
    
    const insertResult = result as any;
    const userId = insertResult.insertId;
    
    // 记录操作日志
    await logOperation({
      userId: session.user.id,
      action: "create_user",
      targetId: userId,
      details: `管理员创建用户: ${username}`,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown"
    });
    
    return NextResponse.json(
      { success: true, message: "用户添加成功", userId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("添加用户失败:", error);
    return NextResponse.json(
      { success: false, message: "添加用户过程中发生错误" },
      { status: 500 }
    );
  }
}
