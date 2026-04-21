"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Copy, CheckCheck, QrCode, UploadCloud, Trash } from "lucide-react";
import Link from "next/link";
import { QRCode } from "react-qrcode-logo";

export default function QRGenerator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const QR_CHAR_LIMIT = 900; // Safe limit for M error-correction level
  const isOverLimit = input.length > QR_CHAR_LIMIT;
  
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [size, setSize] = useState(300);
  
  const [qrStyle, setQrStyle] = useState<"squares" | "dots">("squares");
  const [eyeRadius, setEyeRadius] = useState<number>(0);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const download = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const copyImage = async () => {
    try {
      const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
      if (!canvas) return;
      
      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("Export failed");
      
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e: any) {
      console.error("Clipboard copy failed:", e);
      alert("Your browser blocks direct script image copying. Please use the Download Result button instead!");
    }
  };

  const presets = [
    { label: "Dark", fg: "#ffffff", bg: "#0f172a" },
    { label: "Light", fg: "#0f172a", bg: "#ffffff" },
    { label: "Violet", fg: "#a78bfa", bg: "#1e1b4b" },
    { label: "Emerald", fg: "#34d399", bg: "#022c22" },
    { label: "Amber", fg: "#fbbf24", bg: "#1c1400" },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Rich QR Generator</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">QR Code Generator</h1>
              <p className="text-slate-400">Personalize a QR code with logos, rounded corners, dots, and colors. Real-time preview!</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">URL or Text</label>
                <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : "text-slate-500"}`}>
                  {input.length}/{QR_CHAR_LIMIT}
                </span>
              </div>
              {isOverLimit && (
                <div className="mb-2 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                  <span>⚠️</span> Input too long — QR codes support up to ~{QR_CHAR_LIMIT} characters. Shorten your text or use a URL shortener.
                </div>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com or any text…"
                rows={3}
                className={`w-full bg-slate-900 border text-white px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all resize-none placeholder:text-slate-600 ${
                  isOverLimit
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                    : "border-white/10 focus:border-sky-500/50 focus:ring-sky-500/10"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/30 p-4 rounded-2xl border border-white/5">
              {/* Color Block */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Color Theme</label>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                      className="px-2 py-1 rounded-md border text-[10px] font-medium transition-all"
                      style={{
                        backgroundColor: p.bg,
                        color: p.fg,
                        borderColor: fgColor === p.fg && bgColor === p.bg ? p.fg : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">Foreground</label>
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-8 rounded border border-white/10 cursor-pointer bg-transparent" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">Background</label>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 rounded border border-white/10 cursor-pointer bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Style Block */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Module Shape</label>
                <div className="flex gap-2 mb-4 bg-slate-950 p-1.5 rounded-lg border border-white/5">
                  <button onClick={() => setQrStyle("squares")} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${qrStyle === "squares" ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-white"}`}>Squares</button>
                  <button onClick={() => setQrStyle("dots")} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${qrStyle === "dots" ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-white"}`}>Dots</button>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 flex justify-between">Edge Radius <span>{eyeRadius}px</span></label>
                    <input
                      type="range" min={0} max={25} value={eyeRadius}
                      onChange={(e) => setEyeRadius(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 flex justify-between">Export Size <span>{size}px</span></label>
                    <input
                      type="range" min={200} max={1200} step={50} value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Customization */}
            <div className="bg-slate-900/30 p-4 rounded-2xl border border-white/5">
              <label className="block text-sm font-medium text-slate-300 mb-3">Center Logo</label>
              {logoUrl ? (
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/10">
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-white/5 rounded-lg p-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-300 font-medium">Custom Logo Active</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Will be placed natively in the center of the QR matrix</p>
                  </div>
                  <button onClick={() => setLogoUrl("")} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900 hover:border-sky-500/30 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                      <UploadCloud className="w-6 h-6 mb-2" />
                      <p className="text-xs"><span className="font-semibold text-sky-400">Click to upload</span> a logo or icon</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                </div>
              )}
            </div>

          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-6 sticky top-24">
            <div
              className="w-full aspect-square max-w-sm rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden transition-colors duration-300 p-8 shadow-2xl relative"
              style={{ backgroundColor: bgColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              {input.trim() && !isOverLimit ? (
                <motion.div
                  key={input + fgColor + bgColor + qrStyle + eyeRadius + logoUrl}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center bg-white rounded-xl overflow-hidden p-3"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCode
                    id="qr-code-canvas"
                    value={input}
                    size={size}
                    style={{ width: "100%", height: "auto", maxWidth: "300px" }}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    qrStyle={qrStyle}
                    eyeRadius={eyeRadius}
                    logoImage={logoUrl}
                    logoWidth={Math.floor(size * 0.22)}
                    logoHeight={Math.floor(size * 0.22)}
                    logoPaddingStyle="circle"
                    removeQrCodeBehindLogo={!!logoUrl}
                    ecLevel={logoUrl ? "H" : "M"}
                  />
                </motion.div>
              ) : (
                <div className="text-center opacity-30">
                  <QrCode className="w-20 h-20 mx-auto mb-4 text-slate-500" />
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Enter text to view</p>
                </div>
              )}
            </div>

            {input.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 w-full max-w-sm"
              >
                <button
                  onClick={download}
                  className="flex-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:opacity-90 transition-all text-sm font-semibold shadow-lg shadow-sky-500/20"
                >
                  <Download className="w-4 h-4" /> Download Result PNG
                </button>
                <button
                  onClick={copyImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                  {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
            <p className="text-xs text-slate-500 mt-2">Matrix dynamically maps and encodes your logo cleanly avoiding block overlapping seamlessly.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
