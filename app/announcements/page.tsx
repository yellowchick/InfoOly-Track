import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { fallbackAnnouncements } from '@/lib/fallback-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '家校专栏 - InfoOly Track',
  description: '查看所有家校专栏和历史记录',
}

async function getAnnouncements() {
  try {
    const dbAnn = await prisma.announcement.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    })
    if (dbAnn.length > 0) return dbAnn
  } catch { /* ignore */ }
  
  return fallbackAnnouncements
}

export default async function AnnouncementsListPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* 返回 */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2">📢 家校专栏</h1>
        <p className="text-sm text-muted-foreground mb-6">共 {announcements.length} 条记录</p>

        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <Link key={a.id} href={`/announcements/${a.id}/`}>
              <div className="rounded-xl border border-border/60 bg-card p-4 hover:bg-accent/50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{a.date || '近期'}</span>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {a.content.slice(0, 60)}...
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
