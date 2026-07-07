'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Trophy,
  BookOpen,
  CheckSquare,
  Bell,
  Upload,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin/AdminLayout'

interface Stats {
  students: number
  contests: number
  knowledge: number
  tasks: number
  announcements: number
}

const quickActions = [
  { href: '/admin/import/', label: '导入文件', icon: Upload, description: '从 Markdown 导入数据' },
  { href: '/admin/students/', label: '管理学生', icon: Users, description: '添加、编辑、删除学生' },
  { href: '/admin/contests/', label: '管理比赛', icon: Trophy, description: '管理比赛信息' },
  { href: '/admin/knowledge/', label: '管理知识点', icon: BookOpen, description: '管理知识点体系' },
  { href: '/admin/tasks/', label: '管理任务', icon: CheckSquare, description: '分配和跟踪任务' },
  { href: '/admin/announcements/', label: '管理公告', icon: Bell, description: '发布公告和通知' },
]

const recentActivities = [
  { id: '1', action: '学生 张三 信息已更新', time: '2分钟前', type: 'student' },
  { id: '2', action: '新增比赛 CSP-J 2024', time: '1小时前', type: 'contest' },
  { id: '3', action: '知识点 动态规划 已更新', time: '3小时前', type: 'knowledge' },
  { id: '4', action: '新任务分配给 李四', time: '5小时前', type: 'task' },
  { id: '5', action: '公告 "比赛通知" 已发布', time: '1天前', type: 'announcement' },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = React.useState<Stats>({
    students: 0,
    contests: 0,
    knowledge: 0,
    tasks: 0,
    announcements: 0,
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/students', { credentials: 'include' })
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        // Try to fetch stats from multiple endpoints
        const [studentsRes, contestsRes, knowledgeRes, tasksRes, announcementsRes] = await Promise.all([
          fetch('/api/students', { credentials: 'include' }).catch(() => null),
          fetch('/api/contests', { credentials: 'include' }).catch(() => null),
          fetch('/api/knowledge', { credentials: 'include' }).catch(() => null),
          fetch('/api/tasks', { credentials: 'include' }).catch(() => null),
          fetch('/api/announcements', { credentials: 'include' }).catch(() => null),
        ])

        const students = studentsRes?.ok ? await studentsRes.json() : []
        const contests = contestsRes?.ok ? await contestsRes.json() : []
        const knowledge = knowledgeRes?.ok ? await knowledgeRes.json() : []
        const tasks = tasksRes?.ok ? await tasksRes.json() : []
        const announcements = announcementsRes?.ok ? await announcementsRes.json() : []

        setStats({
          students: students.length,
          contests: contests.length,
          knowledge: knowledge.length,
          tasks: tasks.length,
          announcements: announcements.length,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const statCards = [
    { label: '学生', value: stats.students, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: '比赛', value: stats.contests, icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
    { label: '知识点', value: stats.knowledge, icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { label: '任务', value: stats.tasks, icon: CheckSquare, color: 'bg-purple-100 text-purple-600' },
    { label: '公告', value: stats.announcements, icon: Bell, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">快捷操作</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-muted">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">最近活动</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
