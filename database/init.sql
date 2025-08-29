-- SQL initialization script for stock_lab database
-- Create database if not exists executed separately

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
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

INSERT INTO `users` (`username`, `password`, `nickname`, `email`)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin@company.com')
ON DUPLICATE KEY UPDATE username=username;

-- Platform services table
CREATE TABLE IF NOT EXISTS `platform_services` (
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

-- User operation logs table
CREATE TABLE IF NOT EXISTS `user_operation_logs` (
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
