'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-md mx-auto relative">
        <button
          onClick={scrollToTop}
          className={cn(
            'absolute right-4 bg-primary text-white rounded-full p-3 shadow-lg',
            'transition-all duration-300 hover:bg-primary-dark active:scale-90',
            visible
              ? 'bottom-20 opacity-100 translate-y-0 pointer-events-auto'
              : 'bottom-16 opacity-0 translate-y-4'
          )}
          aria-label="回到顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
