import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    
    // 参数验证
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "令牌和新密码是必填项" },
        { status: 400 }
      );
    }
    
    // 在实际应用中，这里应该验证令牌的有效性，检查它是否存在于数据库中且未过期
    // 并且找到对应的用户
    // 由于这是演示版本，我们假设token是"demo-token"并更新admin用户的密码
    
    if (token !== "demo-token") {
      return NextResponse.json(
        { message: "令牌无效或已过期" },
        { status: 400 }
      );
    }
    
    // 获取数据库连接
    const db = await getDb();
    
    // 加密新密码
    const hashedPassword = await hash(newPassword, 10);
    
    // 更新用户密码
    await db.query(
      "UPDATE users SET password = ? WHERE username = ?",
      [hashedPassword, "admin"] // 在实际应用中，应该从令牌中获取用户ID
    );
    
    return NextResponse.json(
      { message: "密码重置成功" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("密码重置失败:", error);
    return NextResponse.json(
      { message: "密码重置过程中发生错误" },
      { status: 500 }
    );
  }
} 