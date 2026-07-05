'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import FormDialog, { type FormField } from '@/components/admin/FormDialog'
import { levelColor, levelLabel } from '@/lib/utils'
import type { KnowledgePoint } from '@/types'

const knowledgeFields: FormField[] = [
  { name: 'name', label: '知识点名称', type: 'input', required: true, placeholder: '输入知识点名称' },
  { name: 'level', label: '等级', type: 'select', required: true, options: [
    { value: '3', label: 'CSP-J (3级)' },
    { value: '4', label: 'GESP 7级 (4级)' },
    { value: '5', label: 'CSP-S (5级)' },
    { value: '6', label: 'USACO金 (6级)' },
    { value: '7', label: '省选 (7级)' },
  ]},
  { name: 'levelAlias', label: '等级别名', type: 'input', placeholder: '如: CSP-J' },
  { name: 'category', label: '分类', type: 'input', required: true, placeholder: '如: 算法, 数据结构' },
  { name: 'description', label: '描述', type: 'textarea', placeholder: '输入描述', rows: 3 },
  { name: 'prerequisites', label: '前置知识', type: 'textarea', placeholder: '输入前置知识，用逗号分隔', rows: 2 },
]

export default function KnowledgePage() {
  const router = useRouter()
  const [knowledgePoints, setKnowledgePoints] = React.useState<KnowledgePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingPoint, setEditingPoint] = React.useState<KnowledgePoint | null>(null)
  const [deletingPoint, setDeletingPoint] = React.useState<KnowledgePoint | null>(null)

  React.useEffect(() => {
    fetchKnowledge()
  }, [])

  const fetchKnowledge = async () => {
    try {
      const res = await fetch('/api/knowledge', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/')
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

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingPoint) {
        const res = await fetch('/api/knowledge', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPoint.id, ...values }),
          credentials: 'include',
        })
        if (res.ok) {
          setEditingPoint(null)
          setShowForm(false)
          fetchKnowledge()
        }
      } else {
        const res = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        })
        if (res.ok) {
          setShowForm(false)
          fetchKnowledge()
        }
      }
    } catch (error) {
      console.error('Error saving knowledge point:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingPoint) return
    try {
      const res = await fetch(`/api/knowledge?id=${deletingPoint.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeletingPoint(null)
        fetchKnowledge()
      }
    } catch (error) {
      console.error('Error deleting knowledge point:', error)
    }
  }

  const grouped = React.useMemo(() => {
    const groups = new Map<number, KnowledgePoint[]>()
    for (const point of knowledgePoints) {
      if (!groups.has(point.level)) {
        groups.set(point.level, [])
      }
      groups.get(point.level)!.push(point)
    }
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
  }, [knowledgePoints])

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
            <p className="text-sm text-muted">管理知识点体系结构</p>
          </div>
          <Button
            onClick={() => {
              setEditingPoint(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新增知识点
          </Button>
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
                  onEdit={(point) => {
                    setEditingPoint(point)
                    setShowForm(true)
                  }}
                  onDelete={(point) => setDeletingPoint(point)}
                />
              </div>
            ))}
            {knowledgePoints.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted">暂无知识点</p>
              </div>
            )}
          </div>
        )}

        {showForm && (
          <FormDialog
            title={editingPoint ? '编辑知识点' : '新增知识点'}
            fields={knowledgeFields}
            initialValues={
              editingPoint
                ? {
                    name: editingPoint.name,
                    level: String(editingPoint.level),
                    levelAlias: editingPoint.levelAlias,
                    category: editingPoint.category,
                    description: editingPoint.description || '',
                    prerequisites: editingPoint.prerequisites || '',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingPoint(null)
            }}
          />
        )}

        {deletingPoint && (
          <ConfirmDialog
            title="确认删除"
            description={`确定要删除知识点 "${deletingPoint.name}" 吗？此操作不可恢复。`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingPoint(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
