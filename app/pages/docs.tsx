'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Typography, 
  Space, 
  Menu,
  Layout,
  theme
} from 'antd';
import {
  BookOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  RightOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');

  const { Title, Text, Paragraph } = Typography;
  const { token } = theme.useToken();

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: '平台概览',
      icon: HomeOutlined,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>欢迎使用股票产品实验室管理平台</Title>
            <Paragraph>
              这是一个专为企业打造的综合管理平台，集成了多种管理工具和技术服务，帮助您高效管理各类业务系统。
            </Paragraph>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <Card>
              <Space align="center">
                <SettingOutlined style={{ fontSize: 32, color: token.colorPrimary }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>管理平台</Title>
                  <Text type="secondary">统一管理各类业务系统</Text>
                </div>
              </Space>
            </Card>

            <Card>
              <Space align="center">
                <DatabaseOutlined style={{ fontSize: 32, color: token.colorSuccess }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>技术服务</Title>
                  <Text type="secondary">提供各种技术支持服务</Text>
                </div>
              </Space>
            </Card>

            <Card>
              <Space align="center">
                <FileTextOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>操作日志</Title>
                  <Text type="secondary">记录和追踪所有操作</Text>
                </div>
              </Space>
            </Card>
          </div>
        </Space>
      )
    },
    {
      id: 'platforms',
      title: '管理平台使用',
      icon: SettingOutlined,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>如何管理平台服务</Title>
            <Paragraph>
              管理平台模块允许您添加、编辑和删除各种管理系统的快捷访问链接。
            </Paragraph>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card
              title={
                <Space>
                  <PlusOutlined style={{ color: token.colorSuccess }} />
                  添加新平台
                </Space>
              }
            >
              <ol style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>点击"管理平台"页面右上角的"添加新平台"按钮</li>
                <li>填写平台信息：
                  <ul style={{ marginLeft: 16, marginTop: 8, listStyleType: 'disc' }}>
                    <li><Text strong>服务代码：</Text>唯一标识符，用于系统内部识别</li>
                    <li><Text strong>服务名称：</Text>显示在界面上的名称</li>
                    <li><Text strong>描述：</Text>简要说明该平台的功能</li>
                    <li><Text strong>访问地址：</Text>平台的URL地址</li>
                    <li><Text strong>图标：</Text>选择合适的图标</li>
                    <li><Text strong>颜色：</Text>选择主题颜色</li>
                  </ul>
                </li>
                <li>选择链接类型：内网链接或终端命令</li>
                <li>点击"保存"完成添加</li>
              </ol>
            </Card>

            <Card
              title={
                <Space>
                  <EditOutlined style={{ color: token.colorPrimary }} />
                  编辑平台信息
                </Space>
              }
            >
              <ol style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>在平台卡片上点击"编辑"按钮（铅笔图标）</li>
                <li>修改需要更改的信息</li>
                <li>点击"保存"应用更改</li>
              </ol>
            </Card>

            <Card
              title={
                <Space>
                  <DeleteOutlined style={{ color: token.colorError }} />
                  删除平台
                </Space>
              }
            >
              <ol style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>在平台卡片上点击"删除"按钮（垃圾桶图标）</li>
                <li>确认删除操作</li>
                <li style={{ color: token.colorWarning }}>⚠️ 注意：删除操作不可恢复，请谨慎操作</li>
              </ol>
            </Card>
          </Space>
        </Space>
      )
    },
    {
      id: 'services',
      title: '技术服务管理',
      icon: DatabaseOutlined,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>技术服务配置</Title>
            <Paragraph>
              技术服务模块用于管理各种技术工具和服务的访问入口，操作方式与管理平台类似。
            </Paragraph>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <Card title="链接类型说明">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Tag color="default" style={{ marginBottom: 8 }}>内网链接</Tag>
                  <Paragraph style={{ fontSize: 14, margin: 0 }}>
                    普通的网页链接，点击后在浏览器中打开指定URL
                  </Paragraph>
                </div>
                <div>
                  <Tag color="default" style={{ marginBottom: 8 }}>终端命令</Tag>
                  <Paragraph style={{ fontSize: 14, margin: 0 }}>
                    使用 windlocal 协议执行的命令，适用于启动本地应用程序
                  </Paragraph>
                </div>
              </Space>
            </Card>

            <Card title="最佳实践">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space align="start">
                  <CheckCircleOutlined style={{ color: token.colorSuccess, marginTop: 2 }} />
                  <Text>使用有意义的服务代码</Text>
                </Space>
                <Space align="start">
                  <CheckCircleOutlined style={{ color: token.colorSuccess, marginTop: 2 }} />
                  <Text>编写清晰的描述信息</Text>
                </Space>
                <Space align="start">
                  <CheckCircleOutlined style={{ color: token.colorSuccess, marginTop: 2 }} />
                  <Text>选择合适的图标和颜色</Text>
                </Space>
                <Space align="start">
                  <CheckCircleOutlined style={{ color: token.colorSuccess, marginTop: 2 }} />
                  <Text>定期检查链接有效性</Text>
                </Space>
              </Space>
            </Card>
          </div>
        </Space>
      )
    },
    {
      id: 'logs',
      title: '操作日志查看',
      icon: FileTextOutlined,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>操作日志功能</Title>
            <Paragraph>
              操作日志记录了所有用户在平台上的操作行为，便于审计和问题追踪。
            </Paragraph>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card
              title={
                <Space>
                  <EyeOutlined style={{ color: token.colorPrimary }} />
                  查看操作记录
                </Space>
              }
            >
              <ul style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>• 点击左侧菜单"操作日志"进入日志页面</li>
                <li>• 查看所有用户的操作记录，包括增删改操作</li>
                <li>• 每条记录显示：操作类型、服务代码、操作用户、时间、详细信息</li>
              </ul>
            </Card>

            <Card
              title={
                <Space>
                  <FilterOutlined style={{ color: '#722ed1' }} />
                  筛选和搜索
                </Space>
              }
            >
              <ul style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>• <Text strong>操作类型：</Text>按新增、更新、删除、访问筛选</li>
                <li>• <Text strong>服务代码：</Text>查看特定服务的操作记录</li>
                <li>• <Text strong>日期范围：</Text>按时间范围筛选记录</li>
                <li>• 支持分页浏览，默认每页显示50条记录</li>
              </ul>
            </Card>

            <Card
              title={
                <Space>
                  <ReloadOutlined style={{ color: token.colorSuccess }} />
                  日志管理
                </Space>
              }
            >
              <ul style={{ paddingLeft: 16, lineHeight: '1.8' }}>
                <li>• 系统自动清理超过30天的历史记录</li>
                <li>• 可手动点击"清理过期日志"按钮进行清理</li>
                <li>• 所有操作都会自动记录，无需手动干预</li>
              </ul>
            </Card>
          </Space>
        </Space>
      )
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: ExclamationCircleOutlined,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>常见问题解答</Title>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card title="Q: 如何重置密码？">
              <Paragraph>
                A: 请联系系统管理员重置密码。当前版本暂不支持用户自助重置密码功能。
              </Paragraph>
            </Card>

            <Card title="Q: 为什么有些平台无法访问？">
              <Paragraph>
                A: 可能的原因包括：1) 网络连接问题；2) 平台服务器维护；3) 权限不足；4) URL配置错误。请检查网络连接或联系管理员。
              </Paragraph>
            </Card>

            <Card title="Q: 操作记录会保存多久？">
              <Paragraph>
                A: 系统会自动保留30天的操作记录，超过30天的记录会被自动清理以节省存储空间。
              </Paragraph>
            </Card>

            <Card title="Q: 如何添加新的技术服务？">
              <Paragraph>
                A: 进入"技术服务"页面，点击"添加新服务"按钮，填写服务信息并保存即可。请确保服务代码唯一且有意义。
              </Paragraph>
            </Card>

            <Card title="Q: 支持哪些浏览器？">
              <Paragraph>
                A: 建议使用现代浏览器，如 Chrome 90+、Firefox 88+、Safari 14+、Edge 90+。IE浏览器不被支持。
              </Paragraph>
            </Card>
          </Space>
        </Space>
      )
    }
  ];

  const currentSection = helpSections.find(section => section.id === activeSection);

  const menuItems = helpSections.map(section => ({
    key: section.id,
    icon: React.createElement(section.icon),
    label: section.title,
  }));

  return (
    <Layout style={{ height: '100%' }}>
      {/* 左侧导航 */}
      <Layout.Sider 
        width={256} 
        theme="light" 
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
      >
        <div style={{ padding: 16 }}>
          <Space style={{ marginBottom: 24 }}>
            <BookOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
            <Title level={4} style={{ margin: 0 }}>帮助中心</Title>
          </Space>
          
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            items={menuItems}
            onSelect={({ key }) => setActiveSection(key)}
            style={{ border: 'none' }}
          />
        </div>
      </Layout.Sider>

      {/* 右侧内容 */}
      <Layout.Content style={{ padding: 24, overflow: 'auto' }}>
        <div style={{ maxWidth: 1024 }}>
          {currentSection && (
            <div style={{ marginBottom: 24 }}>
              <Space align="center" size="middle">
                {React.createElement(currentSection.icon, { 
                  style: { fontSize: 32, color: token.colorPrimary } 
                })}
                <Title level={2} style={{ margin: 0 }}>{currentSection.title}</Title>
              </Space>
            </div>
          )}
          
          {currentSection?.content}
          
          {/* 底部信息 */}
          <div style={{ 
            marginTop: 32, 
            paddingTop: 24, 
            borderTop: `1px solid ${token.colorBorderSecondary}` 
          }}>
            <Card>
              <Space align="start">
                <InfoCircleOutlined style={{ 
                  color: token.colorPrimary, 
                  fontSize: 20, 
                  marginTop: 2 
                }} />
                <div>
                  <Title level={5} style={{ 
                    margin: 0, 
                    marginBottom: 4
                  }}>
                    需要更多帮助？
                  </Title>
                  <Paragraph style={{ margin: 0 }}>
                    如果您在使用过程中遇到问题，请联系技术支持团队或查看技术论坛获取更多信息。
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}