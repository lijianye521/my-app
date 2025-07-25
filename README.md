# 股票产品实验室 - 企业管理平台

## 📋 项目简介

股票产品实验室是一个现代化的企业管理平台，专为金融科技公司设计。该平台提供统一的入口来管理各种业务平台和技术服务，支持 Wind 终端集成，提供直观的可视化界面。

## ✨ 功能特性

### 🏠 工作台

- 技术论坛快速访问
- 平台和服务统计概览
- 常用平台快速链接
- 技术服务展示

### ⚙️ 管理平台

- AINEWS 运营管理
- 指标服务管理
- F9 菜单管理
- 券商研报权限管理
- DocParser 密钥管理
- ENTI 管理员设置
- 邮件订阅管理
- Prompt 管理平台

### 🛠️ 技术服务

- Ocean 数据处理服务
- Cloud 云计算服务
- WSS 实时指标服务
- RAG 检索增强服务
- HTML 转图工具

### 🔧 配置管理

- 平台链接配置
- 服务地址配置
- 图标和颜色自定义
- 排序和布局调整

## 🏗️ 技术架构

- **前端**: Next.js 15 + React 19 + TypeScript
- **UI 框架**: Tailwind CSS + Radix UI
- **图标库**: Lucide React
- **后端**: MySQL 数据库
- **部署**: 支持 Wind 终端集成

## 📊 数据库设计

### 用户表 (users)

```sql
-- 创建用户表
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '用户密码（加密存储）',
  `nickname` varchar(100) DEFAULT NULL COMMENT '用户昵称',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱地址',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否激活，1=激活，0=禁用',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员账号
INSERT INTO `users` (`username`, `password`, `nickname`, `email`) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin@company.com');
```

### 平台服务配置表 (platform_services)

