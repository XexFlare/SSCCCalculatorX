import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Download, Loader2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { renderBarcodeToCanvas, renderBarcodeToSVG } from '@/services/barcode'
import { downloadCanvasAsPNG, downloadSVG } from '@/services/download'
import { printImageDataUrl } from '@/services/print'

interface BarcodeDisplayProps {
  sscc: string
}

export function BarcodeDisplay({ sscc }: BarcodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsRendering(true)
    renderBarcodeToCanvas(canvasRef.current!, sscc, { scale: 3, barHeight: 16 }).finally(() => {
      if (!cancelled) setIsRendering(false)
    })
    return () => {
      cancelled = true
    }
  }, [sscc])

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return
    downloadCanvasAsPNG(canvasRef.current, `sscc-${sscc}-barcode.png`)
    toast.success('Barcode PNG downloaded')
  }

  const handleDownloadSVG = async () => {
    const svg = await renderBarcodeToSVG(sscc, { scale: 3, barHeight: 16 })
    downloadSVG(svg, `sscc-${sscc}-barcode.svg`)
    toast.success('Barcode SVG downloaded')
  }

  const handlePrint = () => {
    if (!canvasRef.current) return
    printImageDataUrl(canvasRef.current.toDataURL('image/png'), `SSCC ${sscc} barcode`)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-x-auto rounded-xl bg-white p-4">
        {isRendering && (
          <div className="flex h-16 items-center justify-center text-navy-400">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="mx-auto block"
          style={{ display: isRendering ? 'none' : 'block' }}
          role="img"
          aria-label={`GS1-128 barcode encoding SSCC ${sscc}`}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={handleDownloadPNG} disabled={isRendering}>
          <Download className="size-3.5" />
          Download PNG
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handleDownloadSVG} disabled={isRendering}>
          <Download className="size-3.5" />
          Download SVG
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handlePrint} disabled={isRendering}>
          <Printer className="size-3.5" />
          Print
        </Button>
      </div>
    </div>
  )
}
