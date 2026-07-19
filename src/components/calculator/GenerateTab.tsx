import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Check, Copy, Dices, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useClipboard } from '@/hooks/useClipboard'
import { BarcodeDisplay } from './BarcodeDisplay'
import { ShippingLabelPreview } from './ShippingLabelPreview'
import {
  MAX_COMPANY_PREFIX_LENGTH,
  MIN_COMPANY_PREFIX_LENGTH,
  buildSSCC,
  formatGrouped,
  formatWithApplicationIdentifier,
  generateRandomSSCC,
  maxSerialReferenceLength,
} from '@/utils/sscc'
import type { SSCCComponents } from '@/types/sscc'

const generateSchema = z
  .object({
    extensionDigit: z.string().regex(/^[0-9]$/, 'Pick a digit 0-9'),
    companyPrefix: z
      .string()
      .regex(/^\d+$/, 'Digits only')
      .min(MIN_COMPANY_PREFIX_LENGTH, `At least ${MIN_COMPANY_PREFIX_LENGTH} digits`)
      .max(MAX_COMPANY_PREFIX_LENGTH, `At most ${MAX_COMPANY_PREFIX_LENGTH} digits`),
    serialReference: z.string().regex(/^\d+$/, 'Digits only').min(1, 'Required'),
  })
  .superRefine((values, ctx) => {
    const max = maxSerialReferenceLength(values.companyPrefix.length)
    if (values.serialReference.length > max) {
      ctx.addIssue({
        code: 'custom',
        message: `Too long for a ${values.companyPrefix.length}-digit company prefix (max ${max} digits)`,
        path: ['serialReference'],
      })
    }
  })

type GenerateFormValues = z.infer<typeof generateSchema>

interface GenerateTabProps {
  onGenerated: (components: SSCCComponents) => void
}

export function GenerateTab({ onGenerated }: GenerateTabProps) {
  const [result, setResult] = useState<SSCCComponents | null>(null)
  const sscc = useClipboard()
  const gs1Value = useClipboard()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: { extensionDigit: '0', companyPrefix: '', serialReference: '' },
  })

  const emit = (components: SSCCComponents) => {
    setResult(components)
    onGenerated(components)
  }

  const onSubmit = (values: GenerateFormValues) => {
    const outcome = buildSSCC(values.extensionDigit, values.companyPrefix, values.serialReference)
    if (!outcome.ok) {
      toast.error(outcome.error)
      return
    }
    emit(outcome.components)
    toast.success('SSCC-18 generated')
  }

  const handleRandom = () => {
    const components = generateRandomSSCC()
    setValue('extensionDigit', components.extensionDigit, { shouldValidate: true })
    setValue('companyPrefix', components.companyPrefix, { shouldValidate: true })
    setValue('serialReference', components.serialReference, { shouldValidate: true })
    emit(components)
    toast.success('Random valid SSCC generated')
  }

  const handleCopySSCC = async () => {
    if (!result) return
    if (await sscc.copy(result.sscc)) toast.success('SSCC copied to clipboard')
  }

  const handleCopyGS1 = async () => {
    if (!result) return
    if (await gs1Value.copy(formatWithApplicationIdentifier(result.sscc))) {
      toast.success('GS1-128 value copied to clipboard')
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="extensionDigit">Extension Digit</Label>
                <select
                  id="extensionDigit"
                  className="flex h-11 w-full rounded-xl border border-navy-500 bg-navy-800/60 px-3 text-sm text-ink-100 outline-none transition-colors focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/30"
                  {...register('extensionDigit')}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                {errors.extensionDigit && (
                  <p className="text-xs text-rose-glow">{errors.extensionDigit.message}</p>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="companyPrefix">Company Prefix</Label>
                <Input
                  id="companyPrefix"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="e.g. 0031234"
                  {...register('companyPrefix')}
                  aria-invalid={!!errors.companyPrefix}
                />
                {errors.companyPrefix && (
                  <p className="text-xs text-rose-glow">{errors.companyPrefix.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="serialReference">Serial Reference</Label>
              <Input
                id="serialReference"
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 56789012"
                {...register('serialReference')}
                aria-invalid={!!errors.serialReference}
              />
              {errors.serialReference && (
                <p className="text-xs text-rose-glow">{errors.serialReference.message}</p>
              )}
              <p className="text-xs text-ink-500">
                Padded on the left with zeros to fill the space left by your company prefix.
              </p>
            </div>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <Button type="submit" size="lg" className="flex-1">
                <Sparkles className="size-4" />
                Generate SSCC
              </Button>
              <Button type="button" size="lg" variant="secondary" onClick={handleRandom}>
                <Dices className="size-4" />
                Random Valid SSCC
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={result.sscc}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card>
              <CardContent className="flex flex-col gap-6 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                    Generated SSCC-18
                  </p>
                  <p className="mt-2 break-all font-mono-tabular text-2xl font-bold text-ink-50 sm:text-3xl">
                    {formatGrouped(result.sscc)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleCopySSCC}>
                      {sscc.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      Copy SSCC
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleCopyGS1}>
                      {gs1Value.copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      Copy Barcode Value
                    </Button>
                  </div>
                </div>

                <Separator />

                <BarcodeDisplay sscc={result.sscc} />

                <Separator />

                <ShippingLabelPreview sscc={result.sscc} />
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
              Fill in the fields and generate an SSCC-18 to see the barcode and shipping label
              preview here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
