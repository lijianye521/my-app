import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Edit, Trash2, GripVertical, Check, ArrowDownWideNarrow, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageProps, PlatformItem, ServiceItem } from "./types";
import { iconOptions } from "./data";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 定义拖拽动画
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0',  // 从0.5改为0，完全隐藏原始位置的项
      },
    },
  }),
};

// 获取图标组件
const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

// 访问平台的函数 - 根据URL类型选择打开方式
function openPlatform(url: string, urlType?: string) {
  console.log("openPlatform", { url, urlType });
  
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

// 平台卡片组件 - 用于拖拽覆盖层
function PlatformCard({ platform }: { platform: PlatformItem }) {
  const Icon = getIconByName(platform.iconName);
  
  return (
    <div className="gradient-border">
      <Card className="bg-white group h-48">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 添加GripVertical图标，在拖拽覆盖层中显示 */}
              <div className="mr-1 text-gray-400">
                <GripVertical className="h-5 w-5" />
              </div>
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
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-between" style={{ minHeight: '120px' }}>
          <div className="flex-1">
            {platform.description && (
              <p className="text-gray-600 mb-4 truncate" title={platform.description}>
                {platform.description}
              </p>
            )}
          </div>
          <Button
            className="w-full bg-transparent mt-auto"
            variant="outline"
            disabled
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            访问平台
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 排序项组件
interface SortablePlatformItemProps {
  platform: PlatformItem;
  isSorting: boolean;
  onEdit: ((item: PlatformItem | ServiceItem, type: string) => void) | undefined;
  onDelete: ((id: string, type: string) => void) | undefined;
}

function SortablePlatformItem({ platform, isSorting, onEdit, onDelete }: SortablePlatformItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: platform.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,  // 原位置确实需要隐藏
    zIndex: isDragging ? 1 : 0,
    cursor: isSorting ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };
  
  const Icon = getIconByName(platform.iconName);
  
  return (
    <div ref={setNodeRef} style={style} className="gradient-border touch-none" {...attributes} {...listeners}>
      <Card className={`bg-white group h-48 ${isDragging ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSorting && (
                <div className="mr-1 text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>
              )}
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
            {!isSorting && (
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
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-between" style={{ minHeight: '120px' }}>
          <div className="flex-1">
            {platform.description && (
              <p className="text-gray-600 mb-4 truncate" title={platform.description}>
                {platform.description}
              </p>
            )}
          </div>
          <Button
            className="w-full bg-transparent mt-auto"
            variant="outline"
            onClick={() => openPlatform(platform.url, platform.urlType)}
            disabled={isSorting}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            访问平台
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Platforms({
  managementPlatforms,
  setManagementPlatforms,
  onAddNew,
  onEdit,
  onDelete,
}: PageProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [sortedItems, setSortedItems] = useState([...managementPlatforms]);
  const [activePlatform, setActivePlatform] = useState<PlatformItem | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移动距离后激活拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeItem = sortedItems.find(item => item.id === active.id);
    if (activeItem) {
      setActivePlatform(activeItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSortedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActivePlatform(null);
  };
  
  const toggleSorting = () => {
    if (!isSorting) {
      // 进入排序模式
      setSortedItems([...managementPlatforms]);
    }
    setIsSorting(!isSorting);
  };
  
  const saveSortOrder = async () => {
    try {
      // 准备排序数据
      const sortData = sortedItems.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }));
      
      // 调用API更新排序
      const response = await fetch('/api/platforms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: sortData,
          type: 'platform'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 更新前端状态
        setManagementPlatforms(sortedItems);
        setIsSorting(false);
        toast.success('排序更新成功', {
          icon: '👍',
        });
      } else {
        toast.error(result.message || '保存排序时发生错误', {
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('更新排序失败:', error);
      toast.error('更新排序过程中发生错误，请查看控制台', {
        icon: '❌',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">管理平台</h2>
        <div className="flex items-center gap-2">
          
          {/* 排序按钮 */}
          <Button
            onClick={toggleSorting}
            variant={isSorting ? "default" : "outline"}
            className={isSorting ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
            {isSorting ? "取消排序" : "排序"}
          </Button>
          
          {/* 确认排序按钮 */}
          {isSorting && (
            <Button
              onClick={saveSortOrder}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              确认排序
            </Button>
          )}
          
          {/* 新增平台按钮 */}
          {!isSorting && (
            <Button
              onClick={() => onAddNew?.("platform")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增平台
            </Button>
          )}
        </div>
      </div>

      {isSorting ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <SortableContext
            items={sortedItems.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((platform) => (
                <SortablePlatformItem 
                  key={platform.id}
                  platform={platform}
                  isSorting={isSorting}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation} className="cursor-grabbing">
            {activePlatform ? <PlatformCard platform={activePlatform} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementPlatforms.map((platform) => {
            const Icon = getIconByName(platform.iconName);
            return (
              <div key={platform.id} className="gradient-border">
                <Card className="bg-white group h-48">
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
                  <CardContent className="flex flex-col justify-between" style={{ minHeight: '120px' }}>
                    <div className="flex-1">
                      {platform.description && (
                        <p className="text-gray-600 mb-4 truncate" title={platform.description}>
                          {platform.description}
                        </p>
                      )}
                    </div>
                    <Button
                      className="w-full bg-transparent mt-auto"
                      variant="outline"
                      onClick={() => openPlatform(platform.url, platform.urlType)}
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
      )}
    </div>
  );
}
