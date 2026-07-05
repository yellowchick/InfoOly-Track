'use client'

import { Badge } from '@/components/ui/badge'

export type FilterState = {
  year: string | null
  platform: string | null
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const YEARS = ['2024', '2025', '2026']
const PLATFORMS = ['CCF', 'USACO', 'YACS', 'AtCoder']

export default function ContestFilter({ filters, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-sm font-medium text-muted shrink-0">年份</span>
        <Badge
          variant={filters.year === null ? 'default' : 'outline'}
          className="cursor-pointer select-none"
          onClick={() => onChange({ ...filters, year: null })}
        >
          全部
        </Badge>
        {YEARS.map(year => (
          <Badge
            key={year}
            variant={filters.year === year ? 'default' : 'outline'}
            className="cursor-pointer select-none"
            onClick={() => onChange({ ...filters, year })}
          >
            {year}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-sm font-medium text-muted shrink-0">平台</span>
        <Badge
          variant={filters.platform === null ? 'default' : 'outline'}
          className="cursor-pointer select-none"
          onClick={() => onChange({ ...filters, platform: null })}
        >
          全部
        </Badge>
        {PLATFORMS.map(platform => (
          <Badge
            key={platform}
            variant={filters.platform === platform ? 'default' : 'outline'}
            className="cursor-pointer select-none"
            onClick={() => onChange({ ...filters, platform })}
          >
            {platform}
          </Badge>
        ))}
      </div>
    </div>
  )
}
