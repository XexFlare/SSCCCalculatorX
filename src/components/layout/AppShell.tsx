import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { Footer } from './Footer'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ocean-gradient">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <AppHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
