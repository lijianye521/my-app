'use client';

import React from 'react';
import { Card, Typography, Space, theme } from 'antd';
import { ClockCircleOutlined, HourglassOutlined } from '@ant-design/icons';

interface ComingSoonProps {
  title?: string;
}

export default function ComingSoon({ title = "敬请期待" }: ComingSoonProps) {
  const { token } = theme.useToken();
  const { Title, Text } = Typography;

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
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            borderBottom: 'none'
          },
          body: { padding: '32px' }
        }}
        title={
          <Space align="center">
            <ClockCircleOutlined style={{ fontSize: 24 }} />
            <Title level={2} style={{ margin: 0, color: 'white' }}>
              {title}
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
            <HourglassOutlined 
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
