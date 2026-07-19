import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--color-navy-800)',
          '--normal-text': 'var(--color-ink-100)',
          '--normal-border': 'var(--color-navy-500)',
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
