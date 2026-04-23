"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Download, Copy, CheckCheck, Eye, Code2, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const INITIAL_MD = `# Welcome to Markdown Editor

A clean, distraction-free writing experience with scroll sync.

## Features

- **Live preview** synced to your scroll position
- *Italic*, ~~strikethrough~~, \`inline code\`
- [Links](https://example.com) and images
- Code blocks, tables, blockquotes
- Export as **.md** or **HTML**

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Tool | Category | Status |
|------|----------|--------|
| Regex Tester | Developer | ✅ |
| Color Palette | Design | ✅ |
| Whiteboard | Creative | ✅ |

> **Tip:** Scroll in the editor — the preview follows automatically.

---

Start editing to see your changes live!
`;

const STORAGE_KEY = "markdown-editor-content";
type ViewMode = "split" | "edit" | "preview";

export default function MarkdownPage() {
  const [md, setMd] = useState(INITIAL_MD);
  const [view, setView] = useState<ViewMode>("split");
  const [copied, setCopied] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMd(saved);
  }, []);

  const handleChange = (val: string) => {
    setMd(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, val);
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 1500);
    }, 800);
  };

  // Scroll sync: editor → preview
  const handleEditorScroll = useCallback(() => {
    if (syncingRef.current || view !== "split") return;
    const ta = textareaRef.current;
    const pre = previewRef.current;
    if (!ta || !pre) return;
    syncingRef.current = true;
    const pct = ta.scrollTop / (ta.scrollHeight - ta.clientHeight || 1);
    pre.scrollTop = pct * (pre.scrollHeight - pre.clientHeight);
    requestAnimationFrame(() => { syncingRef.current = false; });
  }, [view]);

  const handlePreviewScroll = useCallback(() => {
    if (syncingRef.current || view !== "split") return;
    const ta = textareaRef.current;
    const pre = previewRef.current;
    if (!ta || !pre) return;
    syncingRef.current = true;
    const pct = pre.scrollTop / (pre.scrollHeight - pre.clientHeight || 1);
    ta.scrollTop = pct * (ta.scrollHeight - ta.clientHeight);
    requestAnimationFrame(() => { syncingRef.current = false; });
  }, [view]);

  const openFile = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".md,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => handleChange(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const copy = () => {
    navigator.clipboard.writeText(md);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const downloadMd = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "document.md"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadHtml = () => {
    const preview = previewRef.current?.innerHTML ?? "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Document</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1f2937; line-height: 1.75; font-size: 16px; background: #fff; }
  h1, h2, h3, h4, h5, h6 { font-weight: 700; line-height: 1.3; margin: 1.5em 0 0.5em; color: #111827; }
  h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.25em; }
  p { margin: 0 0 1em; }
  a { color: #4f46e5; text-decoration: underline; }
  ul, ol { padding-left: 1.5em; margin: 0 0 1em; }
  li { margin: 0.25em 0; }
  pre { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 1em 1.25em; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
  code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.875em; background: #f3f4f6; padding: 2px 5px; border-radius: 4px; }
  pre code { background: none; padding: 0; font-size: 0.85em; }
  blockquote { border-left: 4px solid #6366f1; margin: 1em 0; padding: 0.5em 1em; background: #f5f3ff; color: #4b5563; border-radius: 0 6px 6px 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 14px; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  tr:nth-child(even) td { background: #f9fafb; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
  img { max-width: 100%; height: auto; border-radius: 6px; }
  del { color: #9ca3af; }
  strong { font-weight: 700; } em { font-style: italic; }
</style>
</head>
<body>${preview}</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "document.html"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      handleChange(md.substring(0, start) + "  " + md.substring(end));
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const wordCount = md.trim() ? md.trim().split(/\s+/).length : 0;
  const charCount = md.length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 200));

  const VIEW_MODES: { id: ViewMode; label: string; Icon: typeof Code2 }[] = [
    { id: "edit", label: "Edit", Icon: Code2 },
    { id: "split", label: "Split", Icon: Eye },
    { id: "preview", label: "Preview", Icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" style={{ height: "100vh" }}>
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Markdown Editor</span>

          <div className="flex bg-slate-800 border border-white/10 rounded-xl p-1 ml-2">
            {VIEW_MODES.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              ><Icon className="w-3.5 h-3.5" />{label}</button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-600">{wordCount}w · {charCount}c · ~{readingMin}min read</span>
            {savedIndicator && <span className="text-emerald-400 font-medium">Saved ✓</span>}
            <button onClick={openFile} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
              <FolderOpen className="w-3.5 h-3.5" /> Open
            </button>
            <button onClick={copy} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy MD"}
            </button>
            <button onClick={downloadMd} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
              <Download className="w-3.5 h-3.5" /> .md
            </button>
            <button onClick={downloadHtml} className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-500 transition-colors px-3 py-1.5 rounded-lg font-semibold">
              <Download className="w-3.5 h-3.5" /> HTML
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex overflow-hidden ${view === "split" ? "flex-row" : "flex-col"}`}>
        {/* Editor pane */}
        {(view === "edit" || view === "split") && (
          <div className={`flex flex-col ${view === "split" ? "w-1/2 border-r border-white/10" : "flex-1"}`}>
            <div className="px-4 py-2 bg-slate-900/50 border-b border-white/5 text-xs text-slate-600 font-semibold uppercase tracking-wider flex-shrink-0 flex justify-between">
              <span>Markdown</span>
              {view === "split" && <span className="text-slate-700">↕ Scroll synced</span>}
            </div>
            <textarea
              ref={textareaRef}
              value={md}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={handleTab}
              onScroll={handleEditorScroll}
              className="flex-1 w-full bg-transparent text-slate-200 font-mono text-sm px-6 py-5 outline-none resize-none leading-relaxed overflow-y-auto"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview pane */}
        {(view === "preview" || view === "split") && (
          <div className={`flex flex-col ${view === "split" ? "w-1/2" : "flex-1"} overflow-hidden`}>
            <div className="px-4 py-2 bg-slate-900/50 border-b border-white/5 text-xs text-slate-600 font-semibold uppercase tracking-wider flex-shrink-0">Preview</div>
            <div
              ref={previewRef}
              onScroll={handlePreviewScroll}
              className="flex-1 px-8 py-6 prose prose-invert prose-sm max-w-none overflow-y-auto prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10 prose-code:text-violet-300 prose-a:text-indigo-400 prose-blockquote:border-indigo-500 prose-headings:text-white"
            >
              <ReactMarkdown>{md}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
