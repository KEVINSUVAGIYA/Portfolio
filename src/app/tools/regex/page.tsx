"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, AlertCircle, Regex, Code2, FlaskConical, BookOpen, ChevronDown } from "lucide-react";
import Link from "next/link";

const QUICK_INSERTS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s]+" },
  { label: "Phone", pattern: "\\+?[1-9]\\d{1,14}" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { label: "Date YYYY-MM-DD", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { label: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})" },
  { label: "Digits Only", pattern: "^\\d+$" },
  { label: "Word Boundary", pattern: "\\b\\w+\\b" },
  { label: "JWT Token", pattern: "[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+" },
  { label: "Slug", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
];

const FLAG_INFO: Record<string, string> = {
  g: "Global — find all matches, not just first",
  m: "Multiline — ^ and $ match line starts/ends",
  i: "Case insensitive — A matches a",
  s: "DotAll — . also matches newlines (\\n)",
};

const MAX_MATCHES = 100;
const EXEC_TIMEOUT_MS = 500;

function safeExec(pattern: string, flags: string, text: string): { matches: { text: string; index: number; groups: string[] }[]; timedOut: boolean } {
  const results: { text: string; index: number; groups: string[] }[] = [];
  const deadline = performance.now() + EXEC_TIMEOUT_MS;
  try {
    const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    let m: RegExpExecArray | null;
    while ((m = r.exec(text)) !== null) {
      if (performance.now() > deadline) return { matches: results, timedOut: true };
      results.push({ text: m[0], index: m.index, groups: m.slice(1) });
      if (results.length >= MAX_MATCHES) break;
      if (!flags.includes("g")) break;
      if (m[0].length === 0) r.lastIndex++;
    }
  } catch { /* ignore */ }
  return { matches: results, timedOut: false };
}

// Plain-English explainer
function explainPattern(pattern: string): string[] {
  if (!pattern) return [];
  const parts: string[] = [];
  const rules: [RegExp, string][] = [
    [/^\^/, "String must start here"],
    [/\$$/, "String must end here"],
    [/\.\+/, "One or more of any character (except newline)"],
    [/\.\*/, "Zero or more of any character (except newline)"],
    [/\.\?/, "Zero or one of any character (except newline)"],
    [/\\./, "Literal special character"],
    [/\[([^\]]+)\]/, "A character from the set: [$1]"],
    [/\(([^)]+)\)/, "Capture group: ($1)"],
    [/\\d\+/, "One or more digits (0-9)"],
    [/\\d\*/, "Zero or more digits (0-9)"],
    [/\\d/, "A single digit (0-9)"],
    [/\\w\+/, "One or more word characters (a-z, A-Z, 0-9, _)"],
    [/\\w/, "A word character (a-z, A-Z, 0-9, _)"],
    [/\\s/, "A whitespace character (space, tab, newline)"],
    [/\\b/, "Word boundary"],
    [/\{(\d+),(\d+)\}/, "Between $1 and $2 repetitions"],
    [/\{(\d+)\}/, "Exactly $1 repetitions"],
    [/\|/, "OR — matches either side"],
    [/\+/, "One or more of the previous"],
    [/\*/, "Zero or more of the previous"],
    [/\?/, "Zero or one of the previous (optional)"],
    [/\./, "Any single character (except newline)"],
  ];
  for (const [r, desc] of rules) {
    const m = pattern.match(r);
    if (m) {
      let d = desc;
      m.forEach((g, i) => { if (i > 0) d = d.replace(`$${i}`, g); });
      parts.push(d);
    }
  }
  return parts.length ? parts : ["Custom pattern — enter a test string to see matches"];
}

