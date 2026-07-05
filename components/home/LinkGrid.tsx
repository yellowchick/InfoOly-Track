import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface ExternalLinkItem {
  id: string
  name: string
  url: string
  icon?: string | null
}

interface LinkGridProps {
  links: ExternalLinkItem[]
}

export function LinkGrid({ links }: LinkGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="cursor-pointer transition-transform active:scale-95 hover:shadow-md border-border/60">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <span className="text-2xl" role="img" aria-label={link.name}>
                {link.icon || '🔗'}
              </span>
              <span className="text-sm font-medium text-foreground">{link.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
