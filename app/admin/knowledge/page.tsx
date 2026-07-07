'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search, Layers } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import { levelColor, levelLabel } from '@/lib/utils'
import type { KnowledgePoint } from '@/types'

export default function KnowledgePage() {
  const router = useRouter()
  const [knowledgePoints, setKnowledgePoints] = React.useState<KnowledgePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    fetchKnowledge()
  }, [])

  const fetchKnowledge = async () => {
    try {
      const res = await fetch('/api/knowledge', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setKnowledgePoints(data.knowledgePoints)
      }
    } catch (error) {
      console.error('Error fetching knowledge points:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPoints = React.useMemo(() => {
    if (!searchQuery.trim()) return knowledgePoints
    const q = searchQuery.toLowerCase()
    return knowledgePoints.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      levelLabel(p.level).toLowerCase().includes(q)
    )
  }, [knowledgePoints, searchQuery])

  const grouped = React.useMemo(() => {
    const groups = new Map<number, KnowledgePoint[]>()
    for (const point of filteredPoints) {
      if (!groups.has(point.level)) {
        groups.set(point.level, [])
      }
      groups.get(point.level)!.push(point)
    }
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
  }, [filteredPoints])

  const columns = [
    {
      key: 'name',
      title: '知识点',
      render: (point: KnowledgePoint) => (
        <div className="font-medium">{point.name}</div>
      ),
    },
    {
      key: 'level',
      title: '等级',
      render: (point: KnowledgePoint) => (
        <Badge className={levelColor(point.level)}>
          {levelLabel(point.level)}
        </Badge>
      ),
    },
    {
      key: 'category',
      title: '分类',
      render: (point: KnowledgePoint) => (
        <div className="flex items-center gap-1 text-muted">
          <Layers className="h-3.5 w-3.5" />
          {point.category}
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">知识点管理</h1>
            <p className="text-sm text-muted">查看知识点体系结构</p>
          </div>
          <div className="text-sm text-muted">
            共 {filteredPoints.length} 个知识点
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="搜索知识点名称、分类..."
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
          <div className="space-y-8">
            {grouped.map(([level, points]) => (
              <div key={level}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge className={levelColor(level)}>{levelLabel(level)}</Badge>
                  <span className="text-sm text-muted">{points.length} 个知识点</span>
                </div>
                <DataTable
                  columns={columns}
                  data={points}
                  keyExtractor={(p) => p.id}
                />
              </div>
            ))}
            {filteredPoints.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted">暂无知识点</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
