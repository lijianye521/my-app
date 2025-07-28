"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">数据库连接状态</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>数据库状态</span>
            <div 
              className={`w-4 h-4 rounded-full ${
                status?.status === 'online' ? 'bg-green-500' : 
                status?.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`}
            />
          </CardTitle>
          <CardDescription>
            最后检查时间: {status?.timestamp ? new Date(status.timestamp).toLocaleString('zh-CN') : '加载中...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">连接状态:</div>
                <div className={`${
                  status?.details.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status?.details.message || '未知'}
                </div>
              </div>
              
              {status?.details.host && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">主机:</div>
                  <div>{status.details.host}</div>
                </div>
              )}
              
              {status?.details.database && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">数据库:</div>
                  <div>{status.details.database}</div>
                </div>
              )}
              
              {status?.details.version && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">版本:</div>
                  <div>{status.details.version}</div>
                </div>
              )}
              
              {status?.details.connections && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">当前连接数:</div>
                  <div>{status.details.connections}</div>
                </div>
              )}
              
              {status?.details.error && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">错误信息:</div>
                  <div className="text-red-600">{status.details.error}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={checkDbStatus} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "检查中..." : "刷新状态"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 