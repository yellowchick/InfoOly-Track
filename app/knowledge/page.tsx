import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { fallbackKnowledgePoints } from '@/lib/fallback-data'
import { KnowledgePageClient } from '@/components/knowledge/KnowledgePageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '知识点库 | InfoOly Track',
  description: '信息学奥赛知识体系与难度分级',
}

function serializeKnowledgePoint(kp: any) {
  return {
    ...kp,
    createdAt: kp.createdAt?.toISOString(),
    updatedAt: kp.updatedAt?.toISOString(),
    students: kp.students?.map((sk: any) => ({
      ...sk,
      createdAt: sk.createdAt?.toISOString(),
      updatedAt: sk.updatedAt?.toISOString(),
      certifiedAt: sk.certifiedAt ?? undefined,
      student: sk.student
        ? {
            ...sk.student,
            avatarUrl: sk.student.avatarUrl ?? undefined,
            bio: sk.student.bio ?? undefined,
            createdAt: sk.student.createdAt?.toISOString(),
            updatedAt: sk.student.updatedAt?.toISOString(),
          }
        : undefined,
    })),
  }
}

export default async function KnowledgePage() {
  let knowledgePoints: any[] = []

  try {
    const dbKnowledgePoints = await prisma.knowledgePoint.findMany({
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
    knowledgePoints = dbKnowledgePoints.map(serializeKnowledgePoint)
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
