import React from "react";
import { Select as AntSelect, SelectProps as AntSelectProps } from "antd";

const { Option } = AntSelect;

interface SelectProps extends AntSelectProps {
  // 保持与原有API兼容
}

function Select({ className, ...props }: SelectProps) {
  return (
    <AntSelect
      className={className}
      {...props}
    />
  );
}

export { Select, Option };
export type { SelectProps };