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
  Info,
  TrendingUp,
  ExternalLink,
  UserPlus,
  Upload,
  Globe
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
              这是一个专为金融科技公司打造的统一入口平台，专门管理股票相关业务平台和技术服务，支持Wind终端集成，为企业员工提供一站式服务。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">管理平台</h4>
                    <p className="text-sm text-gray-500">统一管理各类业务系统和工具</p>
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
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <h4 className="font-medium">用户管理</h4>
                    <p className="text-sm text-gray-500">管理员可管理用户权限</p>
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

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-indigo-500" />
                  <div>
                    <h4 className="font-medium">AI助手</h4>
                    <p className="text-sm text-gray-500">智能助手功能 (开发中)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-cyan-500" />
                  <div>
                    <h4 className="font-medium">技术论坛</h4>
                    <p className="text-sm text-gray-500">新员工学习交流平台</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">核心特色</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 支持Wind终端集成 (windlocal协议)</li>
                  <li>• 动态配置管理，无需硬编码</li>
                  <li>• 拖拽排序，150+种图标，20种颜色主题</li>
                  <li>• 完整的操作审计和权限管理</li>
                  <li>• 响应式设计，支持多设备访问</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: '工作台使用',
      icon: Home,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">工作台功能介绍</h3>
            <p className="text-gray-600 mb-4">
              工作台是平台的首页，提供快速访问入口和系统概览信息，帮助用户快速定位所需功能。
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  技术论坛快速入口
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    工作台顶部显著位置提供技术论坛入口，点击即可访问员工学习交流平台。
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>论坛地址：</strong>http://10.106.19.29:8090/
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      新员工可在此获取技术分享和问题解答
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  平台服务概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>管理平台统计：</strong>显示已配置的管理平台数量</li>
                  <li>• <strong>技术服务统计：</strong>显示已配置的技术服务数量</li>
                  <li>• <strong>快速访问：</strong>点击对应卡片可直接跳转到相应页面</li>
                  <li>• <strong>状态指示：</strong>实时显示各服务的可用状态</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-purple-500" />
                  常用平台快捷访问
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    工作台右侧展示常用的管理平台和技术服务，方便快速访问。
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>访问方式：</strong>点击平台卡片即可根据配置的URL类型自动跳转：
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
                      <li>• URL跳转：浏览器新标签页打开</li>
                      <li>• 终端命令：使用windlocal协议执行</li>
                    </ul>
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
              管理平台模块允许您添加、编辑和删除各种管理系统的快捷访问链接。支持拖拽排序，150+种图标选择，20种颜色主题。
            </p>
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                <strong>预设平台包括：</strong>AINEWS运营管理、指标服务管理、F9菜单管理、券商研报权限管理、DocParser密钥管理、ENTI管理员设置、邮件订阅管理、Prompt管理平台等
              </p>
            </div>
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
              技术服务模块用于管理各种技术工具和服务的访问入口，操作方式与管理平台类似。同样支持拖拽排序和动态配置。
            </p>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>预设服务包括：</strong>Ocean数据处理服务、Cloud云计算服务、WSS实时指标服务、RAG检索增强服务、HTML转图工具等
              </p>
            </div>
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
      id: 'users',
      title: '用户管理 (管理员)',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">用户管理功能</h3>
            <p className="text-gray-600 mb-4">
              用户管理功能仅对管理员开放，可以管理系统用户账户、角色权限和批量操作。
            </p>
            <div className="bg-orange-50 p-3 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                <p className="text-sm text-orange-800">
                  <strong>权限说明：</strong>只有管理员用户才能访问用户管理页面，普通用户无法查看。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-green-500" />
                  添加新用户
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 点击"添加用户"按钮打开注册表单</li>
                  <li>• 填写用户名、邮箱、密码和角色信息</li>
                  <li>• 支持设置用户为管理员或普通用户</li>
                  <li>• 系统会自动验证用户名和邮箱的唯一性</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-blue-500" />
                  Excel批量导入
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>• 支持通过Excel文件批量导入用户</li>
                    <li>• Excel格式：用户名、邮箱、密码、角色（admin/user）</li>
                    <li>• 导入后显示成功和失败统计</li>
                    <li>• 自动跳过重复用户，避免冲突</li>
                  </ul>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      建议Excel文件包含标题行：username、email、password、role
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-500" />
                  用户管理操作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>重置密码：</strong>管理员可为任意用户重置密码</li>
                  <li>• <strong>批量删除：</strong>支持多选用户进行批量删除</li>
                  <li>• <strong>角色管理：</strong>批量设置用户角色（管理员/普通用户）</li>
                  <li>• <strong>状态统计：</strong>显示总用户数、管理员数量等统计信息</li>
                  <li>• <strong>操作确认：</strong>危险操作需要二次确认，防止误操作</li>
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
              操作日志记录了所有用户在平台上的操作行为，便于审计和问题追踪。支持虚拟化滚动，高效处理大量日志数据。
            </p>
            <div className="bg-purple-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-purple-800">
                <strong>记录范围：</strong>平台访问、服务配置增删改、用户管理操作等所有关键行为都会自动记录
              </p>
            </div>
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
      id: 'ai-agent',
      title: 'AI智能助手',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">AI智能助手功能</h3>
            <p className="text-gray-600 mb-4">
              AI智能助手是平台的未来核心功能，将为用户提供智能化的操作辅助和问题解答。
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-800">
                  <Zap className="h-5 w-5 mr-2" />
                  开发进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-700">功能开发</span>
                    <Badge className="bg-indigo-500">开发中</Badge>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <p className="text-sm text-indigo-800 font-medium">
                      📅 预计上线时间：2025年9月12日前
                    </p>
                  </div>
                  <p className="text-sm text-indigo-600">
                    我们正在紧锣密鼓地开发AI智能助手功能，敬请期待！
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  规划功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>智能问答：</strong>回答平台使用相关问题</li>
                  <li>• <strong>操作指导：</strong>提供步骤化的操作指引</li>
                  <li>• <strong>故障诊断：</strong>协助排查和解决技术问题</li>
                  <li>• <strong>配置建议：</strong>根据使用情况提供优化建议</li>
                  <li>• <strong>学习推荐：</strong>推荐相关技术文档和资源</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'system-info',
      title: '系统信息',
      icon: Info,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">系统技术信息</h3>
            <p className="text-gray-600 mb-4">
              了解平台的技术架构、环境要求和部署信息。
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  技术栈
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">前端技术</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Next.js 15 + React 18</li>
                      <li>• TypeScript</li>
                      <li>• Ant Design 5.27+</li>
                      <li>• Tailwind CSS</li>
                      <li>• Lucide React Icons</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">后端技术</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Next.js API Routes</li>
                      <li>• NextAuth认证</li>
                      <li>• MySQL数据库</li>
                      <li>• Sequelize ORM</li>
                      <li>• Node.js运行时</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-500" />
                  环境配置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">数据库配置</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 主机：localhost:3306</li>
                      <li>• 数据库：stock_lab</li>
                      <li>• 用户：root2</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-blue-800">Wind终端集成</h5>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• 本地访问：http://localhost:3000</li>
                      <li>• Wind访问：windlocal://open?http://localhost:3000</li>
                      <li>• 支持windlocal协议跳转</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-purple-500" />
                  浏览器兼容性
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">Chrome 90+</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">Firefox 88+</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">Safari 14+</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-medium">Edge 90+</p>
                  </div>
                </div>
                <div className="mt-3 bg-red-50 p-2 rounded-lg">
                  <p className="text-sm text-red-600">
                    ⚠️ 不支持 Internet Explorer 浏览器
                  </p>
                </div>
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
                  A: 请联系系统管理员重置密码。管理员可在用户管理页面为任意用户重置密码。当前版本暂不支持用户自助重置密码功能。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 为什么有些平台无法访问？</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>A: 可能的原因包括：</p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>网络连接问题：</strong>检查网络连接是否正常</li>
                    <li>• <strong>平台服务器维护：</strong>目标服务可能正在维护</li>
                    <li>• <strong>权限不足：</strong>您可能没有访问该平台的权限</li>
                    <li>• <strong>URL配置错误：</strong>管理员需要检查URL配置</li>
                    <li>• <strong>Wind终端问题：</strong>检查windlocal协议是否正常工作</li>
                  </ul>
                  <p className="text-orange-600 mt-2">建议先尝试刷新页面，如问题持续请联系管理员。</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 操作记录会保存多久？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 系统会自动保留30天的操作记录，超过30天的记录会被自动清理以节省存储空间。管理员也可以手动执行清理操作。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 如何添加新的技术服务？</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>A: 添加服务的步骤：</p>
                  <ol className="ml-4 space-y-1 list-decimal">
                    <li>进入"技术服务"或"管理平台"页面</li>
                    <li>点击右上角"添加新服务"或"添加新平台"按钮</li>
                    <li>填写完整信息：服务代码（唯一）、名称、描述、URL、图标、颜色</li>
                    <li>选择URL类型（URL跳转或终端命令）</li>
                    <li>点击保存完成添加</li>
                  </ol>
                  <p className="text-blue-600 mt-2">💡 提示：服务代码必须唯一，建议使用有意义的英文标识。</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 如何使用拖拽排序功能？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  A: 在管理平台和技术服务页面，您可以直接拖拽卡片来调整显示顺序。拖拽时会显示半透明的预览效果，松开鼠标即可完成排序，系统会自动保存新的排序。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 用户管理功能有什么限制？</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>A: 用户管理功能限制如下：</p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>权限限制：</strong>只有管理员用户才能访问用户管理功能</li>
                    <li>• <strong>批量操作：</strong>支持批量删除和角色设置，但需要二次确认</li>
                    <li>• <strong>Excel导入：</strong>支持批量导入，但会跳过重复用户</li>
                    <li>• <strong>密码重置：</strong>管理员可以重置任意用户密码</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: Wind终端集成如何工作？</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>A: Wind终端集成说明：</p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>本地访问：</strong>http://localhost:3000</li>
                    <li>• <strong>Wind中访问：</strong>windlocal://open?http://localhost:3000</li>
                    <li>• <strong>终端命令：</strong>配置为"终端命令"类型的链接会使用windlocal协议</li>
                    <li>• <strong>URL跳转：</strong>配置为"URL跳转"类型的链接会在浏览器中打开</li>
                  </ul>
                  <p className="text-green-600 mt-2">✅ 这样设计可以满足不同场景的访问需求。</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Q: 支持哪些浏览器？</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>A: 支持的现代浏览器：</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>✅ Chrome 90+</div>
                    <div>✅ Firefox 88+</div>
                    <div>✅ Safari 14+</div>
                    <div>✅ Edge 90+</div>
                  </div>
                  <p className="text-red-600 mt-2">❌ 不支持 Internet Explorer 浏览器</p>
                  <p className="text-blue-600">推荐使用最新版本的Chrome或Edge浏览器以获得最佳体验。</p>
                </div>
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
                  <div className="text-sm text-blue-700 mt-1 space-y-2">
                    <p>如果您在使用过程中遇到问题，可以通过以下方式获取帮助：</p>
                    <ul className="space-y-1 ml-4">
                      <li>• 访问技术论坛：<a href="http://10.106.19.29:8090/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">http://10.106.19.29:8090/</a></li>
                      <li>• 联系系统管理员重置密码或解决权限问题</li>
                      <li>• 查看本帮助文档的相关章节</li>
                      <li>• Git仓库地址：<span className="font-mono text-xs">http://10.106.18.36:8082/stock/web/stock.product.lab</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>股票产品实验室管理平台 - 企业级统一入口平台</p>
              <p className="mt-1">基于 Next.js 15 + Ant Design 5.27+ 构建</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}