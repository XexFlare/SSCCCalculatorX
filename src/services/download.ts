function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function downloadCanvasAsPNG(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, filename)
  }, 'image/png')
}

export function downloadSVG(svgMarkup: string, filename: string): void {
  downloadBlob(new Blob([svgMarkup], { type: 'image/svg+xml' }), filename)
}

export function downloadCSV(csvContent: string, filename: string): void {
  downloadBlob(new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' }), filename)
}
