'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

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

  // 打开菜单时禁止页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* ========== 遮罩层 (Backdrop) ========== */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-black/60 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* ========== Drawer 菜单 ========== */}
      <div
        className={cn(
          'fixed right-0 top-0 z-[110] h-full w-[280px] transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.25)' }}
      >
        {/* 不透明背景 */}
        <div className="absolute inset-0 bg-white" />
        
        {/* 内容层 */}
        <div className="relative flex h-full flex-col">
          {/* 头部 */}
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 safe-top">
            <span className="text-lg font-bold text-primary">菜单</span>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="关闭菜单"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 导航列表 */}
          <nav className="flex-1 flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex h-12 items-center rounded-xl px-4 text-base font-medium text-gray-700 transition-all hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 底部信息 */}
          <div className="border-t border-gray-100 p-4">
            <p className="text-xs text-gray-400 text-center">InfoOly Track</p>
          </div>
        </div>
      </div>
    </header>
  )
}
