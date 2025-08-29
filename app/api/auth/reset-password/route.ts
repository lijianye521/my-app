import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, email, newPassword } = await req.json();
    
    // 参数验证
    if (!username || !email || !newPassword) {
      return NextResponse.json(
        { message: "用户名、邮箱和新密码都是必填项" },
        { status: 400 }
      );
    }
    
    // 密码强度验证
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "密码长度至少为6位" },
        { status: 400 }
      );
    }
    
    // 获取数据库连接
    const db = await getDb();
    
    // 检查用户是否存在且邮箱匹配
    const [rows] = await db.query(
      "SELECT id, username FROM users WHERE username = ? AND email = ? AND is_active = 1 LIMIT 1",
      [username, email]
    );
    
    const users = rows as any[];
    const user = users[0];
    
    if (!user) {
      return NextResponse.json(
        { message: "用户名和邮箱不匹配，或用户不存在" },
        { status: 400 }
      );
    }
    
    // 加密新密码
    const hashedPassword = await hash(newPassword, 10);
    
    // 更新用户密码
    await db.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, user.id]
    );
    
    console.log(`用户 ${user.username} 的密码已成功重置`);
    
    return NextResponse.json(
      { message: "密码重置成功，请使用新密码登录" },
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
