"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, FileText, Wifi, WifiOff, Shuffle, Users, Eraser } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { ref, set, onValue, off, onDisconnect, remove } from "firebase/database";
import { copyToClipboard, generateColor } from "@/lib/utils";

const adjectives = ["Swift","Quiet","Bold","Calm","Bright","Nova","Sage","Zephyr","Echo","Mist"];
const nouns = ["Fox","River","Star","Hawk","Moon","Wave","Pine","Ash","Reed","Stone"];
function generateName() {
  return adjectives[Math.floor(Math.random()*adjectives.length)] + nouns[Math.floor(Math.random()*nouns.length)];
}

const suggestions = ["meeting-notes","shared-draft","grocery-list","travel-plan","brainstorm","code-snippet","daily-log"];

function NotConfigured() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-3xl">🔧</div>
        <h2 className="text-xl font-bold text-white mb-2">Firebase Not Configured</h2>
        <p className="text-slate-400 text-sm mb-4">
          Copy <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local.example</code> to <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local</code> and add your Firebase credentials.
        </p>
      </div>
    </div>
  );
}

function NotesEntry({ onOpen }: { onOpen: (key: string) => void }) {
  const [key, setKey] = useState("");
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-10"><ArrowLeft className="w-4 h-4" /> Back to Tools</Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Shared Notes</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">Rich text notes synced live. Anyone on the same URL edits it together.</p>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">key:</div>
              <input type="text" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onOpen(key)} placeholder="my-note-key" className="w-full bg-slate-900 border border-white/10 text-white pl-14 pr-10 py-4 rounded-xl text-base outline-none focus:border-emerald-500/50 font-mono" />
              <button onClick={() => setKey(suggestions[Math.floor(Math.random()*suggestions.length)])} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"><Shuffle className="w-4 h-4" /></button>
            </div>
            <button onClick={() => onOpen(key)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">Open Note →</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SharedNote({ noteKey }: { noteKey: string }) {
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [myName, setMyName] = useState("");
  const [activeUsers, setActiveUsers] = useState<{name: string, isTyping: boolean}[]>([]);
  
  const localTextRef = useRef("");
  const myNameRef = useRef("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const typingResetRef = useRef<NodeJS.Timeout | null>(null);
  
  const noteRefPath = `tools/notes/${noteKey}/content`;
  const presenceRefPath = `tools/notes/${noteKey}/presence`;

  useEffect(() => {
    const stored = sessionStorage.getItem("notes-name");
    const name = stored || generateName();
    if (!stored) sessionStorage.setItem("notes-name", name);
    myNameRef.current = name;
    setMyName(name);
  }, []);

  useEffect(() => {
    if (!myName) return;
    const db = getFirebaseDb();
    const noteRef = ref(db, noteRefPath);
    const myPresenceRef = ref(db, `${presenceRefPath}/${myName}`);
    const allPresenceRef = ref(db, presenceRefPath);

    // Initial presence
    set(myPresenceRef, { name: myName, online: true, joinedAt: Date.now(), isTyping: false });
    onDisconnect(myPresenceRef).remove();

    const unsubPresence = onValue(allPresenceRef, (snap) => {
      const data = snap.val() || {};
      const users = Object.values(data) as any[];
      setActiveUsers(users);

      // If I am alone and I just joined, clear the document
      const size = Object.keys(data).length;
      if (size === 1 && data[myName]) {
        if (data[myName].joinedAt && Date.now() - data[myName].joinedAt < 3000) {
          remove(noteRef).catch(() => {});
        }
      }
    });

    const unsubNote = onValue(noteRef, (snap) => {
      const val: string = snap.val() ?? "";
      if (val !== localTextRef.current) {
        localTextRef.current = val;
        setText(val);
      }
    });

    setConnected(true);
    return () => { off(noteRef); unsubNote(); off(allPresenceRef); unsubPresence(); remove(myPresenceRef); };
  }, [myName, noteKey]);

  const syncToFirebase = useCallback((val: string) => {
    const db = getFirebaseDb();
    set(ref(db, noteRefPath), val).then(() => {
      setLastSaved(new Date());
      set(ref(db, `${presenceRefPath}/${myNameRef.current}/isTyping`), false);
    });
  }, [noteRefPath]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    localTextRef.current = val;
    setText(val);
    // Set typing status
    const db = getFirebaseDb();
    set(ref(db, `${presenceRefPath}/${myNameRef.current}/isTyping`), true);
    if (typingResetRef.current) clearTimeout(typingResetRef.current);
    typingResetRef.current = setTimeout(() => {
      set(ref(db, `${presenceRefPath}/${myNameRef.current}/isTyping`), false);
    }, 1500);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncToFirebase(val), 600);
  };

  const copyLink = async () => { await copyToClipboard(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  
  // No modules needed - using plain textarea

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Dynamic Style Injection to skin Quill for Dark Mode! */}
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar { border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px 12px 0 0 !important; font-family: inherit !important; background: rgba(15,23,42,0.6) !important; }
        .ql-container { border: 1px solid rgba(255,255,255,0.1) !important; border-top: 0 !important; border-radius: 0 0 12px 12px !important; font-size: 16px !important; font-family: inherit !important; color: #e2e8f0 !important; background: rgba(15,23,42,0.4) !important;}
        .ql-editor { min-height: 50vh; padding: 24px !important; }
        .ql-editor.ql-blank::before { color: rgba(255,255,255,0.3) !important; font-style: normal !important; }
        .ql-stroke { stroke: #94a3b8 !important; }
        .ql-fill { fill: #94a3b8 !important; }
        .ql-picker-label, .ql-picker-item { color: #94a3b8 !important; }
        .ql-picker-options { background-color: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
        button.ql-active .ql-stroke { stroke: #34d399 !important; }
        button:hover .ql-stroke { stroke: #cbd5e1 !important; }
      `}} />

      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-white" /></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold truncate">{noteKey}</span>
                {connected ? <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <WifiOff className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                {lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Waiting…"}
              </p>
            </div>
          </div>
          <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs text-emerald-400">
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : null} Share note
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-4">
        {/* Presence Bar */}
        <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 rounded-xl p-3 flex-wrap">
          <Users className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1" />
          {activeUsers.map((u, i) => (
            <div key={i} className={`text-xs px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-2 ${u.name === myName ? "bg-white/5" : "bg-slate-800"}`}>
              <span className={`w-2 h-2 rounded-full ${u.isTyping ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
              <span className={`font-semibold ${generateColor(u.name)}`}>{u.name} {u.name === myName ? "(You)" : ""}</span>
              {u.isTyping && <span className="text-slate-400 italic text-[10px]">typing</span>}
            </div>
          ))}
          {activeUsers.length === 0 && <span className="text-xs text-slate-500">Connecting…</span>}
        </div>

        {/* Editor */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col pb-10">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Start typing together… synced live across all tabs."
            className="flex-1 w-full min-h-[60vh] bg-slate-900 border border-white/10 text-slate-100 px-6 py-5 rounded-xl text-base outline-none focus:border-emerald-500/40 transition-colors resize-none font-mono leading-relaxed placeholder:text-slate-600"
          />
          <div className="mt-3 text-xs text-slate-600 flex justify-between">
            <span>Plain text · Auto-saved · Cleared when no one is in the room.</span>
            <span>{text.length} chars</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function NotesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const key = searchParams.get("key");
  if (!isFirebaseConfigured()) return <NotConfigured />;
  function handleOpen(noteKey: string) {
    const k = (noteKey || `note-${Date.now()}`).trim().replace(/\s+/g, "-").toLowerCase();
    router.push(`/tools/notes?key=${encodeURIComponent(k)}`);
  }
  if (!key) return <NotesEntry onOpen={handleOpen} />;
  return <SharedNote noteKey={key} />;
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <NotesPageInner />
    </Suspense>
  );
}
