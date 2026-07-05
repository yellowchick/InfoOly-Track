import Link from 'next/link'
import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: number
  href: string
}

export function StatCard({ icon, label, value, href }: StatCardProps) {
  return (
    <Link href={href} className="shrink-0">
      <Card className="min-w-[100px] w-full cursor-pointer transition-transform active:scale-95 hover:shadow-md border-border/60">
        <CardContent className="p-3 flex flex-col items-center gap-1.5">
          <div className="text-primary text-xl">{icon}</div>
          <div className="text-xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted font-medium leading-tight">{label}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
