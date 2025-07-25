import { BookOpen } from "lucide-react";

export default function Docs() {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <BookOpen className="h-24 w-24 mx-auto text-gray-400 mb-4" />
      </div>
      <h2 className="text-2xl font-bold mb-4">文档中心</h2>
      <p className="text-gray-500 mb-8">该功能正在开发中，敬请期待！</p>
      <div className="text-sm text-gray-400">
        <p>未来这里将包含：</p>
        <ul className="mt-2 space-y-1">
          <li>• API 文档</li>
          <li>• 操作指南</li>
          <li>• 技术规范</li>
          <li>• 常见问题</li>
        </ul>
      </div>
    </div>
  );
}
