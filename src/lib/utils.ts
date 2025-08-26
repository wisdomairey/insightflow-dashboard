import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to combine and merge Tailwind CSS classes
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format numbers for display in charts and KPIs
 * @param value - Number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  options: {
    style?: 'decimal' | 'currency' | 'percent'
    currency?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
  } = {}
): string {
  const {
    style = 'decimal',
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard'
  } = options

  return new Intl.NumberFormat('en-US', {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    notation
  }).format(value)
}

/**
 * Generate a random ID for components
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Format percentage values
 * @param value - Decimal value (0.1 = 10%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change as decimal
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 1 : 0
  return (current - previous) / previous
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
