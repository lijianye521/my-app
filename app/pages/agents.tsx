import { useState } from "react";
import { Button, Card, Tag, Typography, Space, theme, message } from "antd";
import { PlusOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MenuOutlined, CheckOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { PageProps, PlatformItem, ServiceItem } from "./types";
import { iconOptions, colorOptions } from "./data";
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

// Agent项类型定义
export interface AgentItem extends ServiceItem {
  // Agent特有属性可以在这里扩展
}

// 定义拖拽动画
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0',  // 完全隐藏原始位置的项
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
  if (!colorValue) return '#8b5cf6';  // Agent使用紫色作为默认色
  const colorOption = colorOptions.find((option) => option.value === colorValue);
  return colorOption ? colorOption.color : '#8b5cf6';
};

// 访问Agent的函数 - 根据URL类型选择打开方式
function openAgent(url: string, urlType?: string) {
  console.log("openAgent", { url, urlType });
  
  if (urlType === 'internal') {
    // 内网链接 - 在新标签页中打开
    window.open(url, '_blank');
  } else {
    // 终端命令或默认情况 - 使用windlocal协议
    window.location.href = "windlocal://open?" + encodeURIComponent(url);
  }
}

// Agent卡片组件 - 用于拖拽覆盖层
function AgentCard({ agent }: { agent: AgentItem }) {
  const Icon = getIconByName(agent.iconName);
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const agentColor = getColorByValue(agent.color);
  
  return (
    <div style={{
      background: `linear-gradient(45deg, ${token.colorWarning}20, ${token.colorWarningBg})`,
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
                background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
                borderRadius: token.borderRadiusLG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <Title level={5} style={{ margin: 0, color: token.colorWarning }}>
              {agent.name}
            </Title>
          </Space>
        }
      >
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ minHeight: 20, marginBottom: 16 }}>
            {agent.description && (
              <Text type="secondary" style={{ fontSize: 13 }} ellipsis>
                {agent.description}
              </Text>
            )}
          </div>
          <Button
            block
            disabled
            icon={<ExportOutlined />}
          >
            访问Agent
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Agent卡片项组件 - 用于非排序模式
interface AgentCardItemProps {
  agent: AgentItem;
  onEdit: ((item: PlatformItem | ServiceItem, type: string) => void) | undefined;
  onDelete: ((id: string, type: string) => void) | undefined;
}

function AgentCardItem({ agent, onEdit, onDelete }: AgentCardItemProps) {
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const [isHovered, setIsHovered] = useState(false);
  const agentColor = getColorByValue(agent.color);
  const Icon = getIconByName(agent.iconName);
  
  return (
    <div 
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
                  background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
                  borderRadius: token.borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <Title level={5} style={{ margin: 0, color: token.colorWarning }}>
                {agent.name}
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
                  onEdit?.(agent, "agent");
                }}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(agent.id, "agent");
                }}
              />
            </Space>
          </div>
        }
      >
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ minHeight: 20, marginBottom: 16 }}>
            {agent.description && (
              <Text type="secondary" style={{ fontSize: 13 }} ellipsis title={agent.description}>
                {agent.description}
              </Text>
            )}
          </div>
          <Button
            block
            type="default"
            icon={<ExportOutlined />}
            onClick={() => openAgent(agent.url, agent.urlType)}
          >
            访问Agent
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 排序项组件
interface SortableAgentItemProps {
  agent: AgentItem;
  isSorting: boolean;
  onEdit: ((item: PlatformItem | ServiceItem, type: string) => void) | undefined;
  onDelete: ((id: string, type: string) => void) | undefined;
}

function SortableAgentItem({ agent, isSorting, onEdit, onDelete }: SortableAgentItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: agent.id });
  
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const [isHovered, setIsHovered] = useState(false);
  const agentColor = getColorByValue(agent.color);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1 : 0,
    cursor: isSorting ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };
  
  const Icon = getIconByName(agent.iconName);
  
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
            boxShadow: `0 0 0 2px ${token.colorWarning}`,
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
                  background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
                  borderRadius: token.borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <Title level={5} style={{ margin: 0, color: token.colorWarning }}>
                {agent.name}
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
                    onEdit?.(agent, "agent");
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(agent.id, "agent");
                  }}
                />
              </Space>
            )}
          </div>
        }
      >
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ minHeight: 20, marginBottom: 16 }}>
            {agent.description && (
              <Text type="secondary" style={{ fontSize: 13 }} ellipsis title={agent.description}>
                {agent.description}
              </Text>
            )}
          </div>
          <Button
            block
            type="default"
            icon={<ExportOutlined />}
            onClick={() => openAgent(agent.url, agent.urlType)}
            disabled={isSorting}
          >
            访问Agent
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface AgentPageProps extends PageProps {
  agents?: AgentItem[];
  setAgents?: (agents: AgentItem[]) => void;
}

export default function Agents({
  agents = [],
  setAgents,
  onAddNew,
  onEdit,
  onDelete,
}: AgentPageProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [sortedItems, setSortedItems] = useState([...agents]);
  const [activeAgent, setActiveAgent] = useState<AgentItem | null>(null);
  
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
      setActiveAgent(activeItem);
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
    
    setActiveAgent(null);
  };
  
  const toggleSorting = () => {
    if (!isSorting) {
      // 进入排序模式
      setSortedItems([...agents]);
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
          type: 'agent'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 更新前端状态
        setAgents?.(sortedItems);
        setIsSorting(false);
        message.success('Agent排序更新成功');
      } else {
        message.error(result.message || '保存排序时发生错误');
      }
    } catch (error) {
      console.error('更新排序失败:', error);
      message.error('更新排序过程中发生错误，请查看控制台');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>
          AI Agent
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
          
          {/* 新增Agent按钮 */}
          {!isSorting && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => onAddNew?.("agent")}
              type="primary"
              style={{ backgroundColor: token.colorWarning, borderColor: token.colorWarning }}
            >
              新增Agent
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
              {sortedItems.map((agent) => (
                <SortableAgentItem 
                  key={agent.id}
                  agent={agent}
                  isSorting={isSorting}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation} className="cursor-grabbing">
            {activeAgent ? <AgentCard agent={activeAgent} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24
        }}>
          {agents.map((agent) => (
            <AgentCardItem
              key={agent.id}
              agent={agent}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}