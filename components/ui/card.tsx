import React from "react";
import { Card as AntCard, CardProps as AntCardProps } from "antd";

// 使用Ant Design的Card组件，保持原有的API结构
function Card({ className, children, ...props }: React.ComponentProps<"div"> & AntCardProps) {
  return (
    <AntCard 
      className={className}
      {...props}
    >
      {children}
    </AntCard>
  );
}

// CardHeader映射到Card的title和extra区域
function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`mb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`text-lg font-semibold leading-none ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardDescription({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`text-sm text-gray-500 mt-1 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardAction({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`flex justify-end ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`flex items-center mt-4 pt-4 border-t border-gray-200 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
