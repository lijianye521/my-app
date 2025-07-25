import { LucideProps } from "lucide-react";

// 图标选项接口
export interface IconOption {
  value: string;
  icon: React.ComponentType<LucideProps>;
  label: string;
}

// 颜色选项接口
export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

// 平台项目接口
export interface PlatformItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  iconName: string;
  status: string;
  url: string;
  color: string;
}

// 服务项目接口
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  iconName: string;
  url: string;
  color?: string;
}

// 表单数据类型
export interface FormDataType {
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
}

// 菜单项接口
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
}

// 页面组件属性接口
export interface PageProps {
  managementPlatforms: PlatformItem[];
  setManagementPlatforms: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  techServices: ServiceItem[];
  setTechServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  onAddNew?: (type: string) => void;
  onEdit?: (item: PlatformItem | ServiceItem, type: string) => void;
  onDelete?: (id: string, type: string) => void;
  onUrlChange?: (id: string, newUrl: string, type: string) => void;
  onSaveConfig?: () => void;
}
