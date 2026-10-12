let fonts: Promise<unknown> | undefined
export function ensurePageFonts() {
  return fonts ??= Promise.all([
    document.fonts.load('700 48px "Page Serif"'),
    document.fonts.load('400 48px "Event Display"'),
    document.fonts.load('400 48px "Event Horror"'),
    document.fonts.load('400 48px "Event Blood"'),
    document.fonts.load('400 32px "Page Antique"'),
    document.fonts.load('italic 32px "Page Antique"'),
  ])
}
/** Subpixel ink spread is baked into the paper, never a blur on the book. */
export function preparePageInk(ctx: CanvasRenderingContext2D) {
  const write = ctx.fillText.bind(ctx)
  ctx.fillText = (text, x, y, width) => {
    if(width === undefined) write(text, x, y); else write(text, x, y, width)
    ctx.save();ctx.globalAlpha *= .12
    if(width === undefined) write(text, x + .28, y + .22); else write(text, x + .28, y + .22, width)
    ctx.restore()
  }
}
