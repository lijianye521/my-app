import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { FormDataType, PlatformItem, ServiceItem, UrlType } from "./types";
import { iconOptions, colorOptions, urlTypeOptions } from "./data";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormDataType) => void;
  editingItem: PlatformItem | ServiceItem | null;
  itemType: string; // 'platform' or 'service'
}

export default function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  itemType,
}: FormDialogProps) {
  const [formData, setFormData] = useState<FormDataType>({
    name: editingItem?.name || "",
    description: editingItem?.description || "",
    url: editingItem?.url || "",
    icon: editingItem?.iconName || "Settings",  // 修正这里，使用iconName
    color: editingItem?.color || "bg-blue-500",
    urlType: (editingItem?.urlType as UrlType) || "internal",
    otherInformation: editingItem?.otherInformation || "",
  });

  // 添加useEffect，当editingItem变化时重新设置表单数据
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        url: editingItem.url || "",
        icon: editingItem.iconName || "Settings",  // 修正这里，使用iconName
        color: editingItem.color || "bg-blue-500",
        urlType: (editingItem.urlType as UrlType) || "internal",
        otherInformation: editingItem.otherInformation || "",
      });
    } else {
      // 当创建新项目时重置表单
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      url: "",
      icon: "Settings",
      color: "bg-blue-500",
      urlType: "internal",
      otherInformation: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.url) {
      alert("请填写名称和链接地址");
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  const renderIconGrid = () => {
    return (
      <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
        {iconOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.value}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-1 ${
                formData.icon === option.value
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "border"
              }`}
              onClick={() => setFormData({ ...formData, icon: option.value })}
              title={option.label}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-xs text-center">{option.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderColorGrid = () => {
    return (
      <div className="grid grid-cols-10 gap-2 p-2 border rounded">
        {colorOptions.map((option) => (
          <div
            key={option.value}
            className={`w-8 h-8 rounded cursor-pointer border-2 ${
              formData.color === option.value
                ? "border-gray-800"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: option.color }}
            onClick={() => setFormData({ ...formData, color: option.value })}
            title={option.label}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "编辑" : "新增"}
            {itemType === "platform" ? "管理平台" : "技术服务"}
          </DialogTitle>
          <DialogDescription>
            请填写{itemType === "platform" ? "管理平台" : "技术服务"}的基本信息
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="请输入名称"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="请输入描述信息"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlType">链接类型 *</Label>
            <select
              id="urlType"
              value={formData.urlType}
              onChange={(e) =>
                setFormData({ ...formData, urlType: e.target.value as UrlType })
              }
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              {urlTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">
              {formData.urlType === 'internal' ? '链接地址' : '终端命令'} *
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder={
                formData.urlType === 'internal'
                  ? "请输入内网链接地址，如：http://10.106.19.29:8090/"
                  : "请输入windlocal命令，如：windlocal://open?cmd=notepad"
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherInformation">其他信息</Label>
            <Textarea
              id="otherInformation"
              value={formData.otherInformation}
              onChange={(e) =>
                setFormData({ ...formData, otherInformation: e.target.value })
              }
              placeholder="请输入其他信息（可选，JSON格式）"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>选择图标</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">当前选择：</span>
                <div
                  className={`w-8 h-8 ${formData.color} rounded flex items-center justify-center`}
                >
                  {(() => {
                    const IconComponent =
                      iconOptions.find((opt) => opt.value === formData.icon)
                        ?.icon || Settings;
                    return <IconComponent className="h-4 w-4 text-white" />;
                  })()}
                </div>
                <span className="text-sm">
                  {iconOptions.find((opt) => opt.value === formData.icon)
                    ?.label || "设置"}
                </span>
              </div>
              {renderIconGrid()}
            </div>
          </div>

          <div className="space-y-2">
            <Label>选择颜色</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">当前选择：</span>
                <div
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor:
                      colorOptions.find((opt) => opt.value === formData.color)
                        ?.color || "#3b82f6",
                  }}
                />
                <span className="text-sm">
                  {colorOptions.find((opt) => opt.value === formData.color)
                    ?.label || "蓝色"}
                </span>
              </div>
              {renderColorGrid()}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            {editingItem ? "保存" : "添加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
