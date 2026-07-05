'use client'

import { Badge } from '@/components/ui/badge'
import { awardColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function AwardBadge({ award }: { award?: string }) {
  if (!award) return null

  const extraImpact =
    award.includes('一等') || award.includes('银升金')
      ? 'ring-1 ring-yellow-300 shadow-sm'
      : award.includes('二等') || award.includes('铜升银')
      ? 'ring-1 ring-gray-200'
      : ''

  return <Badge className={cn(awardColor(award), extraImpact)}>{award}</Badge>
}
