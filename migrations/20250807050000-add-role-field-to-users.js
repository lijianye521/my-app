'use strict';

module.exports = {
    async up(queryInterface, Sequelize) { // 为users表添加权限字段
        await queryInterface.addColumn('users', 'role', {
            type: Sequelize.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
            comment: '用户权限：admin=管理员，user=普通用户',
            after: 'email'
        });

        // 更新现有的admin用户为admin权限
        await queryInterface.sequelize.query("UPDATE users SET role = 'admin' WHERE username = 'admin'");
    },

    async down(queryInterface, Sequelize) { // 回滚时移除权限字段
        await queryInterface.removeColumn('users', 'role');
    }
};
