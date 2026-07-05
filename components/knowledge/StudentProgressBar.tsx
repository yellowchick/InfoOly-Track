import Link from 'next/link'
import { Student, StudentKnowledge } from '@/types'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface StudentProgressBarProps {
  student: Student & { knowledges: StudentKnowledge[] }
  totalKnowledgePoints: number
}

export function StudentProgressBar({ student, totalKnowledgePoints }: StudentProgressBarProps) {
  const masteredCount = student.knowledges.length
  const percentage = totalKnowledgePoints > 0 ? Math.round((masteredCount / totalKnowledgePoints) * 100) : 0

  return (
    <Link href={`/students/${student.id}/`} passHref className="block flex-shrink-0 w-64">
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {student.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{student.displayName}</div>
            <div className="text-xs text-muted">
              已掌握 {masteredCount} / {totalKnowledgePoints}
            </div>
          </div>
        </div>
        <Progress value={percentage} />
        <div className="text-xs text-muted mt-1 text-right">
          {percentage}%
        </div>
      </Card>
    </Link>
  )
}
