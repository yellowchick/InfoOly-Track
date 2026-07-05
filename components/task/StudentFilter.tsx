'use client'

import { useState } from 'react'
import { Student } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentFilterProps {
  students: Student[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function StudentFilter({ students, selectedId, onSelect }: StudentFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = searchQuery.trim()
    ? students.filter((s) => s.name.includes(searchQuery.trim()))
    : students

  return (
    <div className="space-y-3">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索学生姓名..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* 学生按钮横向滚动 */}
      <div
        className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 snap-x-mandatory"
        style={{ touchAction: 'pan-x' }}
      >
        {/* 全部按钮 */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all snap-start',
            selectedId === null
              ? 'bg-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          全部
        </button>

        {/* 学生头像按钮 */}
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelect(student.id)}
            className={cn(
              'flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-full transition-all border-2 snap-start',
              selectedId === student.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {student.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{student.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
