import React from 'react'
import { cn } from '@/lib/utils'

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className={cn('px-4 pb-nav safe-top animate-fade-in', className)}>
      {children}
    </div>
  )
}
