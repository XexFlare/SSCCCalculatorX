import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-brand-500 text-white shadow-glow-brand hover:bg-brand-400 active:bg-brand-600',
        secondary:
          'bg-navy-700 text-ink-100 border border-navy-500 hover:bg-navy-600',
        outline:
          'border border-navy-500 bg-transparent text-ink-100 hover:bg-navy-800',
        ghost: 'text-ink-300 hover:bg-navy-800 hover:text-ink-100',
        link: 'text-brand-400 underline-offset-4 hover:underline',
        destructive: 'bg-rose-glow/90 text-navy-950 hover:bg-rose-glow',
        flare: 'bg-flare-500 text-white shadow-[0_8px_32px_-8px_rgba(255,122,26,0.45)] hover:bg-flare-400 active:bg-flare-600',
      },
      size: {
        default: 'h-11 px-5 [&_svg]:size-4',
        sm: 'h-9 px-3.5 text-[13px] [&_svg]:size-3.5',
        lg: 'h-12 px-7 text-base [&_svg]:size-5',
        icon: 'size-10 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
