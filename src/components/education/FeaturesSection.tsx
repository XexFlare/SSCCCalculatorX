import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const FEATURES = [
  'Generate valid SSCC-18 numbers',
  'Validate existing SSCCs',
  'Automatic check digit calculation',
  'GS1-128 barcode generation',
  'Printable shipping labels',
  'Batch generation',
  'CSV export',
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-navy-800/60 bg-navy-900/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">Everything you need, built in</h2>
          <p className="mt-4 text-ink-300">
            No spreadsheets, no manual check-digit math — just accurate, GS1-compliant results.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-12 grid max-w-3xl gap-x-8 gap-y-4 sm:grid-cols-2"
        >
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 rounded-xl border border-navy-700 bg-navy-800/30 px-4 py-3">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-glow" aria-hidden="true" />
              <span className="text-sm font-medium text-ink-100">{feature}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
