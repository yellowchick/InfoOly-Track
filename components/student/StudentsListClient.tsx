'use client'

import { useState, useMemo } from 'react'
import { Student } from '@/types'
import { StudentCard } from '@/components/student/StudentCard'
import { Input } from '@/components/ui/input'
import { Search, Users } from 'lucide-react'
import { getStudentStats, studentsSeedData } from '@/lib/student-data'

interface StudentsListClientProps {
  allStudents: Student[]
}

export function StudentsListClient({ allStudents }: StudentsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const studentsWithStats = useMemo(() => {
    return allStudents.map(student => {
      const fullProfile = studentsSeedData.find(s => s.id === student.id)
      if (!fullProfile) return { student, stats: { contestCount: 0, knowledgeCount: 0, taskCompletionRate: 0 } }
      return { student, stats: getStudentStats(fullProfile) }
    })
  }, [allStudents])

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentsWithStats
    const query = searchQuery.toLowerCase()
    return studentsWithStats.filter(({ student }) =>
      student.name.toLowerCase().includes(query) ||
      student.displayName.toLowerCase().includes(query)
    )
  }, [studentsWithStats, searchQuery])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="mx-auto max-w-md px-4 py-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">学生列表</h1>
          </div>
          <p className="text-muted-foreground">查看所有学生的生涯记录与成长轨迹</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索学生姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {filteredStudents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredStudents.map(({ student, stats }) => (
              <StudentCard key={student.id} student={student} stats={stats} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">未找到匹配的学生</h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              尝试搜索其他姓名
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
