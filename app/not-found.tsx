import Link from 'next/link'
import { Home, Frown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Frown className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="mt-2 text-muted text-base">页面未找到</p>
          <p className="mt-1 text-sm text-muted">
            您访问的页面不存在或已被移除
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}
