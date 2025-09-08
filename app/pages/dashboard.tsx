// 首页
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  ExternalLink,
  Settings,
  Database,
  TrendingUp,
} from "lucide-react";
import { PageProps } from "./types";
import { iconOptions } from "./data";

// 获取图标组件
const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

// 访问平台/服务的函数 - 根据URL类型选择打开方式
function openItem(url: string, urlType?: string) {
  console.log("openItem", { url, urlType });
  
  if (urlType === 'internal') {
    // 内网链接 - 在新标签页中打开
    window.open(url, '_blank');
  } 
  // else if (urlType === 'internal_terminal') {
  //   // 终端内跳转 - 使用当前域名拼接
  //   const fullUrl = window.location.origin + url;
  //   window.open(fullUrl, '_blank');
  // } 
  else {
    // 终端命令或默认情况 - 使用windlocal协议
    window.location.href = "windlocal://open?" + encodeURIComponent(url);
  }
}

export default function Dashboard({
  managementPlatforms,
  techServices,
}: PageProps) {
  const handleForumClick = () => {
    window.open("http://10.106.19.29:8090/", "_blank");
  };

  console.log('Dashboard组件接收数据:', { 
    managementPlatforms, 
    techServicesLength: techServices?.length,
    managementPlatformsLength: managementPlatforms?.length
  });

  return (
    <div className="space-y-6">
      {/* 论坛大卡片 - 占据显著位置 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            className="h-64 cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-none"
            onClick={handleForumClick}
          >
            <CardContent className="h-full flex flex-col items-center justify-center text-white p-6 relative">
              <MessageSquare className="h-14 w-14 mb-3" />
              <h2 className="text-2xl font-bold mb-2">技术论坛</h2>
              <p className="text-base text-center mb-4 text-blue-100 max-w-sm">
                新员工学习交流平台，技术分享与问题讨论
              </p>
              <div className="flex justify-center w-full">
                <Button
                  size="default"
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleForumClick();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  访问论坛
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">管理平台</div>
                    <div className="text-sm text-blue-600 font-medium">
                      专业管理工具集
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{managementPlatforms.length}</div>
                  <div className="text-xs text-gray-500">个平台</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">技术服务</div>
                    <div className="text-sm text-green-600 font-medium">
                      核心技术支撑
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{techServices.length}</div>
                  <div className="text-xs text-gray-500">个服务</div>
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
            {managementPlatforms.map((platform) => {
              const Icon = getIconByName(platform.iconName);
              return (
                <div
                  key={platform.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => openItem(platform.url, platform.urlType)}
                >
                  <div
                    className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium group-hover:text-blue-600">
                      {platform.name}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              );
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
            {techServices.map((service) => {
              const Icon = getIconByName(service.iconName);
              return (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => openItem(service.url, service.urlType)}
                >
                  <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium group-hover:text-blue-600">
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
