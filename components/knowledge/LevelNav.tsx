'use client'

import { levelLabel, levelColor, cn } from '@/lib/utils'

interface LevelNavProps {
  levels: number[]
  onLevelClick: (level: number) => void
}

export function LevelNav({ levels, onLevelClick }: LevelNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-y border-border py-3 mb-4 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onLevelClick(level)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition-all active:scale-95',
              levelColor(level)
            )}
          >
            {levelLabel(level)} ({level})
          </button>
        ))}
      </div>
    </div>
  )
}
