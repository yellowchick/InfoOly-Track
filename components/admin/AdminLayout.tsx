'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Trophy,
  BookOpen,
  CheckSquare,
  Bell,
  Upload,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard/', label: '总览', icon: LayoutDashboard },
  { href: '/admin/students/', label: '学生', icon: Users },
  { href: '/admin/contests/', label: '比赛', icon: Trophy },
  { href: '/admin/knowledge/', label: '知识点', icon: BookOpen },
  { href: '/admin/tasks/', label: '任务', icon: CheckSquare },
  { href: '/admin/announcements/', label: '公告', icon: Bell },
  { href: '/admin/import/', label: '导入', icon: Upload },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
      router.push('/admin/')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/admin/')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-slate-900 text-white md:flex">
        <div className="flex h-16 items-center px-6">
          <span className="text-lg font-bold">InfoOly 管理后台</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col md:hidden">
        <header className="flex h-14 items-center justify-between bg-slate-900 px-4 text-white">
          <span className="font-bold">InfoOly 管理后台</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 hover:bg-slate-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        {mobileOpen && (
          <nav className="border-b border-border bg-slate-900 px-3 pb-3 text-white max-h-64 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              退出登录
            </Button>
          </nav>
        )}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Desktop Content */}
      <main className="hidden flex-1 flex-col md:flex">
        <div className="flex h-16 items-center border-b border-border bg-card px-8">
          <h1 className="text-xl font-semibold">
            {navItems.find((item) => pathname === item.href || pathname.startsWith(item.href))?.label || '管理后台'}
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  )
}
