"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  Users,
  Database,
  Key,
  Mail,
  FileText,
  BarChart3,
  Cloud,
  MessageSquare,
  BookOpen,
  Shield,
  Zap,
  Globe,
  Code,
  TrendingUp,
  Home,
  ExternalLink,
  LogOut,
  User,
  Link,
  Save,
  Plus,
  Trash2,
  Edit,
  Monitor,
  Server,
  Smartphone,
  Laptop,
  HardDrive,
  Wifi,
  Camera,
  Headphones,
  Gamepad2,
  Printer,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Bookmark,
  Flag,
  Target,
  Compass,
  Map,
  Navigation,
  Layers,
  Grid,
  Box,
  Package,
  Truck,
  ShoppingCart,
  CreditCard,
  DollarSign,
  PieChart,
  LineChart,
  BarChart,
  Calendar,
  Timer,
  Bell,
  Volume2,
  Mic,
  Video,
  Image,
  Film,
  Music,
  Radio,
  Tv,
  Rss,
  Newspaper,
  Book,
  GraduationCap,
  Award,
  Trophy,
  Medal,
  Gift,
  Sparkles,
  Flame,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Umbrella,
  Thermometer,
  Wind,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Share,
  Copy,
  Scissors,
  Paperclip,
  Link2,
  Lock,
  Unlock,
  UserCheck,
  UserPlus,
  Crown,
  Briefcase,
  Building,
  Factory,
  Store,
  Warehouse,
  MapPin,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Fuel,
  Battery,
  Plug,
  Power,
  Scan,
  QrCode,
  Barcode,
  Hash,
  AtSign,
  Percent,
  Fingerprint,
  Palette,
  Brush,
  Pen,
  PenTool,
  Eraser,
  Ruler,
  Type,
  Bold,
  Italic,
  Underline,
  Quote,
  List,
  Layout,
  LayoutGrid,
  Columns,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Diamond,
  Shapes,
  Puzzle,
  Component,
  Workflow,
  GitBranch,
  Github,
  Chrome,
  ChromeIcon as Firefox,
  Bluetooth,
  Usb,
  Disc,
  Folder,
  File,
  Archive,
  Inbox,
  Send,
  Reply,
  Forward,
  Trash,
} from "lucide-react"

import { LucideProps } from "lucide-react"

// 添加类型定义
interface IconOption {
  value: string
  icon: React.ComponentType<LucideProps>
  label: string
}

interface ColorOption {
  value: string
  label: string
  color: string
}

interface PlatformItem {
  id: string
  name: string
  description: string
  icon: React.ComponentType<LucideProps>
  iconName: string
  status: string
  url: string
  color: string
}

interface ServiceItem {
  id: string
  name: string
  description: string
  icon: React.ComponentType<LucideProps>
  iconName: string
  url: string
  color?: string
}

interface FormDataType {
  name: string
  description: string
  url: string
  icon: string
  color: string
}

