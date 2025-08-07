#!/usr/bin/env node

/**
 * 数据库迁移命令行工具
 * 提供友好的界面来管理和执行数据库迁移
 * 
 * 使用方法:
 * node database/migrate.js <命令> [参数]
 * 
 * 命令:
 * - create <名称>   创建新的迁移文件
 * - up              应用所有未执行的迁移
 * - down            回滚最近一次迁移
 * - reset           回滚所有迁移然后重新应用
 * - status          查看迁移状态
 * - help            显示帮助信息
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 检查sequelize-cli是否安装
function checkDependencies() {
  try {
    execSync('npx sequelize-cli --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(`${colors.red}错误: sequelize-cli未安装${colors.reset}`);
    console.log('请先执行: npm install --save sequelize sequelize-cli mysql2');
    process.exit(1);
  }
}

// 创建新的迁移文件
function createMigration(name) {
  if (!name) {
    console.log(`${colors.red}错误: 请提供迁移名称${colors.reset}`);
    console.log('例如: node database/migrate.js create add-field-to-users');
    process.exit(1);
  }
  
  try {
    console.log(`${colors.cyan}正在创建迁移文件: ${name}${colors.reset}`);
    const output = execSync(`npx sequelize-cli migration:generate --name ${name}`).toString();
    console.log(output);
    
    // 提取新创建的文件路径
    const match = output.match(/New migration was created at (.*?)\./);
    if (match && match[1]) {
      console.log(`${colors.green}成功创建迁移文件: ${path.basename(match[1])}${colors.reset}`);
      console.log(`请编辑文件添加迁移内容: ${match[1]}`);
    }
  } catch (error) {
    console.log(`${colors.red}创建迁移文件失败: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 应用所有未执行的迁移
function runMigrations() {
  try {
    console.log(`${colors.cyan}正在应用所有未执行的迁移...${colors.reset}`);
    const output = execSync('npx sequelize-cli db:migrate').toString();
    console.log(output);
    console.log(`${colors.green}迁移成功应用${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}迁移应用失败: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 回滚最近一次迁移
function undoMigration() {
  try {
    console.log(`${colors.yellow}正在回滚最近一次迁移...${colors.reset}`);
    const output = execSync('npx sequelize-cli db:migrate:undo').toString();
    console.log(output);
    console.log(`${colors.green}迁移成功回滚${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}迁移回滚失败: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 回滚所有迁移然后重新应用
async function resetMigrations() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log(`${colors.yellow}警告: 此操作将回滚所有迁移然后重新应用${colors.reset}`);
  console.log(`${colors.yellow}这可能会导致数据丢失, 请确保已备份重要数据${colors.reset}`);
  
  rl.question(`${colors.bright}确定要继续吗? (y/N) ${colors.reset}`, async (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log(`${colors.yellow}正在回滚所有迁移...${colors.reset}`);
        execSync('npx sequelize-cli db:migrate:undo:all', { stdio: 'inherit' });
        
        console.log(`${colors.cyan}正在重新应用所有迁移...${colors.reset}`);
        execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        
        console.log(`${colors.green}迁移重置成功${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}迁移重置失败: ${error.message}${colors.reset}`);
      }
    } else {
      console.log('操作已取消');
    }
    rl.close();
  });
}

// 查看迁移状态
function migrationStatus() {
  try {
    console.log(`${colors.cyan}查询迁移状态...${colors.reset}`);
    execSync('npx sequelize-cli db:migrate:status', { stdio: 'inherit' });
  } catch (error) {
    console.log(`${colors.red}查询迁移状态失败: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
${colors.bright}数据库迁移工具${colors.reset}

${colors.cyan}使用方法:${colors.reset}
  node database/migrate.js <命令> [参数]

${colors.cyan}命令:${colors.reset}
  ${colors.green}create <名称>${colors.reset}   创建新的迁移文件
  ${colors.green}up${colors.reset}              应用所有未执行的迁移
  ${colors.green}down${colors.reset}            回滚最近一次迁移
  ${colors.green}reset${colors.reset}           回滚所有迁移然后重新应用
  ${colors.green}status${colors.reset}          查看迁移状态
  ${colors.green}help${colors.reset}            显示帮助信息

${colors.cyan}示例:${colors.reset}
  node database/migrate.js create add-field-to-users
  node database/migrate.js up
  node database/migrate.js status
  `);
}

// 主函数
async function main() {
  checkDependencies();
  
  const command = process.argv[2];
  const param = process.argv[3];
  
  switch (command) {
    case 'create':
      createMigration(param);
      break;
    
    case 'up':
      runMigrations();
      break;
    
    case 'down':
      undoMigration();
      break;
    
    case 'reset':
      await resetMigrations();
      break;
    
    case 'status':
      migrationStatus();
      break;
    
    case 'help':
    default:
      showHelp();
      break;
  }
}

// 执行主函数
main().catch(err => {
  console.error(`${colors.red}发生错误: ${err.message}${colors.reset}`);
  process.exit(1);
}); 