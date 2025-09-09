import React from "react";
import { Card as AntCard, CardProps as AntCardProps } from "antd";

const { Meta } = AntCard;

interface CardProps extends AntCardProps {
  // 保持与原有API兼容
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <AntCard
      className={className}
      {...props}
    >
      {children}
    </AntCard>
  );
}

// Card子组件
function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`card-header ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 className={`card-title font-semibold text-lg ${className || ''}`} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={`card-description text-gray-600 text-sm ${className || ''}`} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`card-content ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`card-footer flex items-center justify-between mt-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

// 为了向后兼容保留CardAction
function CardAction({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`card-action ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardAction,
  Meta as CardMeta
};
export type { CardProps };