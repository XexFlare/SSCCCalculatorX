import { motion } from 'framer-motion'
import { Factory, Globe2, Network, ShoppingCart, Truck, Warehouse } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const INDUSTRIES = [
  { icon: Warehouse, title: 'Warehousing', description: 'Track pallets and roll cages from receiving to put-away.' },
  { icon: Factory, title: 'Manufacturing', description: 'Identify finished-goods units leaving the production line.' },
  { icon: Truck, title: 'Distribution', description: 'Reconcile shipments and cross-dock units across facilities.' },
  { icon: ShoppingCart, title: 'Retail', description: 'Match inbound pallets against advance ship notices (ASNs).' },
  { icon: Network, title: 'Third Party Logistics', description: 'Give every client a consistent, scannable unit identifier.' },
  { icon: Globe2, title: 'Supply Chain', description: 'Trace shipping units end-to-end across trading partners.' },
]

export function IndustriesSection() {
  return (
    <section id="industries" className="scroll-mt-20 border-t border-navy-800/60">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">Built for every part of the chain</h2>
          <p className="mt-4 text-ink-300">
            SSCC-18 codes are the backbone of pallet and unit-load tracking across industries.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, i) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-transform hover:-translate-y-1">
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-flare-500/15 text-flare-500">
                    <industry.icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="text-lg font-semibold text-ink-50">{industry.title}</p>
                  <p className="text-sm text-ink-400">{industry.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
