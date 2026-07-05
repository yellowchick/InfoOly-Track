'use client'

import Link from 'next/link'
import { Student } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronRight } from 'lucide-react'

interface StudentCardProps {
  student: Student
  stats: {
    contestCount: number
    knowledgeCount: number
    taskCompletionRate: number
  }
}

export function StudentCard({ student, stats }: StudentCardProps) {
  const initials = student.name.charAt(0)

  return (
    <Link
      href={`/students/${student.id}/`}
      className="flex items-center gap-4 px-4 py-3 rounded-xl border bg-card transition-all hover:shadow-sm hover:border-primary/40 active:scale-[0.99]"
    >
      <Avatar className="h-16 w-16 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold leading-tight truncate">{student.name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
          <span>比赛{stats.contestCount}场</span>
          <span className="text-muted-foreground/40">|</span>
          <span>知识点{stats.knowledgeCount}个</span>
          <span className="text-muted-foreground/40">|</span>
          <span>任务完成{stats.taskCompletionRate}%</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0" />
    </Link>
  )
}
