'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 定义关联
    }
  }
  
  User.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '主键ID'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '用户密码（加密存储）'
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '用户昵称'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '邮箱地址'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      comment: '是否激活，1=激活，0=禁用'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '更新时间'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false, // 因为我们手动定义了created_at和updated_at
  });
  
  return User;
}; 