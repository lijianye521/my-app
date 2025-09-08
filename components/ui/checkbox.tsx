import React from "react";
import { Checkbox as AntCheckbox, CheckboxProps as AntCheckboxProps } from "antd";

interface CheckboxProps extends Omit<AntCheckboxProps, 'onChange'> {
  // 保持与原有API兼容
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: any) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: any) => {
      const checked = e.target?.checked ?? e;
      if (onCheckedChange) {
        onCheckedChange(checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <AntCheckbox
        ref={ref}
        className={className}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps }; 