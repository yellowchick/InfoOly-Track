import { levelLabel, levelColor, cn } from '@/lib/utils'
import { KnowledgePoint, Student, StudentKnowledge } from '@/types'
import { KnowledgeCard } from './KnowledgeCard'

type KnowledgePointWithStudents = KnowledgePoint & {
  students: (StudentKnowledge & { student: Student })[]
}

interface LevelSectionProps {
  groupedByLevel: Map<number, KnowledgePointWithStudents[]>
}

export function LevelSection({ groupedByLevel }: LevelSectionProps) {
  return (
    <div className="space-y-6">
      {Array.from(groupedByLevel.entries()).map(([level, points]) => (
        <section
          key={level}
          id={`level-${level}`}
          className="rounded-xl bg-card border shadow-sm overflow-hidden scroll-mt-20"
        >
          {/* 彩色标题栏 */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-semibold border',
                levelColor(level)
              )}
            >
              {levelLabel(level)}
            </span>
            <span className="text-sm text-muted">
              {points.length} 个知识点
            </span>
          </div>

          {/* 单列列表：每个知识点一行 */}
          <div className="divide-y divide-border">
            {points.map((point) => (
              <KnowledgeCard key={point.id} knowledgePoint={point} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
