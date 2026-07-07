'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Contest, StudentContestResult } from '@/types'
import PlatformIcon, { getPlatformBorderColor } from './PlatformIcon'
import StudentResultRow from './StudentResultRow'

type Props = {
  contest: Contest
  results: StudentContestResult[]
}

export default function ContestCard({ contest, results }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isAtCoder = contest.platform === 'AtCoder'

  const borderColor = getPlatformBorderColor(contest.platform)

  return (
    <Card className={cn('overflow-hidden border-l-4 transition-shadow hover:shadow-md', borderColor)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold truncate">{contest.name}（{contest.date}）</h3>
              <PlatformIcon platform={contest.platform} />
              {contest.isTeam && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  团队
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              <Badge variant={contest.type === 'offline' ? 'outline' : 'secondary'} className="text-xs">
                {contest.type === 'offline' ? '线下' : '线上'}
              </Badge>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md hover:bg-muted/50 transition-colors shrink-0"
            aria-label={expanded ? '折叠详情' : '展开详情'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Compact results row */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar">
          {results.map(r => (
            <div key={r.id} className="flex items-center gap-1.5 bg-muted/40 rounded-full px-2 py-1 shrink-0">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {(r.student?.displayName || r.student?.name || '?').charAt(0)}
              </div>
              <span className="text-xs text-foreground">{r.student?.displayName || r.student?.name}</span>
              {r.award && <span className="text-xs text-yellow-600 font-medium">{r.award}</span>}
              {r.score !== undefined && r.score !== null && !r.award && (
                <span className="text-xs font-medium">{r.score}</span>
              )}
            </div>
          ))}
        </div>

        {(contest.totalScore || contest.timeLimit) && (
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            {contest.totalScore && (
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                满分 {contest.totalScore}
              </span>
            )}
            {contest.timeLimit && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {contest.timeLimit}
              </span>
            )}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-1 animate-fade-in">
            {results.map(r => (
              <StudentResultRow key={r.id} result={r} isAtCoder={isAtCoder} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
