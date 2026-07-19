/** Opens a new window containing the given image and triggers the print dialog. */
export function printImageDataUrl(dataUrl: string, title = 'Print'): void {
  const win = window.open('', '_blank', 'width=650,height=850')
  if (!win) return

  win.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      html, body { margin: 0; padding: 24px; display: flex; justify-content: center; align-items: center; background: #fff; }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" alt="${title}" />
  </body>
</html>`)
  win.document.close()

  const img = win.document.querySelector('img')
  if (img) {
    img.addEventListener('load', () => {
      win.focus()
      win.print()
    })
  }
}