// 头像图标选项
const iconOptions: IconOption[] = [
  { value: "Settings", icon: Settings, label: "设置" },
  { value: "Users", icon: Users, label: "用户" },
  { value: "Database", icon: Database, label: "数据库" },
  { value: "Key", icon: Key, label: "密钥" },
  { value: "Mail", icon: Mail, label: "邮件" },
  { value: "FileText", icon: FileText, label: "文档" },
  { value: "BarChart3", icon: BarChart3, label: "图表" },
  { value: "Cloud", icon: Cloud, label: "云服务" },
  { value: "Shield", icon: Shield, label: "安全" },
  { value: "Zap", icon: Zap, label: "闪电" },
  { value: "Globe", icon: Globe, label: "全球" },
  { value: "Code", icon: Code, label: "代码" },
  { value: "Monitor", icon: Monitor, label: "监控" },
  { value: "Server", icon: Server, label: "服务器" },
  { value: "Smartphone", icon: Smartphone, label: "手机" },
  { value: "Laptop", icon: Laptop, label: "笔记本" },
  { value: "HardDrive", icon: HardDrive, label: "硬盘" },
  { value: "Wifi", icon: Wifi, label: "网络" },
  { value: "Camera", icon: Camera, label: "相机" },
  { value: "Headphones", icon: Headphones, label: "耳机" },
  { value: "Gamepad2", icon: Gamepad2, label: "游戏" },
  { value: "Printer", icon: Printer, label: "打印机" },
  { value: "Activity", icon: Activity, label: "活动" },
  { value: "AlertCircle", icon: AlertCircle, label: "警告" },
  { value: "CheckCircle", icon: CheckCircle, label: "完成" },
  { value: "Clock", icon: Clock, label: "时钟" },
  { value: "Star", icon: Star, label: "星星" },
  { value: "Heart", icon: Heart, label: "心形" },
  { value: "Bookmark", icon: Bookmark, label: "书签" },
  { value: "Flag", icon: Flag, label: "旗帜" },
  { value: "Target", icon: Target, label: "目标" },
  { value: "Compass", icon: Compass, label: "指南针" },
  { value: "Map", icon: Map, label: "地图" },
  { value: "Navigation", icon: Navigation, label: "导航" },
  { value: "Layers", icon: Layers, label: "图层" },
  { value: "Grid", icon: Grid, label: "网格" },
  { value: "Box", icon: Box, label: "盒子" },
  { value: "Package", icon: Package, label: "包裹" },
  { value: "Truck", icon: Truck, label: "卡车" },
  { value: "ShoppingCart", icon: ShoppingCart, label: "购物车" },
  { value: "CreditCard", icon: CreditCard, label: "信用卡" },
  { value: "DollarSign", icon: DollarSign, label: "美元" },
  { value: "PieChart", icon: PieChart, label: "饼图" },
  { value: "LineChart", icon: LineChart, label: "折线图" },
  { value: "BarChart", icon: BarChart, label: "柱状图" },
  { value: "Calendar", icon: Calendar, label: "日历" },
  { value: "Timer", icon: Timer, label: "计时器" },
  { value: "Bell", icon: Bell, label: "铃铛" },
  { value: "Volume2", icon: Volume2, label: "音量" },
  { value: "Mic", icon: Mic, label: "麦克风" },
  { value: "Video", icon: Video, label: "视频" },
  { value: "Image", icon: Image, label: "图片" },
  { value: "Film", icon: Film, label: "电影" },
  { value: "Music", icon: Music, label: "音乐" },
  { value: "Radio", icon: Radio, label: "收音机" },
  { value: "Tv", icon: Tv, label: "电视" },
  { value: "Rss", icon: Rss, label: "RSS" },
  { value: "Newspaper", icon: Newspaper, label: "新闻" },
  { value: "Book", icon: Book, label: "书籍" },
  { value: "GraduationCap", icon: GraduationCap, label: "毕业帽" },
  { value: "Award", icon: Award, label: "奖项" },
  { value: "Trophy", icon: Trophy, label: "奖杯" },
  { value: "Medal", icon: Medal, label: "奖牌" },
  { value: "Gift", icon: Gift, label: "礼物" },
  { value: "Sparkles", icon: Sparkles, label: "闪光" },
  { value: "Flame", icon: Flame, label: "火焰" },
  { value: "Sun", icon: Sun, label: "太阳" },
  { value: "Moon", icon: Moon, label: "月亮" },
  { value: "CloudRain", icon: CloudRain, label: "雨云" },
  { value: "Snowflake", icon: Snowflake, label: "雪花" },
  { value: "Umbrella", icon: Umbrella, label: "雨伞" },
  { value: "Thermometer", icon: Thermometer, label: "温度计" },
  { value: "Wind", icon: Wind, label: "风" },
  { value: "Eye", icon: Eye, label: "眼睛" },
  { value: "Search", icon: Search, label: "搜索" },
  { value: "Filter", icon: Filter, label: "过滤" },
  { value: "RefreshCw", icon: RefreshCw, label: "刷新" },
  { value: "Download", icon: Download, label: "下载" },
  { value: "Upload", icon: Upload, label: "上传" },
  { value: "Share", icon: Share, label: "分享" },
  { value: "Copy", icon: Copy, label: "复制" },
  { value: "Scissors", icon: Scissors, label: "剪刀" },
  { value: "Paperclip", icon: Paperclip, label: "回形针" },
  { value: "Link2", icon: Link2, label: "链接" },
  { value: "Lock", icon: Lock, label: "锁定" },
  { value: "Unlock", icon: Unlock, label: "解锁" },
  { value: "UserCheck", icon: UserCheck, label: "用户确认" },
  { value: "UserPlus", icon: UserPlus, label: "添加用户" },
  { value: "Crown", icon: Crown, label: "皇冠" },
  { value: "Briefcase", icon: Briefcase, label: "公文包" },
  { value: "Building", icon: Building, label: "建筑" },
  { value: "Factory", icon: Factory, label: "工厂" },
  { value: "Store", icon: Store, label: "商店" },
  { value: "Warehouse", icon: Warehouse, label: "仓库" },
  { value: "MapPin", icon: MapPin, label: "地图标记" },
  { value: "Car", icon: Car, label: "汽车" },
  { value: "Bus", icon: Bus, label: "公交车" },
  { value: "Train", icon: Train, label: "火车" },
  { value: "Plane", icon: Plane, label: "飞机" },
  { value: "Ship", icon: Ship, label: "轮船" },
  { value: "Bike", icon: Bike, label: "自行车" },
  { value: "Fuel", icon: Fuel, label: "燃料" },
  { value: "Battery", icon: Battery, label: "电池" },
  { value: "Plug", icon: Plug, label: "插头" },
  { value: "Power", icon: Power, label: "电源" },
  { value: "Scan", icon: Scan, label: "扫描" },
  { value: "QrCode", icon: QrCode, label: "二维码" },
  { value: "Barcode", icon: Barcode, label: "条形码" },
  { value: "Hash", icon: Hash, label: "井号" },
  { value: "AtSign", icon: AtSign, label: "@符号" },
  { value: "Percent", icon: Percent, label: "百分号" },
  { value: "Fingerprint", icon: Fingerprint, label: "指纹" },
  { value: "Palette", icon: Palette, label: "调色板" },
  { value: "Brush", icon: Brush, label: "画笔" },
  { value: "Pen", icon: Pen, label: "钢笔" },
  { value: "PenTool", icon: PenTool, label: "钢笔工具" },
  { value: "Eraser", icon: Eraser, label: "橡皮擦" },
  { value: "Ruler", icon: Ruler, label: "尺子" },
  { value: "Type", icon: Type, label: "文字" },
  { value: "Bold", icon: Bold, label: "粗体" },
  { value: "Italic", icon: Italic, label: "斜体" },
  { value: "Underline", icon: Underline, label: "下划线" },
  { value: "Quote", icon: Quote, label: "引用" },
  { value: "List", icon: List, label: "列表" },
  { value: "Layout", icon: Layout, label: "布局" },
  { value: "LayoutGrid", icon: LayoutGrid, label: "网格布局" },
  { value: "Columns", icon: Columns, label: "列" },
  { value: "Square", icon: Square, label: "正方形" },
  { value: "Circle", icon: Circle, label: "圆形" },
  { value: "Triangle", icon: Triangle, label: "三角形" },
  { value: "Hexagon", icon: Hexagon, label: "六边形" },
  { value: "Diamond", icon: Diamond, label: "菱形" },
  { value: "Shapes", icon: Shapes, label: "形状" },
  { value: "Puzzle", icon: Puzzle, label: "拼图" },
  { value: "Component", icon: Component, label: "组件" },
  { value: "Workflow", icon: Workflow, label: "工作流" },
  { value: "GitBranch", icon: GitBranch, label: "Git分支" },
  { value: "Github", icon: Github, label: "GitHub" },
  { value: "Chrome", icon: Chrome, label: "Chrome" },
  { value: "Firefox", icon: Firefox, label: "Firefox" },
  { value: "Bluetooth", icon: Bluetooth, label: "蓝牙" },
  { value: "Usb", icon: Usb, label: "USB" },
  { value: "Disc", icon: Disc, label: "光盘" },
  { value: "Folder", icon: Folder, label: "文件夹" },
  { value: "File", icon: File, label: "文件" },
  { value: "Archive", icon: Archive, label: "归档" },
  { value: "Inbox", icon: Inbox, label: "收件箱" },
  { value: "Send", icon: Send, label: "发送" },
  { value: "Reply", icon: Reply, label: "回复" },
  { value: "Forward", icon: Forward, label: "转发" },
  { value: "Trash", icon: Trash, label: "垃圾桶" },
]

