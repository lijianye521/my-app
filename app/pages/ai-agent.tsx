'use client';

import React from 'react';
import { Card, Typography, Space, theme } from 'antd';
import { StarOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';

export default function AIAgent() {
  const { token } = theme.useToken();
  const { Title, Text, Paragraph } = Typography;

  // 特性项组件123
  const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      padding: 16,
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`
    }}>
      <div style={{
        marginRight: 16,
        backgroundColor: token.colorPrimaryBg,
        padding: 12,
        borderRadius: '50%'
      }}>
        {icon}
      </div>
      <div>
        <Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
          {title}
        </Title>
        <Paragraph style={{ margin: 0, fontSize: 14, color: token.colorTextSecondary }}>
          {description}
        </Paragraph>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px 0' }}>
      <Card
        style={{
          width: '100%',
          overflow: 'hidden',
          border: 'none',
          boxShadow: token.boxShadowSecondary,
        }}
        styles={{
          header: {
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            borderBottom: 'none'
          },
          body: { padding: '32px' }
        }}
        title={
          <Space align="center">
            <StarOutlined style={{ fontSize: 24 }} />
            <Title level={2} style={{ margin: 0, color: 'white' }}>
              AI 智能助手
            </Title>
          </Space>
        }
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 0',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: 24,
            height: 96,
            width: 96,
            borderRadius: '50%',
            backgroundColor: token.colorPrimaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BulbOutlined 
              style={{ 
                fontSize: 48, 
                color: token.colorPrimary,
                animation: 'pulse 2s infinite'
              }} 
            />
          </div>
          <Title level={1} style={{ marginBottom: 8, color: token.colorText }}>
            努力开发中
          </Title>
          <div style={{
            marginBottom: 32,
            padding: '16px 32px',
            backgroundColor: token.colorPrimaryBg,
            borderRadius: token.borderRadiusLG,
            display: 'inline-block'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 600,
              color: token.colorPrimary
            }}>
              预计2025.9.12日前上线
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
