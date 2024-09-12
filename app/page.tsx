"use client";
import { Button } from "./components/shared/Button";
import {
  FaRotate,
  MagnifyingMinus,
  MagnifyingPlus,
} from "./components/shared/FaIcons";
import { Footer } from "./components/shared/Footer";
import { Header } from "./components/shared/Header";
import { Spinner } from "./components/shared/Spinner";
import { FileDrop } from "./tools/FileDrop";
import { ItemGraphic } from "./tools/ItemGraphic";
import { RoundedIconButton } from "./tools/RoundedIconButton";
import { Selecto } from "./tools/Selecto";
import { downloadBlob } from "./lib/downloadBlob";
import { fileToUInt8Array } from "./lib/filetToUInt8Array";
import { pageToCanvas } from "./lib/pdfjs/pageToCanvas";
import { removeFileExt } from "./lib/removeFileExt";
import { PDFDocument, degrees } from "pdf-lib";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { FC, useEffect, useRef, useState } from "react";

interface IPdfPage {
  pageNum: number;
  canvas: HTMLCanvasElement;
  selected: boolean;
  rotation: number;
}

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.6.82/build/pdf.worker.mjs`;

export default function RotatePdf() {
  const [pages, setPages] = useState<IPdfPage[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfData, setPdfData] = useState<Uint8Array | undefined>(undefined);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(200);
  const [fileName, setFileName] = useState("");
  const minPageWidth = 100;
  const maxPageWidth = 500;

  const addFiles = async (files: FileList) => {
    setIsLoadingPdf(true);

    try {
      const insertPages: IPdfPage[] = [];
      const file = files[0];
      const data = await fileToUInt8Array(file);
      const dataCopy = new Uint8Array(data);
      const document = await getDocument(data).promise;

      for (let index = 1; index < document.numPages + 1; index++) {
        const page = await document.getPage(index);
        const canvas = await pageToCanvas(page, { viewportScale: 1 });
        insertPages.push({
          pageNum: index,
          canvas,
          selected: true,
          rotation: 0,
        });
      }

      setFileName(file.name);
      setPdfData(dataCopy);
      setPages([...pages, ...insertPages]);
    } catch (err) {
      console.warn(err);
    }

    setIsLoadingPdf(false);
  };

  const onDownload = async () => {
    const downloadDoc = await PDFDocument.load(pdfData!);
    const pageCount = downloadDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const page = downloadDoc.getPage(i);
      page.setRotation(degrees(pages[i].rotation));
    }

    const bytes = await downloadDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    downloadBlob(blob, `${removeFileExt(fileName)}(pdf.ai-rotated).pdf`);
  };

  const onRotateAll = () => {
    const newPages = pages.map((p) => {
      p.rotation += 90;
      return p;
    });
    setPages(newPages);
  };

  const onZoom = (increase: boolean) => {
    if (increase) {
      setPageWidth(Math.min(pageWidth + 50, maxPageWidth));
    } else {
      setPageWidth(Math.max(pageWidth - 50, minPageWidth));
    }
  };

  const onClearPDF = () => {
    setPages([]);
    setPdfData(undefined);
  };

  return (
    <main>
      <Header />
      <Selecto
        container={pagesRef.current}
        selectableTargets={[".pdf-page"]}
        ignoreClass=".selecto-ignore"
        indexAttrProp="data-page-num"
        onChange={(index, type) => {
          const newPages = pages.slice();
          const page = newPages[Number(index)];
          page.selected = type === "remove" ? false : true;
          setPages(newPages);
        }}
      />

      <div className="bg-[#f7f5ee] text-black">
        <div className="container mx-auto py-20 space-y-5">
          <div className="flex flex-col text-center !mb-10 space-y-5">
            <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
            <p className="mt-2 text-gray-600 max-w-lg mx-auto">
              Simply click on a page to rotate it. You can then download your
              modified PDF.
            </p>
          </div>

          {pages.length > 0 && (
            <div className="flex justify-center items-center space-x-3 selecto-ignore">
              <Button className="!w-auto" onClick={onRotateAll}>
                Rotate all
              </Button>
              <Button
                className="!w-auto !bg-gray-800"
                onClick={onClearPDF}
                aria-label="Remove this PDF and select a new one"
                data-microtip-position="top"
                role="tooltip"
              >
                Remove PDF
              </Button>
              <RoundedIconButton
                disabled={pageWidth === maxPageWidth}
                aria-label="Zoom in"
                data-microtip-position="top"
                role="tooltip"
                className="!bg-white"
                onClick={() => onZoom(true)}
              >
                <MagnifyingPlus className="w-5 h-5" />
              </RoundedIconButton>
              <RoundedIconButton
                disabled={pageWidth === minPageWidth}
                aria-label="Zoom out"
                data-microtip-position="top"
                role="tooltip"
                className="!bg-white"
                onClick={() => onZoom(false)}
              >
                <MagnifyingMinus className="w-5 h-5" />
              </RoundedIconButton>
            </div>
          )}

          {pages.length === 0 && !isLoadingPdf && (
            <div className="w-full flex justify-center">
              <FileDrop onFileChange={addFiles} />
            </div>
          )}

          {isLoadingPdf && (
            <div className="flex justify-center">
              <Spinner color="black" />
            </div>
          )}

          {!isLoadingPdf && (
            <div ref={pagesRef} className="flex flex-wrap justify-center">
              {pages.map((page, i) => {
                return (
                  <div
                    key={i}
                    className="m-3"
                    style={{
                      maxWidth: `${pageWidth}px`,
                      flex: `0 0 ${pageWidth}px`,
                    }}
                  >
                    <PdfPage
                      index={i}
                      name={`${i + 1}`}
                      canvas={page.canvas}
                      rotation={page.rotation}
                      onRotate={(degrees) => {
                        page.rotation = degrees;
                        setPages([...pages]);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {pages.length > 0 && (
            <div className="flex flex-col justify-center items-center space-y-3 selecto-ignore">
              <Button
                disabled={pages.filter((p) => p.selected).length === 0}
                onClick={onDownload}
                className="!w-auto shadow"
                aria-label="Split and download PDF"
                data-microtip-position="top"
                role="tooltip"
              >
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

interface IPdfPageProps {
  index: number;
  canvas: HTMLCanvasElement;
  name: string;
  rotation: number;
  onRotate(degrees: number): void;
}
const PdfPage: FC<IPdfPageProps> = ({
  index,
  canvas,
  name,
  rotation,
  onRotate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (ref.current) {
      if (!hasMounted) {
        canvas.style.transitionProperty = "transform";
        canvas.style.transitionTimingFunction = "cubic-bezier(0.4, 0, 0.2, 1)";
        canvas.style.transitionDuration = "150ms";
        setHasMounted(true);
      }
      canvas.style.transform = `rotate(${rotation}deg)`;
    }
  }, [ref, rotation]);
  return (
    <div
      className="relative cursor-pointer pdf-page"
      data-page-num={index}
      onClick={() => onRotate(rotation + 90)}
    >
      <div
        className={
          "absolute z-10 top-1 right-1 rounded-full p-1 hover:scale-105 hover:fill-white bg-[#ff612f] fill-white"
        }
      >
        <FaRotate className="w-3" />
      </div>

      <div ref={ref} className="overflow-hidden transition-transform">
        <ItemGraphic canvas={canvas} name={name} />
      </div>
    </div>
  );
};
