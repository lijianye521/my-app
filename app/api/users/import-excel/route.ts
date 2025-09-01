import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { hash } from "bcryptjs";
import * as XLSX from 'xlsx';

// Excel导入用户API
export async function POST(req: NextRequest) {
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

    // 获取上传的文件
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "请选择要导入的Excel文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const fileType = file.type;
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (!validTypes.includes(fileType) && !file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: "只支持Excel文件格式(.xlsx或.xls)" },
        { status: 400 }
      );
    }

    // 读取Excel文件
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 将工作表转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '' 
    }) as string[][];

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "Excel文件内容为空或格式不正确" },
        { status: 400 }
      );
    }

    // 获取表头
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    // 查找需要的列索引
    const columnMap = {
      name: -1,        // 真实姓名
      email: -1,       // 邮箱  
      username: -1,    // 用户名
      nickname: -1,    // 昵称
      password: -1,    // 密码
      role: -1         // 管理员权限
    };

    // 根据表头查找列索引
    headers.forEach((header, index) => {
      const headerStr = String(header).trim();
      if (headerStr.includes('姓名') || headerStr.includes('真实姓名')) {
        columnMap.name = index;
      } else if (headerStr.includes('邮箱') || headerStr.includes('邮件')) {
        columnMap.email = index;
      } else if (headerStr.includes('用户名') || headerStr.includes('用户账号')) {
        columnMap.username = index;
      } else if (headerStr.includes('昵称') || headerStr.includes('显示名')) {
        columnMap.nickname = index;
      } else if (headerStr.includes('密码')) {
        columnMap.password = index;
      } else if (headerStr.includes('管理员') || headerStr.includes('权限')) {
        columnMap.role = index;
      }
    });

    console.log('列映射:', columnMap);
    console.log('表头:', headers);

    // 处理用户数据
    const results = {
      total: dataRows.length,
      success: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2; // Excel行号(从1开始，加上表头行)
      
      try {
        // 提取用户信息
        const userData = {
          name: columnMap.name >= 0 ? String(row[columnMap.name] || '').trim() : '',
          email: columnMap.email >= 0 ? String(row[columnMap.email] || '').trim() : '',
          username: columnMap.username >= 0 ? String(row[columnMap.username] || '').trim() : '',
          nickname: columnMap.nickname >= 0 ? String(row[columnMap.nickname] || '').trim() : '',
          password: columnMap.password >= 0 ? String(row[columnMap.password] || '').trim() : '123456',
          role: columnMap.role >= 0 ? String(row[columnMap.role] || '').trim() : 'user'
        };

        // 如果用户名为空，尝试使用邮箱前缀作为用户名
        if (!userData.username && userData.email) {
          userData.username = userData.email.split('@')[0];
        }

        // 验证必要字段
        if (!userData.username) {
          results.failed++;
          results.errors.push(`第${rowNum}行: 用户名不能为空`);
          continue;
        }

        // 检查用户是否已存在
        const [existingUsers] = await db.query(
          "SELECT username FROM users WHERE username = ? LIMIT 1",
          [userData.username]
        );
        
        const existingUserList = existingUsers as any[];
        if (existingUserList.length > 0) {
          results.skipped++;
          console.log(`跳过已存在的用户: ${userData.username}`);
          continue;
        }

        // 设置默认值
        if (!userData.nickname) {
          userData.nickname = userData.name || userData.username;
        }

        // 处理角色信息
        let finalRole = 'user';
        if (userData.role) {
          const roleStr = userData.role.toLowerCase();
          if (roleStr.includes('admin') || roleStr.includes('管理员')) {
            finalRole = 'admin';
          }
        }

        // 加密密码
        const hashedPassword = await hash(userData.password, 10);

        // 创建用户
        await db.query(
          `INSERT INTO users (username, password, nickname, email, role, is_active, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          [
            userData.username,
            hashedPassword,
            userData.nickname,
            userData.email || null,
            finalRole
          ]
        );

        results.success++;
        console.log(`成功创建用户: ${userData.username} (${finalRole})`);

      } catch (error: any) {
        results.failed++;
        console.error(`处理第${rowNum}行时出错:`, error);
        results.errors.push(`第${rowNum}行: ${error.message || '创建用户失败'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `导入完成: 成功${results.success}个，跳过${results.skipped}个，失败${results.failed}个`,
      results: results
    });

  } catch (error: any) {
    console.error("Excel导入失败:", error);
    return NextResponse.json(
      { error: error.message || "Excel导入过程中发生错误" },
      { status: 500 }
    );
  }
}
