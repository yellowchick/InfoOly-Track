'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import FormDialog, { type FormField } from '@/components/admin/FormDialog'
import type { Announcement } from '@/types'

const announcementFields: FormField[] = [
  { name: 'title', label: '标题', type: 'input', required: true, placeholder: '输入公告标题' },
  { name: 'content', label: '内容', type: 'textarea', required: true, placeholder: '输入公告内容', rows: 4 },
  { name: 'category', label: '分类', type: 'select', required: true, options: [
    { value: 'general', label: '一般' },
    { value: 'contest', label: '比赛' },
    { value: 'notice', label: '通知' },
    { value: 'achievement', label: '成绩' },
  ]},
  { name: 'date', label: '日期', type: 'input', placeholder: 'YYYY-MM-DD' },
  { name: 'isPublic', label: '公开', type: 'select', options: [
    { value: 'true', label: '是' },
    { value: 'false', label: '否' },
  ]},
]

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<Announcement | null>(null)
  const [deletingAnnouncement, setDeletingAnnouncement] = React.useState<Announcement | null>(null)

  React.useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const payload = {
        ...values,
        isPublic: values.isPublic === 'true' || values.isPublic === true,
      }

      if (editingAnnouncement) {
        const res = await fetch('/api/announcements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingAnnouncement.id, ...payload }),
          credentials: 'include',
        })
        if (res.ok) {
          setEditingAnnouncement(null)
          setShowForm(false)
          fetchAnnouncements()
        }
      } else {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        })
        if (res.ok) {
          setShowForm(false)
          fetchAnnouncements()
        }
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingAnnouncement) return
    try {
      const res = await fetch(`/api/announcements?id=${deletingAnnouncement.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeletingAnnouncement(null)
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const categoryLabel: Record<string, string> = {
    general: '一般',
    contest: '比赛',
    notice: '通知',
    achievement: '成绩',
  }

  const categoryVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
    general: 'secondary',
    contest: 'default',
    notice: 'warning',
    achievement: 'success',
  }

  const columns = [
    {
      key: 'title',
      title: '标题',
      render: (item: Announcement) => (
        <div className="font-medium">{item.title}</div>
      ),
    },
    {
      key: 'category',
      title: '分类',
      render: (item: Announcement) => (
        <Badge variant={categoryVariant[item.category] || 'secondary'}>
          {categoryLabel[item.category] || item.category}
        </Badge>
      ),
    },
    {
      key: 'isPublic',
      title: '状态',
      render: (item: Announcement) => (
        item.isPublic ? (
          <div className="flex items-center gap-1 text-success"><Eye className="h-3.5 w-3.5" />公开</div>
        ) : (
          <div className="flex items-center gap-1 text-muted"><EyeOff className="h-3.5 w-3.5" />私密</div>
        )
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">公告管理</h1>
            <p className="text-sm text-muted">发布公告和通知</p>
          </div>
          <Button
            onClick={() => {
              setEditingAnnouncement(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新增公告
          </Button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={announcements}
            keyExtractor={(a) => a.id}
            onEdit={(item) => {
              setEditingAnnouncement(item)
              setShowForm(true)
            }}
            onDelete={(item) => setDeletingAnnouncement(item)}
          />
        )}

        {showForm && (
          <FormDialog
            title={editingAnnouncement ? '编辑公告' : '新增公告'}
            fields={announcementFields}
            initialValues={
              editingAnnouncement
                ? {
                    title: editingAnnouncement.title,
                    content: editingAnnouncement.content,
                    category: editingAnnouncement.category,
                    date: editingAnnouncement.date || '',
                    isPublic: editingAnnouncement.isPublic ? 'true' : 'false',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingAnnouncement(null)
            }}
          />
        )}

        {deletingAnnouncement && (
          <ConfirmDialog
            title="确认删除"
            description={`确定要删除公告 "${deletingAnnouncement.title}" 吗？此操作不可恢复。`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingAnnouncement(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
