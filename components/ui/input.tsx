import React from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";

interface InputProps extends AntInputProps {
  // 保持与原有API兼容
}

function Input({ className, ...props }: InputProps) {
  return (
    <AntInput
      className={className}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };