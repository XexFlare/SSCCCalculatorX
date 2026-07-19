import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-12 items-center gap-1 rounded-xl border border-navy-600 bg-navy-800/60 p-1',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-ink-400 transition-colors',
        'data-[state=active]:bg-brand-500 data-[state=active]:text-white data-[state=active]:shadow-glow-brand',
        'hover:text-ink-100 outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40',
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-6 outline-none data-[state=inactive]:hidden', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
