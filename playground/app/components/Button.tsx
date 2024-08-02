import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "~/utils";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition duration-300 ease-in-out outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-300 focus:ring-secondary-500',
    outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border-2 border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800 focus:ring-secondary-500',
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};