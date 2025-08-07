'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserOperationLog extends Model {
    static associate(models) {
      // 定义关联
      UserOperationLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  
  UserOperationLog.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '主键ID'
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: '用户ID'
    },
    operation_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '操作类型：add=新增，update=修改，delete=删除，access=访问'
    },
    service_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '操作的服务代码'
    },
    operation_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '操作详情，JSON格式记录具体变更内容'
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: '操作IP地址'
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '用户代理信息'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '操作时间'
    }
  }, {
    sequelize,
    modelName: 'UserOperationLog',
    tableName: 'user_operation_logs',
    timestamps: false, // 因为我们只使用created_at
  });
  
  return UserOperationLog;
}; 