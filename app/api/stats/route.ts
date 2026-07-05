import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [studentCount, contestCount, knowledgeCount, taskCount] = await Promise.all([
      prisma.student.count(),
      prisma.contest.count(),
      prisma.knowledgePoint.count(),
      prisma.task.count(),
    ])

    return NextResponse.json({
      studentCount,
      contestCount,
      knowledgeCount,
      taskCount,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
