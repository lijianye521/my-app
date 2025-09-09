import React from "react";
import { Input } from "antd";

const { TextArea } = Input;

interface TextareaProps {
  className?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <TextArea
      className={className}
      {...props}
    />
  );
}

export { Textarea };