```sql
-- 创建平台服务配置表
CREATE TABLE `platform_services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `service_code` varchar(50) NOT NULL COMMENT '服务代码，唯一标识',
  `service_name` varchar(100) NOT NULL COMMENT '服务名称',
  `service_description` text COMMENT '服务描述信息',
  `service_type` enum('platform','service') NOT NULL DEFAULT 'platform' COMMENT '服务类型：platform=管理平台，service=技术服务',
  `icon_name` varchar(50) NOT NULL DEFAULT 'Settings' COMMENT '图标名称，对应lucide-react图标',
  `color_class` varchar(50) NOT NULL DEFAULT 'bg-blue-500' COMMENT '颜色CSS类名',
  `service_url` varchar(500) NOT NULL COMMENT '服务访问地址',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '排序权重，数字越小越靠前',
  `is_visible` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否可见，1=可见，0=隐藏',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_service_code` (`service_code`),
  KEY `idx_service_type` (`service_type`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台服务配置表';

-- 插入初始化数据 - 管理平台
INSERT INTO `platform_services` (`service_code`, `service_name`, `service_description`, `service_type`, `icon_name`, `color_class`, `service_url`, `sort_order`) VALUES
('ainews', 'AINEWS运营管理', 'AI新闻内容管理和发布平台', 'platform', 'FileText', 'bg-blue-500', '/ainews-admin', 1),
('indicators', '指标服务管理', '金融指标数据服务运营管理', 'platform', 'BarChart3', 'bg-green-500', '/indicators-admin', 2),
('f9menu', 'F9菜单管理', 'F9快捷菜单配置和权限管理', 'platform', 'Settings', 'bg-purple-500', '/f9menu-admin', 3),
('research', '券商研报权限', '定制券商研报访问权限管理', 'platform', 'Shield', 'bg-orange-500', '/research-admin', 4),
('docparser', 'DocParser密钥管理', '文档解析服务API密钥管理', 'platform', 'Key', 'bg-red-500', '/docparser-admin', 5),
('enti', 'ENTI管理员设置', '企业实体管理员权限配置', 'platform', 'Users', 'bg-indigo-500', '/enti-admin', 6),
('email', '邮件订阅管理', '邮件订阅服务运营管理', 'platform', 'Mail', 'bg-pink-500', '/email-admin', 7),
('prompt', 'Prompt管理平台', 'AI提示词模板管理和优化', 'platform', 'Code', 'bg-teal-500', '/prompt-admin', 8);

-- 插入初始化数据 - 技术服务
INSERT INTO `platform_services` (`service_code`, `service_name`, `service_description`, `service_type`, `icon_name`, `color_class`, `service_url`, `sort_order`) VALUES
('ocean', 'Ocean服务', '海量数据处理服务', 'service', 'Database', 'bg-blue-500', '/ocean', 1),
('cloud', 'Cloud服务', '云计算资源管理', 'service', 'Cloud', 'bg-green-500', '/cloud', 2),
('wss', 'WSS指标服务', 'WebSocket实时指标推送', 'service', 'Zap', 'bg-purple-500', '/wss', 3),
('rag', 'RAG服务', '检索增强生成服务', 'service', 'Globe', 'bg-orange-500', '/rag', 4),
('html2img', 'HTML转图工具', 'HTML页面转图片工具', 'service', 'FileText', 'bg-red-500', '/html2img', 5);
```

### 用户操作日志表 (user_operation_logs)

```sql
-- 创建用户操作日志表
CREATE TABLE `user_operation_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `operation_type` varchar(50) NOT NULL COMMENT '操作类型：add=新增，update=修改，delete=删除，access=访问',
  `service_code` varchar(50) DEFAULT NULL COMMENT '操作的服务代码',
  `operation_detail` text COMMENT '操作详情，JSON格式记录具体变更内容',
  `ip_address` varchar(45) DEFAULT NULL COMMENT '操作IP地址',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理信息',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_operation_type` (`operation_type`),
  KEY `idx_service_code` (`service_code`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户操作日志表';
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**

```bash
git clone http://10.106.18.36:8082/stock/web/stock.product.lab
cd stock.product.lab
```

2. **安装依赖**

```bash
npm install
```

3. **数据库初始化**

```bash
# 执行上述SQL脚本创建数据库表和初始数据
mysql -u username -p database_name < database/init.sql
```

4. **环境配置**

```bash
# 复制环境配置文件
cp .env.example .env

# 配置数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

5. **启动开发服务器**

```bash
npm run dev
```

6. **访问应用**

```
本地访问: http://localhost:3000
Wind终端访问: windlocal://open?http://localhost:3000
```

## 📱 使用说明

### Wind 终端集成

项目支持 Wind 终端的 windlocal 协议，点击平台链接时会自动在 Wind 终端中打开对应页面：

```javascript
function launch(params) {
  window.location.href = "windlocal://open?" + encodeURIComponent(params);
}
```

### 添加新平台/服务

1. 在数据库中插入新记录
2. 设置适当的图标名称（需在 iconOptions 中存在）
3. 配置颜色类名和访问地址
4. 设置排序权重和可见性

### 图标配置

系统支持 150+种 Lucide 图标，常用图标包括：

- `Settings` - 设置
- `Database` - 数据库
- `Shield` - 安全
- `Mail` - 邮件
- `Code` - 代码
- `BarChart3` - 图表

### 颜色主题

支持 20 种预设颜色主题：

- `bg-blue-500` - 蓝色
- `bg-green-500` - 绿色
- `bg-purple-500` - 紫色
- `bg-orange-500` - 橙色
- `bg-red-500` - 红色

## 🔄 API 设计建议

### 用户认证

```
POST /api/auth/login     # 用户登录
POST /api/auth/logout    # 用户登出
```

### 获取平台列表

```
GET /api/platforms?type=platform&visible=1
```

### 获取服务列表

```
GET /api/platforms?type=service&visible=1
```

### 更新配置

```
PUT /api/platforms/{service_code}  # 更新服务配置
```

### 批量排序

```
POST /api/platforms/reorder        # 批量更新排序
```

### 操作日志

```
GET /api/logs?user_id={id}&type={operation_type}  # 查询操作日志
```

## 🛠️ 开发指南

### 目录结构

```
app/
├── pages/           # 页面组件
│   ├── dashboard.tsx    # 工作台
│   ├── platforms.tsx    # 管理平台
│   ├── services.tsx     # 技术服务
│   ├── config.tsx       # 配置管理
│   ├── types.ts         # 类型定义
│   └── data.ts          # 静态数据
├── components/      # UI组件
├── page.tsx         # 主页面
└── layout.tsx       # 布局组件
```

### 添加新页面

1. 在`pages`目录创建新组件
2. 在`data.ts`中添加菜单项
3. 在主页面`renderContent`中添加路由

### 日志记录示例

记录用户操作日志：

```sql
INSERT INTO user_operation_logs (user_id, operation_type, service_code, operation_detail, ip_address)
VALUES (1, 'update', 'ainews', '{"field": "service_url", "old_value": "/old-path", "new_value": "/new-path"}', '192.168.1.100');
```

## 📞 联系方式

- 技术论坛: http://10.106.19.29:8090/
- Git 仓库: http://10.106.18.36:8082/stock/web/stock.product.lab

## 📄 许可证

内部项目，仅供公司内部使用。
