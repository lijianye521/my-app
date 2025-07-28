import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { username, email } = await req.json();
    
    // 参数验证
    if (!username || !email) {
      return NextResponse.json(
        { message: "用户名和邮箱是必填项" },
        { status: 400 }
      );
    }
    
    // 获取数据库连接
    const db = await getDb();
    
    // 检查用户是否存在且邮箱匹配
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? AND email = ? AND is_active = 1 LIMIT 1",
      [username, email]
    );
    
    const users = rows as any[];
    const user = users[0];
    
    // 为安全起见，即使用户不存在，我们也返回成功，防止用户枚举
    if (!user) {
      return NextResponse.json(
        { message: "如果信息匹配，重置链接已发送到您的邮箱" },
        { status: 200 }
      );
    }
    
    // 创建重置令牌
    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 令牌有效期1小时
    
    // 在实际应用中，应该将token存入数据库，并发送邮件
    // 这里我们简化处理，仅返回令牌（实际应用中不应如此）
    
    return NextResponse.json(
      {
        message: "重置链接已发送到您的邮箱",
        // 实际应用中不要返回token，这里仅为演示
        token: token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("密码重置请求失败:", error);
    return NextResponse.json(
      { message: "请求处理过程中发生错误" },
      { status: 500 }
    );
  }
} 