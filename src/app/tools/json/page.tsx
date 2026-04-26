"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Copy, CheckCheck, Braces, AlertCircle, CheckCircle2,
  ChevronRight, ChevronDown, Search, GitCompare, Minimize2, Maximize2
} from "lucide-react";
import Link from "next/link";

// ── Tree renderer ──────────────────────────────────────────────────────────
function JsonTree({ data, searchTerm, expandAllCount }: { data: unknown; searchTerm: string; expandAllCount: number }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Reset collapsed when expandAllCount changes
  useMemo(() => {
    if (expandAllCount > 0) setCollapsed(new Set());
  }, [expandAllCount]);

  // Collapse all
  const handleCollapseAll = () => {
    const allPaths = new Set<string>();
    const traverse = (val: unknown, path: string) => {
      if (val && typeof val === "object") {
        allPaths.add(path);
        if (Array.isArray(val)) val.forEach((v, i) => traverse(v, `${path}.${i}`));
        else Object.entries(val).forEach(([k, v]) => traverse(v, `${path}.${k}`));
      }
    };
    traverse(data, "root");
    setCollapsed(allPaths);
  };

  const toggle = (path: string) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(path) ? next.delete(path) : next.add(path);
    return next;
  });

  const highlight = (text: string) => {
    if (!searchTerm) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return <span>{text.slice(0, idx)}<mark className="bg-amber-400/30 text-amber-200 rounded px-0.5">{text.slice(idx, idx + searchTerm.length)}</mark>{text.slice(idx + searchTerm.length)}</span>;
  };

  const renderValue = (value: unknown, path = ""): React.ReactNode => {
    const isCollapsed = collapsed.has(path);
    if (value === null) return <span className="text-rose-400 font-semibold">null</span>;
    if (typeof value === "boolean") return <span className={`font-bold ${value ? "text-emerald-400" : "text-red-400"}`}>{String(value)}</span>;
    if (typeof value === "number") return <span className="text-sky-300 font-semibold">{String(value)}</span>;
    if (typeof value === "string") return <span className="text-amber-300">&quot;{highlight(value)}&quot;</span>;

    if (Array.isArray(value)) return (
      <div>
        <span className="cursor-pointer text-violet-400 hover:text-violet-200 transition-colors inline-flex items-center gap-1 font-bold bg-violet-500/10 px-1.5 py-0.5 rounded" onClick={() => toggle(path)}>
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Array [{value.length}]
        </span>
        {!isCollapsed && (
          <div className="ml-4 border-l-2 border-violet-500/30 pl-4 mt-1.5 space-y-1">
            {value.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm items-start">
                <span className="text-slate-500 font-mono text-xs mt-0.5 w-4 flex-shrink-0">{i}</span>
                {renderValue(item, `${path}.${i}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <div>
          <span className="cursor-pointer text-indigo-400 hover:text-indigo-200 transition-colors inline-flex items-center gap-1 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded" onClick={() => toggle(path)}>
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Object {`{${entries.length}}`}
          </span>
          {!isCollapsed && (
            <div className="ml-4 border-l-2 border-indigo-500/30 pl-4 mt-1.5 space-y-1">
              {entries.map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm flex-wrap items-start">
                  <span className="text-rose-300 font-semibold flex-shrink-0">&quot;{highlight(k)}&quot;:</span>
                  {renderValue(v, `${path}.${k}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return <span className="text-slate-300">{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm leading-relaxed relative pt-8">
      <div className="absolute top-0 right-0 flex gap-2">
        <button onClick={() => setCollapsed(new Set())} className="text-[10px] bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded">Expand All</button>
        <button onClick={handleCollapseAll} className="text-[10px] bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded">Collapse All</button>
      </div>
      {renderValue(data, "root")}
    </div>
  );
}

// ── Diff highlighter ───────────────────────────────────────────────────────
function diffLines(a: string, b: string) {
  const la = a.split("\n");
  const lb = b.split("\n");
  const maxLen = Math.max(la.length, lb.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    left: la[i] ?? "",
    right: lb[i] ?? "",
    changed: la[i] !== lb[i],
  }));
}

type ViewMode = "formatted" | "tree" | "diff";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [diffInput, setDiffInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [view, setView] = useState<ViewMode>("formatted");
  const [copied, setCopied] = useState(false);
  const [copiedMinify, setCopiedMinify] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [lastValidObj, setLastValidObj] = useState<unknown>(null);
  const [expandAllCount, setExpandAllCount] = useState(0);

  const sortKeysFn = useCallback((o: any): any => {
    if (Array.isArray(o)) return o.map(sortKeysFn);
    if (o !== null && typeof o === "object") {
      return Object.keys(o).sort().reduce((acc, k) => { acc[k] = sortKeysFn(o[k]); return acc; }, {} as any);
    }
    return o;
  }, []);

  const parsed = useMemo(() => {
    if (!input.trim()) return { obj: null, error: null, formatted: "" };
    try {
      let obj = JSON.parse(input);
      if (sortAlphabetical) obj = sortKeysFn(obj);
      return { obj, error: null, formatted: JSON.stringify(obj, null, indent) };
    } catch (e) {
      return { obj: null, error: (e as Error).message, formatted: "" };
    }
  }, [input, indent, sortAlphabetical, sortKeysFn]);

  // Keep last valid object mounted for the tree to avoid collapse reset
  useEffect(() => {
    if (parsed.obj !== null) setLastValidObj(parsed.obj);
  }, [parsed.obj]);

  const parsedDiff = useMemo(() => {
    if (!diffInput.trim()) return { obj: null, error: null, formatted: "" };
    try {
      let obj = JSON.parse(diffInput);
      if (sortAlphabetical) obj = sortKeysFn(obj);
      return { obj, error: null, formatted: JSON.stringify(obj, null, indent) };
    } catch (e) {
      return { obj: null, error: (e as Error).message, formatted: "" };
    }
  }, [diffInput, indent, sortAlphabetical, sortKeysFn]);

  const minified = useMemo(() => {
    if (!parsed.obj) return "";
    return JSON.stringify(parsed.obj);
  }, [parsed.obj]);

  const diffResult = useMemo(() => {
    if (!parsed.formatted || !parsedDiff.formatted) return [];
    return diffLines(parsed.formatted, parsedDiff.formatted);
  }, [parsed.formatted, parsedDiff.formatted]);

  const changedLines = diffResult.filter(l => l.changed).length;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMinify = () => {
    if (!minified) return;
    navigator.clipboard.writeText(minified);
    setCopiedMinify(true);
    setTimeout(() => setCopiedMinify(false), 1500);
  };

  const copyFormatted = () => {
    if (!parsed.formatted) return;
    navigator.clipboard.writeText(parsed.formatted);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 1500);
  };

  // Search filter — count occurrences in formatted JSON
  const searchMatches = useMemo(() => {
    if (!searchTerm || !parsed.formatted) return 0;
    const lower = parsed.formatted.toLowerCase();
    const needle = searchTerm.toLowerCase();
    let count = 0, pos = 0;
    while ((pos = lower.indexOf(needle, pos)) !== -1) { count++; pos += needle.length; }
    return count;
  }, [searchTerm, parsed.formatted]);

  const EXAMPLE = JSON.stringify({
    name: "Kevin Suvagiya", role: "Full Stack Developer",
    skills: ["Apex", "LWC", "React", "Next.js", "TypeScript"],
    experience: { years: 3, certifications: 7 },
    active: true, rating: 9.5,
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Braces className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">JSON Formatter</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 flex-wrap">
            {parsed.obj !== null && (
              <AnimatePresence mode="wait">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
                </motion.div>
              </AnimatePresence>
            )}
            {parsed.error && (
              <span className="text-red-400 text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Invalid</span>
            )}
            <select value={indent} onChange={e => setIndent(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
            <button onClick={() => setSortAlphabetical(s => !s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sortAlphabetical ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"}`}
            >Sort Keys {sortAlphabetical ? "On" : "Off"}</button>
            <button onClick={() => { setInput(EXAMPLE); }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs"
            >Load Example</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white mb-1">JSON Formatter & Validator</h1>
          <p className="text-slate-400 text-sm">Format · Minify · Tree Explorer · Diff · JSONPath Search — all in the browser.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Input JSON</span>
              <button onClick={() => { setInput(""); }} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'{\n  "paste": "your JSON here"\n}'}
              className="flex-1 min-h-[400px] bg-slate-900 border border-white/10 text-emerald-300 px-4 py-4 rounded-xl text-sm font-mono outline-none focus:border-amber-500/40 transition-all resize-none placeholder:text-slate-700"
            />

            {view === "diff" && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-400">Compare JSON (B)</span>
                <textarea
                  value={diffInput}
                  onChange={e => setDiffInput(e.target.value)}
                  placeholder={'{\n  "compare": "with this JSON"\n}'}
                  className="min-h-[200px] bg-slate-900 border border-white/10 text-violet-300 px-4 py-4 rounded-xl text-sm font-mono outline-none focus:border-violet-500/40 transition-all resize-none placeholder:text-slate-700"
                />
                {parsedDiff.error && <p className="text-red-400 text-xs font-mono">{parsedDiff.error}</p>}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button onClick={copyFormatted} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg shadow-amber-500/20">
                {copiedFormat ? "✓ Copied!" : "Copy Formatted"}
              </button>
              <button onClick={copyMinify} disabled={!minified}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition-all text-sm"
                title="Copy minified JSON"
              >
                <Minimize2 className="w-4 h-4" /> {copiedMinify ? "Copied!" : "Minify"}
              </button>
            </div>
            {parsed.error && (
              <div className="flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Parse Error</p>
                  <p className="text-rose-400/70 text-xs mt-1 font-mono">{parsed.error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Output column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm font-semibold text-slate-400">Output</span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* View mode */}
                {parsed.obj !== null && (
                  <div className="flex gap-1 p-1 bg-slate-800 rounded-lg border border-white/10">
                    {([
                      { id: "formatted" as const, label: "{ } Format", icon: Maximize2 },
                      { id: "tree" as const, label: "🌲 Tree", icon: null },
                      { id: "diff" as const, label: "Diff", icon: GitCompare },
                    ]).map(v => (
                      <button key={v.id} onClick={() => setView(v.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${view === v.id ? "bg-amber-500 text-white shadow-md" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                      >
                        {v.icon && <v.icon className="w-3 h-3" />}{v.label}
                        {v.id === "diff" && changedLines > 0 && <span className="ml-1 text-[9px] bg-red-500 text-white px-1 rounded-full">{changedLines}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {parsed.formatted && (
                  <button onClick={() => copy(parsed.formatted)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            {/* Search bar — only for tree/formatted */}
            {parsed.obj !== null && view !== "diff" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search keys and values..."
                  className="w-full bg-slate-900 border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-amber-500/40 transition-colors"
                />
                {searchTerm && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-semibold">
                    {searchMatches} hit{searchMatches !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}

            <div className="flex-1 min-h-[400px] bg-slate-900 border border-white/10 rounded-xl overflow-auto">
              {!parsed.formatted && !parsed.error && (
                <div className="h-full flex items-center justify-center text-slate-700 text-sm">Formatted output appears here</div>
              )}

              {parsed.formatted && view === "formatted" && (
                <pre className="p-4 font-mono text-sm text-emerald-300 whitespace-pre-wrap break-all">{parsed.formatted}</pre>
              )}

              {lastValidObj !== null && view === "tree" && (
                <div className="p-4"><JsonTree data={lastValidObj} searchTerm={searchTerm} expandAllCount={expandAllCount} /></div>
              )}

              {view === "diff" && (
                <div className="overflow-x-auto">
                  {!parsed.formatted && !parsedDiff.formatted ? (
                    <div className="h-full flex items-center justify-center text-slate-700 text-sm p-8">Paste JSON in both panels to diff them.</div>
                  ) : (
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="p-2 text-left text-slate-500 font-semibold w-1/2">JSON A</th>
                          <th className="p-2 text-left text-slate-500 font-semibold w-1/2">JSON B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diffResult.map((row, i) => (
                          <tr key={i} className={row.changed ? "bg-amber-500/5" : ""}>
                            <td className={`p-1.5 px-3 border-r border-white/5 whitespace-pre-wrap break-all align-top ${row.changed ? "text-red-300 bg-red-500/10" : "text-slate-400"}`}>{row.left}</td>
                            <td className={`p-1.5 px-3 whitespace-pre-wrap break-all align-top ${row.changed ? "text-emerald-300 bg-emerald-500/10" : "text-slate-400"}`}>{row.right}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            {parsed.formatted && (
              <div className="flex gap-4 text-xs text-slate-600">
                <span>{parsed.formatted.split("\n").length} lines</span>
                <span>{new TextEncoder().encode(parsed.formatted).length} bytes</span>
                <span>{new TextEncoder().encode(minified).length} bytes minified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
