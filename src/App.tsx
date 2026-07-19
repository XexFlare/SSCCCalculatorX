import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Hero } from '@/components/hero/Hero'
import { CalculatorSection, type CalculatorTab } from '@/components/calculator/CalculatorSection'
import { WhatIsSSCC } from '@/components/education/WhatIsSSCC'
import { IndustriesSection } from '@/components/education/IndustriesSection'
import { FeaturesSection } from '@/components/education/FeaturesSection'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('generate')

  return (
    <TooltipProvider delayDuration={200}>
      <AppShell>
        <Hero onSelectTab={setActiveTab} />
        <CalculatorSection activeTab={activeTab} onTabChange={setActiveTab} />
        <WhatIsSSCC />
        <IndustriesSection />
        <FeaturesSection />
      </AppShell>
      <Toaster position="top-right" />
    </TooltipProvider>
  )
}
