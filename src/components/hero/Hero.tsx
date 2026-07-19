import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, ScanBarcode, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroProps {
  onSelectTab: (tab: 'generate' | 'validate') => void
}

function scrollToCalculator() {
  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Hero({ onSelectTab }: HeroProps) {
  return (
    <section className="relative flex-1 overflow-hidden" aria-label="Introduction">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/pallets.jpg)' }}
        role="img"
        aria-label="Warehouse pallets stacked with shipping labels"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/70 to-navy-950/92" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-navy-950/40 to-transparent" />

      <div className="relative mx-auto flex min-h-[86vh] w-full max-w-7xl flex-col justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <Badge variant="default" className="mb-5">
            <ShieldCheck className="size-3.5" />
            Official GS1 Mod-10 algorithm
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-ink-50 sm:text-5xl lg:text-6xl">
            Generate &amp; Validate <span className="text-gradient-brand">SSCC-18</span> Codes Instantly
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-300 sm:text-lg">
            Professional GS1 SSCC generator, validator and barcode creator built for warehouses,
            manufacturers and logistics professionals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => {
              onSelectTab('generate')
              scrollToCalculator()
            }}
          >
            Generate SSCC
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              onSelectTab('validate')
              scrollToCalculator()
            }}
          >
            <ScanBarcode className="size-4" />
            Validate SSCC
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-xs text-ink-500"
        >
          No sign-up. No uploads. Every calculation runs locally in your browser.
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={scrollToCalculator}
        aria-label="Scroll to the calculator"
        className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-1.5 text-ink-400 outline-none transition-colors hover:text-ink-100 focus-visible:text-ink-100"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[11px] font-medium uppercase tracking-widest">Scroll to explore</span>
        <ChevronDown className="size-5" />
      </motion.button>
    </section>
  )
}
