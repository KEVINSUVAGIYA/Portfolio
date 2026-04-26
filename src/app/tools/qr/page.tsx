"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Copy, CheckCheck, QrCode, UploadCloud, Trash } from "lucide-react";
import Link from "next/link";
import { QRCode } from "react-qrcode-logo";

type Template = "url" | "wifi" | "vcard" | "email" | "text";

export default function QRGenerator() {
  const [template, setTemplate] = useState<Template>("url");
  const [copied, setCopied] = useState(false);
  const QR_CHAR_LIMIT = 2500;

  // URL / text
  const [textInput, setTextInput] = useState("");
  // WiFi
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "nopass">("WPA");
  // vCard
  const [vcName, setVcName] = useState("");
  const [vcPhone, setVcPhone] = useState("");
  const [vcEmail, setVcEmail] = useState("");
  const [vcOrg, setVcOrg] = useState("");
  // Email
  const [emailTo, setEmailTo] = useState("");
  const [emailSubj, setEmailSubj] = useState("");

  // Style
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [size, setSize] = useState(300);
  const [qrStyle, setQrStyle] = useState<"squares" | "dots">("squares");
  const [eyeRadius, setEyeRadius] = useState<number>(0);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const qrValue = (() => {
    switch (template) {
      case "wifi": {
        const passField = wifiType !== "nopass" ? `P:${wifiPass};` : "";
        return `WIFI:T:${wifiType};S:${wifiSsid};${passField};`;
      }
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcOrg}\nEND:VCARD`;
      case "email": return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubj)}`;
      default: return textInput;
    }
  })();

  const isOverLimit = qrValue.length > QR_CHAR_LIMIT;

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
    } catch {
      alert("Your browser blocks script image copying. Please use Download instead.");
    }
  };

  useEffect(() => {
    return () => { if (logoUrl) URL.revokeObjectURL(logoUrl); };
  }, [logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoUrl(URL.createObjectURL(file));
  };

  const TEMPLATES: { id: Template; label: string; emoji: string }[] = [
    { id: "url", label: "URL / Link", emoji: "🔗" },
    { id: "wifi", label: "WiFi", emoji: "📶" },
    { id: "vcard", label: "Contact", emoji: "👤" },
    { id: "email", label: "Email", emoji: "📧" },
    { id: "text", label: "Plain Text", emoji: "📝" },
  ];

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">QR Code Generator</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">QR Code Generator</h1>
              <p className="text-slate-400">WiFi, vCard, Email, URL templates · Custom colors, logos, and dot styles.</p>
            </div>

            {/* Template picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Template</label>
              <div className="flex gap-1.5 flex-wrap">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${template === t.id ? "bg-sky-600 border-sky-600 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                  >{t.emoji} {t.label}</button>
                ))}
              </div>
            </div>

            {/* Template inputs */}
            {(template === "url" || template === "text") && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {template === "url" ? "URL or Link" : "Plain Text"}
                </label>
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)}
                  placeholder={template === "url" ? "https://example.com" : "Any text content..."}
                  rows={3}
                  className="w-full bg-slate-900 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-sky-500/50 transition-all resize-none placeholder:text-slate-600"
                />
                <div className="mt-1 text-right text-xs text-slate-600 font-mono">{textInput.length}/{QR_CHAR_LIMIT}</div>
              </div>
            )}

            {template === "wifi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block font-semibold">Network Name (SSID)</label>
                    <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} placeholder="MyHomeWiFi"
                      className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block font-semibold">Security Type</label>
                    <select value={wifiType} onChange={e => setWifiType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (no password)</option>
                    </select>
                  </div>
                </div>
                {wifiType !== "nopass" && (
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block font-semibold">Password</label>
                    <input type="password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="••••••••"
                      className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-600 bg-slate-900 border border-white/5 rounded-xl p-3">
                  Scanning this QR will auto-join the WiFi network on Android & iOS (iOS 11+).
                </p>
              </div>
            )}

            {template === "vcard" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-semibold">Full Name</label>
                  <input value={vcName} onChange={e => setVcName(e.target.value)} placeholder="John Doe"
                    className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block font-semibold">Phone</label>
                    <input value={vcPhone} onChange={e => setVcPhone(e.target.value)} placeholder="+1 555 0000"
                      className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block font-semibold">Email</label>
                    <input value={vcEmail} onChange={e => setVcEmail(e.target.value)} placeholder="john@example.com"
                      className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-semibold">Organization (optional)</label>
                  <input value={vcOrg} onChange={e => setVcOrg(e.target.value)} placeholder="Acme Corp"
                    className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>
            )}

            {template === "email" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-semibold">To (email address)</label>
                  <input value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="recipient@example.com"
                    className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-semibold">Subject (optional)</label>
                  <input value={emailSubj} onChange={e => setEmailSubj(e.target.value)} placeholder="Hello!"
                    className="w-full bg-slate-900 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>
            )}

            {isOverLimit && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                ⚠️ Content too long ({qrValue.length}/{QR_CHAR_LIMIT} chars). Shorten or use a URL shortener.
              </div>
            )}

            {/* Style section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/30 p-4 rounded-2xl border border-white/5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Color Theme</label>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {presets.map((p) => (
                    <button key={p.label} onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                      className="px-2 py-1 rounded-md border text-[10px] font-medium transition-all"
                      style={{ backgroundColor: p.bg, color: p.fg, borderColor: fgColor === p.fg && bgColor === p.bg ? p.fg : "rgba(255,255,255,0.1)" }}
                    >{p.label}</button>
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
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Module Shape</label>
                <div className="flex gap-2 mb-4 bg-slate-950 p-1.5 rounded-lg border border-white/5">
                  <button onClick={() => setQrStyle("squares")} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${qrStyle === "squares" ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-white"}`}>Squares</button>
                  <button onClick={() => setQrStyle("dots")} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${qrStyle === "dots" ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:text-white"}`}>Dots</button>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 flex justify-between">Eye Radius <span>{eyeRadius}px</span></label>
                    <input type="range" min={0} max={25} value={eyeRadius} onChange={(e) => setEyeRadius(Number(e.target.value))} className="w-full accent-sky-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 flex justify-between">Export Size <span>{size}px</span></label>
                    <input type="range" min={200} max={1200} step={50} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-sky-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-slate-900/30 p-4 rounded-2xl border border-white/5">
              <label className="block text-sm font-medium text-slate-300 mb-3">Center Logo (optional)</label>
              {logoUrl ? (
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-white/5 rounded-lg p-1" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-300 font-medium">Custom Logo Active</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">High error-correction applied to keep QR scannable</p>
                  </div>
                  <button onClick={() => setLogoUrl("")} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900 hover:border-sky-500/30 transition-all">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <UploadCloud className="w-5 h-5" />
                    <span><span className="font-semibold text-sky-400">Click to upload</span> a logo or icon</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-6 sticky top-24">
            <div className="w-full aspect-square max-w-sm rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden transition-colors duration-300 p-8 shadow-2xl relative"
              style={{ backgroundColor: bgColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              {qrValue.trim() && !isOverLimit ? (
                <motion.div
                  key={qrValue + fgColor + bgColor + qrStyle + eyeRadius + logoUrl}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden p-3"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCode
                    id="qr-code-canvas"
                    value={qrValue}
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
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Fill in the form to generate</p>
                </div>
              )}
            </div>

            {qrValue.trim() && !isOverLimit && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 w-full max-w-sm">
                <button onClick={download}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:opacity-90 transition-all text-sm font-semibold shadow-lg shadow-sky-500/20"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button onClick={copyImage}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                  {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
            <p className="text-xs text-slate-600 text-center">All generation is done client-side. Nothing is sent to any server.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
