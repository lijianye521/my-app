# Claude Code 项目记忆文档

> 此文档用于Claude Code快速重建项目上下文和历史记录
> 创建时间: 2025-09-05

## 🎯 项目概述

### 项目名称
**股票产品实验室 (Stock Product Lab)** - 企业级管理平台

### 核心定位
金融科技公司的统一入口平台，专门管理股票相关业务平台和技术服务，支持Wind终端集成。

### 主要用户
- **管理员**: 完整权限，管理用户、配置平台服务
- **普通用户**: 访问已配置的平台和服务
- **新员工**: 快速了解所有可用业务系统
- **技术/业务人员**: 使用各种专业工具和平台

## 🏗️ 技术架构

### 技术栈
```
前端: Next.js 15 + React 19 + TypeScript
UI框架: Tailwind CSS + Radix UI + Lucide React
后端: Next.js API Routes + NextAuth认证  
数据库: MySQL + Sequelize ORM
部署: 支持Wind终端集成 (windlocal协议)
```

### 项目结构
```
├── app/
│   ├── api/                    # API路由
│   │   ├── auth/              # 用户认证
│   │   ├── platforms/         # 平台服务管理
│   │   ├── users/             # 用户管理
│   │   └── operation-logs/    # 操作日志
│   ├── pages/                 # 页面组件
│   │   ├── dashboard.tsx      # 工作台
│   │   ├── platforms.tsx      # 管理平台
│   │   ├── services.tsx       # 技术服务
│   │   ├── users.tsx          # 用户管理
│   │   ├── form-dialog.tsx    # 配置弹窗
│   │   ├── types.ts           # 类型定义
│   │   └── data.ts            # 静态数据配置
│   ├── globals.css            # 全局样式
│   └── page.tsx               # 主入口
├── components/                # UI组件
├── lib/                       # 工具库
│   ├── db.ts                 # 数据库连接
│   └── operation-log-service.ts # 操作日志
├── models/                    # 数据模型
└── migrations/               # 数据库迁移
```

## 💾 数据库设计

### 核心数据表

#### 1. users (用户表)
```sql
- id: 主键
- username: 用户名 (唯一)
- password: 加密密码
- email: 邮箱
- role: 角色 (admin/user)  
- is_active: 激活状态
```

#### 2. platform_services (平台服务配置表)
```sql
- id: 主键
- service_code: 服务代码 (唯一标识)
- service_name: 服务名称
- service_description: 服务描述
- service_type: 类型 (platform/service)
- icon_name: 图标名称 (Lucide图标)
- color_class: 颜色CSS类
- service_url: 访问地址
- url_type: 跳转方式 (internal/terminal/internal_terminal)
- sort_order: 排序权重
- is_visible: 显示状态
```

#### 3. user_operation_logs (操作日志表)
```sql
- id: 主键
- user_id: 用户ID
- operation_type: 操作类型 (add/update/delete/access)
- service_code: 操作的服务代码
- operation_detail: 详细内容 (JSON)
- ip_address: IP地址
- user_agent: 用户代理
- created_at: 操作时间
```

## 🔄 业务逻辑流程

### 用户访问流程
```
用户登录 → NextAuth验证 → 角色权限过滤 → 获取配置数据 → 根据URL类型跳转 → 记录操作日志
```

### URL跳转逻辑
```javascript
// 三种跳转方式
if (urlType === 'internal') {
  window.open(url, '_blank');  // 浏览器新标签页
} else if (urlType === 'internal_terminal') {
  window.open(origin + url, '_blank');  // 当前域名拼接 [已废弃]
} else {
  window.location.href = "windlocal://open?" + encodeURIComponent(url);  // Wind终端
}
```

### 配置管理流程
```
管理员操作 → 表单验证 → 数据库更新 → 前端状态更新 → 操作日志记录
```

## 📋 功能模块

