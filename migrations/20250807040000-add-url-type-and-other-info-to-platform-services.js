'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加 url_type 字段
    await queryInterface.addColumn('platform_services', 'url_type', {
      type: Sequelize.ENUM('internal', 'terminal'),
      allowNull: false,
      defaultValue: 'internal',
      comment: '链接类型：internal=内网链接，terminal=终端命令',
      after: 'service_url'
    });

    // 添加 other_information 字段
    await queryInterface.addColumn('platform_services', 'other_information', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: '其他信息，JSON格式存储',
      after: 'url_type'
    });

    // 移除原有的 link_type 字段（如果存在）
    const tableInfo = await queryInterface.describeTable('platform_services');
    if (tableInfo.link_type) {
      await queryInterface.removeColumn('platform_services', 'link_type');
    }
  },

  async down(queryInterface, Sequelize) {
    // 回滚时移除添加的字段
    await queryInterface.removeColumn('platform_services', 'url_type');
    await queryInterface.removeColumn('platform_services', 'other_information');
    
    // 重新添加 link_type 字段（如果需要的话）
    await queryInterface.addColumn('platform_services', 'link_type', {
      type: Sequelize.ENUM('internal', 'external', 'iframe'),
      allowNull: false,
      defaultValue: 'external',
      comment: '链接类型：internal=内部链接，external=外部链接，iframe=嵌入式链接'
    });
  }
};