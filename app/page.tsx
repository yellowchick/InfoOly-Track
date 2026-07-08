import Link from 'next/link'
import { Metadata } from 'next'
import { Calendar, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatCard } from '@/components/home/StatCard'
import { TrainingCalendar } from '@/components/home/TrainingCalendar'
import { LinkGrid } from '@/components/home/LinkGrid'
import type { Announcement, Schedule, ExternalLink } from '@/types'

export const metadata: Metadata = {
  title: 'InfoOly Track - 首页',
  description: '信息学奥林匹克竞赛学生生涯记录平台首页',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackStats = {
  studentCount: 4,
  contestCount: 12,
  knowledgeCount: 30,
  taskCount: 35,
}

const fallbackAnnouncements: Announcement[] = [
  { id: 'a1', title: '6月表现', content: '6月学生的表现都不错', category: 'home-school', date: '2026-06', isPublic: true },
]

const fallbackSchedules: Schedule[] = [
  { id: 's1', day: '周三', startTime: '18:20', endTime: '20:00', isActive: true },
  { id: 's2', day: '周五', startTime: '15:50', endTime: '19:00', isActive: true },
  { id: 's3', day: '周日', startTime: '09:00', endTime: '12:00', note: '目前都是亏损状态(作业都还有欠着没完成的)，所以都建议有空来讨论完成', isActive: true },
]

const fallbackLinks: ExternalLink[] = [
  { id: 'l1', name: 'USACO', url: 'https://usaco.org/', category: 'platform', icon: '🌐', sortOrder: 1 },
  { id: 'l2', name: 'YACS', url: 'https://www.iai.sh.cn/', category: 'platform', icon: '📚', sortOrder: 2 },
  { id: 'l3', name: 'HydroOJ', url: 'https://hydro.ac/', category: 'platform', icon: '💧', sortOrder: 3 },
  { id: 'l4', name: 'AtCoder', url: 'https://atcoder.jp/', category: 'platform', icon: '⚡', sortOrder: 4 },
]

// 提取公告摘要
function getAnnouncementSummary(content: string): string {
  if (content.startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      return parsed.summary || ''
    } catch {
      return content
    }
  }
  return content
}

// 提取学生数量
function getStudentCount(content: string): number {
  if (content.startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      return parsed.students?.length || 0
    } catch {
      return 0
    }
  }
  return 0
}

async function getHomeData() {
  try {
    const [studentCount, contestCount, knowledgeCount, taskCount, announcements, schedules, links] = await Promise.all([
      prisma.student.count(),
      prisma.contest.count(),
      prisma.knowledgePoint.count(),
      prisma.task.count(),
      prisma.announcement.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.schedule.findMany({
        where: { isActive: true },
        orderBy: { day: 'asc' },
      }),
      prisma.externalLink.findMany({
        orderBy: { sortOrder: 'asc' },
        take: 4,
      }),
    ])
    return { studentCount, contestCount, knowledgeCount, taskCount, announcements, schedules, links }
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    return {
      ...fallbackStats,
      announcements: fallbackAnnouncements,
      schedules: fallbackSchedules,
      links: fallbackLinks,
    }
  }
}

export default async function HomePage() {
  const { studentCount, contestCount, knowledgeCount, taskCount, announcements, schedules, links } = await getHomeData()

  const statItems = [
    { icon: '👥', label: '学生人数', value: studentCount, href: '/students' },
    { icon: '🏆', label: '比赛场数', value: contestCount, href: '/contests' },
    { icon: '📚', label: '知识点数', value: knowledgeCount, href: '/knowledge' },
    { icon: '✅', label: '总任务数', value: taskCount, href: '/tasks' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background pb-nav">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-md px-4 pb-6 animate-fade-in">
        {/* Hero */}
        <section className="mt-4 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">InfoOly Track</h1>
          <p className="mt-1 text-sm opacity-90">信息学奥林匹克竞赛生涯记录</p>
        </section>

        {/* Stats */}
        <section className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item) => (
              <StatCard
                key={item.label}
                icon={<span role="img" aria-label={item.label}>{item.icon}</span>}
                label={item.label}
                value={item.value}
                href={item.href}
              />
            ))}
          </div>
        </section>

        {/* Announcements - 只显示最近一条 */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">📢 家校专栏</h2>
            <Link href="/announcements/" className="text-xs text-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          {announcements.length > 0 ? (
            <Link href={`/announcements/${announcements[0].id}/`}>
              <Card className="border-border/60 hover:bg-accent/30 transition-colors cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{announcements[0].date || '近期'}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                          最新
                        </span>
                        {getStudentCount(announcements[0].content) > 0 && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 text-xs">
                            {getStudentCount(announcements[0].content)}位学生
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {announcements[0].title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {getAnnouncementSummary(announcements[0].content).slice(0, 80)}...
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <p className="text-sm text-muted">暂无公告</p>
          )}
        </section>

        {/* Schedule */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-3">📅 训练安排</h2>
          <TrainingCalendar schedules={schedules} month={7} year={2026} />
        </section>

        {/* Links */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-3">🔗 关联网站</h2>
          <LinkGrid links={links} />
        </section>

        {/* CTA */}
        <section className="mt-8">
          <Link href="/students">
            <Button className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 active:scale-95 transition-transform">
              查看学生列表 →
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
