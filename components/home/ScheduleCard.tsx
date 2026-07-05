import { Card, CardContent } from '@/components/ui/card'

interface ScheduleCardProps {
  day: string
  startTime: string
  endTime: string
  note?: string
}

export function ScheduleCard({ day, startTime, endTime, note }: ScheduleCardProps) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-foreground">
            {startTime} - {endTime}
          </div>
          {note && (
            <p className="text-xs text-muted mt-1 line-clamp-2">{note}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
