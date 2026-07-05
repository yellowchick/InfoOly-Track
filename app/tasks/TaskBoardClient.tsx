'use client'

import { useState, useMemo } from 'react'
import { Task, Student } from '@/types'
import StudentFilter from '@/components/task/StudentFilter'
import TaskGroup from '@/components/task/TaskGroup'
import TaskProgress from '@/components/task/TaskProgress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LayoutList } from 'lucide-react'

interface TaskBoardClientProps {
  students: Student[]
  tasks: (Task & { student: Student })[]
}

export default function TaskBoardClient({ students, tasks }: TaskBoardClientProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  const filteredTasks = useMemo(() => {
    if (selectedStudentId) {
      return tasks.filter((t) => t.studentId === selectedStudentId)
    }
    return tasks
  }, [tasks, selectedStudentId])

  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed').length
  const overallPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const studentGroups = useMemo(() => {
    const groups: Record<string, { student: Student; tasks: Task[] }> = {}
    for (const task of filteredTasks) {
      if (!groups[task.studentId]) {
        groups[task.studentId] = { student: task.student, tasks: [] }
      }
      groups[task.studentId].tasks.push(task)
    }
    return students
      .filter((s) => groups[s.id])
      .map((s) => ({ title: s.name, tasks: groups[s.id].tasks, student: s }))
  }, [filteredTasks, students])

  const handleToggleTask = (taskId: string, newStatus: string) => {
    // TODO: 调用 API 更新任务状态
    console.log('Toggle task', taskId, 'to', newStatus)
  }

  return (
    <div className="space-y-5">
      {/* 总览统计 */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <LayoutList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">总任务数</p>
              <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">已完成</p>
            <p className="text-2xl font-bold text-success">{completedTasks}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground w-10">完成率</span>
          <div className="flex-1">
            <TaskProgress completed={completedTasks} total={totalTasks} />
          </div>
          <span className="text-xs font-bold text-success w-8 text-right">
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* 筛选 */}
      <StudentFilter
        students={students}
        selectedId={selectedStudentId}
        onSelect={setSelectedStudentId}
      />

      {/* 任务分组列表（按学生） */}
      <div className="space-y-3">
        {studentGroups.map((group) => (
          <TaskGroup
            key={group.title}
            title={group.title}
            tasks={group.tasks}
            editable={false}
            onToggleTask={handleToggleTask}
            icon={
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                  {group.student.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            }
          />
        ))}

        {studentGroups.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">暂无任务</p>
          </div>
        )}
      </div>
    </div>
  )
}
