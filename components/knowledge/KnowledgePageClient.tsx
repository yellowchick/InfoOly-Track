'use client'

import { useState, useMemo } from 'react'
import { KnowledgePoint, Student, StudentKnowledge } from '@/types'
import { LevelNav } from './LevelNav'
import { CategoryFilter } from './CategoryFilter'
import { LevelSection } from './LevelSection'

type KnowledgePointWithStudents = KnowledgePoint & {
  students: (StudentKnowledge & { student: Student })[]
}

interface KnowledgePageClientProps {
  knowledgePoints: KnowledgePointWithStudents[]
}

const categories = ['全部', '数据结构', '图论', '动态规划', '数学', '算法']
const levels = [3, 4, 5, 6, 7]

export function KnowledgePageClient({
  knowledgePoints,
}: KnowledgePageClientProps) {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredKnowledgePoints = useMemo(() => {
    if (activeCategory === '全部') return knowledgePoints
    return knowledgePoints.filter((kp) => kp.category === activeCategory)
  }, [knowledgePoints, activeCategory])

  const groupedByLevel = useMemo(() => {
    const groups = new Map<number, KnowledgePointWithStudents[]>()
    for (const level of levels) {
      const items = filteredKnowledgePoints.filter((kp) => kp.level === level)
      if (items.length > 0) {
        groups.set(level, items)
      }
    }
    return groups
  }, [filteredKnowledgePoints])

  const handleLevelClick = (level: number) => {
    const levelId = `level-${level}`
    const element = document.getElementById(levelId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">知识点库</h1>
        <p className="text-muted">信息学奥赛知识体系与难度分级</p>
      </div>

      {/* 难度分级导航 */}
      <LevelNav levels={levels} onLevelClick={handleLevelClick} />

      {/* 分类筛选 */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 难度分级展示 */}
      <div className="mt-6">
        <LevelSection groupedByLevel={groupedByLevel} />
      </div>
    </main>
  )
}
