'use client'

import { TimelineItem } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import { Trophy, BookOpen, CheckCircle, Megaphone } from 'lucide-react'

interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'horizontal' | 'vertical'
}

const typeConfig = {
  contest: {
    icon: Trophy,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    label: '比赛',
  },
  knowledge: {
    icon: BookOpen,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    label: '知识点',
  },
  task: {
    icon: CheckCircle,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    label: '任务',
  },
  announcement: {
    icon: Megaphone,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    label: '公告',
  },
}

export function Timeline({ items, orientation = 'horizontal' }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        暂无时间轴记录
      </div>
    )
  }

  if (orientation === 'horizontal') {
    return (
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory">
          {items.map((item, index) => {
            const config = typeConfig[item.type]
            const Icon = config.icon
            return (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-[280px] snap-start"
              >
                {index > 0 && (
                  <div className="absolute left-[-18px] top-6 h-0.5 w-[18px] bg-primary/20" />
                )}
                <div className={cn(
                  'rounded-xl border p-4 shadow-sm',
                  config.bgColor,
                  config.borderColor
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white', config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium', config.textColor)}>
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm leading-tight mb-1 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  {item.badge && (
                    <span className={cn(
                      'inline-block rounded-full px-2 py-0.5 text-xs font-medium border',
                      config.bgColor,
                      config.textColor,
                      config.borderColor
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-primary/20" />
      <div className="space-y-4">
        {items.map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon
          return (
            <div key={item.id} className="relative">
              <div className={cn(
                'absolute -left-4 top-4 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white',
                config.color
              )}>
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div className={cn(
                'rounded-xl border p-4 shadow-sm',
                config.bgColor,
                config.borderColor
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-white', config.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium', config.textColor)}>
                      {config.label}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h4 className="font-semibold text-sm leading-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.description}
                </p>
                {item.badge && (
                  <span className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-xs font-medium border',
                    config.bgColor,
                    config.textColor,
                    config.borderColor
                  )}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
