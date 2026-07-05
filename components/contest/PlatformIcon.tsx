'use client'

import { cn } from '@/lib/utils'

const platformMap: Record<string, { emoji: string; color: string; borderColor: string }> = {
  CCF: { emoji: '🏛️', color: 'text-blue-600', borderColor: 'border-blue-500' },
  USACO: { emoji: '🌐', color: 'text-green-600', borderColor: 'border-green-500' },
  YACS: { emoji: '📚', color: 'text-orange-600', borderColor: 'border-orange-500' },
  AtCoder: { emoji: '⚡', color: 'text-purple-600', borderColor: 'border-purple-500' },
}

export default function PlatformIcon({ platform }: { platform?: string }) {
  const config = platformMap[platform || ''] || { emoji: '🏆', color: 'text-gray-600', borderColor: 'border-gray-400' }

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', config.color)}>
      <span>{config.emoji}</span>
      <span>{platform || '未知'}</span>
    </span>
  )
}

export function getPlatformBorderColor(platform?: string): string {
  return platformMap[platform || '']?.borderColor || 'border-gray-400'
}
