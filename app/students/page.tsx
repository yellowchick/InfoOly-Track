import type { Metadata } from 'next'
import { StudentsListClient } from '@/components/student/StudentsListClient'
import { prisma } from '@/lib/prisma'
import { studentsSeedData } from '@/lib/student-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '学生列表 - InfoOly Track',
  description: '查看所有学生的信息学奥赛生涯记录与成长轨迹',
}

export default async function StudentsPage() {
  let studentsWithStats: any[] = []

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

    // 并行查询每个学生的统计信息
    const statsList = await Promise.all(
      dbStudents.map(async (student) => {
        const [contestCount, knowledgeCount, taskCount, completedTaskCount] =
          await Promise.all([
            prisma.studentContestResult.count({
              where: { studentId: student.id },
            }),
            prisma.studentKnowledge.count({
              where: { studentId: student.id },
            }),
            prisma.task.count({
              where: { studentId: student.id },
            }),
            prisma.task.count({
              where: { studentId: student.id, status: 'completed' },
            }),
          ])

        const taskCompletionRate =
          taskCount > 0
            ? Math.round((completedTaskCount / taskCount) * 100)
            : 0

        return {
          student: {
            ...student,
            avatarUrl: student.avatarUrl ?? undefined,
            bio: student.bio ?? undefined,
            createdAt: student.createdAt.toISOString(),
            updatedAt: student.updatedAt.toISOString(),
          },
          stats: {
            contestCount,
            knowledgeCount,
            taskCompletionRate,
          },
        }
      })
    )

    studentsWithStats = statsList
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    studentsWithStats = studentsSeedData.map(
      ({ contestResults, knowledges, tasks, ...student }) => {
        const totalTasks = tasks.length
        const completedTasks = tasks.filter(
          (t: any) => t.status === 'completed'
        ).length
        return {
          student: {
            ...student,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
          },
          stats: {
            contestCount: contestResults.length,
            knowledgeCount: knowledges.length,
            taskCompletionRate:
              totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0,
          },
        }
      }
    )
  }

  return <StudentsListClient studentsWithStats={studentsWithStats} />
}
