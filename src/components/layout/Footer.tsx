import { PackageSearch } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-navy-800/80 bg-navy-950/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-navy-800 border border-navy-600">
            <PackageSearch className="size-4 text-brand-400" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink-100">
              SSCC<span className="text-gradient-brand">CalculatorX</span>
            </p>
            <p className="text-xs text-ink-500">
              By <span className="text-gradient-flare font-semibold">🔥 AIFlare</span>
            </p>
          </div>
        </div>

        <p className="max-w-md text-xs text-ink-500 sm:text-right">
          Free GS1-compliant SSCC-18 generator, validator and GS1-128 barcode tool for warehouses,
          manufacturers and logistics teams. All calculations run locally in your browser.
        </p>
      </div>
    </footer>
  )
}
