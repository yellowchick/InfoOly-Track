'use client'

import { useState } from 'react'
import { KnowledgePoint, Student, StudentKnowledge } from '@/types'
import { levelColor, cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronDown } from 'lucide-react'

const categoryTagMap: Record<string, string> = {
  '数据结构': 'bg-purple-100 text-purple-800 border-purple-200',
  '图论': 'bg-blue-100 text-blue-800 border-blue-200',
  '动态规划': 'bg-green-100 text-green-800 border-green-200',
  '数学': 'bg-orange-100 text-orange-800 border-orange-200',
  '算法': 'bg-cyan-100 text-cyan-800 border-cyan-200',
}

const categoryBarMap: Record<string, string> = {
  '数据结构': 'bg-purple-500',
  '图论': 'bg-blue-500',
  '动态规划': 'bg-green-500',
  '数学': 'bg-orange-500',
  '算法': 'bg-cyan-500',
}

type KnowledgePointWithStudents = KnowledgePoint & {
  students: (StudentKnowledge & { student: Student })[]
}

interface KnowledgeCardProps {
  knowledgePoint: KnowledgePointWithStudents
}

export function KnowledgeCard({ knowledgePoint }: KnowledgeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryTag =
    categoryTagMap[knowledgePoint.category] ||
    'bg-gray-100 text-gray-800 border-gray-200'
  const categoryBar =
    categoryBarMap[knowledgePoint.category] || 'bg-gray-500'

  return (
    <div>
      {/* 横向紧凑卡片行 */}
      <div
        className="flex items-center min-h-[56px] py-3 px-4 cursor-pointer transition-colors hover:bg-muted/40"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 左侧：分类颜色竖条 */}
        <div
          className={cn(
            'w-1.5 self-stretch rounded-full shrink-0 mr-3',
            categoryBar
          )}
        />

        {/* 中间：知识点名称 + 标签 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate">
            {knowledgePoint.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                categoryTag
              )}
            >
              {knowledgePoint.category}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                levelColor(knowledgePoint.level)
              )}
            >
              Lv.{knowledgePoint.level}
            </span>
          </div>
        </div>

        {/* 右侧：已掌握学生头像 + 展开箭头 */}
        <div className="flex items-center gap-2 ml-3 shrink-0">
          <div className="flex -space-x-2">
            {knowledgePoint.students.slice(0, 3).map(({ student }) => (
              <Avatar
                key={student.id}
                className="h-6 w-6 border-2 border-card"
              >
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                  {student.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {knowledgePoint.students.length > 3 && (
              <div className="h-6 w-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted">
                +{knowledgePoint.students.length - 3}
              </div>
            )}
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted transition-transform duration-200 shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* 展开详情：描述、前置知识、已掌握学生全名 */}
      {isExpanded && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border">
          <div className="space-y-2">
            {knowledgePoint.description && (
              <div className="text-sm text-muted">
                {knowledgePoint.description}
              </div>
            )}
            {knowledgePoint.prerequisites && (
              <div className="text-xs text-muted">
                <span className="font-medium">前置知识：</span>
                {knowledgePoint.prerequisites}
              </div>
            )}
            {knowledgePoint.students.length > 0 && (
              <div className="text-xs text-muted">
                <span className="font-medium">已掌握：</span>
                {knowledgePoint.students
                  .map(({ student }) => student.displayName)
                  .join('、')}
              </div>
            )}
            {knowledgePoint.students.length === 0 && (
              <div className="text-xs text-muted italic">暂无学生掌握</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
