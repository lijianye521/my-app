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

// 用户接口
export interface UserItem {
  id: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
  role: 'admin' | 'user';
  is_active: number;
  created_at: string;
  updated_at: string;
}

// URL类型枚举
export type UrlType = 'internal' | 'terminal' | 'internal_terminal';

// URL类型选项接口
export interface UrlTypeOption {
  value: UrlType;
  label: string;
  description: string;
}

// 平台项目接口
export interface PlatformItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  status: string;
  url: string;
  color: string;
  urlType?: UrlType;
  otherInformation?: string;
}

// 服务项目接口
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  url: string;
  color?: string;
  urlType?: UrlType;
  otherInformation?: string;
}

// 表单数据类型
export interface FormDataType {
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  urlType: UrlType;
  otherInformation?: string;
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
