'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * 添加agent类型支持到platform_services表
     * 修改service_type枚举类型，添加'agent'选项
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE platform_services 
      MODIFY COLUMN service_type ENUM('platform', 'service', 'agent') NOT NULL
    `);
  },

  async down (queryInterface, Sequelize) {
    /**
     * 回滚agent类型支持
     * 首先删除所有agent类型的记录，然后恢复枚举类型
     */
    await queryInterface.sequelize.query(`
      DELETE FROM platform_services WHERE service_type = 'agent'
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TABLE platform_services 
      MODIFY COLUMN service_type ENUM('platform', 'service') NOT NULL
    `);
  }
};
