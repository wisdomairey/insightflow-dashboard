'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ 
  id, 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  className = '' 
}: CheckboxProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary cursor-pointer transition-colors ${
          checked 
            ? 'bg-primary text-primary-foreground' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
    </div>
  )
}
