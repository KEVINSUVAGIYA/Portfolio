"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Copy, CheckCheck, QrCode } from "lucide-react";
import Link from "next/link";

export default function QRGenerator() {
  const [input, setInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [size, setSize] = useState(300);
  // Separate "preview" colors — only applied when Generate is clicked
  const [previewFg, setPreviewFg] = useState("#ffffff");
  const [previewBg, setPreviewBg] = useState("#0f172a");

  const generate = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    // Apply current color selections to preview on generate
    setPreviewFg(fgColor);
    setPreviewBg(bgColor);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(input.trim(), {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(url);
    } finally {
      setGenerating(false);
    }
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const copyImage = async () => {
    if (!qrDataUrl) return;
    const res = await fetch(qrDataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "Dark", fg: "#ffffff", bg: "#0f172a" },
    { label: "Light", fg: "#0f172a", bg: "#ffffff" },
    { label: "Violet", fg: "#a78bfa", bg: "#1e1b4b" },
    { label: "Emerald", fg: "#34d399", bg: "#022c22" },
    { label: "Amber", fg: "#fbbf24", bg: "#1c1400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">QR Code Generator</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">QR Code Generator</h1>
              <p className="text-slate-400">Generate a QR code for any URL, text, or contact info. Instant, free, no upload.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">URL or Text</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com or any text…"
                rows={3}
                className="w-full bg-slate-900 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10 transition-all resize-none placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color Theme</label>
              <div className="flex gap-2 flex-wrap">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                    className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
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
              <div className="flex gap-4 mt-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Foreground</label>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Background</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Size: {size}px</label>
                  <input
                    type="range" min={150} max={600} value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-sky-500 mt-2"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={!input.trim() || generating}
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20"
            >
              {generating ? "Generating…" : "Generate QR Code"}
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-full aspect-square max-w-xs rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden transition-colors duration-300"
              style={{ backgroundColor: qrDataUrl ? previewBg : "#0f172a" }}
            >
              {qrDataUrl ? (
                <motion.img
                  key={qrDataUrl}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center p-8 opacity-30">
                  <QrCode className="w-16 h-16 mx-auto mb-3 text-slate-500" />
                  <p className="text-sm text-slate-500">Enter text and click Generate</p>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 w-full max-w-xs"
              >
                <button
                  onClick={download}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  onClick={copyImage}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                  {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
