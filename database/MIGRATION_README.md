# 数据库迁移系统使用指南

## 目录
1. [简介](#简介)
2. [系统架构](#系统架构)
3. [基础操作](#基础操作)
4. [常见迁移场景](#常见迁移场景)
5. [迁移文件规范](#迁移文件规范)
6. [高级功能](#高级功能)
7. [故障排除](#故障排除)
8. [最佳实践](#最佳实践)

## 简介

数据库迁移是一种可追踪、可版本控制的方式来逐步修改数据库结构，确保所有环境（开发、测试、生产）的数据库结构保持一致。本项目使用 Sequelize ORM 作为迁移工具，实现了以下功能：

- 自动创建和更新数据库表结构
- 跟踪已应用的迁移记录
- 支持迁移回滚
- 与现有数据库初始化流程无缝集成

## 系统架构

### 文件结构

```
├── config/
│   └── config.json       # 数据库连接配置
├── migrations/           # 迁移文件目录
│   ├── 20250730070256-add-link-type-to-platform-services.js
│   └── ...
├── models/               # 数据模型定义
│   ├── index.js          # 模型索引文件
│   ├── user.js
│   ├── platformService.js
│   └── ...
├── lib/
│   ├── db.ts             # 数据库连接和初始化
│   └── migration-service.ts  # 迁移服务
└── database/
    └── init.sql          # 初始化SQL脚本
```

### 工作原理

1. 启动时，应用程序通过 `db.ts` 中的 `initializeDatabase()` 函数连接数据库
2. 首次运行时执行 `init.sql` 创建基本表结构
3. 然后调用 `MigrationService` 应用所有尚未执行的迁移
4. 迁移记录保存在 `SequelizeMeta` 表中，确保每个迁移只执行一次

## 基础操作

### 创建迁移文件

```bash
# 创建新的迁移文件
npx sequelize-cli migration:generate --name add-field-to-table
```

这将在 `migrations` 目录下创建一个新文件，格式为 `YYYYMMDDHHMMSS-add-field-to-table.js`。

### 编辑迁移文件

每个迁移文件包含两个主要方法：
- `up`: 定义要应用的更改
- `down`: 定义如何回滚这些更改

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加要执行的更改
    await queryInterface.addColumn('table_name', 'field_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: '字段说明'
    });
  },

  async down(queryInterface, Sequelize) {
    // 回滚操作
    await queryInterface.removeColumn('table_name', 'field_name');
  }
};
```

### 执行迁移

```bash
# 应用所有未执行的迁移
npx sequelize-cli db:migrate

# 回滚最近一次迁移
npx sequelize-cli db:migrate:undo

# 回滚所有迁移
npx sequelize-cli db:migrate:undo:all
```

## 常见迁移场景

### 1. 添加新字段

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'mobile', {
    type: Sequelize.STRING(20),
    allowNull: true,
    after: 'email', // 指定位置（MySQL特性）
    comment: '手机号码'
  });
  
  // 添加索引
  await queryInterface.addIndex('users', ['mobile'], {
    name: 'idx_mobile'
  });
}

async down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('users', 'idx_mobile');
  await queryInterface.removeColumn('users', 'mobile');
}
```

### 2. 创建新表

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('notifications', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '主键ID'
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: '通知标题'
    },
    // 其他字段...
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '创建时间'
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    comment: '表说明'
  });
}

async down(queryInterface, Sequelize) {
  await queryInterface.dropTable('notifications');
}
```

### 3. 修改字段

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(150), // 修改长度
    allowNull: false, // 修改约束
    unique: true // 添加唯一约束
  });
}

async down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(100), // 恢复原长度
    allowNull: true, // 恢复原约束
    unique: false // 移除唯一约束
  });
}
```

### 4. 删除表或字段

```javascript
async up(queryInterface, Sequelize) {
  // 删除字段
  await queryInterface.removeColumn('users', 'unused_field');
  
  // 删除表
  await queryInterface.dropTable('deprecated_table');
}

async down(queryInterface, Sequelize) {
  // 恢复表
  await queryInterface.createTable('deprecated_table', { /* ... */ });
  
  // 恢复字段
  await queryInterface.addColumn('users', 'unused_field', {
    type: Sequelize.STRING,
    // ...
  });
}
```

## 迁移文件规范

1. **命名规范**：使用描述性名称，如 `add-field-to-table`、`create-new-table`、`modify-field-type`
2. **单一职责**：每个迁移文件只处理一个逻辑变更
3. **完整回滚**：确保 `down` 方法能完全回滚 `up` 方法的所有操作
4. **字段注释**：为每个字段添加 `comment` 属性，说明其用途
5. **索引命名**：使用统一格式命名索引，如 `idx_table_field`

## 高级功能

### 1. 批量处理

使用事务确保多个操作的原子性：

```javascript
async up(queryInterface, Sequelize) {
  // 开启事务
  const transaction = await queryInterface.sequelize.transaction();
  
  try {
    // 多个操作
    await queryInterface.addColumn('table1', 'field1', { /* ... */ }, { transaction });
    await queryInterface.addColumn('table2', 'field2', { /* ... */ }, { transaction });
    
    // 提交事务
    await transaction.commit();
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    throw error;
  }
}
```

### 2. 条件迁移

根据数据库状态动态执行迁移：

```javascript
async up(queryInterface, Sequelize) {
  // 检查表是否存在
  const tables = await queryInterface.showAllTables();
  
  if (!tables.includes('my_table')) {
    await queryInterface.createTable('my_table', { /* ... */ });
  }
  
  // 检查字段是否存在
  const tableInfo = await queryInterface.describeTable('users');
  if (!tableInfo.mobile) {
    await queryInterface.addColumn('users', 'mobile', { /* ... */ });
  }
}
```

### 3. 数据迁移

迁移不仅限于结构变更，也可以包含数据操作：

```javascript
async up(queryInterface, Sequelize) {
  // 添加新字段
  await queryInterface.addColumn('users', 'full_name', {
    type: Sequelize.STRING(200),
    allowNull: true
  });
  
  // 更新数据
  await queryInterface.sequelize.query(`
    UPDATE users 
    SET full_name = CONCAT(first_name, ' ', last_name)
    WHERE full_name IS NULL
  `);
}
```

## 故障排除

### 常见问题及解决方案

1. **迁移失败**
   - 检查 SQL 语法错误
   - 验证字段类型和约束是否兼容
   - 确认引用的表和字段存在

2. **重复执行迁移**
   - 检查 `SequelizeMeta` 表中的记录
   - 如需重新执行，可手动删除对应记录：
     ```sql
     DELETE FROM SequelizeMeta WHERE name = '20250730070256-add-link-type-to-platform-services.js';
     ```

3. **回滚失败**
   - 确保 `down` 方法中的操作顺序正确（先删除外键，再删除表等）
   - 检查是否有依赖关系阻止回滚

4. **版本冲突**
   - 当多人同时开发时，可能创建相同时间戳的迁移
   - 解决：手动修改冲突文件的时间戳，或协调开发流程

## 最佳实践

1. **版本控制**
   - 将迁移文件纳入版本控制系统
   - 不要修改已提交到版本控制的迁移文件

2. **测试迁移**
   - 在应用到生产环境前，在测试环境验证迁移
   - 测试向上和向下迁移是否都能正常工作

3. **增量变更**
   - 避免大型破坏性变更
   - 拆分为多个小的、向后兼容的迁移

4. **数据备份**
   - 在执行重要迁移前备份数据库
   - 特别是在生产环境中

5. **同步模型**
   - 确保 Sequelize 模型定义与数据库结构保持同步
   - 迁移后更新相关模型文件

6. **文档化**
   - 记录重大结构变更
   - 对复杂迁移添加详细注释

---

本文档最后更新：2025年7月30日 