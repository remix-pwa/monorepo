import { ButtonHTMLAttributes, Children, cloneElement, FC, isValidElement, ReactElement, ReactNode } from "react";
import { cn } from "~/utils";

interface ButtonGroupProps {
  children: ReactNode;
  vertical?: boolean;
  className?: string;
  join?: boolean;
  gap?: 'sm' | 'md' | 'lg';
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
  children,
  vertical = false,
  className,
  join = false,
  gap = 'md',
}) => {
  const gapSizes = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const groupClasses = cn(
    'inline-flex w-full',
    vertical ? 'flex-col' : 'flex-col sm:flex-row',
    !join && gapSizes[gap],
    join && 'overflow-hidden',
    join && (vertical ? 'rounded-md' : 'rounded-md'),
    className
  );

  return (
    <div className={groupClasses}>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, string | React.JSXElementConstructor<any>>, {
            className: cn(
              child.props.className,
              join && 'rounded-none',
              join && {
                'first:rounded-t-md last:rounded-b-md': vertical,
                'first:rounded-l-md last:rounded-r-md': !vertical,
              },
              join && {
                'border-t-0': vertical && index > 0,
                'border-l-0': !vertical && index > 0,
              }
            ),
          });
        }
        return child;
      })}
    </div>
  );
};