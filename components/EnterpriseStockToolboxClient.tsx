"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import AuthNotification from "@/components/AuthNotification";

import Dashboard from "@/app/pages/dashboard";
import Platforms from "@/app/pages/platforms";
import Services from "@/app/pages/services";
import UsersManagement from "@/app/pages/users";
import Docs from "@/app/pages/docs";
import OperationLogs from "@/app/pages/operation-logs";
import FormDialog from "@/app/pages/form-dialog";
import AIAgent from "@/app/pages/ai-agent";
import ComingSoon from "@/app/pages/coming-soon";

import { PlatformItem, ServiceItem, FormDataType } from "@/app/pages/types";
import { menuItems, iconOptions } from "@/app/pages/data";

const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

interface Props {
  initialPlatforms: PlatformItem[];
  initialServices: ServiceItem[];
}

export default function EnterpriseStockToolboxClient({
  initialPlatforms,
  initialServices,
}: Props) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlatformItem | ServiceItem | null>(null);
  const [newItemType, setNewItemType] = useState("platform");
  
  // 通知组件相关状态
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  console.log('EnterpriseStockToolboxClient接收数据:', { initialPlatforms, initialServices });

  const [managementPlatforms, setManagementPlatforms] = useState<PlatformItem[]>(initialPlatforms);
  const [techServices, setTechServices] = useState<ServiceItem[]>(initialServices);

  useEffect(() => {
    console.log('managementPlatforms状态更新:', managementPlatforms);
    console.log('techServices状态更新:', techServices);
  }, [managementPlatforms, techServices]);

  // 更新组件初始化数据
  useEffect(() => {
    if (initialPlatforms?.length) {
      setManagementPlatforms(initialPlatforms);
    }
    if (initialServices?.length) {
      setTechServices(initialServices);
    }
  }, [initialPlatforms, initialServices]);

  const handleAddNew = (type: string) => {
    setNewItemType(type);
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: PlatformItem | ServiceItem, type: string) => {
    setNewItemType(type);
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string, type: string) => {
    if (confirm("确定要删除这个配置项吗？")) {
      try {
        // 调用API删除数据
        const response = await fetch(`/api/platforms?id=${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          // UI更新
          if (type === "platform") {
            setManagementPlatforms((prev) => prev.filter((item) => item.id !== id));
          } else {
            setTechServices((prev) => prev.filter((item) => item.id !== id));
          }
          
          setNotification({
            title: "删除成功",
            message: "配置项已成功删除",
            type: "success"
          });
        } else {
          setNotification({
            title: "删除失败",
            message: result.message || "删除操作失败，请重试",
            type: "error"
          });
        }
      } catch (error) {
        console.error("删除出错:", error);
        setNotification({
          title: "删除错误",
          message: "删除过程中发生错误，请检查网络连接",
          type: "error"
        });
      }
    }
  };

  const handleFormSubmit = async (formData: FormDataType) => {
    try {
      const isNew = !editingItem;
      const id = editingItem?.id || formData.name.toLowerCase().replace(/\s/g, '_');
      
      const requestData = {
        id,
        name: formData.name,
        description: formData.description,
        iconName: formData.icon,
        url: formData.url,
        color: formData.color,
        urlType: formData.urlType,
        otherInformation: formData.otherInformation,
        type: newItemType,
        isNew
      };
      
      // 调用API保存数据
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 创建新项
        const newItem = {
          id,
          name: formData.name,
          description: formData.description,
          iconName: formData.icon,
          url: formData.url,
          color: formData.color,
          urlType: formData.urlType,
          otherInformation: formData.otherInformation,
          status: "运行中",
        };

        // UI更新
        if (editingItem) {
          if (newItemType === "platform") {
            setManagementPlatforms((prev) =>
              prev.map((item) => (item.id === editingItem.id ? newItem : item))
            );
          } else {
            setTechServices((prev) =>
              prev.map((item) => (item.id === editingItem.id ? newItem : item))
            );
          }
        } else {
          if (newItemType === "platform") {
            setManagementPlatforms((prev) => [...prev, newItem]);
          } else {
            setTechServices((prev) => [...prev, newItem]);
          }
        }
        
        setNotification({
          title: isNew ? "添加成功" : "更新成功",
          message: isNew ? "新配置项已成功添加" : "配置项已成功更新",
          type: "success"
        });
      } else {
        setNotification({
          title: "保存失败",
          message: result.message || "保存操作失败，请重试",
          type: "error"
        });
      }
    } catch (error) {
      console.error("保存出错:", error);
      setNotification({
        title: "保存错误",
        message: "保存过程中发生错误，请检查网络连接",
        type: "error"
      });
    }
    
    // 关闭对话框
    setIsAddDialogOpen(false);
  };

  const renderContent = () => {
    const commonProps = {
      managementPlatforms,
      setManagementPlatforms,
      techServices,
      setTechServices,
      onAddNew: handleAddNew,
      onEdit: handleEdit,
      onDelete: handleDelete,
    };

    switch (activeSection) {
      case "dashboard":
        return <Dashboard {...commonProps} />;
      case "platforms":
        return <Platforms {...commonProps} />;
      case "services":
        return <Services {...commonProps} />;
      case "users":
        return <UsersManagement />;
      case "docs":
        return <Docs />;
      case "operation-logs":
        return <OperationLogs onBack={() => setActiveSection("dashboard")} />;
      case "ai-agent":
        return <AIAgent />;
      case "coming-soon":
        return <ComingSoon />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  // 获取会话信息
  const { data: session } = useSession();
  console.log('session', session);
  
  // 根据用户角色过滤显示的菜单项
  const filteredMenuItems = menuItems.filter(item => {
    // 仅管理员可见的菜单项
    if (item.id === "users") {
      return session?.user?.role === "admin";
    }
    // 其他菜单项所有人可见
    return true;
  });
  
  // 处理退出登录
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    // 额外的保险措施 - 直接使用window.location跳转
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
              background: '#2563eb', /* 兜底纯色 */
              filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#2563eb", endColorstr="#9333ea", GradientType=1)', /* IE9 */
              backgroundImage: '-webkit-gradient(linear, left top, right top, from(#2563eb), to(#9333ea))', /* 老webkit */
            
            }}>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">股票产品实验室</h1>
              <p className="text-xs text-gray-500">企业管理平台</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {menuItems.find((item) => item.id === activeSection)?.label || "工作台"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <div className="font-medium">{session?.user?.name || session?.user?.username || "用户"}</div>
                    <div className="text-sm text-gray-500">{session?.user?.email || ""}</div>
                    {session?.user?.id && (
                      <div className="text-sm text-gray-500">ID: {session.user.id}</div>
                    )}
                    {session?.user?.role && (
                      <div className="text-sm mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          session.user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {session.user.role === 'admin' ? '管理员' : '普通用户'}
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      <FormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        itemType={newItemType}
      />
      
      {/* 通知组件 */}
      {notification && (
        <AuthNotification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

