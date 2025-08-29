'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, RefreshCw, Filter } from 'lucide-react';

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
  const [logsData, setLogsData] = useState<LogsData>({
    total: 0,
    logs: [],
    page: 1,
    pageSize: 50,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    operationType: '',
    serviceCode: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // 获取操作日志
  const fetchLogs = async (page: number = 1) => {
    console.log('开始获取操作日志，页码:', page);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '50',
        offset: ((page - 1) * 50).toString()
      });

      if (filters.operationType) params.append('operationType', filters.operationType);
      if (filters.serviceCode) params.append('serviceCode', filters.serviceCode);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      console.log('请求URL:', `/api/operation-logs?${params}`);
      const response = await fetch(`/api/operation-logs?${params}`);
      console.log('响应状态:', response.status);
      const result = await response.json();
      console.log('响应数据:', result);

      if (result.success) {
        setLogsData(result.data);
        setCurrentPage(page);
        console.log('日志数据设置成功:', result.data);
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
        fetchLogs(currentPage); // 刷新当前页
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

  useEffect(() => {
    console.log('OperationLogs component mounted');
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* 调试信息 */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p><strong>调试信息:</strong> 操作日志页面已加载</p>
        <p>当前日志数量: {logsData.logs.length} | 总数: {logsData.total} | 加载状态: {loading ? '加载中' : '已完成'}</p>
      </div>

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
            onClick={() => fetchLogs(currentPage)} 
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
            <Button onClick={() => fetchLogs(1)} disabled={loading}>
              应用筛选
            </Button>
            <Button 
              onClick={() => {
                setFilters({ operationType: '', serviceCode: '', startDate: '', endDate: '' });
                fetchLogs(1);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{logsData.total}</div>
            <p className="text-gray-600">总记录数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{logsData.totalPages}</div>
            <p className="text-gray-600">总页数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{currentPage}</div>
            <p className="text-gray-600">当前页</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{logsData.logs.length}</div>
            <p className="text-gray-600">当前页记录</p>
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
          ) : logsData.logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无操作记录
            </div>
          ) : (
            <div className="space-y-4">
              {logsData.logs.map((log) => {
                const operationInfo = getOperationTypeInfo(log.operation_type);
                return (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
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
              })}
            </div>
          )}

          {/* 分页 */}
          {logsData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              <Button
                onClick={() => fetchLogs(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                variant="outline"
                size="sm"
              >
                上一页
              </Button>
              <span className="px-4 py-2 text-sm">
                第 {currentPage} 页，共 {logsData.totalPages} 页
              </span>
              <Button
                onClick={() => fetchLogs(currentPage + 1)}
                disabled={currentPage === logsData.totalPages || loading}
                variant="outline"
                size="sm"
              >
                下一页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