### 1. 工作台 (Dashboard)
- 技术论坛快速入口 (http://10.106.19.29:8090/)
- 平台服务统计概览
- 常用平台快速访问

### 2. 管理平台 (Platforms)
预设平台包括：
- AINEWS运营管理
- 指标服务管理
- F9菜单管理  
- 券商研报权限管理
- DocParser密钥管理
- ENTI管理员设置
- 邮件订阅管理
- Prompt管理平台

### 3. 技术服务 (Services)
预设服务包括：
- Ocean数据处理服务
- Cloud云计算服务  
- WSS实时指标服务
- RAG检索增强服务
- HTML转图工具

### 4. 用户管理 (仅管理员)
- 用户CRUD操作
- 批量角色分配
- Excel批量导入
- 密码重置

### 5. 操作日志
- 完整操作审计
- 实时统计显示
- 详细变更记录

## 🎨 UI/UX特色

### 图标系统
- 150+种Lucide图标可选
- 动态图标配置

### 颜色主题  
- 20种预设颜色方案
- 实时颜色预览

### 交互功能
- 拖拽排序
- 实时通知 (Toast)
- 响应式设计

## 🔧 重要配置

### 环境变量 (.env)
```
DB_HOST=localhost
DB_PORT=3306  
DB_USER=root2
DB_PASSWORD=123456
DB_NAME=stock_lab
```

### Wind终端集成
```
本地访问: http://localhost:3000
Wind访问: windlocal://open?http://localhost:3000  
```

## 📝 修改历史记录

### 2025-09-05 修改记录

#### 1. 取消 internal_terminal 跳转方式
**原因**: 不再需要这种跳转方式
**修改内容**:
- ✅ 注释掉 `app/pages/data.ts` 中的 internal_terminal 选项
- ✅ 注释掉 `dashboard.tsx`, `services.tsx`, `platforms.tsx` 中的处理逻辑
- ✅ 修改 `form-dialog.tsx` 的默认值和条件判断
- ✅ 在 `types.ts` 中添加废弃说明
**状态**: 已完成，保留类型定义用于兼容性

#### 2. UI文案优化  
**修改内容**:
- ✅ "内网链接" → "URL跳转" (更易懂)
- ✅ 描述文案更新为 "直接在浏览器新标签页中打开链接"
- ✅ placeholder文案相应调整
**状态**: 已完成

#### 3. Select组件样式优化
**问题**: 下拉框左侧黑线 + 聚焦时下移
**解决方案**:
- ✅ 移除聚焦时的额外border样式 (`focus:ring-2 focus:ring-blue-500 focus:border-blue-500`)
- ✅ 在 `globals.css` 中添加 option 元素强制样式
- ✅ 添加 `boxSizing: 'border-box'` 确保盒模型一致
**状态**: 已完成

## 🧠 项目记忆要点

### 关键业务理解
1. **统一入口**: 这是一个企业级平台聚合器，不是单一业务系统
2. **Wind集成**: 金融行业特有的终端集成是核心特色
3. **动态配置**: 平台和服务都可以动态添加配置，不是硬编码
4. **权限分级**: 管理员和普通用户有不同的功能权限
5. **操作审计**: 所有关键操作都有完整的日志记录

### 技术特点
1. **现代化**: 使用最新的Next.js 15 + React 19
2. **类型安全**: 完整的TypeScript类型定义
3. **组件化**: 高度模块化的组件设计
4. **响应式**: 支持各种设备尺寸
5. **可扩展**: 图标、颜色、功能都支持扩展

### 当前状态
- ✅ 基础功能完善
- ✅ UI样式优化完成  
- ✅ URL跳转方式已调整
- 🔄 项目处于稳定运行状态

---

## 📞 快速联系方式
- 技术论坛: http://10.106.19.29:8090/
- Git仓库: http://10.106.18.36:8082/stock/web/stock.product.lab

---
*此文档会随项目发展持续更新，确保Claude Code能快速重建项目上下文*