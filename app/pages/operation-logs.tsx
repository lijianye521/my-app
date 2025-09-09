'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Tag, Typography, Space, Input, Select, Spin, theme } from 'antd';
import { DeleteOutlined, EyeOutlined, ReloadOutlined, FilterOutlined, LeftOutlined } from '@ant-design/icons';
// @ts-ignore - 忽略类型检查以解决react-virtualized导入问题
import { List, AutoSizer } from 'react-virtualized';

interface OperationLog {
  id: number;
  operation_type: string;
  service_code: string;
  operation_detail: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  username: string;
  nickname: string;
}

interface LogsData {
  total: number;
  logs: OperationLog[];
  page: number;
  pageSize: number;
  totalPages: number;
}

interface OperationLogsProps {
  onBack: () => void;
}

export default function OperationLogs({ onBack }: OperationLogsProps) {
  const [allLogs, setAllLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    operationType: '',
    serviceCode: '',
    startDate: '',
    endDate: ''
  });
  
  const { token } = theme.useToken();
  const { Title, Text, Paragraph } = Typography;
  
  // 日志项的估计高度 - 增加高度以避免重叠
  const estimatedRowHeight = 140; // 增加高度以容纳所有内容

  // 获取所有操作日志
  const fetchLogs = async () => {
    console.log('开始获取所有操作日志');
    setLoading(true);
    try {
      // 获取所有日志，不分页
      const params = new URLSearchParams({
        limit: '1000', // 设置一个较大的限制，以获取更多数据
        offset: '0'
      });

      console.log('请求URL:', `/api/operation-logs?${params}`);
      const response = await fetch(`/api/operation-logs?${params}`);
      console.log('响应状态:', response.status);
      const result = await response.json();
      console.log('响应数据:', result);

      if (result.success) {
        setAllLogs(result.data.logs);
        console.log('获取到所有日志数据:', result.data.logs.length);
      } else {
        console.error('获取日志失败:', result.message);
        alert('获取日志失败: ' + result.message);
      }
    } catch (error) {
      console.error('获取日志出错:', error);
      alert('获取日志出错: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // 清理过期日志
  const cleanExpiredLogs = async () => {
    if (!confirm('确定要清理超过30天的过期日志吗？')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/operation-logs', {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        alert(`清理成功！删除了 ${result.deletedCount} 条过期日志`);
        // 重新获取所有日志
        fetchLogs();
      } else {
        alert(`清理失败: ${result.message}`);
      }
    } catch (error) {
      console.error('清理日志出错:', error);
      alert('清理过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 获取操作类型的颜色和文本
  const getOperationTypeInfo = (type: string) => {
    switch (type) {
      case 'add':
        return { color: 'success', text: '新增' };
      case 'update':
        return { color: 'processing', text: '更新' };
      case 'delete':
        return { color: 'error', text: '删除' };
      case 'access':
        return { color: 'default', text: '访问' };
      default:
        return { color: 'default', text: type };
    }
  };

  // 格式化操作详情
  const formatOperationDetail = (detail: any) => {
    if (!detail) return '无详细信息';
    
    try {
      if (typeof detail === 'string') {
        detail = JSON.parse(detail);
      }
      
      // 如果有变更信息，优先显示变更内容
      if (detail.changes) {
        const changes = Object.keys(detail.changes).map(key => {
          const change = detail.changes[key];
          return `${key}: "${change.old}" → "${change.new}"`;
        });
        return changes.join(', ');
      }
      
      // 删除操作显示被删除的数据
      if (detail.deletedData) {
        return `删除了服务: ${detail.deletedData.serviceName} (${detail.deletedData.serviceCode})`;
      }
      
      // 新增操作显示新增的服务名称
      if (detail.serviceName) {
        return `服务: ${detail.serviceName} (${detail.serviceCode})`;
      }
      
      return JSON.stringify(detail, null, 2);
    } catch {
      return detail.toString();
    }
  };

  // 根据筛选条件过滤日志
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      // 操作类型过滤
      if (filters.operationType && log.operation_type !== filters.operationType) {
        return false;
      }
      
      // 服务代码过滤
      if (filters.serviceCode && !log.service_code.includes(filters.serviceCode)) {
        return false;
      }
      
      // 日期过滤
      const logDate = new Date(log.created_at);
      
      // 开始日期过滤
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (logDate < startDate) {
          return false;
        }
      }
      
      // 结束日期过滤
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
        if (logDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [allLogs, filters]);
  
  // 渲染日志项的函数
  const renderLogItem = ({ index, key, style }: any) => {
    const log = filteredLogs[index];
    const operationInfo = getOperationTypeInfo(log.operation_type);
    
    return (
      <div 
        key={key}
        style={{
          ...style,
          height: estimatedRowHeight - 8, // 减去margin的高度
          paddingBottom: '8px', // 添加底部间距
          margin: '0 8px 8px 8px'
        }}
      >
        <Card
          size="small"
          style={{
            height: '100%',
            cursor: 'default'
          }}
          styles={{
            body: { padding: '12px 16px' }
          }}
          hoverable
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            marginBottom: 12 
          }}>
            <Space wrap size="small">
              <Tag color={operationInfo.color as any}>
                {operationInfo.text}
              </Tag>
              <Text strong style={{ fontSize: 13 }}>
                {log.service_code}
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                by {log.nickname || log.username}
              </Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
              {new Date(log.created_at).toLocaleString('zh-CN')}
            </Text>
          </div>
          <div style={{
            fontSize: 13,
            color: token.colorText,
            marginBottom: 8,
            wordBreak: 'break-all',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4em',
            maxHeight: '2.8em'
          }}>
            {formatOperationDetail(log.operation_detail)}
          </div>
          <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
            IP: {log.ip_address} | {log.user_agent.length > 50 ? log.user_agent.substring(0, 50) + '...' : log.user_agent}
          </Text>
        </Card>
      </div>
    );
  };
  
  useEffect(() => {
    console.log('OperationLogs component mounted');
    fetchLogs();
  }, []);
  
  // 不再需要清除缓存，因为我们使用固定高度

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 页面头部 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Button 
            onClick={onBack} 
            icon={<LeftOutlined />}
            style={{ marginBottom: 16 }}
          >
            返回
          </Button>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            用户操作日志
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            查看和管理系统操作记录
          </Paragraph>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined spin={loading} />}
            onClick={() => fetchLogs()} 
            disabled={loading}
          >
            刷新
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            onClick={cleanExpiredLogs} 
            disabled={loading}
            danger
          >
            清理过期日志
          </Button>
        </Space>
      </div>

      {/* 筛选器 */}
      <Card
        title={
          <Space align="center">
            <FilterOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <span>筛选条件</span>
          </Space>
        }
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16,
          marginBottom: 16
        }}>
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              操作类型
            </Text>
            <Select
              value={filters.operationType}
              onChange={(value) => setFilters({ ...filters, operationType: value })}
              placeholder="全部"
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="add">新增</Select.Option>
              <Select.Option value="update">更新</Select.Option>
              <Select.Option value="delete">删除</Select.Option>
              <Select.Option value="access">访问</Select.Option>
            </Select>
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              服务代码
            </Text>
            <Input
              value={filters.serviceCode}
              onChange={(e) => setFilters({ ...filters, serviceCode: e.target.value })}
              placeholder="输入服务代码"
              allowClear
            />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              开始日期
            </Text>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              结束日期
            </Text>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
        <Space>
          <Button 
            type="primary"
            onClick={() => {
              // 只触发过滤条件更新，不需要重新请求
              console.log("应用本地筛选");
            }} 
            disabled={loading}
          >
            应用筛选
          </Button>
          <Button 
            onClick={() => {
              setFilters({ operationType: '', serviceCode: '', startDate: '', endDate: '' });
            }}
          >
            重置
          </Button>
        </Space>
      </Card>

      {/* 统计信息 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16
      }}>
        <Card>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: token.colorPrimary,
              marginBottom: 8
            }}>
              {allLogs.length}
            </div>
            <Text type="secondary">总记录数</Text>
          </div>
        </Card>
        <Card>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: token.colorSuccess,
              marginBottom: 8
            }}>
              {filteredLogs.length}
            </div>
            <Text type="secondary">筛选后记录数</Text>
          </div>
        </Card>
        <Card>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: loading ? token.colorWarning : token.colorSuccess,
              marginBottom: 8
            }}>
              {loading ? "加载中..." : "已完成"}
            </div>
            <Text type="secondary">加载状态</Text>
          </div>
        </Card>
      </div>

      {/* 日志列表 */}
      <Card
        title={
          <Space align="center">
            <EyeOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <span>操作记录</span>
          </Space>
        }
      >
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 0'
          }}>
            <Space direction="vertical" align="center">
              <Spin size="large" />
              <Text>加载中...</Text>
            </Space>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 0'
          }}>
            <Text type="secondary">暂无操作记录</Text>
          </div>
        ) : (
          <div style={{ 
            height: "600px", 
            width: "100%", 
            position: 'relative',
            backgroundColor: token.colorBgLayout,
            borderRadius: token.borderRadius
          }}>
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={filteredLogs.length}
                  rowHeight={estimatedRowHeight}
                  rowRenderer={renderLogItem}
                  overscanRowCount={5}
                  style={{
                    outline: 'none',
                    backgroundColor: token.colorBgLayout
                  }}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </Card>
    </div>
  );
}
