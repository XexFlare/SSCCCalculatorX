import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { FileDown, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  MAX_COMPANY_PREFIX_LENGTH,
  MIN_COMPANY_PREFIX_LENGTH,
  buildSSCC,
  formatGrouped,
} from '@/utils/sscc'
import { sscListToCSV } from '@/utils/csv'
import { downloadCSV } from '@/services/download'
import type { SSCCComponents } from '@/types/sscc'

const MAX_BATCH_SIZE = 500

const batchSchema = z.object({
  extensionDigit: z.string().regex(/^[0-9]$/, 'Pick a digit 0-9'),
  companyPrefix: z
    .string()
    .regex(/^\d+$/, 'Digits only')
    .min(MIN_COMPANY_PREFIX_LENGTH, `At least ${MIN_COMPANY_PREFIX_LENGTH} digits`)
    .max(MAX_COMPANY_PREFIX_LENGTH, `At most ${MAX_COMPANY_PREFIX_LENGTH} digits`),
  startSerial: z.string().regex(/^\d+$/, 'Digits only').min(1, 'Required'),
  quantity: z.coerce
    .number()
    .int('Whole numbers only')
    .min(1, 'At least 1')
    .max(MAX_BATCH_SIZE, `At most ${MAX_BATCH_SIZE} at a time`),
})

type BatchFormInput = z.input<typeof batchSchema>
type BatchFormValues = z.output<typeof batchSchema>

interface BatchGeneratorProps {
  onBatchGenerated: (batch: SSCCComponents[]) => void
}

export function BatchGenerator({ onBatchGenerated }: BatchGeneratorProps) {
  const [batch, setBatch] = useState<SSCCComponents[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormInput, unknown, BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: { extensionDigit: '0', companyPrefix: '', startSerial: '1', quantity: 10 },
  })

  const onSubmit = (values: BatchFormValues) => {
    const results: SSCCComponents[] = []
    let current = BigInt(values.startSerial)

    for (let i = 0; i < values.quantity; i++) {
      const outcome = buildSSCC(values.extensionDigit, values.companyPrefix, current.toString())
      if (!outcome.ok) {
        toast.error(
          results.length > 0
            ? `Stopped after ${results.length} codes: ${outcome.error}`
            : outcome.error
        )
        break
      }
      results.push(outcome.components)
      current += 1n
    }

    if (results.length > 0) {
      setBatch(results)
      onBatchGenerated(results)
      toast.success(`Generated ${results.length} SSCC code${results.length === 1 ? '' : 's'}`)
    }
  }

  const handleExportCSV = () => {
    if (batch.length === 0) return
    downloadCSV(sscListToCSV(batch), `sscc-batch-${batch.length}.csv`)
    toast.success('CSV exported')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="size-4 text-brand-400" />
          Batch Generation
        </CardTitle>
        <CardDescription>Generate a sequential run of SSCCs from one company prefix.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 sm:grid-cols-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="batch-extension">Ext.</Label>
            <select
              id="batch-extension"
              className="flex h-11 w-full rounded-xl border border-navy-500 bg-navy-800/60 px-2 text-sm text-ink-100 outline-none focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/30"
              {...register('extensionDigit')}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <Label htmlFor="batch-prefix">Company Prefix</Label>
            <Input id="batch-prefix" inputMode="numeric" placeholder="0031234" {...register('companyPrefix')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="batch-start">Start Serial</Label>
            <Input id="batch-start" inputMode="numeric" placeholder="1" {...register('startSerial')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="batch-quantity">Quantity</Label>
            <Input id="batch-quantity" type="number" min={1} max={MAX_BATCH_SIZE} {...register('quantity')} />
          </div>

          {(errors.extensionDigit || errors.companyPrefix || errors.startSerial || errors.quantity) && (
            <p className="col-span-2 text-xs text-rose-glow sm:col-span-4">
              {errors.extensionDigit?.message ||
                errors.companyPrefix?.message ||
                errors.startSerial?.message ||
                errors.quantity?.message}
            </p>
          )}

          <div className="col-span-2 sm:col-span-4">
            <Button type="submit" className="w-full sm:w-auto">
              <Layers className="size-4" />
              Generate Batch
            </Button>
          </div>
        </form>

        {batch.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-400">
                {batch.length} code{batch.length === 1 ? '' : 's'} generated
              </p>
              <Button type="button" variant="outline" size="sm" onClick={handleExportCSV}>
                <FileDown className="size-3.5" />
                Export CSV
              </Button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-navy-600">
              <ul className="divide-y divide-navy-700">
                {batch.map((c) => (
                  <li
                    key={c.sscc}
                    className="px-4 py-2 font-mono-tabular text-sm text-ink-200 hover:bg-navy-800/50"
                  >
                    {formatGrouped(c.sscc)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
