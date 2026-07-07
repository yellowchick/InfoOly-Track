'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import type { Announcement } from '@/types'

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

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
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

  const filteredAnnouncements = React.useMemo(() => {
    if (!searchQuery.trim()) return announcements
    const q = searchQuery.toLowerCase()
    return announcements.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      categoryLabel[a.category]?.toLowerCase().includes(q)
    )
  }, [announcements, searchQuery])

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
            <p className="text-sm text-muted">查看公告和通知</p>
          </div>
          <div className="text-sm text-muted">
            共 {filteredAnnouncements.length} 条公告
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="搜索标题、内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAnnouncements}
            keyExtractor={(a) => a.id}
          />
        )}
      </div>
    </AdminLayout>
  )
}
