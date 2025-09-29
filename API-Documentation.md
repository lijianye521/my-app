# Stock Product Lab - API 接口文档

## 项目简介
股票产品实验室是一个企业级管理平台，提供用户管理、平台服务管理、操作日志等功能。

**基础URL**: `http://localhost:3000/api`

## 认证说明
- 大部分API需要用户登录认证（NextAuth）
- 管理员接口需要admin角色权限
- 请求需要携带有效的session

---

## 1. 用户认证相关接口

### 1.1 用户注册
**接口**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "string",      // 必填：用户名
  "password": "string",      // 必填：密码
  "nickname": "string",      // 可选：昵称
  "email": "string"          // 可选：邮箱
}
```

**响应示例**:
```json
{
  "message": "注册成功"
}
```

**状态码**:
- 201: 注册成功
- 400: 参数错误
- 409: 用户名已存在
- 500: 服务器错误

### 1.2 密码重置
**接口**: `POST /auth/reset-password`

**请求参数**:
```json
{
  "username": "string",      // 必填：用户名
  "email": "string",         // 必填：邮箱
  "newPassword": "string"    // 必填：新密码（至少6位）
}
```

**响应示例**:
```json
{
  "message": "密码重置成功，请使用新密码登录"
}
```

### 1.3 角色更新（临时接口）
**接口**: `GET /auth/update-role`

**功能**: 将当前登录用户角色更新为管理员

**响应示例**:
```json
{
  "success": true,
  "message": "用户 admin (ID: 1) 已更新为管理员权限",
  "session": {...}
}
```

---

## 2. 数据库状态接口

### 2.1 数据库状态检查
**接口**: `GET /db-status`

**功能**: 检查数据库连接状态

**响应示例**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "status": "online",
  "details": {
    "success": true,
    "connection": "正常"
  }
}
```

---

## 3. 用户管理接口（需要管理员权限）

### 3.1 获取用户列表
**接口**: `GET /users`

**权限**: 需要管理员权限

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "role": "admin",
      "is_active": 1,
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### 3.2 添加用户
**接口**: `POST /users/add`

**权限**: 需要管理员权限

**请求参数**:
```json
{
  "username": "string",      // 必填：用户名
  "password": "string",      // 必填：密码
  "nickname": "string",      // 可选：昵称
  "email": "string",         // 可选：邮箱
  "role": "user|admin"       // 可选：角色，默认为user
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户添加成功",
  "userId": 123
}
```

### 3.3 删除用户
**接口**: `DELETE /users/{id}`

**权限**: 需要管理员权限

**路径参数**:
- `id`: 用户ID

**响应示例**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

**注意**: 不能删除当前登录的用户

### 3.4 修改用户密码
**接口**: `PUT /users/{id}/password`

**权限**: 需要管理员权限

**路径参数**:
- `id`: 用户ID

