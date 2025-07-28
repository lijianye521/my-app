import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Edit, Trash2, GripVertical, Check, ArrowDownWideNarrow } from "lucide-react";
import { PageProps, PlatformItem, ServiceItem } from "./types";
import { iconOptions } from "./data";
import { useToast } from "@/components/ui/use-toast";
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

// Wind终端专用的页面启动函数
function launch(params: string) {
  console.log("launch", params);
  window.location.href = "windlocal://open?" + encodeURIComponent(params);
}

// 平台卡片组件 - 用于拖拽覆盖层
function PlatformCard({ platform }: { platform: PlatformItem }) {
  const Icon = getIconByName(platform.iconName);
  
  return (
    <div className="gradient-border">
      <Card className="bg-white group">
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
        <CardContent>
          <p className="text-gray-600 mb-4">{platform.description}</p>
          <Button
            className="w-full bg-transparent"
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
      <Card className={`bg-white group ${isDragging ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
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
        <CardContent>
          <p className="text-gray-600 mb-4">{platform.description}</p>
          <Button
            className="w-full bg-transparent"
            variant="outline"
            onClick={() => launch(platform.url)}
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
  const { toast } = useToast();
  
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
        toast({
          title: "排序更新成功",
          type: "success",
        });
      } else {
        toast({
          title: "排序更新失败",
          description: result.message,
          type: "destructive",
        });
      }
    } catch (error) {
      console.error('更新排序失败:', error);
      toast({
        title: "更新失败",
        description: "更新排序过程中发生错误，请查看控制台",
        type: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">管理平台</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{managementPlatforms.length}个平台</Badge>
          
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
      )}
    </div>
  );
}
