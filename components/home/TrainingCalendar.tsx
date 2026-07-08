import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Schedule {
  id: string
  day: string
  startTime: string
  endTime: string
  note?: string | null
}

interface TrainingCalendarProps {
  schedules: Schedule[]
  month?: number
  year?: number
}

export function TrainingCalendar({ schedules, month = 7, year = 2026 }: TrainingCalendarProps) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0=周日, 1=周一
  
  // 解析训练日期
  const trainingDays = new Set(
    schedules.map(s => {
      const match = s.day.match(/\d+\.(\d+)/)
      return match ? parseInt(match[1]) : null
    }).filter(Boolean) as number[]
  )
  
  const scheduleMap = new Map<number, Schedule>()
  schedules.forEach(s => {
    const match = s.day.match(/\d+\.(\d+)/)
    if (match) {
      scheduleMap.set(parseInt(match[1]), s)
    }
  })

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  
  return (
    <Card className="p-4 border-border/60">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-foreground">{year}年{month}月</h3>
        <p className="text-xs text-muted-foreground mt-1">集训日历</p>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 空白填充 */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        
        {/* 日期 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isTraining = trainingDays.has(day)
          const schedule = scheduleMap.get(day)
          
          return (
            <div
              key={day}
              className={cn(
                "h-10 rounded-lg flex items-center justify-center text-sm font-medium relative",
                isTraining
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted/50"
              )}
              title={schedule ? `${schedule.startTime} - ${schedule.endTime}` : undefined}
            >
              {day}
              {isTraining && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80" />
              )}
            </div>
          )
        })}
      </div>
      
      {/* 图例 */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>训练日</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-border" />
          <span>休息日</span>
        </div>
      </div>
      
      {/* 训练日期列表 */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-foreground">训练安排</h4>
        {schedules.map(s => (
          <div key={s.id} className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs">
              {s.day}
            </span>
            <div className="flex-1">
              <div className="font-medium">{s.startTime} - {s.endTime}</div>
              {s.note && <div className="text-xs text-muted-foreground">{s.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
