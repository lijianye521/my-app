import React from "react";
import { Checkbox as AntCheckbox, CheckboxProps as AntCheckboxProps } from "antd";

interface CheckboxProps extends AntCheckboxProps {
  // 保持与原有API兼容
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <AntCheckbox
        className={className}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };