'use client'

import { Task } from '@/types'
import TaskItem from './TaskItem'
import TaskProgress from './TaskProgress'
import { cn } from '@/lib/utils'
import React from 'react'

interface TaskGroupProps {
  title: string
  tasks: Task[]
  editable?: boolean
  onToggleTask?: (taskId: string, newStatus: string) => void
  icon?: React.ReactNode
}

export default function TaskGroup({
  title,
  tasks,
  editable,
  onToggleTask,
  icon,
}: TaskGroupProps) {
  const completed = tasks.filter((t) => t.status === 'completed').length
  const total = tasks.length
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="w-full border-0 rounded-xl bg-gray-50/80 px-3 sm:px-4 py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left"
      >
        {icon && (
          <div className="flex-shrink-0">{icon}</div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {title}
          </h3>
        </div>
        <div className="w-28 sm:w-32 flex-shrink-0">
          <TaskProgress completed={completed} total={total} />
        </div>
      </button>
      {isOpen && (
        <div className={cn('flex flex-col gap-1 pb-2 pt-2')}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              editable={editable}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}
