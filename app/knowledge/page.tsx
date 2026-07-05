import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { fallbackKnowledgePoints } from '@/lib/fallback-data'
import { KnowledgePageClient } from '@/components/knowledge/KnowledgePageClient'

export const metadata: Metadata = {
  title: '知识点库 | InfoOly Track',
  description: '信息学奥赛知识体系与难度分级',
}

export default async function KnowledgePage() {
  let knowledgePoints: any[] = []

  try {
    knowledgePoints = await prisma.knowledgePoint.findMany({
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    })
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    knowledgePoints = fallbackKnowledgePoints
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <KnowledgePageClient
        knowledgePoints={knowledgePoints as any}
      />
    </div>
  )
}
