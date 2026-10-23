'use client'

import { useState } from 'react'
import { levelColor, levelLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { loadAccess } from '@/lib/student-access'

interface KnowledgePointLite {
  id: string
  name: string
  level: number
  levelAlias: string
  category: string
}

interface KnowledgeGridProps {
  studentId: string
  studentName: string
  allPoints: KnowledgePointLite[]
  /** 已掌握知识点 id 集合（与概览页共享的实时状态，由父组件管理） */
  certifiedIds: Set<string>
  setCertifiedIds: React.Dispatch<React.SetStateAction<Set<string>>>
}

export function KnowledgeGrid({ studentId, studentName, allPoints, certifiedIds, setCertifiedIds }: KnowledgeGridProps) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const grouped = allPoints.reduce((acc, kp) => {
    if (!acc[kp.level]) acc[kp.level] = []
    acc[kp.level].push(kp)
    return acc
  }, {} as Record<number, KnowledgePointLite[]>)

  const sortedLevels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)

  const toggle = async (kp: KnowledgePointLite) => {
    if (busyId) return
    const access = loadAccess()
    if (!access) {
      setError('访问代码已失效，请刷新页面重新输入')
      return
    }

    const isCertified = certifiedIds.has(kp.id)
    const action = isCertified ? 'uncertify' : 'certify'

    // 乐观更新（不可变方式更新共享状态）
    setBusyId(kp.id)
    setError('')
    const prev = new Set(certifiedIds)
    const next = new Set(certifiedIds)
    if (isCertified) {
      next.delete(kp.id)
    } else {
      next.add(kp.id)
    }
    setCertifiedIds(next)

    try {
      const res = await fetch(`/api/students/${studentId}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgePointId: kp.id,
          action,
          code: access.code,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || '操作失败')
      }
    } catch (e: any) {
      // 回滚
      setCertifiedIds(prev)
      setError(e.message || '操作失败，请重试')
    } finally {
      setBusyId(null)
    }
  }

  const total = allPoints.length
  const certifiedCount = certifiedIds.size
  const pct = total > 0 ? Math.round((certifiedCount / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* 掌握进度 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              已掌握 {certifiedCount} / {total}
            </span>
            <span className="text-sm text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            点击知识点即可标记掌握（再次点击取消）。数据实时保存到数据库。
          </p>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </CardContent>
      </Card>

      {sortedLevels.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          暂无知识点数据
        </div>
      )}

      {sortedLevels.map(level => {
        const points = grouped[level]
        const certifiedInLevel = points.filter(kp => certifiedIds.has(kp.id)).length
        return (
          <Card key={level}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className={levelColor(level)}>
                  {levelLabel(level)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {certifiedInLevel} / {points.length} 已掌握
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {points.map(kp => {
                  const isCertified = certifiedIds.has(kp.id)
                  const isBusy = busyId === kp.id
                  return (
                    <button
                      key={kp.id}
                      type="button"
                      onClick={() => toggle(kp)}
                      disabled={busyId !== null}
                      className={
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all ' +
                        (isCertified
                          ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 font-medium'
                          : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground') +
                        (isBusy ? ' opacity-60' : '') +
                        (busyId !== null && !isBusy ? ' opacity-70' : '')
                      }
                      title={isCertified ? '点击标记为未掌握' : '点击标记为已掌握'}
                    >
                      {isBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isCertified ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : null}
                      <span>{kp.name}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
