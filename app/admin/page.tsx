import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import {
  Users,
  Trophy,
  BookOpen,
  CheckSquare,
  Bell,
  Calendar,
  AlertCircle,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AdminLayout from '@/components/admin/AdminLayout'

function checkAdminAuth(): boolean {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('admin_token')
  if (!adminCookie?.value) return false

  try {
    const decoded = Buffer.from(adminCookie.value, 'base64').toString('utf-8')
    return decoded.startsWith('admin-token-')
  } catch {
    return false
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  if (!checkAdminAuth()) {
    redirect('/admin/login')
  }

  const [
    studentCount,
    contestCount,
    knowledgeCount,
    taskCount,
    announcementCount,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.contest.count(),
    prisma.knowledgePoint.count(),
    prisma.task.count(),
    prisma.announcement.count(),
  ])

  const [recentContests, recentTasks, recentAnnouncements] = await Promise.all([
    prisma.contest.findMany({
      orderBy: { date: 'desc' },
      take: 3,
      include: { results: true },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { student: true },
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  const [contestsByPlatform, knowledgeByLevel, tasksByStatus] = await Promise.all([
    prisma.contest.groupBy({
      by: ['platform'],
      _count: { id: true },
    }),
    prisma.knowledgePoint.groupBy({
      by: ['levelAlias'],
      _count: { id: true },
    }),
    prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  const stats = [
    {
      label: '学生总数',
      value: studentCount,
      icon: Users,
      href: '/admin/students/',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '比赛总数',
      value: contestCount,
      icon: Trophy,
      href: '/admin/contests/',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: '知识点总数',
      value: knowledgeCount,
      icon: BookOpen,
      href: '/admin/knowledge/',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: '任务总数',
      value: taskCount,
      icon: CheckSquare,
      href: '/admin/tasks/',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: '公告总数',
      value: announcementCount,
      icon: Bell,
      href: '/admin/announcements/',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return String(date)
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">数据仪表盘</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold tabular-nums">{stat.value}</p>
                        <p className="text-xs text-muted truncate">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Contests */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base">最近比赛</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentContests.length > 0 ? (
                recentContests.map((contest) => (
                  <Link key={contest.id} href="/admin/contests/">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50 cursor-pointer">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{contest.name}</p>
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {contest.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-semibold">{contest.results.length}</p>
                        <p className="text-xs text-muted">参赛</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center py-6 text-muted">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  暂无比赛数据
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base">最新任务</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <Link key={task.id} href="/admin/tasks/">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50 cursor-pointer">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {task.student?.name || '未知学生'} · {task.status}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs text-muted">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center py-6 text-muted">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  暂无任务数据
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base">最新公告</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((ann) => (
                  <Link key={ann.id} href="/admin/announcements/">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50 cursor-pointer">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{ann.title}</p>
                        <p className="text-xs text-muted mt-0.5">{ann.category}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs text-muted">{formatDate(ann.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center py-6 text-muted">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  暂无公告数据
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Overview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">数据概览</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Contests by Platform */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted">比赛平台分布</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contestsByPlatform.length > 0 ? (
                  contestsByPlatform.map((item) => {
                    const label = item.platform || '未分类'
                    const count = item._count.id
                    const percentage = contestCount > 0 ? Math.round((count / contestCount) * 100) : 0
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted">暂无数据</p>
                )}
              </CardContent>
            </Card>

            {/* Knowledge by Level */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted">知识点难度分布</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {knowledgeByLevel.length > 0 ? (
                  knowledgeByLevel.map((item) => {
                    const label = item.levelAlias
                    const count = item._count.id
                    const percentage = knowledgeCount > 0 ? Math.round((count / knowledgeCount) * 100) : 0
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted">暂无数据</p>
                )}
              </CardContent>
            </Card>

            {/* Tasks by Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted">任务状态分布</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasksByStatus.length > 0 ? (
                  tasksByStatus.map((item) => {
                    const label = item.status
                    const count = item._count.id
                    const percentage = taskCount > 0 ? Math.round((count / taskCount) * 100) : 0
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-purple-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted">暂无数据</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
