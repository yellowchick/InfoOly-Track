'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  backUrl?: string
  className?: string
}

export function PageHeader({ title, description, backUrl, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border',
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 h-14">
        {backUrl && (
          <Link
            href={backUrl}
            className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-accent/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-xs text-muted mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
    </header>
  )
}
