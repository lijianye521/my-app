'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Settings, 
  Database, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  ChevronRight,
  Home,
  Users,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: '平台概览',
      icon: Home,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">欢迎使用股票产品实验室管理平台</h3>
            <p className="text-gray-600 mb-4">
              这是一个专为企业打造的综合管理平台，集成了多种管理工具和技术服务，帮助您高效管理各类业务系统。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">管理平台</h4>
                    <p className="text-sm text-gray-500">统一管理各类业务系统</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-green-500" />
                  <div>
                    <h4 className="font-medium">技术服务</h4>
                    <p className="text-sm text-gray-500">提供各种技术支持服务</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <div>
                    <h4 className="font-medium">操作日志</h4>
                    <p className="text-sm text-gray-500">记录和追踪所有操作</p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      )
    },
    {
      id: 'platforms',
      title: '管理平台使用',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">如何管理平台服务</h3>
            <p className="text-gray-600 mb-4">
              管理平台模块允许您添加、编辑和删除各种管理系统的快捷访问链接。
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-green-500" />
                  添加新平台
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>点击"管理平台"页面右上角的"添加新平台"按钮</li>
                  <li>填写平台信息：
                    <ul className="ml-4 mt-1 list-disc list-inside">
                      <li><strong>服务代码：</strong>唯一标识符，用于系统内部识别</li>
                      <li><strong>服务名称：</strong>显示在界面上的名称</li>
                      <li><strong>描述：</strong>简要说明该平台的功能</li>
                      <li><strong>访问地址：</strong>平台的URL地址</li>
                      <li><strong>图标：</strong>选择合适的图标</li>
                      <li><strong>颜色：</strong>选择主题颜色</li>
                    </ul>
                  </li>
                  <li>选择链接类型：内网链接或终端命令</li>
                  <li>点击"保存"完成添加</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="h-5 w-5 mr-2 text-blue-500" />
                  编辑平台信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>在平台卡片上点击"编辑"按钮（铅笔图标）</li>
                  <li>修改需要更改的信息</li>
                  <li>点击"保存"应用更改</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                  删除平台
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>在平台卡片上点击"删除"按钮（垃圾桶图标）</li>
                  <li>确认删除操作</li>
                  <li className="text-orange-600">⚠️ 注意：删除操作不可恢复，请谨慎操作</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'services',
      title: '技术服务管理',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">技术服务配置</h3>
            <p className="text-gray-600 mb-4">
              技术服务模块用于管理各种技术工具和服务的访问入口，操作方式与管理平台类似。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">链接类型说明</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2">内网链接</Badge>
                    <p className="text-sm text-gray-600">
                      普通的网页链接，点击后在浏览器中打开指定URL
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">终端命令</Badge>
                    <p className="text-sm text-gray-600">
                      使用 windlocal 协议执行的命令，适用于启动本地应用程序
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">最佳实践</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    使用有意义的服务代码
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    编写清晰的描述信息
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    选择合适的图标和颜色
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    定期检查链接有效性
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'logs',
      title: '操作日志查看',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">操作日志功能</h3>
            <p className="text-gray-600 mb-4">
              操作日志记录了所有用户在平台上的操作行为，便于审计和问题追踪。
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-500" />
                  查看操作记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 点击左侧菜单"操作日志"进入日志页面</li>
                  <li>• 查看所有用户的操作记录，包括增删改操作</li>
                  <li>• 每条记录显示：操作类型、服务代码、操作用户、时间、详细信息</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-500" />
                  筛选和搜索
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>操作类型：</strong>按新增、更新、删除、访问筛选</li>
                  <li>• <strong>服务代码：</strong>查看特定服务的操作记录</li>
                  <li>• <strong>日期范围：</strong>按时间范围筛选记录</li>
                  <li>• 支持分页浏览，默认每页显示50条记录</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-green-500" />
                  日志管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 系统自动清理超过30天的历史记录</li>
                  <li>• 可手动点击"清理过期日志"按钮进行清理</li>
                  <li>• 所有操作都会自动记录，无需手动干预</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">常见问题解答</h3>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 如何重置密码？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 请联系系统管理员重置密码。当前版本暂不支持用户自助重置密码功能。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 为什么有些平台无法访问？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 可能的原因包括：1) 网络连接问题；2) 平台服务器维护；3) 权限不足；4) URL配置错误。请检查网络连接或联系管理员。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 操作记录会保存多久？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 系统会自动保留30天的操作记录，超过30天的记录会被自动清理以节省存储空间。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 如何添加新的技术服务？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 进入"技术服务"页面，点击"添加新服务"按钮，填写服务信息并保存即可。请确保服务代码唯一且有意义。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 支持哪些浏览器？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 建议使用现代浏览器，如 Chrome 90+、Firefox 88+、Safari 14+、Edge 90+。IE浏览器不被支持。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const currentSection = helpSections.find(section => section.id === activeSection);

  return (
    <div className="flex h-full">
      {/* 左侧导航 */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">帮助中心</h2>
        </div>
        
        <nav className="space-y-1">
          {helpSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {section.title}
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl">
          <div className="flex items-center mb-6">
            {currentSection && (
              <>
                <currentSection.icon className="h-8 w-8 text-blue-500 mr-3" />
                <h1 className="text-2xl font-bold">{currentSection.title}</h1>
              </>
            )}
          </div>
          
          {currentSection?.content}
          
          {/* 底部信息 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">需要更多帮助？</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    如果您在使用过程中遇到问题，请联系技术支持团队或查看技术论坛获取更多信息。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}