// 颜色选项
const colorOptions: ColorOption[] = [
  { value: "bg-blue-500", label: "蓝色", color: "#3b82f6" },
  { value: "bg-green-500", label: "绿色", color: "#10b981" },
  { value: "bg-purple-500", label: "紫色", color: "#8b5cf6" },
  { value: "bg-orange-500", label: "橙色", color: "#f97316" },
  { value: "bg-red-500", label: "红色", color: "#ef4444" },
  { value: "bg-indigo-500", label: "靛蓝", color: "#6366f1" },
  { value: "bg-pink-500", label: "粉色", color: "#ec4899" },
  { value: "bg-teal-500", label: "青色", color: "#14b8a6" },
  { value: "bg-yellow-500", label: "黄色", color: "#eab308" },
  { value: "bg-cyan-500", label: "青蓝", color: "#06b6d4" },
  { value: "bg-emerald-500", label: "翠绿", color: "#10b981" },
  { value: "bg-violet-500", label: "紫罗兰", color: "#8b5cf6" },
  { value: "bg-rose-500", label: "玫瑰", color: "#f43f5e" },
  { value: "bg-amber-500", label: "琥珀", color: "#f59e0b" },
  { value: "bg-lime-500", label: "酸橙", color: "#84cc16" },
  { value: "bg-sky-500", label: "天空蓝", color: "#0ea5e9" },
  { value: "bg-slate-500", label: "石板灰", color: "#64748b" },
  { value: "bg-gray-500", label: "灰色", color: "#6b7280" },
  { value: "bg-zinc-500", label: "锌色", color: "#71717a" },
  { value: "bg-neutral-500", label: "中性", color: "#737373" },
]

