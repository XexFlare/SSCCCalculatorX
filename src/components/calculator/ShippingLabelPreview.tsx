import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Download, Loader2, Printer, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { renderBarcodeToCanvas, renderLabelToCanvas } from '@/services/barcode'
import { downloadCanvasAsPNG } from '@/services/download'
import { printImageDataUrl } from '@/services/print'
import { formatGrouped } from '@/utils/sscc'

interface ShippingLabelPreviewProps {
  sscc: string
}

export function ShippingLabelPreview({ sscc }: ShippingLabelPreviewProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendering, setIsRendering] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsRendering(true)
    renderBarcodeToCanvas(previewCanvasRef.current!, sscc, { scale: 2, barHeight: 12 }).finally(() => {
      if (!cancelled) setIsRendering(false)
    })
    return () => {
      cancelled = true
    }
  }, [sscc])

  const handleDownloadLabel = async () => {
    setIsExporting(true)
    try {
      const canvas = document.createElement('canvas')
      await renderLabelToCanvas(canvas, sscc)
      downloadCanvasAsPNG(canvas, `sscc-${sscc}-shipping-label.png`)
      toast.success('Shipping label downloaded')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrintLabel = async () => {
    setIsExporting(true)
    try {
      const canvas = document.createElement('canvas')
      await renderLabelToCanvas(canvas, sscc)
      printImageDataUrl(canvas.toDataURL('image/png'), `SSCC ${sscc} shipping label`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-sm rounded-xl border-2 border-dashed border-navy-500/50 bg-white p-6 text-navy-950 shadow-glass">
        <div className="flex items-center justify-between border-b-2 border-navy-950 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Serial Shipping Container Code
          </span>
          <Tag className="size-4" aria-hidden="true" />
        </div>
        <p className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-navy-700">SSCC</p>
        <p className="mt-1 text-center font-mono-tabular text-xl font-bold tracking-wider">
          {formatGrouped(sscc)}
        </p>
        <div className="mt-4 flex min-h-14 items-center justify-center overflow-x-auto">
          {isRendering && <Loader2 className="size-4 animate-spin text-navy-400" aria-hidden="true" />}
          <canvas ref={previewCanvasRef} style={{ display: isRendering ? 'none' : 'block' }} aria-hidden="true" />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-navy-300 pt-3 text-[9px] font-medium uppercase tracking-wide text-navy-500">
          <span>AI (00) &middot; GS1-128</span>
          <span>AIFlare</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={handleDownloadLabel} disabled={isExporting}>
          {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
          Download Label
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handlePrintLabel} disabled={isExporting}>
          {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Printer className="size-3.5" />}
          Print Label
        </Button>
      </div>
    </div>
  )
}
