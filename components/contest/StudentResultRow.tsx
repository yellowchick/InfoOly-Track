'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AwardBadge from './AwardBadge'
import { StudentContestResult } from '@/types'

type Props = {
  result: StudentContestResult
  isAtCoder?: boolean
}

function parseAtCoderNotes(notes?: string | null) {
  if (!notes) return null
  const match = notes.match(/Rank总排名(\d+)->(\d+)，Rating积分(\d+)->(\d+)/)
  if (!match) return null
  return {
    oldRank: parseInt(match[1]),
    newRank: parseInt(match[2]),
    oldRating: parseInt(match[3]),
    newRating: parseInt(match[4]),
  }
}

export default function StudentResultRow({ result, isAtCoder }: Props) {
  const student = result.student
  const changes = isAtCoder ? parseAtCoderNotes(result.notes) : null

  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-9 w-9">
        <AvatarImage src={student?.avatarUrl || ''} />
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {(student?.displayName || student?.name || '?').charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate">{student?.displayName || student?.name || '未知'}</span>
          {result.award && <AwardBadge award={result.award} />}
          {!result.award && result.score !== null && result.score !== undefined && (
            <span className="text-sm font-semibold text-foreground">{result.score} 分</span>
          )}
        </div>
        {isAtCoder && changes && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>比赛排名: {result.rank}</span>
            <span className="text-green-600">
              ↑ Rank {changes.oldRank.toLocaleString()} → {changes.newRank.toLocaleString()}
            </span>
            <span className="text-blue-600">
              ↑ Rating {changes.oldRating} → {changes.newRating}
            </span>
          </div>
        )}
        {isAtCoder && !changes && result.atcoderRating && (
          <div className="mt-1 text-xs text-muted">
            排名: {result.rank} | Rating: {result.atcoderRating}
          </div>
        )}
        {result.rank && !isAtCoder && (
          <div className="text-xs text-muted">排名: {result.rank}</div>
        )}
      </div>
    </div>
  )
}
