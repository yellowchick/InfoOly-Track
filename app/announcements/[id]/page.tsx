import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { fallbackAnnouncements } from '@/lib/fallback-data'

interface PageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const announcement = await getAnnouncement(params.id)
  if (!announcement) return { title: '内容未找到' }
  return {
    title: `${announcement.title} - 家校专栏`,
    description: announcement.content.slice(0, 100),
  }
}

async function getAnnouncement(id: string) {
  try {
    const dbAnn = await prisma.announcement.findUnique({
      where: { id, isPublic: true },
    })
    if (dbAnn) return dbAnn
  } catch { /* ignore */ }
  
  return fallbackAnnouncements.find((a) => a.id === id) || null
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const announcement = await getAnnouncement(params.id)

  if (!announcement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* 返回 */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        {/* 标题 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{announcement.date || '近期'}</span>
            {announcement.category && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                {announcement.category === 'home-school' ? '家校专栏' : announcement.category}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground">{announcement.title}</h1>
        </div>

        {/* 内容 */}
        <article className="prose prose-sm max-w-none text-foreground">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {announcement.content}
          </div>
        </article>

        {/* 底部导航 */}
        <div className="mt-8 pt-4 border-t border-border">
          <Link href="/announcements/">
            <span className="text-sm text-primary hover:underline">
              查看所有家校专栏 →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
