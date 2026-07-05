import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { fallbackContests } from '@/lib/fallback-data'
import ContestsClient from './ContestsClient'

export const metadata: Metadata = {
  title: '比赛记录 - InfoOly Track',
  description: '记录每一次征战与荣耀',
}

function serializeContest(c: any) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    platform: c.platform ?? undefined,
    date: c.date,
    description: c.description ?? undefined,
    totalScore: c.totalScore ?? undefined,
    timeLimit: c.timeLimit ?? undefined,
    isTeam: c.isTeam,
    results: c.results.map((r: any) => ({
      id: r.id,
      studentId: r.studentId,
      contestId: r.contestId,
      award: r.award ?? undefined,
      score: r.score ?? undefined,
      rank: r.rank ?? undefined,
      atcoderRank: r.atcoderRank ?? undefined,
      atcoderRating: r.atcoderRating ?? undefined,
      notes: r.notes ?? undefined,
      student: {
        id: r.student.id,
        name: r.student.name,
        displayName: r.student.displayName,
        avatarUrl: r.student.avatarUrl ?? undefined,
        bio: r.student.bio ?? undefined,
        createdAt: r.student.createdAt.toISOString(),
        updatedAt: r.student.updatedAt.toISOString(),
      },
    })),
  }
}

export default async function ContestsPage() {
  let contests: any[] = []
  try {
    const dbContests = await prisma.contest.findMany({
      orderBy: { date: 'desc' },
      include: {
        results: {
          include: { student: true },
        },
      },
    })
    contests = dbContests.map(serializeContest)
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    contests = fallbackContests as any
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="max-w-3xl mx-auto px-4 py-6 safe-top safe-bottom">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">比赛记录</h1>
          <p className="text-sm text-muted mt-1">记录每一次征战与荣耀</p>
        </div>
        <ContestsClient contests={contests} />
      </div>
    </div>
  )
}
