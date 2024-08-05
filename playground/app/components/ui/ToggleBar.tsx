import type { ReactNode } from "react";
import { cn } from "~/utils";
import { Button, ButtonProps } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

type ToggleBarColors = 'primary' | 'secondary' | 'green' | 'red' | 'yellow' | 'purple';

interface ToggleBarProps<T = any> extends Omit<ButtonProps, 'color' | 'value' | 'onChange'> {
  items: Array<T>;
  value: T;
  color?: ToggleBarColors;
  onChange: (value: T) => void;
  getKey?: (item: T) => string | number;
  renderItem?: (item: T) => ReactNode;
}

export const ToggleBar = ({
  children,
  className,
  value,
  items,
  onChange,
  color = 'primary',
  fullWidth = false,
  size = 'sm',
  variant = 'solid',
  renderItem = (item) => item as ReactNode,
  getKey = (item) => item as string | number,
  ...props
}: ToggleBarProps) => {
  return (
    <ButtonGroup 
      join 
      className={cn(
        "inline-flex border-collapse flex-row",
        fullWidth && "w-full",
        className
      )}
    >
      {items.map((item) => {
        const key = getKey(item);
        const isActive = value === item;
        return (
          <Button
            key={key}
            size={size}
            color={color}
            variant={isActive ? 'solid' : 'outline'}
            onClick={() => onChange(item)}
            className={cn(
              'ring-0 outline-none focus:shadow-none ring-offset-0',
              'focus:ring-offset-0 focus:ring-0',
              isActive ? 'font-semibold' : 'font-normal'
            )}
            {...props}
          >
            {renderItem(item)}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
