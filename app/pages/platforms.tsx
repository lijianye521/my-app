import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Edit, Trash2 } from "lucide-react";
import { PageProps } from "./types";
import { iconOptions } from "./data";

// 获取图标组件
const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

// Wind终端专用的页面启动函数
function launch(params: string) {
  console.log("launch", params);
  window.location.href = "windlocal://open?" + encodeURIComponent(params);
}

export default function Platforms({
  managementPlatforms,
  onAddNew,
  onEdit,
  onDelete,
}: PageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">管理平台</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{managementPlatforms.length}个平台</Badge>
          <Button
            onClick={() => onAddNew?.("platform")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增平台
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementPlatforms.map((platform) => {
          const Icon = getIconByName(platform.iconName);
          return (
            <div key={platform.id} className="gradient-border">
              <Card className="bg-white group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-blue-600">
                          {platform.name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(platform, "platform");
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(platform.id, "platform");
                        }}
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
                    onClick={() => launch(platform.url)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    访问平台
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
