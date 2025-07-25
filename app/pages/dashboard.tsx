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

export default function Dashboard({
  managementPlatforms,
  techServices,
}: PageProps) {
  const handleForumClick = () => {
    window.open("http://10.106.19.29:8090/", "_blank");
  };

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
              <p className="text-lg text-center mb-6 text-blue-100">
                新员工学习交流平台，技术分享与问题讨论
              </p>
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
                  <div className="text-sm text-gray-500">
                    {managementPlatforms.length}个平台
                  </div>
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
                  <div className="text-sm text-gray-500">
                    {techServices.length}个服务
                  </div>
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
              const Icon = platform.icon;
              return (
                <div
                  key={platform.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => window.open(platform.url, "_blank")}
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
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer group"
                  onClick={() => window.open(service.url, "_blank")}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
