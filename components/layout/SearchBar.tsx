'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  autoFocus?: boolean
  className?: string
}

export function SearchBar({
  placeholder = '搜索...',
  value,
  onChange,
  onSubmit,
  autoFocus,
  className,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'sticky top-14 z-30 bg-white/80 backdrop-blur-md px-4 py-2',
        className
      )}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full h-10 pl-9 pr-9 rounded-full bg-secondary border border-transparent',
            'text-sm text-foreground placeholder:text-muted',
            'focus:outline-none focus:border-ring focus:bg-white transition-colors'
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              onSubmit?.('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            aria-label="清除搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}
