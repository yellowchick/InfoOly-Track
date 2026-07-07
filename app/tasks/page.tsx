import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { fallbackTasks, fallbackStudents } from '@/lib/fallback-data'
import { Task, Student } from '@/types'
import TaskBoardClient from './TaskBoardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '任务板 - InfoOly Track',
  description: '追踪每一位选手的学习进度',
}

function serializeStudent(s: {
  id: string
  name: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}): Student {
  return {
    id: s.id,
    name: s.name,
    displayName: s.displayName,
    avatarUrl: s.avatarUrl ?? undefined,
    bio: s.bio ?? undefined,
    createdAt: s.createdAt?.toISOString(),
    updatedAt: s.updatedAt?.toISOString(),
  }
}

function serializeTask(
  t: {
    id: string
    studentId: string
    title: string
    category: string | null
    problemIds: string | null
    status: string
    priority: string
    dueDate: string | null
    completedAt: Date | null
    student: {
      id: string
      name: string
      displayName: string
      avatarUrl: string | null
      bio: string | null
      createdAt: Date
      updatedAt: Date
    }
  }
): Task & { student: Student } {
  return {
    id: t.id,
    studentId: t.studentId,
    title: t.title,
    category: t.category ?? undefined,
    problemIds: t.problemIds ?? undefined,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ?? undefined,
    completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
    student: serializeStudent(t.student),
  }
}

export default async function TasksPage() {
  let students: Student[] = []
  let tasks: (Task & { student: Student })[] = []

  try {
    const dbStudents = await prisma.student.findMany({
      orderBy: { createdAt: 'asc' },
    })
    students = dbStudents.map(serializeStudent)

    const rawTasks = await prisma.task.findMany({
      include: { student: true },
      orderBy: { createdAt: 'asc' },
    })
    tasks = rawTasks.map(serializeTask)
  } catch (error) {
    console.warn('Database query failed, using fallback data:', error)
    students = fallbackStudents
    tasks = fallbackTasks as (Task & { student: Student })[]
  }

  return (
    <main className="min-h-screen bg-background pb-nav">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* 页面标题区 */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            任务板
          </h1>
          <p className="text-sm text-muted-foreground">
            追踪每一位选手的学习进度
          </p>
        </div>

        <TaskBoardClient
          students={students}
          tasks={tasks}
        />
      </div>
    </main>
  )
}
