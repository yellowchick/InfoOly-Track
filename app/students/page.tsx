import type { Metadata } from 'next'
import { StudentsListClient } from '@/components/student/StudentsListClient'
import { prisma } from '@/lib/prisma'
import { studentsSeedData } from '@/lib/student-data'

export const metadata: Metadata = {
  title: '学生列表 - InfoOly Track',
  description: '查看所有学生的信息学奥赛生涯记录与成长轨迹',
}

export default async function StudentsPage() {
  let students: any[] = []

  try {
    const dbStudents = await prisma.student.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    students = dbStudents.map((s) => ({
      ...s,
      avatarUrl: s.avatarUrl ?? undefined,
      bio: s.bio ?? undefined,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    students = studentsSeedData.map(
      ({ contestResults, knowledges, tasks, ...student }) => ({
        ...student,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      })
    )
  }

  return <StudentsListClient allStudents={students} />
}
