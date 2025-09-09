import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

// 定义兼容的variant类型，映射到Ant Design的属性
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends Omit<AntButtonProps, 'type' | 'size' | 'danger'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean; // 保留兼容性，但不使用
}

// variant到Ant Design type的映射
const getAntButtonType = (variant?: ButtonVariant): AntButtonProps['type'] => {
  switch (variant) {
    case 'default':
      return 'primary';
    case 'destructive':
      return 'primary'; // 将使用danger属性
    case 'outline':
      return 'default';
    case 'secondary':
      return 'dashed';
    case 'ghost':
      return 'text';
    case 'link':
      return 'link';
    default:
      return 'default';
  }
};

// size到Ant Design size的映射
const getAntButtonSize = (size?: ButtonSize): AntButtonProps['size'] => {
  switch (size) {
    case 'sm':
      return 'small';
    case 'lg':
      return 'large';
    case 'icon':
      return 'middle';
    case 'default':
    default:
      return 'middle';
  }
};

function Button({
  variant = "default",
  size = "default",
  asChild = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const antType = getAntButtonType(variant);
  const antSize = getAntButtonSize(size);
  
  // destructive variant特殊处理
  const isDanger = variant === 'destructive';
  
  return (
    <AntButton
      type={antType}
      size={antSize}
      danger={isDanger}
      className={className}
      {...props}
    >
      {children}
    </AntButton>
  );
}

export { Button };
export type { ButtonProps };
