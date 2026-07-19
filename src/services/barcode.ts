import type { RenderOptions } from 'bwip-js/browser'
import { formatGrouped, gs1128BarcodeText } from '@/utils/sscc'

export interface BarcodeRenderOptions {
  scale?: number
  barHeight?: number
  includeText?: boolean
}

// bwip-js bundles encoders for 100+ barcode symbologies (~1.4MB minified).
// It's only needed once a barcode is actually rendered, so it's loaded on
// demand instead of weighing down the initial page bundle.
async function loadBwipJs() {
  return import('bwip-js/browser')
}

function buildOptions(sscc: string, opts: BarcodeRenderOptions): RenderOptions {
  return {
    bcid: 'gs1-128',
    text: gs1128BarcodeText(sscc),
    scale: opts.scale ?? 3,
    height: opts.barHeight ?? 16,
    includetext: opts.includeText ?? true,
    textxalign: 'center',
    textsize: 9,
    textcolor: '000000',
    barcolor: '000000',
    backgroundcolor: 'FFFFFF',
    paddingwidth: 12,
    paddingheight: 12,
  }
}

/** Renders a GS1-128 barcode for the given SSCC onto an existing canvas element. */
export async function renderBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  sscc: string,
  opts: BarcodeRenderOptions = {}
): Promise<void> {
  const bwipjs = await loadBwipJs()
  bwipjs.toCanvas(canvas, buildOptions(sscc, opts))
}

/** Renders a GS1-128 barcode for the given SSCC as standalone SVG markup. */
export async function renderBarcodeToSVG(sscc: string, opts: BarcodeRenderOptions = {}): Promise<string> {
  const bwipjs = await loadBwipJs()
  return bwipjs.toSVG(buildOptions(sscc, opts))
}

/**
 * Composes a full, print-ready shipping label (header, human-readable SSCC,
 * GS1-128 barcode, footer) onto the given canvas.
 */
export async function renderLabelToCanvas(canvas: HTMLCanvasElement, sscc: string): Promise<void> {
  const barcodeCanvas = document.createElement('canvas')
  await renderBarcodeToCanvas(barcodeCanvas, sscc, { scale: 3, barHeight: 14 })

  const width = Math.max(620, barcodeCanvas.width + 100)
  const height = barcodeCanvas.height + 190

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 3
  ctx.strokeRect(10, 10, width - 20, height - 20)
  ctx.lineWidth = 1
  ctx.strokeRect(16, 16, width - 32, height - 32)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#111827'
  ctx.font = '700 15px Inter, system-ui, sans-serif'
  ctx.fillText('SERIAL SHIPPING CONTAINER CODE', width / 2, 52)

  ctx.font = '700 20px Inter, system-ui, sans-serif'
  ctx.fillText('SSCC', width / 2, 80)

  ctx.font = '700 30px "JetBrains Mono", monospace'
  ctx.fillText(formatGrouped(sscc), width / 2, 122)

  const barcodeX = (width - barcodeCanvas.width) / 2
  const barcodeY = 145
  ctx.drawImage(barcodeCanvas, barcodeX, barcodeY)

  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(32, height - 46)
  ctx.lineTo(width - 32, height - 46)
  ctx.stroke()

  ctx.font = '400 11px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#6b7280'
  ctx.textAlign = 'left'
  ctx.fillText(`Generated ${new Date().toLocaleDateString()}`, 32, height - 24)
  ctx.textAlign = 'right'
  ctx.fillText('AIFlare · SSCCCalculatorX', width - 32, height - 24)
}
