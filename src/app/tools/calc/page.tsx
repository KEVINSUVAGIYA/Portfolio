"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, Copy, AlertCircle } from "lucide-react";
import Link from "next/link";

type Base = "HEX" | "DEC" | "OCT" | "BIN";
type BitwiseOp = "AND" | "OR" | "XOR" | "NOT" | "LSH" | "RSH" | "ROL" | "ROR";
type WordSize = 8 | 16 | 32 | 64;


const formatNumber = (val: number, base: Base): string => {
  if (isNaN(val)) return "";
  let v = val;
  if (base === "HEX") return (v >>> 0).toString(16).toUpperCase();
  if (base === "DEC") return v.toString(10);
  if (base === "OCT") return (v >>> 0).toString(8);
  if (base === "BIN") return (v >>> 0).toString(2);
  return "";
};

const parseNumber = (val: string, base: Base): number => {
  if (!val) return NaN;
  if (base === "HEX") return parseInt(val, 16);
  if (base === "DEC") return parseInt(val, 10);
  if (base === "OCT") return parseInt(val, 8);
  if (base === "BIN") return parseInt(val, 2);
  return NaN;
};

// Validate if character is allowed in a given base
const isValidChar = (char: string, base: Base) => {
  if (base === "HEX") return /^[0-9A-Fa-f]$/.test(char);
  if (base === "DEC") return /^[0-9-]$/.test(char); // Allow negative sign for DEC
  if (base === "OCT") return /^[0-7]$/.test(char);
  if (base === "BIN") return /^[01]$/.test(char);
  return false;
};

