'use client'

import { Task } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle } from 'lucide-react'

interface TaskItemProps {
  task: Task
  editable?: boolean
  onToggle?: (taskId: string, newStatus: string) => void
}

const categoryStyles: Record<string, string> = {
  '图论': 'text-blue-700 bg-blue-50 border-blue-200',
  '数据结构': 'text-purple-700 bg-purple-50 border-purple-200',
  '算法': 'text-cyan-700 bg-cyan-50 border-cyan-200',
  '动态规划': 'text-green-700 bg-green-50 border-green-200',
  '比赛': 'text-orange-700 bg-orange-50 border-orange-200',
}

export default function TaskItem({ task, editable = false, onToggle }: TaskItemProps) {
  const isCompleted = task.status === 'completed'

  const handleClick = () => {
    if (editable && onToggle) {
      onToggle(task.id, isCompleted ? 'pending' : 'completed')
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 min-h-[48px] py-2 px-3 rounded-lg transition-colors',
        editable ? 'cursor-pointer active:bg-gray-100' : 'cursor-default',
        'hover:bg-gray-50/50'
      )}
      onClick={handleClick}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
    >
      {/* 状态图标 - 至少 24x24 触摸区域 */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-green-500" aria-label="已完成" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300" aria-label="未完成" />
        )}
      </div>

      {/* 任务标题 */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-sm font-medium leading-relaxed',
            isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
        >
          {task.title}
        </span>
      </div>

      {/* 分类 Badge */}
      {task.category && (
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium flex-shrink-0',
            categoryStyles[task.category] || 'text-gray-700 bg-gray-50 border-gray-200'
          )}
        >
          {task.category}
        </span>
      )}

      {/* 题号 */}
      {task.problemIds && (
        <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">
          {task.problemIds}
        </span>
      )}
    </div>
  )
}
