"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Copy, CheckCheck, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb, isFirebaseConfigured, getFirebaseAuth } from "@/lib/firebase";
import { ref, set, onValue, off, runTransaction, onDisconnect, remove } from "firebase/database";
import { copyToClipboard, generateColor } from "@/lib/utils";

interface PollData {
  question: string;
  options: string[];
  allowUndo: boolean;
  requireName: boolean;
  ownerUid?: string;
  expiresAt?: number | null;
  createdAt: number;
}

interface VoteCounts { [optionIndex: string]: number }


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

function CreatePoll() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [customId, setCustomId] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [creating, setCreating] = useState(false);
  const [allowUndo, setAllowUndo] = useState(false);
  const [requireName, setRequireName] = useState(false);
  const [expirationMins, setExpirationMins] = useState(0);

  const addOption = () => setOptions((o) => [...o, ""]);
  const removeOption = (i: number) => setOptions((o) => o.filter((_, idx) => idx !== i));
  const updateOption = (i: number, val: string) => setOptions((o) => o.map((opt, idx) => idx === i ? val : opt));

  const create = async () => {
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim() || validOptions.length < 2) return;
    setCreating(true);
    const cleanId = customId.trim().replace(/\s+/g, "-").toLowerCase();
    const id = cleanId || `poll-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const db = getFirebaseDb();
    const auth = getFirebaseAuth();
    
    await set(ref(db, `tools/polls/${id}`), {
      question: question.trim(),
      options: validOptions,
      allowUndo,
      requireName,
      ownerUid: auth.currentUser?.uid || null,
      expiresAt: expirationMins > 0 ? Date.now() + expirationMins * 60 * 1000 : null,
      createdAt: Date.now(),
    });
    sessionStorage.setItem(`poll-owner-${id}`, "true");
    router.push(`/tools/poll?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Instant Poll</h1>
          <p className="text-slate-400 mb-8">Create a poll and share the link. Anyone can vote — powered by Firebase.</p>

          <div className="space-y-4 bg-slate-900/50 border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300 block">Poll Settings</label>
              <input value={question} onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should we do?"
                className="w-full bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
              />
              <input value={customId} onChange={(e) => setCustomId(e.target.value)}
                placeholder="Custom Poll ID (optional, e.g. 'lunch-vote')"
                className="w-full bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600 font-mono"
              />
              <label className="flex items-center gap-3 text-sm text-slate-300 mt-2 p-2 rounded hover:bg-slate-800 cursor-pointer transition-colors w-fit">
                <input type="checkbox" checked={allowUndo} onChange={(e) => setAllowUndo(e.target.checked)} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                Allow users to change their vote
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-300 mt-2 p-2 rounded hover:bg-slate-800 cursor-pointer transition-colors w-fit">
                <input type="checkbox" checked={requireName} onChange={(e) => setRequireName(e.target.checked)} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                Force voters to add name (no anonymous)
              </label>
              <label className="text-sm font-medium text-slate-300 block mt-4 mb-2">Poll Expiration</label>
              <select value={expirationMins} onChange={(e) => setExpirationMins(Number(e.target.value))} className="w-full bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500/50 transition-all">
                 <option value={0}>Never Expires</option>
                 <option value={5}>5 Minutes</option>
                 <option value={60}>1 Hour</option>
                 <option value={1440}>24 Hours</option>
                 <option value={10080}>7 Days</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Options</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={opt} onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-slate-800 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
                    />
                    {options.length > 2 && (
                      <button onClick={() => removeOption(i)} className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addOption} className="mt-3 flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                <Plus className="w-4 h-4" /> Add option
              </button>
            </div>
            <button onClick={create} disabled={creating || !question.trim() || options.filter(o => o.trim()).length < 2}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20">
              {creating ? "Creating…" : "Create Poll →"}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4 text-center">Powered by Firebase · No login · Share the link to collect votes</p>
        </motion.div>
      </div>
    </div>
  );
}

