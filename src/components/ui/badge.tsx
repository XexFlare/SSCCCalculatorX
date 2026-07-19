import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
        neutral: 'bg-navy-700 text-ink-300 border border-navy-500',
        warning: 'bg-amber-glow/15 text-amber-glow border border-amber-glow/30',
        danger: 'bg-rose-glow/15 text-rose-glow border border-rose-glow/30',
        success: 'bg-emerald-glow/15 text-emerald-glow border border-emerald-glow/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
