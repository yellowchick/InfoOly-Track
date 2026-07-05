import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TaskProgressProps {
  completed: number
  total: number
  className?: string
  showNumbers?: boolean
}

export default function TaskProgress({
  completed,
  total,
  className,
  showNumbers = true,
}: TaskProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className={cn('w-full', className)}>
      {showNumbers && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="font-medium">
            {completed} / {total}
          </span>
          <span className="font-semibold text-foreground">{percentage}%</span>
        </div>
      )}
      <Progress
        value={completed}
        max={total > 0 ? total : 1}
        className="h-2 [&>div]:bg-success"
      />
    </div>
  )
}
