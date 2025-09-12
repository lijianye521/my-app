// 首页
import { Card, Button, Space, Typography, theme } from "antd";
import {
  MessageOutlined,
  ExportOutlined,
  SettingOutlined,
  DatabaseOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { PageProps } from "./types";
import { iconOptions } from "./data";

// 获取图标组件
const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

// 访问平台/服务的函数 - 根据URL类型选择打开方式
function openItem(url: string, urlType?: string) {
  console.log("openItem", { url, urlType });
  
  if (urlType === 'internal') {
    // 内网链接 - 在新标签页中打开
    window.open(url, '_blank');
  } 
  // else if (urlType === 'internal_terminal') {
  //   // 终端内跳转 - 使用当前域名拼接
  //   const fullUrl = window.location.origin + url;
  //   window.open(fullUrl, '_blank');
  // } 
  else {
    // 终端命令或默认情况 - 使用windlocal协议
    window.location.href = "windlocal://open?" + encodeURIComponent(url);
  }
}

export default function Dashboard({
  managementPlatforms,
  techServices,
  onPageChange,
}: PageProps & { onPageChange?: (page: string) => void }) {
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  
  const handleForumClick = () => {
    window.open("http://10.106.19.29:8090/", "_blank");
  };

  console.log('Dashboard组件接收数据:', { 
    managementPlatforms, 
    techServicesLength: techServices?.length,
    managementPlatformsLength: managementPlatforms?.length
  });

  return (
    <div className="space-y-6">
      {/* 论坛大卡片 - 占据显著位置 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            hoverable
            onClick={handleForumClick}
            style={{
              height: 256,
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #4f46e5)',
              border: 'none',
              borderRadius: token.borderRadiusLG,
              color: 'white'
            }}
            styles={{
              body: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                position: 'relative'
              }
            }}
          >
            <Space direction="vertical" align="center" size="middle" style={{ textAlign: 'center' }}>
              <MessageOutlined style={{ fontSize: 56, color: 'white', marginBottom: 8 }} />
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                技术论坛
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, maxWidth: 280, lineHeight: 1.5 }}>
                新员工学习交流平台，技术分享与问题讨论
              </Text>
              <Button
                type="default"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  backdropFilter: 'blur(4px)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleForumClick();
                }}
                icon={<ExportOutlined />}
              >
                访问论坛
              </Button>
            </Space>
          </Card>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          height: '100%',
          gap: 16
        }}>
          <Card 
            hoverable
            style={{ 
              borderRadius: token.borderRadiusLG,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            styles={{
              body: { padding: '16px 20px' }
            }}
            onClick={() => onPageChange?.('platforms')}
          >
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space align="center" size="middle">
                <div style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                  borderRadius: token.borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: token.boxShadowSecondary
                }}>
                  <SettingOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: token.colorText }}>
                    管理平台
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    管理平台集
                  </Text>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: 28, 
                  fontWeight: 'bold', 
                  color: token.colorPrimary,
                  lineHeight: 1
                }}>
                  {managementPlatforms.length}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  个平台
                </Text>
              </div>
            </Space>
          </Card>

          <Card 
            hoverable
            style={{ 
              borderRadius: token.borderRadiusLG,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            styles={{
              body: { padding: '16px 20px' }
            }}
            onClick={() => onPageChange?.('services')}
          >
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space align="center" size="middle">
                <div style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${token.colorSuccess}, ${token.colorSuccessActive})`,
                  borderRadius: token.borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: token.boxShadowSecondary
                }}>
                  <DatabaseOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: token.colorText }}>
                    技术服务
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    提供技术服务
                  </Text>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: 28, 
                  fontWeight: 'bold', 
                  color: token.colorSuccess,
                  lineHeight: 1
                }}>
                  {techServices.length}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  个服务
                </Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>

      {/* 常用管理平台 */}
      <Card
        title={
          <Space align="center">
            <RiseOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <Title level={4} style={{ margin: 0 }}>常用管理平台</Title>
          </Space>
        }
        style={{ borderRadius: token.borderRadiusLG }}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managementPlatforms.map((platform) => {
              const Icon = getIconByName(platform.iconName);
              return (
                <div
                  key={platform.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => openItem(platform.url, platform.urlType)}
                >
                  <div
                    className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium group-hover:text-blue-600">
                      {platform.name}
                    </div>
                  </div>
                  <ExportOutlined style={{ fontSize: '16px' }} className="text-gray-400 group-hover:text-blue-600" />
                </div>
              );
            })}
          </div>
      </Card>

      {/* 技术服务 */}
      <Card
        title={
          <Space align="center">
            <DatabaseOutlined style={{ fontSize: 20, color: token.colorSuccess }} />
            <Title level={4} style={{ margin: 0 }}>技术服务</Title>
          </Space>
        }
        style={{ borderRadius: token.borderRadiusLG }}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techServices.map((service) => {
              const Icon = getIconByName(service.iconName);
              return (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => openItem(service.url, service.urlType)}
                >
                  <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium group-hover:text-blue-600">
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.description}
                    </div>
                  </div>
                  <ExportOutlined style={{ fontSize: '16px' }} className="text-gray-400 group-hover:text-blue-600" />
                </div>
              );
            })}
          </div>
      </Card>
    </div>
  );
}
