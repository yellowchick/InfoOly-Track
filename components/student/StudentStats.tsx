import { StudentProfile } from '@/types'
import { getStudentStats } from '@/lib/student-data'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, BookOpen, CheckCircle } from 'lucide-react'

interface StudentStatsProps {
  student: StudentProfile
}

export function StudentStats({ student }: StudentStatsProps) {
  const stats = getStudentStats(student)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stats.contestCount}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">比赛场次</p>
          {stats.highestAward !== '暂无' && (
            <p className="mt-2 text-sm font-medium text-yellow-600">
              最高: {stats.highestAward}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stats.knowledgeCount}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">已认证知识点</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stats.taskCompletionRate}%</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">任务完成率</p>
          <div className="mt-2">
            <Progress value={stats.taskCompletionRate} className="h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks} 已完成
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
