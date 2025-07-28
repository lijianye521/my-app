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
import { FormDataType, PlatformItem, ServiceItem } from "./types";
import { iconOptions, colorOptions } from "./data";

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
    icon: (editingItem as any)?.iconName || "Settings",
    color: editingItem?.color || "bg-blue-500",
  });

  // 添加useEffect，当editingItem变化时重新设置表单数据
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        url: editingItem.url || "",
        icon: editingItem.iconName || "Settings",
        color: editingItem.color || "bg-blue-500",
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
            <Label htmlFor="url">链接地址 *</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="请输入链接地址，如：https://example.com"
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
