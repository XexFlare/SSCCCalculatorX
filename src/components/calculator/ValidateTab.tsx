import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle2, ScanBarcode, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { BarcodeDisplay } from './BarcodeDisplay'
import { formatGrouped, validateSSCC } from '@/utils/sscc'
import type { ValidationResult } from '@/types/sscc'

interface ValidateTabProps {
  onValidated: (result: ValidationResult) => void
}

export function ValidateTab({ onValidated }: ValidateTabProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidate = () => {
    const outcome = validateSSCC(input)
    setResult(outcome)
    onValidated(outcome)
    if (outcome.valid) {
      toast.success('SSCC is valid')
    } else {
      toast.error('SSCC is invalid')
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sscc-input">Paste SSCC-18</Label>
            <textarea
              id="sscc-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 003123456789012347"
              rows={3}
              spellCheck={false}
              className="flex w-full resize-none rounded-xl border border-navy-500 bg-navy-800/60 px-4 py-3 font-mono-tabular text-lg tracking-wide text-ink-100 placeholder:text-ink-500 placeholder:font-sans placeholder:text-sm outline-none transition-colors focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/30"
              aria-describedby="sscc-input-help"
            />
            <p id="sscc-input-help" className="text-xs text-ink-500">
              Spaces and dashes are ignored automatically.
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleValidate}
            disabled={input.trim().length === 0}
          >
            <ScanBarcode className="size-4" />
            Validate
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={result.sscc + String(result.valid)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card>
              <CardContent className="flex flex-col gap-6 p-6">
                {result.valid ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-8 text-emerald-glow" aria-hidden="true" />
                    <div>
                      <p className="text-lg font-bold text-ink-50">Valid SSCC</p>
                      <p className="text-sm text-ink-400">The check digit matches — this SSCC is well-formed.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <XCircle className="size-8 text-rose-glow" aria-hidden="true" />
                    <div>
                      <p className="text-lg font-bold text-ink-50">Invalid SSCC</p>
                      <p className="text-sm text-ink-400">{result.reason}</p>
                    </div>
                  </div>
                )}

                {result.sscc && (
                  <p className="break-all font-mono-tabular text-xl font-semibold text-ink-100">
                    {result.sscc.length === 18 ? formatGrouped(result.sscc) : result.sscc}
                  </p>
                )}

                {(result.expectedCheckDigit || result.receivedCheckDigit) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-navy-600 bg-navy-800/40 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                        Expected Check Digit
                      </p>
                      <p className="mt-1 font-mono-tabular text-2xl font-bold text-emerald-glow">
                        {result.expectedCheckDigit}
                      </p>
                    </div>
                    <div className="rounded-xl border border-navy-600 bg-navy-800/40 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                        Received Check Digit
                      </p>
                      <p
                        className={`mt-1 font-mono-tabular text-2xl font-bold ${
                          result.valid ? 'text-emerald-glow' : 'text-rose-glow'
                        }`}
                      >
                        {result.receivedCheckDigit}
                      </p>
                    </div>
                  </div>
                )}

                {result.valid && (
                  <>
                    <Badge variant="success" className="w-fit">
                      GS1 Mod-10 check digit verified
                    </Badge>
                    <BarcodeDisplay sscc={result.sscc} />
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-navy-600 text-center"
          >
            <p className="max-w-xs px-6 text-sm text-ink-500">
              Paste an SSCC-18 and validate it to see a full check-digit breakdown here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
