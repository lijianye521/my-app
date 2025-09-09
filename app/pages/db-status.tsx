"use client";

import { useState, useEffect } from "react";
import { Button, Card, Typography, Space, Spin, theme } from "antd";
import { DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, ReloadOutlined } from "@ant-design/icons";

interface DbStatus {
  timestamp: string;
  status: string;
  details: {
    success: boolean;
    message: string;
    host?: string;
    database?: string;
    version?: string;
    connections?: string;
    error?: string;
  };
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const { Title, Text, Paragraph } = Typography;

  // 检查数据库连接状态
  const checkDbStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/db-status');
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('获取数据库状态失败:', error);
      setStatus({
        timestamp: new Date().toISOString(),
        status: 'error',
        details: {
          success: false,
          message: `请求失败: ${(error as Error).message}`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动检查一次
  useEffect(() => {
    checkDbStatus();
  }, []);

  // 获取状态图标
  const getStatusIcon = () => {
    if (status?.status === 'online') {
      return <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: 16 }} />;
    } else if (status?.status === 'offline') {
      return <CloseCircleOutlined style={{ color: token.colorError, fontSize: 16 }} />;
    } else {
      return <WarningOutlined style={{ color: token.colorWarning, fontSize: 16 }} />;
    }
  };

  // 获取状态颜色
  const getStatusColor = () => {
    if (status?.status === 'online') return token.colorSuccess;
    if (status?.status === 'offline') return token.colorError;
    return token.colorWarning;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        数据库连接状态
      </Title>
      
      <Card
        style={{ marginBottom: 24 }}
        title={
          <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space align="center">
              <DatabaseOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
              <span>数据库状态</span>
            </Space>
            {getStatusIcon()}
          </Space>
        }
        extra={
          <Text type="secondary">
            最后检查时间: {status?.timestamp ? new Date(status.timestamp).toLocaleString('zh-CN') : '加载中...'}
          </Text>
        }
      >
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '32px 0' 
          }}>
            <Space direction="vertical" align="center">
              <Spin size="large" />
              <Text>检查中...</Text>
            </Space>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 2fr', 
              gap: 16,
              alignItems: 'center'
            }}>
              <Text strong>连接状态:</Text>
              <Text style={{ 
                color: status?.details.success ? token.colorSuccess : token.colorError 
              }}>
                {status?.details.message || '未知'}
              </Text>
            </div>
            
            {status?.details.host && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr', 
                gap: 16,
                alignItems: 'center'
              }}>
                <Text strong>主机:</Text>
                <Text>{status.details.host}</Text>
              </div>
            )}
            
            {status?.details.database && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr', 
                gap: 16,
                alignItems: 'center'
              }}>
                <Text strong>数据库:</Text>
                <Text>{status.details.database}</Text>
              </div>
            )}
            
            {status?.details.version && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr', 
                gap: 16,
                alignItems: 'center'
              }}>
                <Text strong>版本:</Text>
                <Text>{status.details.version}</Text>
              </div>
            )}
            
            {status?.details.connections && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr', 
                gap: 16,
                alignItems: 'center'
              }}>
                <Text strong>当前连接数:</Text>
                <Text>{status.details.connections}</Text>
              </div>
            )}
            
            {status?.details.error && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr', 
                gap: 16,
                alignItems: 'center'
              }}>
                <Text strong>错误信息:</Text>
                <Text type="danger">{status.details.error}</Text>
              </div>
            )}
          </div>
        )}
        
        <div style={{ marginTop: 24 }}>
          <Button 
            type="primary"
            icon={<ReloadOutlined />}
            onClick={checkDbStatus} 
            loading={loading}
            block
          >
            {loading ? "检查中..." : "刷新状态"}
          </Button>
        </div>
      </Card>
    </div>
  );
} 