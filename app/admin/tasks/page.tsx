'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckSquare, Square, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import FormDialog, { type FormField } from '@/components/admin/FormDialog'
import type { Task } from '@/types'

interface TaskWithStudent extends Task {
  student?: { id: string; name: string; displayName: string }
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = React.useState<TaskWithStudent[]>([])
  const [students, setStudents] = React.useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<TaskWithStudent | null>(null)
  const [deletingTask, setDeletingTask] = React.useState<TaskWithStudent | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    fetchTasks()
    fetchStudents()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/')
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

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setStudents(data.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })))
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const taskFields: FormField[] = [
    { name: 'studentId', label: '学生', type: 'select', required: true, options: students.map(s => ({ value: s.id, label: s.name })) },
    { name: 'title', label: '任务标题', type: 'input', required: true, placeholder: '输入任务标题' },
    { name: 'category', label: '分类', type: 'input', placeholder: '如: 算法, 练习' },
    { name: 'problemIds', label: '题号', type: 'input', placeholder: '如: A, B, C' },
    { name: 'status', label: '状态', type: 'select', required: true, options: [
      { value: 'pending', label: '待完成' },
      { value: 'completed', label: '已完成' },
      { value: 'in_progress', label: '进行中' },
    ]},
    { name: 'priority', label: '优先级', type: 'select', options: [
      { value: 'low', label: '低' },
      { value: 'normal', label: '正常' },
      { value: 'high', label: '高' },
    ]},
  ]

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingTask) {
        const res = await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTask.id, ...values }),
          credentials: 'include',
        })
        if (res.ok) {
          setEditingTask(null)
          setShowForm(false)
          fetchTasks()
        }
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        })
        if (res.ok) {
          setShowForm(false)
          fetchTasks()
        }
      }
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingTask) return
    try {
      const res = await fetch(`/api/tasks?id=${deletingTask.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeletingTask(null)
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const toggleStatus = async (task: TaskWithStudent) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
        }),
        credentials: 'include',
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const batchToggleStatus = async (status: string) => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, completedAt: status === 'completed' ? new Date().toISOString() : null }),
            credentials: 'include',
          })
        )
      )
      setSelectedIds(new Set())
      fetchTasks()
    } catch (error) {
      console.error('Error batch updating tasks:', error)
    }
  }

  const groupedByStudent = React.useMemo(() => {
    const groups = new Map<string, { student: TaskWithStudent['student']; tasks: TaskWithStudent[] }>()
    for (const task of tasks) {
      const studentId = task.studentId
      if (!groups.has(studentId)) {
        groups.set(studentId, { student: task.student, tasks: [] })
      }
      groups.get(studentId)!.tasks.push(task)
    }
    return Array.from(groups.values())
  }, [tasks])

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
        <button onClick={() => toggleStatus(task)} className="cursor-pointer">
          {task.status === 'completed' ? (
            <Badge variant="success" className="gap-1"><CheckSquare className="h-3 w-3" />已完成</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1"><Square className="h-3 w-3" />待完成</Badge>
          )}
        </button>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务管理</h1>
            <p className="text-sm text-muted">管理学生学习任务</p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新增任务
          </Button>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <span className="text-sm text-muted">已选择 {selectedIds.size} 项</span>
            <div className="flex-1" />
            <Button size="sm" onClick={() => batchToggleStatus('completed')}>标记完成</Button>
            <Button size="sm" variant="outline" onClick={() => batchToggleStatus('pending')}>标记未完成</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>取消</Button>
          </div>
        )}

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
                  onEdit={(task) => {
                    setEditingTask(task)
                    setShowForm(true)
                  }}
                  onDelete={(task) => setDeletingTask(task)}
                />
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted">暂无任务</p>
              </div>
            )}
          </div>
        )}

        {showForm && (
          <FormDialog
            title={editingTask ? '编辑任务' : '新增任务'}
            fields={taskFields}
            initialValues={
              editingTask
                ? {
                    studentId: editingTask.studentId,
                    title: editingTask.title,
                    category: editingTask.category || '',
                    problemIds: editingTask.problemIds || '',
                    status: editingTask.status,
                    priority: editingTask.priority || 'normal',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        )}

        {deletingTask && (
          <ConfirmDialog
            title="确认删除"
            description={`确定要删除任务 "${deletingTask.title}" 吗？此操作不可恢复。`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingTask(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
