import type { ButtonHTMLAttributes, FC } from "react";
import { cn } from "~/utils";

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  color='primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg outline-none focus:ring-[1.5px] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark';
  // transition duration-150 ease-in-out

  // const variantClasses = {
  //   primary: 'bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-500',
  //   secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-300 focus:ring-secondary-500',
  //   outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900 focus:ring-primary-500',
  //   ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800 focus:ring-secondary-500',
  // };
  // const variantClasses = {
  //   solid: `bg-${color}-500 hover:bg-${color}-600 text-white dark:bg-${color}-600 dark:hover:bg-${color}-700 focus:ring-${color}-500`,
  //   outline: `bg-transparent hover:bg-${color}-50 text-${color}-600 border border-${color}-500 dark:text-${color}-400 dark:hover:bg-${color}-900 focus:ring-${color}-500`,
  //   ghost: `bg-transparent hover:bg-${color}-100 text-${color}-700 dark:text-${color}-300 dark:hover:bg-${color}-800 focus:ring-${color}-500`,
  // }; // 700?
  const variantClasses = {
    solid: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700',
      secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 dark:bg-secondary-600 dark:hover:bg-secondary-700',
      green: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700',
      red: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700',
    },
    outline: {
      primary: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900 focus:ring-primary-500',
      secondary: 'bg-transparent hover:bg-secondary-50 text-secondary-600 border border-secondary-500 dark:text-secondary-400 dark:hover:bg-secondary-900 focus:ring-secondary-500',
      green: 'bg-transparent hover:bg-green-50 text-green-600 border border-green-500 dark:text-green-400 dark:hover:bg-green-900 focus:ring-green-500',
      red: 'bg-transparent hover:bg-red-50 text-red-600 border border-red-500 dark:text-red-400 dark:hover:bg-red-900 focus:ring-red-500',
      yellow: 'bg-transparent hover:bg-yellow-50 text-yellow-600 border border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900 focus:ring-yellow-500',
      purple: 'bg-transparent hover:bg-purple-50 text-purple-600 border border-purple-500 dark:text-purple-400 dark:hover:bg-purple-900 focus:ring-purple-500',
    },
    ghost: {
      primary: 'bg-transparent hover:bg-primary-100 text-primary-700 dark:text-primary-300 dark:hover:bg-primary-800 focus:ring-primary-500',
      secondary: 'bg-transparent hover:bg-secondary-100 text-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800 focus:ring-secondary-500',
      green: 'bg-transparent hover:bg-green-100 text-green-700 dark:text-green-300 dark:hover:bg-green-800 focus:ring-green-500',
      red: 'bg-transparent hover:bg-red-100 text-red-700 dark:text-red-300 dark:hover:bg-red-800 focus:ring-red-500',
      yellow: 'bg-transparent hover:bg-yellow-100 text-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-800 focus:ring-yellow-500',
      purple: 'bg-transparent hover:bg-purple-100 text-purple-700 dark:text-purple-300 dark:hover:bg-purple-800 focus:ring-purple-500',
    },
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const buttonClasses = cn(
    baseClasses,
    // @ts-ignore
    variantClasses[variant][color],
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