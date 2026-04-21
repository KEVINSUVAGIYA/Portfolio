"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, Copy, CheckCheck, ArrowLeft, Wifi, WifiOff, Hash } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  ref, push, onChildAdded, onValue, set, remove,
  onDisconnect, query, orderByChild, limitToLast, off,
} from "firebase/database";
import { copyToClipboard, generateColor } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  isSelf: boolean;
}

const adjectives = ["Swift","Quiet","Bold","Calm","Bright","Nova","Sage","Zephyr","Echo","Mist"];
const nouns = ["Fox","River","Star","Hawk","Moon","Wave","Pine","Ash","Reed","Stone"];
function generateName() {
  return adjectives[Math.floor(Math.random()*adjectives.length)] +
         nouns[Math.floor(Math.random()*nouns.length)];
}

const suggestions = ["team-standup","project-alpha","lunch-plan","quick-sync","secret-base","weekend-plans","dev-chat"];

function NotConfigured() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-3xl">🔧</div>
        <h2 className="text-xl font-bold text-white mb-2">Firebase Not Configured</h2>
        <p className="text-slate-400 text-sm mb-4">
          Copy <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local.example</code> to{" "}
          <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local</code> and add your Firebase credentials, then restart the dev server.
        </p>
        <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-all">
          Open Firebase Console →
        </a>
      </div>
    </div>
  );
}

function ChatEntry({ onEnter }: { onEnter: (room: string) => void }) {
  const [room, setRoom] = useState("");
  const [customName, setCustomName] = useState("");
  
  const handleJoin = () => {
    if (customName.trim()) {
      sessionStorage.setItem("chat-name", customName.trim());
    }
    onEnter(room);
  };
  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Instant Chat</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Pick a room name — anyone with the same URL can chat with you. No signup, powered by Firebase.
          </p>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">#</div>
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="my-room-name"
                className="w-full bg-slate-900 border border-white/10 text-white pl-9 pr-4 py-4 rounded-xl text-base outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all placeholder:text-slate-600 font-mono"
              />
            </div>
            <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Your name (optional)"
              className="w-full bg-slate-900 border border-white/10 text-white px-4 py-3.5 rounded-xl text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all placeholder:text-slate-600"
            />
            <button onClick={handleJoin} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20">
              Enter Room →
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {suggestions.slice(0,5).map((s) => (
              <button key={s} onClick={() => setRoom(s)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all text-xs font-mono">#{s}</button>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-6 text-center">Powered by Firebase — works on any device, any browser.</p>
        </motion.div>
      </div>
    </div>
  );
}

function ChatRoom({ room }: { room: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [myName, setMyName] = useState("");
  const myNameRef = useRef("");
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  // Resolve name client-side only (avoids hydration mismatch)
  useEffect(() => {
    const stored = sessionStorage.getItem("chat-name");
    const name = stored || generateName();
    if (!stored) sessionStorage.setItem("chat-name", name);
    myNameRef.current = name;
    setMyName(name);
  }, []);

  // Connect to Firebase once name is resolved
  useEffect(() => {
    if (!myName) return;
    const db = getFirebaseDb();

    const messagesRef = ref(db, `tools/chat/${room}/messages`);
    const presenceRef = ref(db, `tools/chat/${room}/presence/${myName}`);
    const allPresenceRef = ref(db, `tools/chat/${room}/presence`);

    // Register presence + auto-remove on disconnect
    set(presenceRef, { name: myName, online: true, joinedAt: Date.now() });
    onDisconnect(presenceRef).remove();

    // Count online users and track names
    const presenceUnsub = onValue(allPresenceRef, (snap) => {
      const size = snap.size ?? 0;
      const vals = snap.val() || {};
      setActiveUsers(Object.values(vals).map((u: any) => u.name));
      
      // If I am the only one in the room and I just joined, clear the old chat log.
      if (size === 1 && snap.val()?.[myName]) {
        const me = snap.val()[myName];
        if (me.joinedAt && Date.now() - me.joinedAt < 5000) {
          remove(messagesRef).catch(() => {});
        }
      }
    });

    // Load last 100 messages + listen for new ones
    const msgQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(100));
    const msgUnsub = onChildAdded(msgQuery, (snap) => {
      const data = snap.val();
      if (!data?.text) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === snap.key)) return prev;
        return [...prev, {
          id: snap.key!,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
          isSelf: data.sender === myNameRef.current,
        }];
      });
    });

    setConnected(true);

    cleanupRef.current = [
      () => { off(allPresenceRef); presenceUnsub(); },
      () => { off(msgQuery); msgUnsub(); },
      () => remove(presenceRef),
    ];

    return () => {
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, [myName, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !myName) return;
    const db = getFirebaseDb();
    push(ref(db, `tools/chat/${room}/messages`), {
      text: input.trim(),
      sender: myName,
      timestamp: Date.now(),
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyLink = async () => {
    await copyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 flex flex-col pt-safe-top pb-safe-bottom">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold truncate">{room}</span>
                {connected ? <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <WifiOff className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {activeUsers.length} online · You are <span className="text-violet-400 font-medium">{myName || "…"}</span>
              </p>
            </div>
          </div>
          <button onClick={copyLink} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs text-slate-300 hover:text-white flex-shrink-0">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
        {/* Presence Tags */}
        <div className="bg-slate-950/50 border-t border-white/5 py-2 px-4 flex gap-2 overflow-x-auto no-scrollbar max-w-3xl mx-auto w-full">
          {activeUsers.map((name, i) => (
             <div key={i} className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap border border-white/5 ${name === myName ? "bg-white/5 text-violet-300" : "bg-slate-800 text-slate-300"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className={`font-semibold ${generateColor(name)}`}>{name} {name === myName ? "(You)" : ""}</span>
             </div>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-4 overflow-y-auto">
        {!connected && (
          <div className="text-center py-16 text-slate-500">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Connecting to Firebase…</p>
          </div>
        )}
        {connected && messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Hash className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-white font-semibold mb-1">Room is empty</p>
            <p className="text-slate-400 text-sm">Share the link and start chatting. No login needed.</p>
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
              className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] flex flex-col gap-1 ${msg.isSelf ? "items-end" : "items-start"}`}>
                {!msg.isSelf && <span className={`text-xs font-semibold pl-1 ${generateColor(msg.sender)}`}>{msg.sender}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.isSelf ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-200 border border-white/5 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-slate-600 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all placeholder:text-slate-500 resize-none max-h-32 overflow-y-auto"
              style={{ height: "auto", minHeight: "44px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
              disabled={!connected}
            />
            <button onClick={sendMessage} disabled={!input.trim() || !connected}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-violet-500/20 mb-0.5">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1.5 text-center">Enter to send · Shift+Enter for new line · No login required</p>
        </div>
      </div>
    </div>
  );
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const room = searchParams.get("room");
  if (!isFirebaseConfigured()) return <NotConfigured />;
  function handleEnter(roomName: string) {
    const key = (roomName || "general").trim().replace(/\s+/g, "-").toLowerCase() || "general";
    router.push(`/tools/chat?room=${encodeURIComponent(key)}`);
  }
  if (!room) return <ChatEntry onEnter={handleEnter} />;
  return <ChatRoom room={room} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatPageInner />
    </Suspense>
  );
}
