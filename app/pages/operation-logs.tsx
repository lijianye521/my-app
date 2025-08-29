'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, RefreshCw, Filter } from 'lucide-react';
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
  
  // 日志项的估计高度
  const estimatedRowHeight = 120; // 根据内容调整

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
        return { color: 'bg-green-500', text: '新增' };
      case 'update':
        return { color: 'bg-blue-500', text: '更新' };
      case 'delete':
        return { color: 'bg-red-500', text: '删除' };
      case 'access':
        return { color: 'bg-gray-500', text: '访问' };
      default:
        return { color: 'bg-gray-400', text: type };
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
        style={style} 
        className="border rounded-lg p-4 hover:bg-gray-50 mb-2 mx-1"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={`${operationInfo.color} text-white`}>
              {operationInfo.text}
            </Badge>
            <span className="font-medium">{log.service_code}</span>
            <span className="text-gray-500">
              by {log.nickname || log.username}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(log.created_at).toLocaleString('zh-CN')}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          {formatOperationDetail(log.operation_detail)}
        </div>
        <div className="text-xs text-gray-500">
          IP: {log.ip_address} | {log.user_agent}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    console.log('OperationLogs component mounted');
    fetchLogs();
  }, []);
  
  // 不再需要清除缓存，因为我们使用固定高度

  return (
    <div className="space-y-6">
      {/* 调试信息 */}
      {/* <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p><strong>调试信息:</strong> 操作日志页面已加载</p>
        <p>总日志数量: {allLogs.length} | 过滤后数量: {filteredLogs.length} | 加载状态: {loading ? '加载中' : '已完成'}</p>
      </div> */}

      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <Button onClick={onBack} variant="outline" className="mb-4">
            ← 返回
          </Button>
          <h1 className="text-2xl font-bold">用户操作日志</h1>
          <p className="text-gray-600">查看和管理系统操作记录</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchLogs()} 
            variant="outline" 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button 
            onClick={cleanExpiredLogs} 
            variant="outline" 
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清理过期日志
          </Button>
        </div>
      </div>

      {/* 筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            筛选条件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">操作类型</label>
              <select
                value={filters.operationType}
                onChange={(e) => setFilters({ ...filters, operationType: e.target.value })}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:border-gray-400 transition-colors"
              >
                <option value="">全部</option>
                <option value="add">新增</option>
                <option value="update">更新</option>
                <option value="delete">删除</option>
                <option value="access">访问</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">服务代码</label>
              <input
                type="text"
                value={filters.serviceCode}
                onChange={(e) => setFilters({ ...filters, serviceCode: e.target.value })}
                placeholder="输入服务代码"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">开始日期</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">结束日期</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:border-gray-400 transition-colors"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button             onClick={() => {
              // 只触发过滤条件更新，不需要重新请求
              console.log("应用本地筛选");
            }} 
            disabled={loading}>
            应用筛选
          </Button>
          <Button 
            onClick={() => {
              setFilters({ operationType: '', serviceCode: '', startDate: '', endDate: '' });
            }}  
              variant="outline" 
              className="ml-2"
            >
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{allLogs.length}</div>
            <p className="text-gray-600">总记录数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-gray-600">筛选后记录数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{loading ? "加载中..." : "已完成"}</div>
            <p className="text-gray-600">加载状态</p>
          </CardContent>
        </Card>
      </div>

      {/* 日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>加载中...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无操作记录
            </div>
          ) : (
            <div style={{ height: "600px", width: "100%" }}>
              <AutoSizer>
                {({ height, width }: { height: number; width: number }) => (
                  <List
                    width={width}
                    height={height}
                    rowCount={filteredLogs.length}
                    rowHeight={estimatedRowHeight}
                    rowRenderer={renderLogItem}
                    overscanRowCount={10}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
