import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-navy-500 bg-navy-800/60 px-4 text-sm text-ink-100 placeholder:text-ink-500',
        'transition-colors outline-none focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Input }
