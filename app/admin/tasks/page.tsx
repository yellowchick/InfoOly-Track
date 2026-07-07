'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, CheckSquare, Square } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import type { Task } from '@/types'

interface TaskWithStudent extends Task {
  student?: { id: string; name: string; displayName: string }
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = React.useState<TaskWithStudent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('')

  React.useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = React.useMemo(() => {
    let result = tasks
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.student?.name.toLowerCase().includes(q) ||
        t.student?.displayName?.toLowerCase().includes(q)
      )
    }
    if (categoryFilter.trim()) {
      const c = categoryFilter.toLowerCase()
      result = result.filter((t) => t.category?.toLowerCase().includes(c))
    }
    return result
  }, [tasks, searchQuery, categoryFilter])

  const groupedByStudent = React.useMemo(() => {
    const groups = new Map<string, { student: TaskWithStudent['student']; tasks: TaskWithStudent[] }>()
    for (const task of filteredTasks) {
      const studentId = task.studentId
      if (!groups.has(studentId)) {
        groups.set(studentId, { student: task.student, tasks: [] })
      }
      groups.get(studentId)!.tasks.push(task)
    }
    return Array.from(groups.values())
  }, [filteredTasks])

  const columns = [
    {
      key: 'title',
      title: '任务',
      render: (task: TaskWithStudent) => (
        <div className="font-medium">{task.title}</div>
      ),
    },
    {
      key: 'category',
      title: '分类',
      render: (task: TaskWithStudent) => (
        <span className="text-muted">{task.category || '-'}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (task: TaskWithStudent) => (
        task.status === 'completed' ? (
          <Badge variant="success" className="gap-1"><CheckSquare className="h-3 w-3" />已完成</Badge>
        ) : (
          <Badge variant="secondary" className="gap-1"><Square className="h-3 w-3" />待完成</Badge>
        )
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务管理</h1>
            <p className="text-sm text-muted">查看学生学习任务</p>
          </div>
          <div className="text-sm text-muted">
            共 {filteredTasks.length} 个任务
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="搜索任务、学生..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative flex-1">
            <Input
              placeholder="按分类筛选..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByStudent.map(({ student, tasks: studentTasks }) => (
              <div key={student?.id || 'unknown'}>
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted" />
                  <span className="font-medium">{student?.displayName || student?.name || '未分配'}</span>
                  <span className="text-sm text-muted">{studentTasks.length} 个任务</span>
                </div>
                <DataTable
                  columns={columns}
                  data={studentTasks}
                  keyExtractor={(t) => t.id}
                />
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted">暂无任务</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
