import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="mt-3 text-sm text-muted font-medium">加载中...</p>
    </div>
  )
}
