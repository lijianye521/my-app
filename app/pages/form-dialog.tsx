import { useState, useEffect, forwardRef } from "react";
import { 
  Button, 
  Input, 
  Modal, 
  Form, 
  Select, 
  Typography, 
  Space, 
  theme
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { SettingOutlined } from "@ant-design/icons";
import { FormDataType, PlatformItem, ServiceItem, UrlType } from "./types";
import { iconOptions, colorOptions, urlTypeOptions } from "./data";

// 创建一个适配器组件，将Lucide图标转换为兼容Ant Design的组件
interface LucideIconWrapperProps {
  icon: React.ComponentType<any>;
  style?: {
    fontSize?: number;
    color?: string;
  };
  [key: string]: any;
}

const LucideIconWrapper = forwardRef<unknown, LucideIconWrapperProps>(
  ({ icon: Icon, style, ...props }, ref) => {
    // 传递必要的属性并保持ref引用
    return Icon ? <Icon ref={ref} {...props} size={style?.fontSize || 16} color={style?.color} /> : null;
  }
);

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormDataType) => void;
  editingItem: PlatformItem | ServiceItem | null;
  itemType: string; // 'platform' or 'service'
}

export default function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  itemType,
}: FormDialogProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { Title, Text, Paragraph } = Typography;

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = (values: FormDataType) => {
    onSubmit(values);
    handleClose();
  };

  // 当editingItem变化时，重置表单数据
  const [selectedIcon, setSelectedIcon] = useState<string>("Settings");
  const [selectedColor, setSelectedColor] = useState<string>("bg-blue-500");

  useEffect(() => {
    if (editingItem) {
      const iconName = editingItem.iconName || "Settings";
      const color = editingItem.color || "bg-blue-500";
      
      setSelectedIcon(iconName);
      setSelectedColor(color);
      
      form.setFieldsValue({
        name: editingItem.name,
        description: editingItem.description,
        url: editingItem.url,
        icon: iconName,
        color: color,
        urlType: editingItem.urlType || 'internal',
        otherInformation: editingItem.otherInformation
      });
    } else {
      setSelectedIcon("Settings");
      setSelectedColor("bg-blue-500");
      form.resetFields();
    }
  }, [editingItem, form]);

  return (
    <Modal
      title={
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {editingItem ? "编辑" : "新增"}{itemType === "platform" ? "管理平台" : "技术服务"}
          </Title>
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 14 }}>
            请填写{itemType === "platform" ? "管理平台" : "技术服务"}的基本信息
          </Paragraph>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={() => form.submit()}
        >
          {editingItem ? "保存" : "添加"}
        </Button>,
      ]}
      width={800}
      styles={{ 
        body: { 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '12px 24px' 
        } 
      }}
    >

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: "",
            description: "",
            url: "",
            icon: "Settings",
            color: "bg-blue-500",
            urlType: "internal",
            otherInformation: ""
          }}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea 
              placeholder="请输入描述信息"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="urlType"
            label="链接类型"
            rules={[{ required: true, message: '请选择链接类型' }]}
          >
            <Select placeholder="请选择链接类型">
              {urlTypeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="url"
            label={form.getFieldValue('urlType') === 'terminal' ? '终端命令' : '链接地址'}
            rules={[{ required: true, message: '请输入链接地址或终端命令' }]}
          >
            <Input
              placeholder={
                form.getFieldValue('urlType') === 'terminal'
                  ? "请输入windlocal命令，如：windlocal://open?cmd=notepad"
                  : "请输入链接地址，如：http://10.106.19.29:8090/"
              }
            />
          </Form.Item>

          <Form.Item
            name="otherInformation"
            label="其他信息"
          >
            <TextArea
              placeholder="请输入其他信息（可选，JSON格式）"
              rows={2}
            />
          </Form.Item>

          <Form.Item label="选择图标" name="icon">
            <div>
              <Space align="center" style={{ marginBottom: 8 }}>
                <Text type="secondary">当前选择：</Text>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: colorOptions.find(opt => opt.value === selectedColor)?.color || '#3b82f6',
                    borderRadius: token.borderRadiusLG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {(() => {
                    const iconOption = iconOptions.find((opt) => opt.value === selectedIcon);
                    return (
                      <LucideIconWrapper 
                        icon={iconOption?.icon} 
                        style={{ color: '#fff', fontSize: 16 }} 
                      />
                    );
                  })()}
                </div>
                <Text>
                  {iconOptions.find((opt) => opt.value === selectedIcon)?.label || "设置"}
                </Text>
              </Space>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: 8, 
                maxHeight: 192, 
                overflowY: 'auto',
                padding: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG
              }}>
                {iconOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedIcon(option.value);
                      form.setFieldValue('icon', option.value);
                    }}
                      style={{
                        padding: 8,
                        borderRadius: token.borderRadius,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        // 统一使用2px边框，只改变颜色，不改变粗细
                        border: selectedIcon === option.value 
                          ? `2px solid ${token.colorPrimary}` 
                          : `2px solid transparent`,
                        backgroundColor: 'transparent',
                        boxSizing: 'border-box'
                      }}
                  >
                    <LucideIconWrapper 
                      icon={option.icon} 
                      style={{ fontSize: 16 }} 
                    />
                    <Text style={{ fontSize: 12 }}>{option.label}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Form.Item>

          <Form.Item label="选择颜色" name="color">
            <div>
              <Space align="center" style={{ marginBottom: 8 }}>
                <Text type="secondary">当前选择：</Text>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: colorOptions.find((opt) => opt.value === selectedColor)?.color || '#3b82f6',
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`
                  }}
                />
                <Text>
                  {colorOptions.find((opt) => opt.value === selectedColor)?.label || "蓝色"}
                </Text>
              </Space>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)', 
                gap: 8, 
                padding: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG
              }}>
                {colorOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedColor(option.value);
                      form.setFieldValue('color', option.value);
                    }}
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: option.color,
                        borderRadius: token.borderRadiusLG,
                        cursor: 'pointer',
                        boxShadow: selectedColor === option.value
                          ? `0 0 0 2px white, 0 0 0 4px ${token.colorPrimary}`
                          : 'none'
                      }}
                  />
                ))}
              </div>
            </div>
          </Form.Item>
        </Form>
    </Modal>
  );
}
