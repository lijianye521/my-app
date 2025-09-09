import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "antd";

// Dialog主组件使用上下文管理状态
const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// DialogTrigger - 触发器组件
interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { setOpen } = React.useContext(DialogContext);
  
  const handleClick = () => {
    setOpen(true);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return <span onClick={handleClick}>{children}</span>;
}

// DialogContent - Modal内容
interface DialogContentProps extends Omit<ModalProps, 'open' | 'onCancel'> {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

function DialogContent({ 
  children, 
  className, 
  showCloseButton = true,
  ...props 
}: DialogContentProps) {
  const { open, setOpen } = React.useContext(DialogContext);

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      className={className}
      closable={showCloseButton}
      centered={true} // 居中显示
      width="auto" // 自适应宽度
      styles={{
        body: {
          padding: '24px', // 确保内容区域有足够的padding
        },
        header: {
          padding: '16px 24px', // 头部padding
          borderBottom: '1px solid #f0f0f0',
        },
        footer: {
          padding: '16px 24px', // 底部padding
          borderTop: '1px solid #f0f0f0',
        }
      }}
      {...props}
    >
      {children}
    </Modal>
  );
}

// DialogHeader - 头部区域
function DialogHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`mb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

// DialogTitle - 标题
function DialogTitle({ className, children, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 className={`text-lg font-semibold leading-none ${className || ''}`} {...props}>
      {children}
    </h2>
  );
}

// DialogDescription - 描述
function DialogDescription({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className || ''}`} {...props}>
      {children}
    </p>
  );
}

// DialogFooter - 底部区域
function DialogFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

// DialogClose - 关闭按钮
interface DialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogClose({ children, asChild }: DialogCloseProps) {
  const { setOpen } = React.useContext(DialogContext);
  
  const handleClick = () => {
    setOpen(false);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return <span onClick={handleClick}>{children}</span>;
}

// 兼容性组件（保留但不实现）
function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DialogOverlay(props: any) {
  return null; // Ant Design Modal自带遮罩
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
