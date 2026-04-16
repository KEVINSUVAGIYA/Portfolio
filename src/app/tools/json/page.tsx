"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, Braces, AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";

type JsonNode = { key?: string; value: unknown; depth: number; path: string };

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const renderValue = (value: unknown, key?: string, path = ""): React.ReactNode => {
    const indent = depth * 16;
    const isCollapsed = collapsed.has(path);

    if (value === null) return <span className="text-rose-400">null</span>;
    if (typeof value === "boolean") return <span className="text-amber-400">{String(value)}</span>;
    if (typeof value === "number") return <span className="text-sky-400">{String(value)}</span>;
    if (typeof value === "string") return <span className="text-emerald-400">&quot;{value}&quot;</span>;

    if (Array.isArray(value)) {
      return (
        <div>
          <span className="cursor-pointer text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1" onClick={() => toggle(path)}>
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            [{value.length}]
          </span>
          {!isCollapsed && (
            <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-0.5">
              {value.map((item, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-slate-600">{i}:</span>
                  {renderValue(item, undefined, `${path}.${i}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <div>
          <span className="cursor-pointer text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1" onClick={() => toggle(path)}>
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {`{${entries.length}}`}
          </span>
          {!isCollapsed && (
            <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-0.5">
              {entries.map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm flex-wrap">
                  <span className="text-rose-300 flex-shrink-0">&quot;{k}&quot;:</span>
                  {renderValue(v, k, `${path}.${k}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return String(value);
  };

  return <div className="font-mono text-sm">{renderValue(data, undefined, "root")}</div>;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [parsed, setParsed] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"formatted" | "tree">("formatted");
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setFormatted(JSON.stringify(obj, null, indent));
      setParsed(obj);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setFormatted("");
      setParsed(null);
    }
  }, [input, indent]);

  const minify = () => {
    try {
      const obj = JSON.parse(input);
      setFormatted(JSON.stringify(obj));
      setParsed(obj);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    const example = JSON.stringify({
      name: "Kevin Suvagiya",
      role: "Salesforce Developer",
      skills: ["Apex", "LWC", "React", "Next.js"],
      experience: { years: 3, certifications: 7 },
      active: true,
    });
    setInput(example);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Braces className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">JSON Formatter</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">JSON Formatter & Validator</h1>
            <p className="text-slate-400">Paste JSON to format, validate, and explore as a tree. Runs entirely in the browser.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadExample} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs">
              Load Example
            </button>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Input JSON</span>
              <button onClick={() => { setInput(""); setFormatted(""); setParsed(null); setError(null); }} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") format(); }}
              placeholder={'{\n  "paste": "your JSON here"\n}'}
              className="flex-1 min-h-[420px] bg-slate-900 border border-white/10 text-emerald-300 px-4 py-4 rounded-xl text-sm font-mono outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none placeholder:text-slate-700"
            />
            <div className="flex gap-2">
              <button onClick={format} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg shadow-amber-500/20">
                Format ⌘↵
              </button>
              <button onClick={minify} className="px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm">
                Minify
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400">Output</span>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-rose-400 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON
                    </motion.div>
                  )}
                  {!error && formatted && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                {parsed && (
                  <div className="flex gap-1">
                    {(["formatted", "tree"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${view === v ? "bg-amber-500/20 text-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
                {formatted && (
                  <button onClick={copy} className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-[420px] bg-slate-900 border border-white/10 rounded-xl overflow-auto">
              {error && (
                <div className="p-6">
                  <div className="flex items-start gap-3 text-rose-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Parse Error</p>
                      <p className="text-rose-400/70 text-xs mt-1 font-mono">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              {!error && !formatted && (
                <div className="h-full flex items-center justify-center text-slate-700 text-sm">
                  Formatted output appears here
                </div>
              )}
              {!error && formatted && (
                <div className="p-4 h-full">
                  {view === "formatted" ? (
                    <pre className="font-mono text-sm text-emerald-300 whitespace-pre-wrap break-all">{formatted}</pre>
                  ) : (
                    <JsonTree data={parsed} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
