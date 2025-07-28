import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, password, nickname, email } = await req.json();
    
    // 参数验证
    if (!username || !password) {
      return NextResponse.json(
        { message: "用户名和密码是必填项" },
        { status: 400 }
      );
    }
    
    // 获取数据库连接
    const db = await getDb();
    
    // 检查用户名是否已存在
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    
    const users = existingUsers as any[];
    
    if (users.length > 0) {
      return NextResponse.json(
        { message: "用户名已存在" },
        { status: 409 }
      );
    }
    
    // 密码加密
    const hashedPassword = await hash(password, 10);
    
    // 创建新用户
    await db.query(
      "INSERT INTO users (username, password, nickname, email) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, nickname || null, email || null]
    );
    
    return NextResponse.json(
      { message: "注册成功" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { message: "注册过程中发生错误" },
      { status: 500 }
    );
  }
} 