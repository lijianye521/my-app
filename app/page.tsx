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

// 导入页面组件
import Dashboard from "./pages/dashboard";
import Platforms from "./pages/platforms";
import Services from "./pages/services";
import Docs from "./pages/docs";
import Monitoring from "./pages/monitoring";
import FormDialog from "./pages/form-dialog";

// 导入类型和数据
import { PlatformItem, ServiceItem, FormDataType } from "./pages/types";
import { menuItems, iconOptions } from "./pages/data";

// 根据iconName获取图标组件的辅助函数
const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon; // 默认返回第一个图标
};

export default function EnterpriseStockToolbox() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    PlatformItem | ServiceItem | null
  >(null);
  const [newItemType, setNewItemType] = useState("platform");

  // 管理平台配置
  const [managementPlatforms, setManagementPlatforms] = useState<PlatformItem[]>([]);

  // 技术服务工具
  const [techServices, setTechServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const resPlatform = await fetch('/api/platforms?type=platform');
        if (resPlatform.ok) {
          const data = await resPlatform.json();
          setManagementPlatforms(
            data.map((item: any) => ({
              id: item.service_code,
              name: item.service_name,
              description: item.service_description,
              icon: getIconByName(item.icon_name),
              iconName: item.icon_name,
              status: item.is_visible ? '运行中' : '停用',
              url: item.service_url,
              color: item.color_class,
            }))
          );
        }
        const resService = await fetch('/api/platforms?type=service');
        if (resService.ok) {
          const data = await resService.json();
          setTechServices(
            data.map((item: any) => ({
              id: item.service_code,
              name: item.service_name,
              description: item.service_description,
              icon: getIconByName(item.icon_name),
              iconName: item.icon_name,
              url: item.service_url,
              color: item.color_class,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

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

  const handleDelete = (id: string, type: string) => {
    if (confirm("确定要删除这个配置项吗？")) {
      if (type === "platform") {
        setManagementPlatforms((prev) => prev.filter((item) => item.id !== id));
      } else {
        setTechServices((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const handleFormSubmit = (formData: FormDataType) => {
    const iconComponent = getIconByName(formData.icon);
    const newItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      url: formData.url,
      icon: iconComponent,
      iconName: formData.icon,
      color: formData.color,
      status: "运行中",
    };

    if (editingItem) {
      // 编辑现有项目
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
      // 添加新项目
      if (newItemType === "platform") {
        setManagementPlatforms((prev) => [...prev, newItem]);
      } else {
        setTechServices((prev) => [...prev, newItem]);
      }
    }
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
      case "docs":
        return <Docs />;
      case "monitoring":
        return <Monitoring />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">股票产品实验室</h1>
              <p className="text-xs text-gray-500">企业管理平台</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
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

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {menuItems.find((item) => item.id === activeSection)?.label ||
                  "工作台"}
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
                    <div className="font-medium">系统管理员</div>
                    <div className="text-sm text-gray-500">
                      admin@company.com
                    </div>
                    <div className="text-sm text-gray-500">
                      域名: company.com
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* 新增/编辑对话框 */}
      <FormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        itemType={newItemType}
      />
    </div>
  );
}
