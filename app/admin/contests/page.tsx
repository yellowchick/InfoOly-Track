'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import FormDialog, { type FormField } from '@/components/admin/FormDialog'
import type { Contest } from '@/types'

const contestFields: FormField[] = [
  { name: 'name', label: '比赛名称', type: 'input', required: true, placeholder: '输入比赛名称' },
  { name: 'type', label: '类型', type: 'select', required: true, options: [
    { value: 'offline', label: '线下' },
    { value: 'online', label: '线上' },
  ]},
  { name: 'platform', label: '平台', type: 'input', placeholder: '如: AtCoder, Codeforces' },
  { name: 'date', label: '日期', type: 'input', required: true, placeholder: 'YYYY-MM' },
  { name: 'description', label: '描述', type: 'textarea', placeholder: '输入描述', rows: 3 },
  { name: 'totalScore', label: '总分', type: 'number', placeholder: '0' },
  { name: 'timeLimit', label: '时间限制', type: 'input', placeholder: '如: 3小时' },
  { name: 'isTeam', label: '团队赛', type: 'select', options: [
    { value: 'false', label: '否' },
    { value: 'true', label: '是' },
  ]},
]

export default function ContestsPage() {
  const router = useRouter()
  const [contests, setContests] = React.useState<Contest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingContest, setEditingContest] = React.useState<Contest | null>(null)
  const [deletingContest, setDeletingContest] = React.useState<Contest | null>(null)

  React.useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const res = await fetch('/api/contests', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setContests(data)
      }
    } catch (error) {
      console.error('Error fetching contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const payload = {
        ...values,
        isTeam: values.isTeam === 'true' || values.isTeam === true,
        totalScore: values.totalScore ? Number(values.totalScore) : undefined,
      }

      if (editingContest) {
        const res = await fetch('/api/contests', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingContest.id, ...payload }),
          credentials: 'include',
        })
        if (res.ok) {
          setEditingContest(null)
          setShowForm(false)
          fetchContests()
        }
      } else {
        const res = await fetch('/api/contests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        })
        if (res.ok) {
          setShowForm(false)
          fetchContests()
        }
      }
    } catch (error) {
      console.error('Error saving contest:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingContest) return
    try {
      const res = await fetch(`/api/contests?id=${deletingContest.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeletingContest(null)
        fetchContests()
      }
    } catch (error) {
      console.error('Error deleting contest:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      title: '比赛名称',
      render: (contest: Contest) => (
        <div className="font-medium">{contest.name}</div>
      ),
    },
    {
      key: 'date',
      title: '日期',
      render: (contest: Contest) => (
        <div className="flex items-center gap-1 text-muted">
          <Calendar className="h-3.5 w-3.5" />
          {contest.date}
        </div>
      ),
    },
    {
      key: 'type',
      title: '类型',
      render: (contest: Contest) => (
        <Badge variant={contest.type === 'online' ? 'secondary' : 'default'}>
          {contest.type === 'online' ? '线上' : '线下'}
        </Badge>
      ),
    },
    {
      key: 'platform',
      title: '平台',
      render: (contest: Contest) => (
        <span className="text-muted">{contest.platform || '-'}</span>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">比赛管理</h1>
            <p className="text-sm text-muted">管理比赛信息和安排</p>
          </div>
          <Button
            onClick={() => {
              setEditingContest(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新增比赛
          </Button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={contests}
            keyExtractor={(c) => c.id}
            onEdit={(contest) => {
              setEditingContest(contest)
              setShowForm(true)
            }}
            onDelete={(contest) => setDeletingContest(contest)}
          />
        )}

        {showForm && (
          <FormDialog
            title={editingContest ? '编辑比赛' : '新增比赛'}
            fields={contestFields}
            initialValues={
              editingContest
                ? {
                    name: editingContest.name,
                    type: editingContest.type,
                    platform: editingContest.platform || '',
                    date: editingContest.date,
                    description: editingContest.description || '',
                    totalScore: editingContest.totalScore || 0,
                    timeLimit: editingContest.timeLimit || '',
                    isTeam: editingContest.isTeam ? 'true' : 'false',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingContest(null)
            }}
          />
        )}

        {deletingContest && (
          <ConfirmDialog
            title="确认删除"
            description={`确定要删除比赛 "${deletingContest.name}" 吗？此操作不可恢复。`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingContest(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
