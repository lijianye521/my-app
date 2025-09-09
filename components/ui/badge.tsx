import React from "react";
import { Tag, TagProps } from "antd";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends Omit<TagProps, 'color'> {
  variant?: BadgeVariant;
  asChild?: boolean; // 保留兼容性，但不使用
}

// variant到Ant Design Tag color的映射
const getTagColor = (variant?: BadgeVariant): TagProps['color'] => {
  switch (variant) {
    case 'default':
      return 'blue';
    case 'secondary':
      return 'default';
    case 'destructive':
      return 'red';
    case 'outline':
      return undefined; // 使用默认样式
    default:
      return 'blue';
  }
};

function Badge({
  variant = "default",
  className,
  children,
  asChild = false,
  ...props
}: BadgeProps) {
  const color = getTagColor(variant);
  
  return (
    <Tag
      color={color}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Badge };
export type { BadgeProps };
