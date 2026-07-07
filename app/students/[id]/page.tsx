import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StudentDetailTabs } from '@/components/student/StudentDetailTabs'
import { prisma } from '@/lib/prisma'
import { getStudentById, studentsSeedData } from '@/lib/student-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return studentsSeedData.map((student) => ({
    id: student.id,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let student = null
  try {
    student = await prisma.student.findUnique({
      where: { id: params.id },
      select: { name: true },
    })
  } catch { /* ignore */ }

  if (!student) {
    const fallback = getStudentById(params.id)
    if (!fallback) return { title: '学生未找到' }
    return {
      title: `${fallback.name} - 学生详情`,
      description: `${fallback.name}的信息学奥赛生涯记录`,
    }
  }

  return {
    title: `${student.name} - 学生详情`,
    description: `${student.name}的信息学奥赛生涯记录`,
  }
}

export default async function StudentDetailPage({ params }: PageProps) {
  let student: any = null

  try {
    const dbStudent = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        contestResults: {
          include: { contest: true },
          orderBy: { contest: { date: 'desc' } },
        },
        knowledges: {
          include: { knowledgePoint: true },
          orderBy: { certifiedAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (dbStudent) {
      student = {
        ...dbStudent,
        avatarUrl: dbStudent.avatarUrl ?? undefined,
        bio: dbStudent.bio ?? undefined,
        createdAt: dbStudent.createdAt?.toISOString(),
        updatedAt: dbStudent.updatedAt?.toISOString(),
        contestResults: dbStudent.contestResults.map((cr: any) => ({
          ...cr,
          createdAt: cr.createdAt?.toISOString(),
          updatedAt: cr.updatedAt?.toISOString(),
          contest: cr.contest
            ? {
                ...cr.contest,
                createdAt: cr.contest.createdAt?.toISOString(),
                updatedAt: cr.contest.updatedAt?.toISOString(),
              }
            : undefined,
        })),
        knowledges: dbStudent.knowledges.map((sk: any) => ({
          ...sk,
          createdAt: sk.createdAt?.toISOString(),
          updatedAt: sk.updatedAt?.toISOString(),
          knowledgePoint: sk.knowledgePoint
            ? {
                ...sk.knowledgePoint,
                createdAt: sk.knowledgePoint.createdAt?.toISOString(),
                updatedAt: sk.knowledgePoint.updatedAt?.toISOString(),
              }
            : undefined,
        })),
        tasks: dbStudent.tasks.map((t: any) => ({
          ...t,
          createdAt: t.createdAt?.toISOString(),
          updatedAt: t.updatedAt?.toISOString(),
          completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
          category: t.category ?? undefined,
          problemIds: t.problemIds ?? undefined,
          dueDate: t.dueDate ?? undefined,
        })),
      }
    }
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
  }

  if (!student) {
    student = getStudentById(params.id)
  }

  if (!student) {
    notFound()
  }

  return <StudentDetailTabs student={student} />
}