export default function ProgrammerCalcPage() {
  const [val, setVal] = useState("0");
  const [base, setBase] = useState<Base>("DEC");
  const [wordSize, setWordSize] = useState<WordSize>(32);
  const [op, setOp] = useState<BitwiseOp>("AND");
  const [valA, setValA] = useState("10");
  const [valB, setValB] = useState("5");
  const [bitwiseBase, setBitwiseBase] = useState<Base>("DEC");

  // JS bitwise ops are 32-bit; for smaller word sizes, mask lower bits
  const mask: number = wordSize >= 32 ? 0xFFFFFFFF : (1 << wordSize) - 1;

  // Derive all bases from main input
  const num = parseNumber(val, base);
  const isValid = !isNaN(num);

  const bases: { id: Base; val: string }[] = [
    { id: "HEX", val: formatNumber(num, "HEX") },
    { id: "DEC", val: formatNumber(num, "DEC") },
    { id: "OCT", val: formatNumber(num, "OCT") },
    { id: "BIN", val: formatNumber(num, "BIN") },
  ];

  const handleMainInput = (newVal: string) => {
    // Validate chars
    if (newVal !== "" && newVal !== "-") {
      const lastChar = newVal[newVal.length - 1];
      if (!isValidChar(lastChar, base)) return;
    }
    setVal(newVal);
  };

  const switchMainBase = (newBase: Base) => {
    if (newBase === base) return;
    if (isValid && val !== "") {
      const converted = formatNumber(num, newBase);
      setVal(converted);
    } else {
      setVal("");
    }
    setBase(newBase);
  };

  const getBits = (n: number) => {
    if (isNaN(n)) return Array(wordSize).fill(0);
    const bin = (n >>> 0).toString(2).padStart(wordSize, "0").slice(-wordSize);
    return bin.split("").map(Number);
  };
  const bits = getBits(num);

  // ASCII character
  const asciiChar = (!isNaN(num) && num >= 32 && num <= 126) ? String.fromCharCode(num) : null;


  // Bitwise compute
  const nA = parseNumber(valA, bitwiseBase);
  const nB = parseNumber(valB, bitwiseBase);
  let res = NaN;
  if (!isNaN(nA)) {
    if (op === "NOT") {
      res = ~nA & mask;
    } else if (!isNaN(nB)) {
      switch (op) {
        case "AND": res = (nA & nB) & mask; break;
        case "OR": res = (nA | nB) & mask; break;
        case "XOR": res = (nA ^ nB) & mask; break;
        case "LSH": res = (nA << nB) & mask; break;
        case "RSH": res = (nA >> nB) & mask; break;
        case "ROL": { const s=nB%wordSize; res=((nA<<s)|(nA>>>(wordSize-s)))&mask; break; }
        case "ROR": { const s=nB%wordSize; res=((nA>>>s)|(nA<<(wordSize-s)))&mask; break; }
      }
    }
  }

  const bitwiseResult = formatNumber(res, bitwiseBase);
  const showBitwiseError = ((valA && isNaN(nA)) || (valB && op !== "NOT" && isNaN(nB)));

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center"><Calculator className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Programmer Calc</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Programmer Calculator</h1>
          <p className="text-slate-400 text-sm">HEX/DEC/OCT/BIN · 8–64 bit word sizes · Bitwise ops + ROL/ROR · ASCII lookup</p>
        </motion.div>

        {/* Word size selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Word size:</span>
          {([8,16,32,64] as WordSize[]).map(w => (
            <button key={w} onClick={() => setWordSize(w)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${wordSize===w?"bg-indigo-600 border-indigo-600 text-white":"border-white/10 text-slate-400 hover:text-white"}`}
            >{w===8?"BYTE (8)":w===16?"WORD (16)":w===32?"DWORD (32)":"QWORD (64)"}</button>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
          <div className="flex gap-2 bg-slate-950 rounded-xl p-1 mb-6 border border-white/5">
            {bases.map(b => (
              <button key={b.id} onClick={() => switchMainBase(b.id)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${base === b.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
              >{b.id}</button>
            ))}
          </div>

          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{base}</span>
            <input value={val} onChange={e => handleMainInput(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-16 py-6 text-3xl font-black text-white font-mono outline-none focus:border-indigo-500/50 transition-colors"
            />
            {val && !isValid && val !== "-" && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">Invalid</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {bases.map(b => (
              <div key={b.id} onClick={() => navigator.clipboard.writeText(b.val)}
                className="bg-slate-950 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-indigo-500/30 transition-colors group"
                title="Click to copy"
              >
                <div className="text-[10px] text-slate-500 font-bold mb-1 flex justify-between">
                  {b.id} <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
                <div className="text-lg text-slate-300 font-mono break-all leading-tight">{b.val || "—"}</div>
              </div>
            ))}
          </div>

          {/* Bits Viewer */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{wordSize}-Bit View</p>
              {asciiChar && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">ASCII char:</span>
                  <kbd className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded font-mono font-bold text-base">{asciiChar}</kbd>
                </div>
              )}
            </div>
            <div className={`grid gap-y-2 gap-x-0.5 ${wordSize <= 8 ? "grid-cols-8" : wordSize <= 16 ? "grid-cols-8" : wordSize <= 32 ? "grid-cols-8 md:grid-cols-16" : "grid-cols-8"}`}>
              {bits.map((bit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-full py-1.5 rounded text-center text-xs font-mono transition-colors ${bit===1?"bg-indigo-500/20 text-indigo-300 border border-indigo-500/30":"bg-slate-800 text-slate-600 border border-white/5"}`}>{bit}</div>
                  {(i+1) % 8 === 0 && <div className="text-[7px] text-slate-700 mt-0.5">{wordSize-i-1}…{wordSize-i-8}</div>}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3 text-center">{wordSize}-bit unsigned view · Click any base row above to copy</p>
          </div>
        </div>

        {/* Bitwise Ops */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-slate-900 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Visual Bitwise Ops</h2>
              <div className="flex gap-1 bg-slate-950 border border-white/10 rounded-lg p-0.5">
                {(["HEX","DEC","BIN"] as Base[]).map(b => (
                  <button key={b} onClick={() => setBitwiseBase(b)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${bitwiseBase === b ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
                  >{b}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-bold">{bitwiseBase}</span>
                <input value={valA} onChange={e => setValA(e.target.value)}
                  className="w-32 bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-mono text-center outline-none focus:border-indigo-500/50" />
              </div>
              
              <select value={op} onChange={e=>setOp(e.target.value as BitwiseOp)}
                className="bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl font-bold appearance-none outline-none focus:border-indigo-500/50"
              >
                <option value="AND">AND (&amp;)</option>
                <option value="OR">OR (|)</option>
                <option value="XOR">XOR (^)</option>
                <option value="NOT">NOT (~)</option>
                <option value="LSH">LSH (&lt;&lt;)</option>
                <option value="RSH">RSH (&gt;&gt;)</option>
                <option value="ROL">ROL (rotate ←)</option>
                <option value="ROR">ROR (rotate →)</option>
              </select>

              {op !== "NOT" && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-bold">{bitwiseBase}</span>
                  <input value={valB} onChange={e => setValB(e.target.value)}
                    className="w-32 bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-mono text-center outline-none focus:border-indigo-500/50" />
                </div>
              )}

              <span className="text-xl font-bold text-slate-500">=</span>
              
              <div className={`flex-1 border rounded-xl px-4 py-3 text-white font-mono text-center font-bold min-w-[120px] ${showBitwiseError ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"}`}>
                {showBitwiseError ? "Err" : bitwiseResult || "—"}
              </div>
            </div>
            {showBitwiseError && <p className="text-xs text-red-400 mt-3">Input values contain invalid characters for {bitwiseBase} base.</p>}
          </div>

          <div className="md:col-span-4 bg-slate-900 border border-white/10 rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Logic Truth Table</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {["AND", "OR", "XOR"].map(o => (
                  <button key={o} onClick={() => setOp(o as BitwiseOp)} className={`flex-1 py-1.5 rounded text-xs font-bold ${op === o ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>{o}</button>
                ))}
              </div>
              <table className="w-full text-xs text-center border-collapse">
                <thead><tr className="border-b border-white/10 text-slate-500"><th>A</th><th>B</th><th>Res</th></tr></thead>
                <tbody>
                  {[
                    [0,0, op==="OR"?0:op==="XOR"?0:0],
                    [0,1, op==="OR"?1:op==="XOR"?1:0],
                    [1,0, op==="OR"?1:op==="XOR"?1:0],
                    [1,1, op==="OR"?1:op==="XOR"?0:1],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5"><td className="py-2 text-slate-400">{row[0]}</td><td className="text-slate-400">{row[1]}</td><td className="font-bold text-indigo-400">{row[2]}</td></tr>
                  ))}
                </tbody>
              </table>
              {op === "NOT" && <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">NOT is unary, flips all bits.</p>}
              {op === "LSH" && <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">LSH shifts bits left by B positions.</p>}
              {op === "RSH" && <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">RSH shifts bits right by B positions (preserves sign).</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
