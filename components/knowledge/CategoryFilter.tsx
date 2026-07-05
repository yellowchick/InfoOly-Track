'use client'

import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categoryColorMap: Record<string, string> = {
  '全部': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  '数据结构': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  '图论': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  '动态规划': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  '数学': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  '算法': 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
            categoryColorMap[category],
            activeCategory === category && 'ring-2 ring-primary/30 ring-offset-1 ring-offset-background'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