// Code generator
function generateCode(pattern: string, flags: string, lang: string): string {
  const safePattern = pattern.replace(/\\/g, "\\\\");
  switch (lang) {
    case "js":
      return `const regex = /${pattern}/${flags};\nconst matches = text.match(regex);\nconsole.log(matches);`;
    case "python":
      return `import re\npattern = re.compile(r"${safePattern}"${flags.includes("i") ? ", re.IGNORECASE" : ""}${flags.includes("m") ? " | re.MULTILINE" : ""}${flags.includes("s") ? " | re.DOTALL" : ""})\nmatches = pattern.findall(text)\nprint(matches)`;
    case "go":
      return `import "regexp"\n\nre := regexp.MustCompile(\`${safePattern}\`)\nmatches := re.FindAllString(text, -1)\nfmt.Println(matches)`;
    case "java":
      return `import java.util.regex.*;\n\nPattern p = Pattern.compile("${safePattern.replace(/"/g, '\\"')}"${flags.includes("i") ? ", Pattern.CASE_INSENSITIVE" : ""});\nMatcher m = p.matcher(text);\nwhile (m.find()) {\n    System.out.println(m.group());\n}`;
    default: return "";
  }
}

type Tab = "matches" | "explain" | "codegen" | "test";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gm");
  const [testStr, setTestStr] = useState(
    "Hello World!\nContact us at hello@example.com or visit https://example.com\nPhone: +1234567890  Date: 2025-01-15\nColor: #ff5733  IP: 192.168.1.1"
  );
  const [replacement, setReplacement] = useState("");
  const [copiedMatch, setCopiedMatch] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [tab, setTab] = useState<Tab>("matches");
  const [codeLang, setCodeLang] = useState("js");
  const [unitTests, setUnitTests] = useState<{ input: string; shouldMatch: boolean }[]>([
    { input: "hello@example.com", shouldMatch: true },
    { input: "notanemail", shouldMatch: false },
  ]);
  const [newTestInput, setNewTestInput] = useState("");
  const [newTestShouldMatch, setNewTestShouldMatch] = useState(true);

  const getRegex = useCallback((): [RegExp | null, string] => {
    if (!pattern) return [null, ""];
    try { return [new RegExp(pattern, flags), ""]; }
    catch (e: any) { return [null, e.message]; }
  }, [pattern, flags]);

  const [regex, error] = getRegex();

  const { matches, timedOut } = useMemo(() =>
    regex && testStr ? safeExec(pattern, flags, testStr) : { matches: [], timedOut: false },
    [regex, pattern, flags, testStr]
  );

  const highlighted = useMemo(() => {
    if (!regex || matches.length === 0) return [{ text: testStr, match: false }];
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    matches.forEach(({ text, index }) => {
      if (index > last) parts.push({ text: testStr.slice(last, index), match: false });
      parts.push({ text, match: true });
      last = index + text.length;
    });
    if (last < testStr.length) parts.push({ text: testStr.slice(last), match: false });
    return parts;
  }, [regex, matches, testStr]);

  const replaced = useMemo(() => {
    if (!regex || !replacement) return testStr;
    try { return testStr.replace(regex, replacement); } catch { return testStr; }
  }, [regex, testStr, replacement]);

  const explanation = useMemo(() => explainPattern(pattern), [pattern]);
  const codeOutput = useMemo(() => generateCode(pattern, flags, codeLang), [pattern, flags, codeLang]);

  const unitTestResults = useMemo(() => {
    if (!pattern) return unitTests.map(t => ({ ...t, result: null as boolean | null }));
    return unitTests.map(t => {
      try {
        // Use the user's actual flags (strip 'g' for .test())
        const testFlags = flags.replace("g", "") || undefined;
        const r = new RegExp(pattern, testFlags);
        const matched = r.test(t.input);
        return { ...t, result: matched === t.shouldMatch };
      } catch { return { ...t, result: null as boolean | null }; }
    });
  }, [pattern, unitTests]);

  const toggleFlag = (f: string) => setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);

  const copyMatches = () => {
    navigator.clipboard.writeText(matches.map(m => m.text).join("\n"));
    setCopiedMatch(true);
    setTimeout(() => setCopiedMatch(false), 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const addUnitTest = () => {
    if (!newTestInput.trim()) return;
    setUnitTests(prev => [...prev, { input: newTestInput.trim(), shouldMatch: newTestShouldMatch }]);
    setNewTestInput("");
  };

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "matches", label: "Matches", icon: Regex },
    { id: "explain", label: "Explain", icon: BookOpen },
    { id: "codegen", label: "Export Code", icon: Code2 },
    { id: "test", label: "Unit Tests", icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center"><Regex className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Regex Tester</span>
          <div className="ml-auto flex items-center gap-3 text-xs">
            {timedOut && <span className="text-amber-400 font-bold">⚠ Timeout</span>}
            {!timedOut && pattern && !error && (
              <span className={`font-bold ${matches.length > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                {matches.length}{matches.length === MAX_MATCHES ? "+" : ""} match{matches.length !== 1 ? "es" : ""}
              </span>
            )}
            {error && <span className="text-red-400 font-bold truncate max-w-xs">⚠ {error}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Regex Tester</h1>
          <p className="text-slate-400 text-sm">Live highlighting · Plain-English explainer · Code export · Unit tests</p>
        </motion.div>

        {/* Quick inserts */}
        <div className="flex flex-wrap gap-2">
          {QUICK_INSERTS.map(({ label, pattern: p }) => (
            <button key={label} onClick={() => setPattern(p)}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:border-violet-500/40 hover:text-violet-300 transition-all font-medium"
            >{label}</button>
          ))}
        </div>

        {/* Pattern input */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-semibold uppercase tracking-wider">Pattern</label>
            <div className={`flex items-center bg-slate-950 border rounded-xl overflow-hidden transition-colors ${error ? "border-red-500/50" : pattern && matches.length > 0 ? "border-emerald-500/40" : "border-white/10"}`}>
              <span className="text-slate-500 pl-4 text-lg font-mono select-none">/</span>
              <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="your regex pattern..."
                className="flex-1 bg-transparent text-white font-mono text-base px-3 py-3 outline-none placeholder:text-slate-700"
              />
              <span className="text-slate-500 pr-2 text-lg font-mono select-none">/</span>
              {(["g","m","i","s"] as const).map(f => (
                <button key={f} onClick={() => toggleFlag(f)} title={FLAG_INFO[f]}
                  className={`px-2.5 py-3 font-mono text-sm font-bold transition-colors ${flags.includes(f) ? "text-violet-400" : "text-slate-600 hover:text-slate-400"}`}
                >{f}</button>
              ))}
            </div>
            {error && <div className="flex items-center gap-2 mt-2 text-red-400 text-xs"><AlertCircle className="w-3.5 h-3.5" /> {error}</div>}
            {timedOut && <div className="flex items-center gap-2 mt-2 text-amber-400 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Pattern timed out — may cause catastrophic backtracking. Simplify your regex.</div>}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setShowReplace(!showReplace)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-semibold ${showReplace ? "border-violet-500/40 bg-violet-500/10 text-violet-300" : "border-white/10 text-slate-500 hover:text-white"}`}
            >Replace Mode</button>
            {matches.length > 0 && (
              <button onClick={copyMatches} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors">
                {copiedMatch ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy all matches
              </button>
            )}
          </div>

          {showReplace && (
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-semibold uppercase tracking-wider">Replacement (supports $1, $2 for groups)</label>
              <input value={replacement} onChange={e => setReplacement(e.target.value)}
                placeholder="replacement string..."
                className="w-full bg-slate-950 border border-white/10 text-white font-mono px-4 py-3 rounded-xl outline-none focus:border-violet-500/40 transition-colors text-sm"
              />
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test string */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3">
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Test String</label>
            <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 text-white font-mono text-sm px-4 py-3 rounded-xl resize-none h-36 outline-none focus:border-violet-500/40 transition-colors"
            />
            {pattern && !error && (
              <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl font-mono text-sm leading-relaxed whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                {highlighted.map((part, i) => (
                  <span key={i} className={part.match ? "bg-violet-500/30 text-violet-200 rounded px-0.5" : "text-slate-400"}>{part.text}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right panel with tabs */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
            {/* Tab bar */}
            <div className="flex gap-1 bg-slate-950 border border-white/5 rounded-xl p-1">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${tab === t.id ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <Icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Matches tab */}
            {tab === "matches" && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {showReplace ? (
                  <div className="font-mono text-sm text-white whitespace-pre-wrap break-all bg-slate-950/80 border border-white/5 rounded-xl p-4 h-64 overflow-y-auto">{replaced}</div>
                ) : (
                  <>
                    {matches.length === 0 && <p className="text-slate-600 text-sm italic text-center py-8">{pattern ? "No matches found." : "Enter a pattern to start."}</p>}
                    {matches.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-950/60 border border-white/5 rounded-xl px-3 py-2.5 hover:border-violet-500/20 transition-colors cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(m.text)}
                        title="Click to copy"
                      >
                        <span className="text-[10px] text-violet-400 font-bold mt-0.5 w-5 flex-shrink-0">#{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm text-white break-all">{m.text}</p>
                          {m.groups.length > 0 && (
                            <p className="text-xs text-slate-500 mt-1">Groups: {m.groups.map((g,j)=>`$${j+1}=${JSON.stringify(g)}`).join(", ")}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">@{m.index}</span>
                      </div>
                    ))}
                    {matches.length === MAX_MATCHES && <p className="text-xs text-amber-400 text-center pt-1">Showing first {MAX_MATCHES} matches only</p>}
                  </>
                )}
              </div>
            )}

            {/* Explain tab */}
            {tab === "explain" && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {!pattern && <p className="text-slate-600 text-sm italic text-center py-8">Enter a pattern to see its explanation.</p>}
                {explanation.map((line, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3">
                    <span className="text-violet-400 font-bold text-xs mt-0.5 flex-shrink-0">{i+1}.</span>
                    <p className="text-sm text-slate-300">{line}</p>
                  </div>
                ))}
                <p className="text-[10px] text-slate-600 text-center pt-2">Explainer covers common constructs. Complex nested patterns may not be fully parsed.</p>
              </div>
            )}

            {/* Code gen tab */}
            {tab === "codegen" && (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {["js","python","go","java"].map(lang => (
                    <button key={lang} onClick={() => setCodeLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${codeLang === lang ? "bg-violet-600 border-violet-600 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                    >{{js:"JavaScript", python:"Python", go:"Go", java:"Java"}[lang]}</button>
                  ))}
                </div>
                {!pattern ? (
                  <p className="text-slate-600 text-sm italic text-center py-8">Enter a pattern to generate code.</p>
                ) : (
                  <div className="relative">
                    <pre className="bg-slate-950 border border-white/5 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto max-h-64">{codeOutput}</pre>
                    <button onClick={copyCode} className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors">
                      {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Unit tests tab */}
            {tab === "test" && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {unitTestResults.map((t, i) => (
                  <div key={i} className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 ${t.result === true ? "bg-emerald-500/10 border-emerald-500/20" : t.result === false ? "bg-red-500/10 border-red-500/20" : "bg-slate-950/60 border-white/5"}`}>
                    <span className="text-lg flex-shrink-0">{t.result === true ? "✅" : t.result === false ? "❌" : "⏳"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white truncate">{t.input}</p>
                      <p className="text-xs text-slate-500">{t.shouldMatch ? "Should match" : "Should NOT match"}</p>
                    </div>
                    <button onClick={() => setUnitTests(prev => prev.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400 text-xs transition-colors flex-shrink-0">✕</button>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <input value={newTestInput} onChange={e => setNewTestInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addUnitTest()}
                    placeholder="Test string..."
                    className="flex-1 bg-slate-950 border border-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-violet-500/40"
                  />
                  <select value={String(newTestShouldMatch)} onChange={e => setNewTestShouldMatch(e.target.value === "true")}
                    className="bg-slate-800 border border-white/10 text-slate-300 text-xs px-2 py-2 rounded-lg outline-none"
                  >
                    <option value="true">Should match</option>
                    <option value="false">Should NOT match</option>
                  </select>
                  <button onClick={addUnitTest} className="px-3 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-500 transition-colors">Add</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
