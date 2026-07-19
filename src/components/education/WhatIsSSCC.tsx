import { motion } from 'framer-motion'
import { Boxes, Hash, KeyRound, ListOrdered } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const SEGMENTS = [
  {
    icon: Hash,
    title: 'Extension Digit',
    description: 'A single digit (0-9) that lets one company prefix generate more serial capacity.',
  },
  {
    icon: KeyRound,
    title: 'GS1 Company Prefix',
    description: "Uniquely assigned to your organisation by GS1, typically 6-10 digits.",
  },
  {
    icon: ListOrdered,
    title: 'Serial Reference',
    description: 'A number you control, unique within your company prefix, never reused.',
  },
  {
    icon: Boxes,
    title: 'Check Digit',
    description: 'Calculated with the GS1 Mod-10 algorithm to catch transcription errors.',
  },
]

export function WhatIsSSCC() {
  return (
    <section id="what-is-sscc" className="scroll-mt-20 border-t border-navy-800/60 bg-navy-900/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">
            What is an <span className="text-gradient-brand">SSCC</span>?
          </h2>
          <p className="mt-4 text-ink-300">
            <strong className="text-ink-100">SSCC</strong> stands for{' '}
            <strong className="text-ink-100">Serial Shipping Container Code</strong> — an 18-digit
            GS1 identification number. Despite the name, it doesn't identify individual products.
            It uniquely identifies logistics units like pallets, cartons, crates, roll cages and
            other shipping units as they move through the supply chain, so every party — from the
            warehouse floor to the receiving dock — can scan one barcode and know exactly which
            unit they're handling.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((segment, i) => (
            <motion.div
              key={segment.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="h-full">
                <CardContent className="flex flex-col gap-3 p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
                    <segment.icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-semibold text-ink-50">{segment.title}</p>
                  <p className="text-sm text-ink-400">{segment.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
