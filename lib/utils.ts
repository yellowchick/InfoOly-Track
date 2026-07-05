import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  if (dateStr.length === 6) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}`
  }
  if (dateStr.includes('/')) {
    return dateStr.replace('/', '-')
  }
  return dateStr
}

export function levelColor(level: number): string {
  const colors: Record<number, string> = {
    3: 'bg-green-100 text-green-800 border-green-200',
    4: 'bg-blue-100 text-blue-800 border-blue-200',
    5: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    6: 'bg-orange-100 text-orange-800 border-orange-200',
    7: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function levelLabel(level: number): string {
  const labels: Record<number, string> = {
    3: 'CSP-J',
    4: 'GESP 7级',
    5: 'CSP-S',
    6: 'USACO金',
    7: '省选',
  }
  return labels[level] || `Level ${level}`
}

export function awardColor(award: string): string {
  if (award.includes('一等')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  if (award.includes('二等')) return 'text-gray-600 bg-gray-50 border-gray-200'
  if (award.includes('三等')) return 'text-amber-700 bg-amber-50 border-amber-200'
  if (award.includes('金')) return 'text-yellow-500 bg-yellow-50 border-yellow-200'
  if (award.includes('银')) return 'text-gray-400 bg-gray-50 border-gray-200'
  if (award.includes('铜')) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-blue-600 bg-blue-50 border-blue-200'
}
