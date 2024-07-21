import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Custom classnames function that merges tailwind classes
 * @param inputs the classes to merge
 * @returns a string of merged classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
