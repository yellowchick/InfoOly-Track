'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import type { Contest } from '@/types'

export default function ContestsPage() {
  const router = useRouter()
  const [contests, setContests] = React.useState<Contest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const res = await fetch('/api/contests', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
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

  const filteredContests = React.useMemo(() => {
    if (!searchQuery.trim()) return contests
    const q = searchQuery.toLowerCase()
    return contests.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.platform?.toLowerCase().includes(q) ||
      c.date.includes(q)
    )
  }, [contests, searchQuery])

  const columns = [
    {
      key: 'name',
      title: '比赛名称',
      render: (contest: Contest) => (
        <Link href={`/contests/${contest.id}`} className="font-medium hover:underline text-primary">
          {contest.name}
        </Link>
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
            <p className="text-sm text-muted">查看比赛信息和安排</p>
          </div>
          <div className="text-sm text-muted">
            共 {filteredContests.length} 场比赛
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="搜索比赛名称、平台..."
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
            data={filteredContests}
            keyExtractor={(c) => c.id}
          />
        )}
      </div>
    </AdminLayout>
  )
}