function ViewPoll({ id }: { id: string }) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [voters, setVoters] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [myName, setMyName] = useState("");
  const [customVoterName, setCustomVoterName] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsOwner(!!sessionStorage.getItem(`poll-owner-${id}`));
    const adjectives = ["Swift","Quiet","Bold","Calm","Bright","Nova","Sage","Zephyr","Echo","Mist"];
    const nouns = ["Fox","River","Star","Hawk","Moon","Wave","Pine","Ash","Reed","Stone"];
    const storedName = sessionStorage.getItem("poll-name");
    const name = storedName || (adjectives[Math.floor(Math.random()*adjectives.length)] + nouns[Math.floor(Math.random()*nouns.length)]);
    if (!storedName) sessionStorage.setItem("poll-name", name);
    setMyName(name);
  }, []);

  useEffect(() => {
    if (!myName) return;
    const db = getFirebaseDb();
    const presenceRef = ref(db, `tools/polls/${id}/presence/${myName}`);
    const allPresenceRef = ref(db, `tools/polls/${id}/presence`);
    
    set(presenceRef, { name: myName, online: true });
    onDisconnect(presenceRef).remove();

    const unsub = onValue(allPresenceRef, (snap) => {
      setActiveUsers(Object.values(snap.val() || {}).map((u:any) => u.name));
    });
    return () => { off(allPresenceRef); unsub(); remove(presenceRef); };
  }, [id, myName]);

  useEffect(() => {
    const db = getFirebaseDb();
    const pollRef = ref(db, `tools/polls/${id}`);
    const votesRef = ref(db, `tools/polls/${id}/votes`);

    // Check voted state from sessionStorage
    const stored = sessionStorage.getItem(`poll-voted-${id}`);
    if (stored !== null) setVoted(Number(stored));

    // 5-second timeout for not-found detection
    timeoutRef.current = setTimeout(() => setNotFound(true), 5000);

    const unsubPoll = onValue(pollRef, (snap) => {
      const data = snap.val();
      if (data?.question) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setNotFound(false);
        const fetchedPoll = { 
          question: data.question, options: data.options, 
          allowUndo: !!data.allowUndo, requireName: !!data.requireName, 
          ownerUid: data.ownerUid, expiresAt: data.expiresAt || null, createdAt: data.createdAt 
        };
        setPoll(fetchedPoll);
        
        // Ensure absolute deterministic ownership validation via UID fallback
        const auth = getFirebaseAuth();
        if (data.ownerUid && data.ownerUid === auth.currentUser?.uid) {
           setIsOwner(true);
           sessionStorage.setItem(`poll-owner-${id}`, "true");
        }
      }
    });

    const unsubVoters = onValue(ref(db, `tools/polls/${id}/voters`), (snap) => {
      setVoters(snap.val() || {});
    });

    return () => {
      off(pollRef); unsubPoll();
      off(ref(db, `tools/polls/${id}/voters`)); unsubVoters();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id]);

  const vote = async (optionIndex: number) => {
    if (poll?.expiresAt && Date.now() > poll.expiresAt) return;
    // Already voted and undo not allowed — fully block, no error
    if (voted !== null && !poll?.allowUndo) return;
    // Same option — no-op
    if (voted === optionIndex) return;
    // Name required but not provided
    if (poll?.requireName && !customVoterName.trim()) {
      alert("The creator of this poll requires you to enter your name to vote.");
      return;
    }
    setVoted(optionIndex);
    const db = getFirebaseDb();
    const identityKey = poll?.requireName ? customVoterName.trim().replace(/\s+/g,'-') : myName;
    await set(ref(db, `tools/polls/${id}/voters/${identityKey}`), optionIndex);
    sessionStorage.setItem(`poll-voted-${id}`, String(optionIndex));
  };

  const copyLink = async () => {
    await copyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalVotes = Object.keys(voters).length;
  const isExpired = poll?.expiresAt ? Date.now() > poll.expiresAt : false;

  if (!poll && notFound) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-7 h-7 text-slate-600" />
      </div>
      <h2 className="text-white font-bold text-xl mb-2">Poll not found</h2>
      <p className="text-slate-400 text-sm mb-6">This poll doesn&apos;t exist or has expired.</p>
      <Link href="/tools/poll" className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-all">Create a new poll →</Link>
    </div>
  );

  if (!poll) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading poll…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Instant Poll</span>
          </div>
          <button onClick={copyLink} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs text-slate-300">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Presence Tags — owner only */}
        {isOwner && (
          <div className="bg-slate-900/50 border border-white/5 py-2 px-3 rounded-xl mb-6 flex gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-wider px-1 flex-shrink-0">Watching:</span>
            {activeUsers.map((name, i) => (
               <div key={i} className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap border border-white/5 ${name === myName ? "bg-white/5 text-amber-300" : "bg-slate-800 text-slate-300"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className={`font-semibold ${generateColor(name)}`}>{name} {name === myName ? "(You)" : ""}</span>
               </div>
            ))}
            {activeUsers.length === 0 && <span className="text-xs text-slate-500 p-1">Connecting...</span>}
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-white">{poll.question}</h2>
            <div className="flex gap-2 flex-wrap justify-end">
              {isExpired && <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-bold rounded">Expired</span>}
              {isOwner && <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase font-bold rounded">Owner View</span>}
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-6">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} · {isExpired ? "Poll Locked" : (voted !== null ? "You voted" : "Choose an option")}</p>

          {!isExpired && voted === null && poll.requireName && (
             <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <label className="text-xs text-amber-400 font-semibold mb-2 block">Name required to vote</label>
                <input value={customVoterName} onChange={(e) => setCustomVoterName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-slate-900 border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors"
                />
             </div>
          )}

          <div className="space-y-3">
            {poll.options.map((opt, i) => {
              const count = Object.values(voters).filter(v => v === i).length;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isMyVote = voted === i;
              const showResults = voted !== null || isOwner || isExpired;
              const votersForOption = Object.entries(voters).filter(([, optIdx]) => optIdx === i).map(([name]) => name);

              return (
                <motion.button key={i}
                  onClick={() => vote(i)}
                  disabled={(voted !== null && !poll.allowUndo) || isExpired}
                  className={`w-full relative text-left px-5 py-4 rounded-xl border transition-all overflow-hidden ${
                    isMyVote ? "border-amber-500/50 bg-amber-500/10" :
                    voted !== null && !poll.allowUndo ? "border-white/10 bg-slate-900/50 cursor-not-allowed" :
                    isExpired ? "border-white/10 bg-slate-900/50 cursor-default" :
                    "border-white/10 bg-slate-900/50 hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer"
                  }`}
                >
                  <AnimatePresence>
                    {showResults && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 rounded-xl ${isMyVote ? "bg-amber-500/20" : "bg-white/5"}`}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10 mt-1 flex justify-between items-center text-sm">
                    <span className={`font-semibold ${isMyVote ? "text-amber-400" : "text-white"}`}>{opt}</span>
                    {showResults && <span className={`text-sm font-bold ml-4 flex-shrink-0 ${isMyVote ? "text-amber-400" : "text-slate-400"}`}>{pct}%</span>}
                  </div>
                  
                  {isOwner && votersForOption.length > 0 && (
                    <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                      {votersForOption.map(name => (
                        <span key={name} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/70 border border-white/5 text-slate-300 shadow-inner">
                          {name === customVoterName.trim() || name === myName ? `${name} (You)` : name}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-600">
            <span>Live results · Powered by Firebase</span>
            <Link href="/tools/poll" className="text-amber-500 hover:text-amber-400 transition-colors">+ New poll</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PollPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!isFirebaseConfigured()) return <NotConfigured />;
  if (!id) return <CreatePoll />;
  return <ViewPoll id={id} />;
}

export default function PollPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PollPageInner />
    </Suspense>
  );
}
