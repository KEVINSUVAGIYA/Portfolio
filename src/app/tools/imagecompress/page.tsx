"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, ImageIcon, X, ZoomIn } from "lucide-react";
import Link from "next/link";

type OutputFormat = "jpeg" | "png" | "webp";

interface ImageEntry {
  name: string;
  originalSize: number;
  originalUrl: string;
  outputUrl: string;
  outputSize: number;
  w: number;
  h: number;
}

const fmtBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

function BeforeAfterSlider({ original, compressed }: { original: string; compressed: string }) {
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updateSlider(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => { updateSlider(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl cursor-ew-resize select-none bg-slate-950"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      style={{ userSelect: "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={compressed} alt="Compressed" className="w-full max-h-80 object-contain" />
      {/* Original overlay clipped to left portion */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={original} alt="Original" className="w-full max-h-80 object-contain" />
      </div>
      {/* Divider line */}
      <div className="absolute inset-y-0 pointer-events-none" style={{ left: `${sliderX}%` }}>
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize">
          <ZoomIn className="w-3.5 h-3.5 text-slate-800" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">Original</span>
      <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">Compressed</span>
    </div>
  );
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObjsRef = useRef<File[]>([]);
  const qualityDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const appendModeRef = useRef(false);


  useEffect(() => {
    return () => { images.forEach(img => { URL.revokeObjectURL(img.originalUrl); URL.revokeObjectURL(img.outputUrl); }); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent default drag/drop on the window so dropping on slider doesn't navigate away
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => { window.removeEventListener("dragover", prevent); window.removeEventListener("drop", prevent); };
  }, []);

  const compressFile = useCallback((file: File, q: number, fmt: OutputFormat): Promise<ImageEntry> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          if (fmt === "jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          else ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const mime = fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : "image/png";
          const dataUrl = canvas.toDataURL(mime, fmt === "png" ? undefined : q / 100);
          fetch(dataUrl).then(r => r.blob()).then(blob => {
            const originalUrl = URL.createObjectURL(file);
            resolve({
              name: file.name,
              originalSize: file.size,
              originalUrl,
              outputUrl: dataUrl,
              outputSize: blob.size,
              w: img.width,
              h: img.height,
            });
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const processFiles = useCallback(async (files: File[], q: number, fmt: OutputFormat, append = false) => {
    setProcessing(true);
    const entries: ImageEntry[] = [];
    for (const file of files) {
      entries.push(await compressFile(file, q, fmt));
    }
    setImages(prev => {
      if (append) return [...prev, ...entries];
      prev.forEach(img => { URL.revokeObjectURL(img.originalUrl); URL.revokeObjectURL(img.outputUrl); });
      return entries;
    });
    if (!append) setSelected(0);
    setProcessing(false);
  }, [compressFile]);

  const handleFiles = useCallback((incoming: FileList | File[], append = false) => {
    const valid = Array.from(incoming).filter(f => f.type.startsWith("image/")).slice(0, 20);
    if (!valid.length) return;
    if (append) {
      const combined = [...fileObjsRef.current, ...valid].slice(0, 20);
      fileObjsRef.current = combined;
      processFiles(valid, quality, format, true);
    } else {
      fileObjsRef.current = valid;
      processFiles(valid, quality, format, false);
    }
  }, [processFiles, quality, format]);

  const recompress = (q: number, fmt: OutputFormat) => {
    setQuality(q);
    setFormat(fmt);
    if (!fileObjsRef.current.length) return;
    if (qualityDebounceRef.current) clearTimeout(qualityDebounceRef.current);
    qualityDebounceRef.current = setTimeout(() => {
      processFiles(fileObjsRef.current, q, fmt);
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      const ext = format === "jpeg" ? "jpg" : format;
      const a = document.createElement("a");
      a.href = img.outputUrl;
      a.download = `${img.name.replace(/\.[^/.]+$/, "")}_compressed.${ext}`;
      a.click();
    });
  };

  const current = images[selected] ?? null;
  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalCompressed = images.reduce((s, i) => s + i.outputSize, 0);
  const totalSavings = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Image Compressor</span>
          {images.length > 0 && <span className="ml-auto text-xs text-slate-500">{images.length} image{images.length > 1 ? "s" : ""} · saved {totalSavings}%</span>}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { handleFiles(e.target.files!, appendModeRef.current); appendModeRef.current = false; }} />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Image Compressor</h1>
          <p className="text-slate-400 text-sm">Client-side compression. Nothing is uploaded. Drag up to 20 images at once.</p>
        </motion.div>

        {images.length === 0 && (
          <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-3xl p-16 text-center cursor-pointer transition-colors group"
          >
            <ImageIcon className="w-12 h-12 text-slate-600 group-hover:text-amber-500 transition-colors mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Drop images or click to upload</p>
            <p className="text-slate-500 text-sm">PNG, JPG, WebP · Up to 20 images · All processed in your browser</p>
          </div>
        )}

        {processing && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Compressing...</p>
          </div>
        )}

        {!processing && images.length > 0 && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white">{fmtBytes(totalOriginal)}</div>
                <div className="text-xs text-slate-500 mt-1">Total Original</div>
              </div>
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
                <div className={`text-2xl font-black ${totalSavings > 0 ? "text-emerald-400" : "text-white"}`}>{fmtBytes(totalCompressed)}</div>
                <div className="text-xs text-slate-500 mt-1">Total Compressed</div>
              </div>
              <div className={`border rounded-2xl p-4 text-center ${totalSavings > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-900 border-white/10"}`}>
                <div className={`text-2xl font-black ${totalSavings > 0 ? "text-emerald-400" : "text-slate-400"}`}>{totalSavings > 0 ? "-" : ""}{Math.abs(totalSavings)}%</div>
                <div className="text-xs text-slate-500 mt-1">Saved</div>
              </div>
            </div>

            {/* Format + Quality controls */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Output Format</label>
                <div className="flex gap-2">
                  {(["jpeg", "webp", "png"] as OutputFormat[]).map(f => (
                    <button key={f} onClick={() => recompress(quality, f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${format === f ? "bg-amber-500 border-amber-500 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                    >
                      {f}{f === "webp" && <span className="ml-1 text-[9px] opacity-70">best</span>}{f === "png" && <span className="ml-1 text-[9px] opacity-60">lossless</span>}
                    </button>
                  ))}
                </div>
              </div>
              {format !== "png" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">Quality</label>
                    <span className="font-mono text-amber-400 font-bold">{quality}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={quality} onChange={e => recompress(Number(e.target.value), format)}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-600"><span>Smaller</span><span>Higher quality</span></div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 items-end">
                {images.map((img, i) => {
                  const savings = Math.round((1 - img.outputSize / img.originalSize) * 100);
                  const ext = format === "jpeg" ? "jpg" : format;
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      <button onClick={() => setSelected(i)}
                        className={`flex-shrink-0 rounded-xl border overflow-hidden transition-all ${selected === i ? "border-amber-500 scale-105" : "border-white/10"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.outputUrl} alt={img.name} className="w-20 h-14 object-cover" />
                        <div className="bg-slate-900 px-2 py-1 text-[9px] text-center text-emerald-400 font-bold">-{savings > 0 ? savings : 0}%</div>
                      </button>
                      <a href={img.outputUrl} download={`${img.name.replace(/\.[^/.]+$/, "")}_compressed.${ext}`}
                        className="text-[9px] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-1 py-0.5 rounded text-center transition-colors font-bold"
                      >↓ Get</a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Before/After slider */}
            {current && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{current.name} · {current.w}×{current.h}px</span>
                  <span className="text-emerald-400 font-bold">{fmtBytes(current.originalSize)} → {fmtBytes(current.outputSize)} ({Math.round((1 - current.outputSize / current.originalSize) * 100)}% smaller)</span>
                </div>
                <p className="text-xs text-slate-600">← Drag slider to compare →</p>
                <BeforeAfterSlider original={current.originalUrl} compressed={current.outputUrl} />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              {images.length === 1 && current ? (
                <a href={current.outputUrl} download={`${current.name.replace(/\.[^/.]+$/, "")}_compressed.${format === "jpeg" ? "jpg" : format}`}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              ) : (
                <button onClick={downloadAll}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" /> Download All ({images.length})
                </button>
              )}
              <button onClick={() => { appendModeRef.current = true; if (fileRef.current) fileRef.current.value = ""; fileRef.current?.click(); }}
                className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors text-sm"
              >Add More</button>
              <button onClick={() => { setImages([]); fileObjsRef.current = []; if (fileRef.current) fileRef.current.value = ""; }}
                className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors text-sm"
              ><X className="w-4 h-4" /> Clear All</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
