'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/students', label: '学生列表' },
  { href: '/contests', label: '比赛记录' },
  { href: '/knowledge', label: '知识点库' },
  { href: '/tasks', label: '任务板' },
  { href: '/admin', label: '管理后台' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md safe-top">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">InfoOly</span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          aria-label="打开菜单"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* 深色遮罩 */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-black/70 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 白色实色菜单 */}
      <div
        className={cn(
          'fixed right-0 top-0 z-[110] h-full w-[260px] bg-white text-foreground shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* 菜单头部 */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 safe-top">
          <span className="text-lg font-bold text-foreground">菜单</span>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭菜单"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 导航列表 - 白色卡片 */}
        <nav className="flex flex-col gap-2 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex h-12 items-center rounded-lg bg-white border border-gray-200 px-4 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/20 active:scale-[0.98]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 底部 */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400 text-center">InfoOly Track</p>
        </div>
      </div>
    </header>
  )
}
