'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Trophy, BookOpen, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: '首页', href: '/', icon: Home },
  { label: '学生', href: '/students', icon: Users },
  { label: '比赛', href: '/contests', icon: Trophy },
  { label: '知识点', href: '/knowledge', icon: BookOpen },
  { label: '任务', href: '/tasks', icon: ClipboardList },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around h-14 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[44px]',
                  'transition-colors duration-200 select-none',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