**请求参数**:
```json
{
  "password": "string"       // 必填：新密码
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

### 3.5 批量设置用户角色
**接口**: `PUT /users/batch-role`

**权限**: 需要管理员权限

**请求参数**:
```json
{
  "userIds": [1, 2, 3],      // 必填：用户ID数组
  "role": "admin|user"       // 必填：要设置的角色
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "成功将3个用户的角色设置为管理员",
  "affectedRows": 3,
  "updatedUsers": [...]
}
```

### 3.6 Excel批量导入用户
**接口**: `POST /users/import-excel`

**权限**: 需要管理员权限

**请求**: 使用FormData上传Excel文件

**表格列映射**:
- 姓名/真实姓名 → name
- 邮箱/邮件 → email
- 用户名/用户账号 → username
- 昵称/显示名 → nickname
- 密码 → password（如未提供则默认为123456）
- 管理员/权限 → role

**响应示例**:
```json
{
  "success": true,
  "message": "导入完成: 成功5个，跳过2个，失败0个",
  "results": {
    "total": 7,
    "success": 5,
    "skipped": 2,
    "failed": 0,
    "errors": []
  }
}
```

---

## 4. 平台服务管理接口

### 4.1 获取平台和服务数据
**接口**: `GET /platforms`

**权限**: 需要登录

**响应示例**:
```json
{
  "platforms": [
    {
      "id": "platform_code",
      "name": "平台名称",
      "description": "平台描述",
      "iconName": "icon_name",
      "status": "运行中",
      "url": "http://example.com",
      "color": "blue",
      "urlType": "internal",
      "otherInformation": "其他信息"
    }
  ],
  "services": [...],
  "agents": [...]
}
```

### 4.2 更新排序
**接口**: `PUT /platforms`

**权限**: 需要登录

**请求参数**:
```json
{
  "items": [
    {
      "id": "service_code",
      "sortOrder": 1
    }
  ],
  "type": "platform|service|agent"
}
```

### 4.3 添加/更新平台服务
**接口**: `POST /platforms`

**权限**: 需要登录

**请求参数**:
```json
{
  "id": "string",            // 必填：服务代码
  "name": "string",          // 必填：服务名称
  "description": "string",   // 可选：描述
  "url": "string",           // 必填：URL地址
  "iconName": "string",      // 必填：图标名称
  "color": "string",         // 必填：颜色
  "type": "platform|service|agent", // 必填：类型
  "urlType": "internal|terminal",    // 必填：跳转方式
  "otherInformation": "string",      // 可选：其他信息
  "isNew": boolean           // 是否为新增
}
```

### 4.4 删除平台服务
**接口**: `DELETE /platforms?id={serviceCode}`

**权限**: 需要登录

**查询参数**:
- `id`: 服务代码

**响应示例**:
```json
{
  "success": true
}
```

---

## 5. 操作日志接口

### 5.1 查询操作日志
**接口**: `GET /operation-logs`

**权限**: 需要登录

**查询参数**:
- `userId`: 用户ID（可选）
- `operationType`: 操作类型（可选）
- `serviceCode`: 服务代码（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `limit`: 限制数量（默认50）
- `offset`: 偏移量（默认0）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "logs": [...],
    "total": 100
  }
}
```

### 5.2 获取操作统计
**接口**: `GET /operation-logs/stats`

**权限**: 需要登录

**查询参数**:
- `userId`: 用户ID（可选）
- `days`: 统计天数（默认7天）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 150,
      "byType": {
        "access": 100,
        "update": 30,
        "add": 15,
        "delete": 5
      }
    },
    "period": "7天",
    "userId": "全部用户"
  }
}
```

### 5.3 获取最近操作记录
**接口**: `GET /operation-logs/recent`

**权限**: 需要登录

**查询参数**:
- `serviceCode`: 服务代码（必填）
- `limit`: 限制数量（默认10）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "serviceCode": "platform_code",
    "logs": [...],
    "count": 5
  }
}
```

### 5.4 清理过期日志
**接口**: `DELETE /operation-logs`

**权限**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "message": "已清理 1000 条过期日志记录",
  "deletedCount": 1000
}
```

---

## 错误处理

### 通用错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

### 常见状态码
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权访问
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突
- `500`: 服务器错误

---

## 数据模型

### URL跳转类型说明
- `internal`: 浏览器新标签页打开
- `terminal`: Wind终端打开（使用windlocal协议）

### 用户角色
- `admin`: 管理员（完整权限）
- `user`: 普通用户（基础权限）

### 服务类型
- `platform`: 管理平台
- `service`: 技术服务
- `agent`: AI代理（新增类型）

### 操作类型
- `access`: 访问操作
- `add`: 添加操作
- `update`: 更新操作
- `delete`: 删除操作

---

## 注意事项

1. **认证机制**: 使用NextAuth进行session管理
2. **权限控制**: 管理员接口会验证用户角色
3. **操作日志**: 重要操作会自动记录日志
4. **数据验证**: 所有接口都有参数验证
5. **错误处理**: 统一的错误响应格式
6. **事务处理**: 关键操作使用数据库事务

## 开发环境
- 本地开发地址: `http://localhost:3000`
- 数据库: MySQL
- 认证: NextAuth.js
- 文档生成时间: 2024年

---

*该文档涵盖了项目中所有16个API接口的详细说明，包括请求参数、响应格式、权限要求等信息。*