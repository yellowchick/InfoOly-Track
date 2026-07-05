import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/layout/Providers'
import { BottomNav } from '@/components/layout/BottomNav'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import './globals.css'

export const metadata: Metadata = {
  title: 'InfoOly Track - 信息学奥赛生涯记录',
  description: '记录学生在信息学奥林匹克竞赛学习过程中的生涯历程、战绩、知识点与成长轨迹',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1e40af',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-100 text-foreground antialiased">
        <Providers>
          <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative isolate">
            {children}
            <BottomNav />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  )
}
