import { BarChart3, Activity } from "lucide-react";

export default function Monitoring() {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <BarChart3 className="h-24 w-24 mx-auto text-gray-400 mb-4" />
      </div>
      <h2 className="text-2xl font-bold mb-4">系统监控</h2>
      <p className="text-gray-500 mb-8">该功能正在开发中，敬请期待！</p>
      <div className="text-sm text-gray-400">
        <p>未来这里将包含：</p>
        <ul className="mt-2 space-y-1">
          <li>• 系统性能监控</li>
          <li>• 服务状态监控</li>
          <li>• 实时数据大屏</li>
          <li>• 告警通知</li>
        </ul>
      </div>
    </div>
  );
}
