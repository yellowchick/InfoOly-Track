'use client'

import { StudentKnowledge } from '@/types'
import { levelColor, levelLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KnowledgeGridProps {
  knowledges: (StudentKnowledge & { knowledgePoint?: { name: string; level: number; levelAlias: string; category: string } })[]
}

export function KnowledgeGrid({ knowledges }: KnowledgeGridProps) {
  const grouped = knowledges.reduce((acc, sk) => {
    const level = sk.knowledgePoint?.level || 0
    if (!acc[level]) acc[level] = []
    acc[level].push(sk)
    return acc
  }, {} as Record<number, typeof knowledges>)

  const sortedLevels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)

  if (sortedLevels.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        暂无已认证知识点
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedLevels.map(level => (
        <Card key={level}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge className={levelColor(level)}>
                {levelLabel(level)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {grouped[level].length} 个知识点
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {grouped[level].map(sk => (
                <div
                  key={sk.id}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                >
                  <span>{sk.knowledgePoint?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {sk.knowledgePoint?.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
