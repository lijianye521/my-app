import { useState } from "react";
import { Button, Card, Tag, Typography, Space, theme } from "antd";
import { PlusOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MenuOutlined, CheckOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { PageProps, PlatformItem, ServiceItem } from "./types";
import { iconOptions, colorOptions } from "./data";
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

// 获取颜色值
const getColorByValue = (colorValue: string | undefined) => {
  if (!colorValue) return '#3b82f6';
  const colorOption = colorOptions.find((option) => option.value === colorValue);
  return colorOption ? colorOption.color : '#3b82f6';
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
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const platformColor = getColorByValue(platform.color);
  
  return (
    <div style={{
      background: `linear-gradient(45deg, ${token.colorPrimary}20, ${token.colorPrimaryBg})`,
      padding: 2,
      borderRadius: token.borderRadiusLG
    }}>
      <Card
        style={{
          backgroundColor: 'white',
          height: 192,
          borderRadius: token.borderRadiusLG
        }}
        styles={{
          body: { padding: 0 },
          header: { padding: '16px 20px', borderBottom: 'none' }
        }}
        title={
          <Space align="center">
            <MenuOutlined style={{ color: token.colorTextSecondary }} />
            <div
              style={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${platformColor}, ${platformColor}cc)`,
                borderRadius: token.borderRadiusLG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
              {platform.name}
            </Title>
          </Space>
        }
      >
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ minHeight: 20, marginBottom: 16 }}>
            {platform.description && (
              <Text type="secondary" style={{ fontSize: 13 }} ellipsis>
                {platform.description}
              </Text>
            )}
          </div>
          <Button
            block
            disabled
            icon={<ExportOutlined />}
          >
            访问平台
          </Button>
        </div>
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
  
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const [isHovered, setIsHovered] = useState(false);
  const platformColor = getColorByValue(platform.color);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1 : 0,
    cursor: isSorting ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };
  
  const Icon = getIconByName(platform.iconName);
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="gradient-border touch-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        hoverable={!isSorting}
        style={{
          backgroundColor: 'white',
          height: 192,
          ...(isDragging && { 
            boxShadow: `0 0 0 2px ${token.colorPrimary}`,
            transform: 'scale(1.02)' 
          })
        }}
        styles={{
          body: { padding: 0 },
          header: { padding: '16px 20px', borderBottom: 'none' }
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space align="center">
              {isSorting && (
                <MenuOutlined style={{ color: token.colorTextSecondary }} />
              )}
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${platformColor}, ${platformColor}cc)`,
                  borderRadius: token.borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
                {platform.name}
              </Title>
            </Space>
            {!isSorting && (
              <Space 
                size="small" 
                style={{ 
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out'
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(platform, "platform");
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(platform.id, "platform");
                  }}
                />
              </Space>
            )}
          </div>
        }
      >
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ minHeight: 20, marginBottom: 16 }}>
            {platform.description && (
              <Text type="secondary" style={{ fontSize: 13 }} ellipsis title={platform.description}>
                {platform.description}
              </Text>
            )}
          </div>
          <Button
            block
            type="default"
            icon={<ExportOutlined />}
            onClick={() => openPlatform(platform.url, platform.urlType)}
            disabled={isSorting}
          >
            访问平台
          </Button>
        </div>
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
  
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>
          管理平台
        </Title>
        <Space>
          {/* 排序按钮 */}
          <Button
            icon={<SortAscendingOutlined />}
            onClick={toggleSorting}
            type={isSorting ? "primary" : "default"}
            style={isSorting ? { backgroundColor: token.colorWarning } : {}}
          >
            {isSorting ? "取消排序" : "排序"}
          </Button>
          
          {/* 确认排序按钮 */}
          {isSorting && (
            <Button
              icon={<CheckOutlined />}
              onClick={saveSortOrder}
              type="primary"
              style={{ backgroundColor: token.colorSuccess, borderColor: token.colorSuccess }}
            >
              确认排序
            </Button>
          )}
          
          {/* 新增平台按钮 */}
          {!isSorting && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => onAddNew?.("platform")}
              type="primary"
            >
              新增平台
            </Button>
          )}
        </Space>
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24
            }}>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24
        }}>
          {managementPlatforms.map((platform) => {
            const Icon = getIconByName(platform.iconName);
            const platformColor = getColorByValue(platform.color);
            const [isHovered, setIsHovered] = useState(false);
            
            return (
              <div 
                key={platform.id} 
                className="gradient-border"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Card
                  hoverable
                  style={{
                    backgroundColor: 'white',
                    height: 192
                  }}
                  styles={{
                    body: { padding: 0 },
                    header: { padding: '16px 20px', borderBottom: 'none' }
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Space align="center">
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            background: `linear-gradient(135deg, ${platformColor}, ${platformColor}cc)`,
                            borderRadius: token.borderRadiusLG,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
                          {platform.name}
                        </Title>
                      </Space>
                      <Space 
                        size="small" 
                        style={{ 
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.2s ease-in-out'
                        }}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(platform, "platform");
                          }}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(platform.id, "platform");
                          }}
                        />
                      </Space>
                    </div>
                  }
                >
                  <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ minHeight: 20, marginBottom: 16 }}>
                      {platform.description && (
                        <Text type="secondary" style={{ fontSize: 13 }} ellipsis title={platform.description}>
                          {platform.description}
                        </Text>
                      )}
                    </div>
                    <Button
                      block
                      type="default"
                      icon={<ExportOutlined />}
                      onClick={() => openPlatform(platform.url, platform.urlType)}
                    >
                      访问平台
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
