import { useState } from 'react'
import { PackageSearch, Moon, Sun, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '#calculator', label: 'Calculator' },
  { href: '#what-is-sscc', label: 'What is an SSCC?' },
  { href: '#industries', label: 'Industries' },
  { href: '#features', label: 'Features' },
]

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-navy-800 border border-navy-600">
        <PackageSearch className="size-5 text-brand-400" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-ink-50">SSCC</span>
          <span className="text-gradient-brand">CalculatorX</span>
        </span>
        <span className="text-xs text-ink-500">
          By <span className="text-gradient-flare font-semibold">🔥 AIFlare</span>
        </span>
      </span>
    </a>
  )
}

function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="relative px-3.5 py-2 text-sm font-medium rounded-lg text-ink-400 transition-colors hover:text-ink-100 hover:bg-navy-800/60"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export function AppHeader() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-navy-800/80 bg-navy-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <NavLinks className="hidden lg:flex" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="hidden sm:inline-flex"
          >
            {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-navy-800 bg-navy-950/95 px-6 py-4 lg:hidden">
          <NavLinks className="flex-col items-stretch gap-1" onNavigate={() => setMobileOpen(false)} />
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start gap-2" onClick={toggleTheme}>
            {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            {theme === 'dark' ? 'Dark mode' : 'Light mode'}
          </Button>
        </div>
      )}
    </header>
  )
}
