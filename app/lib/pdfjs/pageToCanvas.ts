import { PDFPageProxy } from "pdfjs-dist";

interface IOpts {
    viewportScale: number,
    hideText?: boolean
}
export async function pageToCanvas(page: PDFPageProxy, opts: IOpts): Promise<HTMLCanvasElement> {
    let origStrokeText = CanvasRenderingContext2D.prototype.strokeText
    let origFillText = CanvasRenderingContext2D.prototype.fillText
    if (opts.hideText) {
        CanvasRenderingContext2D.prototype.strokeText = function () { };
        CanvasRenderingContext2D.prototype.fillText = function () { };
    }

    const viewport = page.getViewport({ scale: opts.viewportScale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height
    canvas.width = viewport.width
    canvas.style.width = '100%'
    canvas.style.objectFit = 'contain'

    await page.render({ canvasContext: context!, viewport }).promise

    if (opts.hideText) {
        CanvasRenderingContext2D.prototype.strokeText = origStrokeText
        CanvasRenderingContext2D.prototype.fillText = origFillText
    }
    return canvas
}