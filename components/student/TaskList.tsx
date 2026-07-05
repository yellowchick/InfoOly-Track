'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, Circle } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => {
    return new Set(tasks.filter(t => t.status === 'completed').map(t => t.id))
  })

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  const grouped = tasks.reduce((acc, task) => {
    const category = task.category || '未分类'
    if (!acc[category]) acc[category] = []
    acc[category].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const sortedCategories = Object.keys(grouped).sort()

  if (sortedCategories.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        暂无任务
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedCategories.map(category => (
        <Card key={category}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{category}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {grouped[category].map(task => {
                const isChecked = checkedTasks.has(task.id)
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors min-h-[44px]',
                      'hover:bg-accent active:bg-accent/80',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                          <Circle className="h-3 w-3 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm leading-relaxed',
                        isChecked && 'line-through text-muted-foreground'
                      )}>
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          截止: {task.dueDate}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      isChecked
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}>
                      {isChecked ? '已完成' : '进行中'}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