export default function EnterpriseStockToolbox() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PlatformItem | ServiceItem | null>(null)
  const [newItemType, setNewItemType] = useState("platform") // 'platform' or 'service'

  // 新增/编辑表单状态
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    url: "",
    icon: "Settings",
    color: "bg-blue-500",
  })

  // 管理平台配置
  const [managementPlatforms, setManagementPlatforms] = useState<PlatformItem[]>([
    {
      id: "ainews",
      name: "AINEWS运营管理",
      description: "AI新闻内容管理和发布平台",
      icon: FileText,
      iconName: "FileText",
      status: "运行中",
      url: "/ainews-admin",
      color: "bg-blue-500",
    },
    {
      id: "indicators",
      name: "指标服务管理",
      description: "金融指标数据服务运营管理",
      icon: BarChart3,
      iconName: "BarChart3",
      status: "运行中",
      url: "/indicators-admin",
      color: "bg-green-500",
    },
    {
      id: "f9menu",
      name: "F9菜单管理",
      description: "F9快捷菜单配置和权限管理",
      icon: Settings,
      iconName: "Settings",
      status: "运行中",
      url: "/f9menu-admin",
      color: "bg-purple-500",
    },
    {
      id: "research",
      name: "券商研报权限",
      description: "定制券商研报访问权限管理",
      icon: Shield,
      iconName: "Shield",
      status: "运行中",
      url: "/research-admin",
      color: "bg-orange-500",
    },
    {
      id: "docparser",
      name: "DocParser密钥管理",
      description: "文档解析服务API密钥管理",
      icon: Key,
      iconName: "Key",
      status: "运行中",
      url: "/docparser-admin",
      color: "bg-red-500",
    },
    {
      id: "enti",
      name: "ENTI管理员设置",
      description: "企业实体管理员权限配置",
      icon: Users,
      iconName: "Users",
      status: "运行中",
      url: "/enti-admin",
      color: "bg-indigo-500",
    },
    {
      id: "email",
      name: "邮件订阅管理",
      description: "邮件订阅服务运营管理",
      icon: Mail,
      iconName: "Mail",
      status: "运行中",
      url: "/email-admin",
      color: "bg-pink-500",
    },
    {
      id: "prompt",
      name: "Prompt管理平台",
      description: "AI提示词模板管理和优化",
      icon: Code,
      iconName: "Code",
      status: "运行中",
      url: "/prompt-admin",
      color: "bg-teal-500",
    },
  ])

  // 技术服务工具
  const [techServices, setTechServices] = useState<ServiceItem[]>([
    {
      id: "ocean",
      name: "Ocean服务",
      description: "海量数据处理服务",
      icon: Database,
      iconName: "Database",
      url: "/ocean",
    },
    {
      id: "cloud",
      name: "Cloud服务",
      description: "云计算资源管理",
      icon: Cloud,
      iconName: "Cloud",
      url: "/cloud",
    },
    {
      id: "wss",
      name: "WSS指标服务",
      description: "WebSocket实时指标推送",
      icon: Zap,
      iconName: "Zap",
      url: "/wss",
    },
    {
      id: "rag",
      name: "RAG服务",
      description: "检索增强生成服务",
      icon: Globe,
      iconName: "Globe",
      url: "/rag",
    },
    {
      id: "html2img",
      name: "HTML转图工具",
      description: "HTML页面转图片工具",
      icon: FileText,
      iconName: "FileText",
      url: "/html2img",
    },
  ])

  const menuItems = [
    { id: "dashboard", label: "工作台", icon: Home },
    { id: "platforms", label: "管理平台", icon: Settings },
    { id: "services", label: "技术服务", icon: Database },
    { id: "config", label: "链接配置", icon: Link },
    { id: "docs", label: "文档中心", icon: BookOpen },
    { id: "monitoring", label: "系统监控", icon: BarChart3 },
  ]

  const handleForumClick = () => {
    window.open("http://10.106.19.29:8090/", "_blank")
  }

  const handlePlatformUrlChange = (id: string, newUrl: string) => {
    setManagementPlatforms((prev) =>
      prev.map((platform) => (platform.id === id ? { ...platform, url: newUrl } : platform)),
    )
  }

  const handleServiceUrlChange = (id: string, newUrl: string) => {
    setTechServices((prev) => prev.map((service) => (service.id === id ? { ...service, url: newUrl } : service)))
  }

  const handleSaveConfig = () => {
    alert("配置已保存！")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      url: "",
      icon: "Settings",
      color: "bg-blue-500",
    })
    setEditingItem(null)
  }

  const handleAddNew = (type: string) => {
    setNewItemType(type)
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: PlatformItem | ServiceItem, type: string) => {
    setNewItemType(type)
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      url: item.url,
      icon: item.iconName || "Settings",
      color: item.color || "bg-blue-500",
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string, type: string) => {
    if (confirm("确定要删除这个配置项吗？")) {
      if (type === "platform") {
        setManagementPlatforms((prev) => prev.filter((item) => item.id !== id))
      } else {
        setTechServices((prev) => prev.filter((item) => item.id !== id))
      }
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.url) {
      alert("请填写名称和链接地址")
      return
    }

    const iconComponent = iconOptions.find((opt) => opt.value === formData.icon)?.icon || Settings
    const newItem = {
      id: (editingItem && (editingItem as PlatformItem | ServiceItem).id) ? (editingItem as PlatformItem | ServiceItem).id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      url: formData.url,
      icon: iconComponent,
      iconName: formData.icon,
      color: formData.color,
      status: "运行中",
    }

    if (editingItem) {
      // 编辑现有项目
      if (newItemType === "platform") {
        setManagementPlatforms((prev) => prev.map((item) => (item.id === (editingItem as PlatformItem | ServiceItem).id ? newItem : item)))
      } else {
        setTechServices((prev) => prev.map((item) => (item.id === (editingItem as PlatformItem | ServiceItem).id ? newItem : item)))
      }
    } else {
      // 添加新项目
      if (newItemType === "platform") {
        setManagementPlatforms((prev) => [...prev, newItem])
      } else {
        setTechServices((prev) => [...prev, newItem])
      }
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const renderIconGrid = () => {
    return (
      <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
        {iconOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <div
              key={option.value}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-1 ${
                formData.icon === option.value ? "bg-blue-100 border-blue-500 border-2" : "border"
              }`}
              onClick={() => setFormData({ ...formData, icon: option.value })}
              title={option.label}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-xs text-center">{option.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderColorGrid = () => {
    return (
      <div className="grid grid-cols-10 gap-2 p-2 border rounded">
        {colorOptions.map((option) => (
          <div
            key={option.value}
            className={`w-8 h-8 rounded cursor-pointer border-2 ${
              formData.color === option.value ? "border-gray-800" : "border-gray-300"
            }`}
            style={{ backgroundColor: option.color }}
            onClick={() => setFormData({ ...formData, color: option.value })}
            title={option.label}
          />
        ))}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* 论坛大卡片 - 占据显著位置 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card
                  className="h-64 cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-none"
                  onClick={handleForumClick}
                >
                  <CardContent className="h-full flex flex-col items-center justify-center text-white p-8">
                    <MessageSquare className="h-16 w-16 mb-4" />
                    <h2 className="text-3xl font-bold mb-2">技术论坛</h2>
                    <p className="text-lg text-center mb-6 text-blue-100">新员工学习交流平台，技术分享与问题讨论</p>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={handleForumClick}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      访问论坛
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">管理平台</div>
                        <div className="text-sm text-gray-500">{managementPlatforms.length}个平台</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">技术服务</div>
                        <div className="text-sm text-gray-500">{techServices.length}个服务</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 常用管理平台 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  常用管理平台
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {managementPlatforms.slice(0, 6).map((platform) => {
                    const Icon = platform.icon
                    return (
                      <div
                        key={platform.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                        onClick={() => window.open(platform.url, "_blank")}
                      >
                        <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-blue-600">{platform.name}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 技术服务 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  技术服务
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {techServices.map((service, index) => {
                    const Icon = service.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                        onClick={() => window.open(service.url, "_blank")}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-blue-600">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "platforms":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">管理平台</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{managementPlatforms.length}个平台</Badge>
                <Button onClick={() => handleAddNew("platform")} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新增平台
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Card key={platform.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-blue-600">{platform.name}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(platform, "platform")}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(platform.id, "platform")}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{platform.description}</p>
                      <Button
                        className="w-full bg-transparent"
                        variant="outline"
                        onClick={() => window.open(platform.url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        访问平台
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case "services":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">技术服务</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{techServices.length}个服务</Badge>
                <Button onClick={() => handleAddNew("service")} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新增服务
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techServices.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-blue-600">{service.name}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service, "service")}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id, "service")}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <Button
                        className="w-full bg-transparent"
                        variant="outline"
                        onClick={() => window.open(service.url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        访问服务
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case "config":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">链接配置管理</h2>
              <Button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
            </div>

            {/* 管理平台链接配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  管理平台链接配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {managementPlatforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div
                      key={platform.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-sm text-gray-500">{platform.description}</div>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`platform-${platform.id}`}>链接地址</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`platform-${platform.id}`}
                            value={platform.url}
                            onChange={(e) => handlePlatformUrlChange(platform.id, e.target.value)}
                            placeholder="请输入平台链接地址"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(platform.url, "_blank")}
                            disabled={!platform.url}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Separator />

            {/* 技术服务链接配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  技术服务链接配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {techServices.map((service) => {
                  const Icon = service.icon
                  return (
                    <div
                      key={service.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`service-${service.id}`}>链接地址</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`service-${service.id}`}
                            value={service.url}
                            onChange={(e) => handleServiceUrlChange(service.id, e.target.value)}
                            placeholder="请输入服务链接地址"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(service.url, "_blank")}
                            disabled={!service.url}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">功能开发中</h2>
            <p className="text-gray-500">该功能正在开发中，敬请期待！</p>
          </div>
        )
    }
  }

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
              const Icon = item.icon
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
              )
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
                    <div className="font-medium">系统管理员</div>
                    <div className="text-sm text-gray-500">admin@company.com</div>
                    <div className="text-sm text-gray-500">域名: company.com</div>
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "编辑" : "新增"}
              {newItemType === "platform" ? "管理平台" : "技术服务"}
            </DialogTitle>
            <DialogDescription>
              请填写{newItemType === "platform" ? "管理平台" : "技术服务"}的基本信息
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入描述信息"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">链接地址 *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="请输入链接地址，如：https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>选择图标</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">当前选择：</span>
                  <div className={`w-8 h-8 ${formData.color} rounded flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = iconOptions.find((opt) => opt.value === formData.icon)?.icon || Settings
                      return <IconComponent className="h-4 w-4 text-white" />
                    })()}
                  </div>
                  <span className="text-sm">
                    {iconOptions.find((opt) => opt.value === formData.icon)?.label || "设置"}
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
                      backgroundColor: colorOptions.find((opt) => opt.value === formData.color)?.color || "#3b82f6",
                    }}
                  />
                  <span className="text-sm">
                    {colorOptions.find((opt) => opt.value === formData.color)?.label || "蓝色"}
                  </span>
                </div>
                {renderColorGrid()}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>{editingItem ? "保存" : "添加"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
