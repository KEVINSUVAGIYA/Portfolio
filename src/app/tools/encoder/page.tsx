"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, ArrowRightLeft, FileCode } from "lucide-react";
import Link from "next/link";

type EncodeMode = "base64" | "url" | "jwt";

function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
  } catch { return null; }
}

function formatExpiry(exp: number): string {
  const d = new Date(exp * 1000);
  const now = Date.now();
  const expired = d.getTime() < now;
  const diff = Math.abs(d.getTime() - now);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const when = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : `${mins}m ago`;
  return `${d.toLocaleString()} — ${expired ? "⛔ Expired " + when : "✅ Valid for " + when.replace(" ago", "")}`;
}

/** Pure computation — no side-effects */
function computeOutput(mode: EncodeMode, direction: "encode" | "decode", input: string): { result: string; error: string } {
  if (!input.trim()) return { result: "", error: "" };
  try {
    if (mode === "base64") {
      if (direction === "encode") {
        // Handles full Unicode safely
        const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
        return { result: encoded, error: "" };
      } else {
        const decoded = decodeURIComponent(Array.from(atob(input)).map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
        return { result: decoded, error: "" };
      }
    }
    if (mode === "url") {
      return { result: direction === "encode" ? encodeURIComponent(input) : decodeURIComponent(input), error: "" };
    }
  } catch (e: any) {
    return { result: "", error: "Invalid input: " + e.message };
  }
  return { result: "", error: "" };
}

export default function Base64Page() {
  const [mode, setMode] = useState<EncodeMode>("base64");
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState<string | null>(null);

  // Derive output purely — no side-effects during render
  const { result: output, error } = useMemo(() => computeOutput(mode, direction, input), [mode, direction, input]);
  const jwt = useMemo(() => mode === "jwt" ? decodeJWT(input) : null, [mode, input]);

  const copy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const swap = () => {
    if (!output) return;
    setInput(output);
    setDirection(d => d === "encode" ? "decode" : "encode");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center"><FileCode className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Encoder / Decoder</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Encoder / Decoder</h1>
          <p className="text-slate-400 text-sm">Base64, URL encoding, and JWT inspection — all in your browser.</p>
        </motion.div>

        {/* Mode Tabs */}
        <div className="flex gap-2 bg-slate-900 border border-white/10 rounded-xl p-1.5">
          {([["base64", "Base64"], ["url", "URL Encode"], ["jwt", "JWT Decoder"]] as const).map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setInput(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-cyan-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"}`}
            >{label}</button>
          ))}
        </div>

        {mode !== "jwt" && (
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-sm">
              {(["encode", "decode"] as const).map(d => (
                <button key={d} onClick={() => setDirection(d)}
                  className={`px-4 py-2 rounded-md font-semibold capitalize transition-colors ${direction === d ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
                >{d}</button>
              ))}
            </div>
            {input && output && (
              <button onClick={swap} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Swap
              </button>
            )}
          </div>
        )}

        {/* Input */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {mode === "jwt" ? "JWT Token" : `Input (to ${direction})`}
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "jwt" ? "Paste your JWT token here..." : `Paste text to ${direction}...`}
            className="w-full bg-slate-950 border border-white/10 text-white font-mono text-sm px-4 py-3 rounded-xl resize-none h-36 outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-700"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* Output */}
        <AnimatePresence>
          {(output || jwt) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {mode === "jwt" && jwt ? (
                <div className="space-y-3">
                  {([
                    ["Header", jwt.header, "from-blue-500 to-cyan-600"],
                    ["Payload", jwt.payload, "from-violet-500 to-purple-700"],
                  ] as const).map(([label, data, gradient]) => (
                    <div key={String(label)} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-5 h-5 rounded bg-gradient-to-br ${gradient} flex-shrink-0`} />
                        <span className="text-sm font-bold text-white">{String(label)}</span>
                        <button onClick={() => copy(JSON.stringify(data, null, 2), String(label))}
                          className="ml-auto text-slate-500 hover:text-white transition-colors">
                          {copied === String(label) ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
                      {/* Show decoded exp time if present in Payload */}
                      {String(label) === "Payload" && (data as any).exp && (
                        <p className={`mt-2 text-xs font-mono px-2 py-1 rounded-lg border ${(data as any).exp * 1000 < Date.now() ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                          exp → {formatExpiry((data as any).exp)}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-rose-600 flex-shrink-0" />
                      <span className="text-sm font-bold text-white">Signature</span>
                      <span className="ml-2 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-semibold">Not verified client-side</span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 break-all">{jwt.signature}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Output</label>
                    <button onClick={() => copy(output, "output")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      {copied === "output" ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === "output" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-white break-all whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl max-h-52 overflow-y-auto">{output}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
