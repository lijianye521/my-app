'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlatformService extends Model {
    static associate(models) {
      // 定义关联
    }
  }
  
  PlatformService.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '主键ID'
    },
    service_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '服务代码，唯一标识'
    },
    service_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '服务名称'
    },
    service_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '服务描述信息'
    },
    service_type: {
      type: DataTypes.ENUM('platform', 'service'),
      allowNull: false,
      defaultValue: 'platform',
      comment: '服务类型：platform=管理平台，service=技术服务'
    },
    icon_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Settings',
      comment: '图标名称，对应lucide-react图标'
    },
    color_class: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'bg-blue-500',
      comment: '颜色CSS类名'
    },
    service_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '服务访问地址'
    },
    url_type: {
      type: DataTypes.ENUM('internal', 'terminal'),
      allowNull: false,
      defaultValue: 'internal',
      comment: '链接类型：internal=内网链接，terminal=终端命令'
    },
    other_information: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '其他信息，JSON格式存储'
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序权重，数字越小越靠前'
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      comment: '是否可见，1=可见，0=隐藏'
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
    modelName: 'PlatformService',
    tableName: 'platform_services',
    timestamps: false, // 因为我们手动定义了created_at和updated_at
  });
  
  return PlatformService;
}; 