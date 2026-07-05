'use client'

import { useState, useMemo } from 'react'
import { Trophy, Users, Medal, Target, TrendingUp, Award } from 'lucide-react'
import { Contest, StudentContestResult } from '@/types'
import ContestFilter, { FilterState } from '@/components/contest/ContestFilter'
import ContestCard from '@/components/contest/ContestCard'

type ContestWithResults = Contest & {
  results: (StudentContestResult & {
    student: {
      id: string
      name: string
      displayName: string
      avatarUrl?: string
      bio?: string
      createdAt: string
      updatedAt: string
    }
  })[]
}

type Props = {
  contests: ContestWithResults[]
}

export default function ContestsClient({ contests }: Props) {
  const [filters, setFilters] = useState<FilterState>({ year: null, platform: null })

  const filtered = useMemo(() => {
    return contests.filter(c => {
      if (filters.year && !c.date.startsWith(filters.year)) return false
      if (filters.platform && c.platform !== filters.platform) return false
      return true
    })
  }, [contests, filters])

  const stats = useMemo(() => {
    const totalContests = filtered.length
    const totalParticipants = filtered.reduce((sum, c) => sum + c.results.length, 0)
    let firstPrizes = 0
    let secondPrizes = 0
    let hasScore = false
    let maxScore = 0
    let hasRating = false
    let maxAtCoderRating = 0

    for (const c of filtered) {
      for (const r of c.results) {
        if (r.award?.includes('一等')) firstPrizes++
        if (r.award?.includes('二等')) secondPrizes++
        if (r.score !== null && r.score !== undefined) {
          hasScore = true
          if (r.score > maxScore) maxScore = r.score
        }
        if (r.atcoderRating !== null && r.atcoderRating !== undefined) {
          hasRating = true
          if (r.atcoderRating > maxAtCoderRating) maxAtCoderRating = r.atcoderRating
        }
      }
    }

    return [
      { label: '总比赛场次', value: totalContests, icon: Trophy },
      { label: '总参赛人次', value: totalParticipants, icon: Users },
      { label: '一等奖次数', value: firstPrizes, icon: Award },
      { label: '二等奖次数', value: secondPrizes, icon: Medal },
      { label: '最高单次得分', value: hasScore ? maxScore : '-', icon: Target },
      { label: 'AtCoder最高Rating', value: hasRating ? maxAtCoderRating : '-', icon: TrendingUp },
    ]
  }, [filtered])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="snap-start shrink-0 w-32 bg-card rounded-xl border p-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-muted mb-1">
              <stat.icon className="h-3.5 w-3.5" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <ContestFilter filters={filters} onChange={setFilters} />

      {/* Contest List */}
      <div className="space-y-3">
        {filtered.map(contest => (
          <ContestCard key={contest.id} contest={contest} results={contest.results} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>暂无符合条件的比赛记录</p>
          </div>
        )}
      </div>
    </div>
  )
}
