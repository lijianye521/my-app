import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";

// 临时API端点，用于更新当前用户的角色为管理员
export async function GET(req: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    // 获取当前用户ID
    const userId = session.user.id;
    const username = session.user.username;

    // 使用数据库连接更新用户角色
    const db = await getDb();
    await db.query(
      "UPDATE users SET role = 'admin' WHERE id = ?",
      [userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: `用户 ${username} (ID: ${userId}) 已更新为管理员权限`,
      session: session
    });
  } catch (error) {
    console.error("更新用户角色失败:", error);
    return NextResponse.json(
      { error: "更新用户角色时发生错误" },
      { status: 500 }
    );
  }
}
