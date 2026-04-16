"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  noRepeating: boolean;
}

function generatePassword(length: number, options: PasswordOptions): string {
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  if (options.excludeAmbiguous) {
    upper = upper.replace(/[OI]/g, "");
    lower = lower.replace(/[oil]/g, "");
    numbers = numbers.replace(/[01]/g, "");
  }

  let pool = "";
  if (options.upper) pool += upper;
  if (options.lower) pool += lower;
  if (options.numbers) pool += numbers;
  if (options.symbols) pool += symbols;
  if (!pool) pool = lower + numbers;

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pwd = Array.from(arr, (n) => pool[n % pool.length]).join("");

    if (options.noRepeating) {
      const hasRepeat = /(.)\1/.test(pwd);
      if (hasRepeat) continue;
    }

    // Ensure at least one of each required type
    const hasUpper = !options.upper || /[A-Z]/.test(pwd);
    const hasLower = !options.lower || /[a-z]/.test(pwd);
    const hasNumber = !options.numbers || /[0-9]/.test(pwd);
    const hasSymbol = !options.symbols || /[^A-Za-z0-9]/.test(pwd);
    if (hasUpper && hasLower && hasNumber && hasSymbol) return pwd;
  }
  // Fallback if exhausted
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => pool[n % pool.length]).join("");
}

function generatePassphrase(wordCount: number): string {
  const words = [
    "apple","brave","coral","dance","eagle","flame","grape","honey","ivory","joker",
    "kite","lemon","maple","night","ocean","piano","queen","river","stone","tiger",
    "ultra","vivid","waltz","xenon","yacht","zebra","amber","blaze","chess","drift",
    "elder","feast","ghost","haven","inbox","jewel","knack","laser","marsh","noble",
    "olive","plum","quest","radar","solar","torch","unite","vapor","wheat","youth",
  ];
  const separators = ["-", ".", "_", "!", "#"];
  const sep = separators[Math.floor(Math.random() * separators.length)];
  const arr = new Uint32Array(wordCount);
  crypto.getRandomValues(arr);
  const phrase = Array.from(arr, (n) => words[n % words.length]);
  // Add a number at end for better strength
  const numArr = new Uint32Array(1);
  crypto.getRandomValues(numArr);
  phrase.push(String(numArr[0] % 100));
  return phrase.join(sep);
}

function getStrength(password: string): { label: string; color: string; score: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 3) return { label: "Weak", color: "#ef4444", score };
  if (score <= 5) return { label: "Fair", color: "#f59e0b", score };
  if (score <= 6) return { label: "Good", color: "#10b981", score };
  return { label: "Strong", color: "#06b6d4", score };
}

type Mode = "random" | "passphrase";

export default function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>("random");
  const [length, setLength] = useState(20);
  const [wordCount, setWordCount] = useState(4);
  const [options, setOptions] = useState<PasswordOptions>({
    upper: true, lower: true, numbers: true, symbols: true,
    excludeAmbiguous: false, noRepeating: false,
  });
  const [password, setPassword] = useState(() =>
    generatePassword(20, { upper: true, lower: true, numbers: true, symbols: true, excludeAmbiguous: false, noRepeating: false })
  );
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const pwd = mode === "random" ? generatePassword(length, options) : generatePassphrase(wordCount);
    setPassword(pwd);
    setHistory((prev) => [pwd, ...prev.slice(0, 4)]);
  }, [mode, length, options, wordCount]);

  const copy = (text = password) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggle = (key: keyof PasswordOptions) => setOptions((o) => ({ ...o, [key]: !o[key] }));
  const strength = getStrength(password);

  const charOptionLabels: { key: keyof PasswordOptions; label: string; preview: string }[] = [
    { key: "upper", label: "Uppercase", preview: "A-Z" },
    { key: "lower", label: "Lowercase", preview: "a-z" },
    { key: "numbers", label: "Numbers", preview: "0-9" },
    { key: "symbols", label: "Symbols", preview: "!@#" },
    { key: "excludeAmbiguous", label: "Exclude Ambiguous", preview: "no 0/O/l/1" },
    { key: "noRepeating", label: "No Repeating", preview: "no aa,11" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Password Generator</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Password Generator</h1>
          <p className="text-slate-400 text-sm">Cryptographically secure. Nothing leaves your browser.</p>
        </motion.div>

        {/* Mode tabs */}
        <div className="flex gap-2 bg-slate-900/60 border border-white/10 rounded-xl p-1.5">
          {(["random", "passphrase"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-rose-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"}`}
            >
              {m === "random" ? "🔐 Random" : "🔑 Passphrase"}
            </button>
          ))}
        </div>

        {/* Password display — visible by default */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="flex-1 font-mono text-lg text-white break-all leading-relaxed tracking-wider select-all cursor-text">
              {password}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => copy()}
                title="Copy to clipboard"
                className="p-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={generate}
                title="Regenerate"
                className="p-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Strength */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">Strength</span>
              <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(strength.score / 8) * 100}%` }}
                style={{ backgroundColor: strength.color }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-6">
          {mode === "random" ? (
            <>
              {/* Length */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Length</label>
                  <span className="text-sm font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg">{length} chars</span>
                </div>
                <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-rose-500" />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>8</span><span>32</span><span>64</span><span>128</span>
                </div>
              </div>

              {/* Character options */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Options</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {charOptionLabels.map(({ key, label, preview }) => (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm text-left ${
                        options[key]
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                          : "border-white/10 bg-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <span className="font-medium">{label}</span>
                        <span className={`block text-xs mt-0.5 ${options[key] ? "text-rose-400/70" : "text-slate-600"}`}>{preview}</span>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${options[key] ? "border-rose-500 bg-rose-500" : "border-slate-600"}`}>
                        {options[key] && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Passphrase controls */
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Number of Words</label>
                <span className="text-sm font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg">{wordCount} words</span>
              </div>
              <input type="range" min={3} max={8} value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className="w-full accent-rose-500" />
              <p className="text-xs text-slate-500 mt-3">Words joined with a separator + a number. Easy to remember, hard to crack.</p>
            </div>
          )}

          <button
            onClick={generate}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Password
          </button>
        </div>

        {/* History */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">Recent (this session)</p>
              {history.map((pwd, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 gap-3">
                  <p className="font-mono text-sm text-slate-500 truncate">{pwd}</p>
                  <button onClick={() => copy(pwd)} className="text-slate-600 hover:text-white transition-colors flex-shrink-0">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-slate-700 text-center">Generated via crypto.getRandomValues() · Never stored or sent · Runs 100% in your browser</p>
      </div>
    </div>
  );
}
