import { ScanBarcode, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GenerateTab } from './GenerateTab'
import { ValidateTab } from './ValidateTab'
import { BatchGenerator } from './BatchGenerator'
import { RecentCalculations } from './RecentCalculations'
import { useRecentEntries } from '@/hooks/useRecentEntries'

export type CalculatorTab = 'generate' | 'validate'

interface CalculatorSectionProps {
  activeTab: CalculatorTab
  onTabChange: (tab: CalculatorTab) => void
}

export function CalculatorSection({ activeTab, onTabChange }: CalculatorSectionProps) {
  const { entries, addEntry, clear } = useRecentEntries()

  return (
    <section id="calculator" className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">SSCC Calculator</h2>
        <p className="mt-3 text-ink-400">Generate a new SSCC-18, or validate one you already have.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as CalculatorTab)}>
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generate">
            <Sparkles className="size-4" />
            Generate SSCC
          </TabsTrigger>
          <TabsTrigger value="validate">
            <ScanBarcode className="size-4" />
            Validate SSCC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <GenerateTab
            onGenerated={(components) =>
              addEntry({ type: 'generated', sscc: components.sscc, valid: true })
            }
          />
        </TabsContent>
        <TabsContent value="validate">
          <ValidateTab
            onValidated={(result) => addEntry({ type: 'validated', sscc: result.sscc, valid: result.valid })}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <BatchGenerator
          onBatchGenerated={(list) =>
            list.forEach((c) => addEntry({ type: 'batch', sscc: c.sscc, valid: true }))
          }
        />
        <RecentCalculations entries={entries} onClear={clear} />
      </div>
    </section>
  )
}
