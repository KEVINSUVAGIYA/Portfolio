"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Keyboard, BarChart2 } from "lucide-react";
import Link from "next/link";

const POOL: Record<string, string[]> = {
  quotes: [
    "the quick brown fox jumps over the lazy dog near the river bank on a sunny afternoon",
    "technology must marry with liberal arts to give us great results in the modern world",
    "design is not just what it looks like design is how it works and feels every single day",
    "innovation distinguishes a leader from a follower in any competitive and fast moving field",
    "stay hungry stay foolish never let the noise of others drown out your own inner voice",
    "the only way to do great work is to love what you do every single moment without exception",
    "simplicity is the ultimate sophistication in product design and engineering practice",
    "we cannot solve our problems with the same thinking we used when we first created them",
    "the measure of intelligence is the ability to change and adapt to new situations quickly",
    "if you want to go fast go alone but if you want to go far you must go together as a team",
    "creativity is intelligence having fun in the most unexpected and surprising of all places",
    "the best time to plant a tree was twenty years ago the second best time is right now today",
    "success is not final failure is not fatal it is the courage to continue that truly counts",
    "in the middle of every difficulty lies an opportunity for those who are brave enough to act",
    "the future belongs to those who believe in the beauty of their dreams and work hard for them",
    "an investment in knowledge always pays the best interest and dividends in the long run",
    "it does not matter how slowly you go as long as you do not stop moving in the right direction",
  ],
  code: [
    "const greet = name => hello plus name returns a greeting string from the function call",
    "function fibonacci n return n less than two ? n : fibonacci n minus one + fibonacci n minus two",
    "const doubled = arr . map x => x times two . filter x => x greater than four",
    "async function getData url const response = await fetch url return response . json",
    "class Stack constructor this . items = empty array push item this . items . push item to end",
    "const memoize = fn => const cache = {} return args => cache args ?? cache args = fn args",
  ],
  common: [
    "time will tell the great and small among us all in due time without any exception whatsoever",
    "be the change that you wish to see in the world around you every single day of your life",
    "all our dreams can come true if we have the courage to pursue them without ever giving up",
    "the secret of getting ahead is getting started no matter how small or uncertain the step",
    "believe you can and you are halfway there the rest is simply putting in the required work",
    "hard work beats talent when talent does not work hard enough to reach its full potential",
    "the only limit to our realization of tomorrow is our doubts of today so believe and act",
  ],
};

type Mode = "time" | "words";
type Category = keyof typeof POOL;

function buildTarget(cat: Category, mode: Mode, wl: number): string {
  const pool = [...POOL[cat]].sort(() => Math.random() - 0.5);
  if (mode === "words") {
    const words = pool.join(" ").split(/\s+/).filter(Boolean);
    return words.slice(0, wl).join(" ");
  }
  // Time mode: join 3 different quotes so there is NO repetition
  return pool.slice(0, 3).join(" ");
}

export default function TypingTestPage() {
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [mode, setMode] = useState<Mode>("time");
  const [category, setCategory] = useState<Category>("quotes");
  const [target, setTarget] = useState("");
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [focused, setFocused] = useState(false);

  const hiddenRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const doneRef = useRef(false);
  const inputRef = useRef(""); // always-current input for closures

  useEffect(() => {
    const s = localStorage.getItem("typing-best-wpm");
    if (s) setBestWpm(Number(s));
  }, []);

  const reset = useCallback((cat = category, m = mode, tl = timeLimit, wl = wordLimit) => {
    const t = buildTarget(cat as Category, m as Mode, wl);
    setTarget(t);
    setInput(""); inputRef.current = "";
    setStarted(false); setDone(false); doneRef.current = false;
    setWpm(0); setAccuracy(100); setWpmHistory([]);
    setTimeLeft(tl);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => hiddenRef.current?.focus(), 50);
  }, [category, mode, timeLimit, wordLimit]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); }, []);

  // Timer — WPM = gross (all typed chars / 5 / elapsed min)
  useEffect(() => {
    if (!started || mode !== "time" || done) return;
    intervalRef.current = setInterval(() => {
      const elapsedSec = (Date.now() - startRef.current) / 1000;
      const left = Math.max(0, timeLimit - elapsedSec);
      setTimeLeft(Math.ceil(left));
      const elapsedMin = elapsedSec / 60;
      if (elapsedMin > 0.001) {
        const cur = Math.round((inputRef.current.length / 5) / elapsedMin);
        setWpm(cur);
        setWpmHistory(h => [...h.slice(-119), cur]);
        const errors = [...inputRef.current].filter((c, i) => c !== target[i]).length;
        const acc = inputRef.current.length > 0 ? Math.max(0, Math.round(((inputRef.current.length - errors) / inputRef.current.length) * 100)) : 100;
        setAccuracy(acc);
      }
      if (left <= 0) clearInterval(intervalRef.current!);
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [started, mode, done, timeLimit, target]);

  const finish = useCallback((val: string) => {
    if (doneRef.current) return;
    doneRef.current = true; setDone(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsedMin = Math.max(0.001, (Date.now() - startRef.current) / 60000);
    // Gross WPM: all chars typed / 5 / minutes
    const finalWpm = Math.round((val.length / 5) / elapsedMin);
    const errors = [...val].filter((c, i) => c !== target[i]).length;
    const acc = val.length > 0 ? Math.max(0, Math.round(((val.length - errors) / val.length) * 100)) : 100;
    setWpm(finalWpm); setAccuracy(acc);
    const prev = Number(localStorage.getItem("typing-best-wpm") || "0");
    localStorage.setItem("typing-prev-best", String(prev));
    localStorage.setItem("typing-best-wpm", String(Math.max(prev, finalWpm)));
    setBestWpm(Math.max(prev, finalWpm));
  }, [target]);

  // Finish when time hits 0
  useEffect(() => {
    if (started && mode === "time" && timeLeft === 0 && !doneRef.current) finish(inputRef.current);
  }, [timeLeft, started, mode, finish]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (done) return;
    const val = e.target.value;
    // Hard cap: target + 20 extra chars max
    if (val.length > target.length + 20) return;
    if (!started && val.length > 0) { setStarted(true); startRef.current = Date.now(); }
    setInput(val); inputRef.current = val;
    // Live accuracy
    const errors = [...val].filter((c, i) => c !== target[i]).length;
    setAccuracy(val.length > 0 ? Math.max(0, Math.round(((val.length - errors) / val.length) * 100)) : 100);
    // Words mode: finish when correct words reach limit
    if (mode === "words") {
      const targetWords = target.split(" ");
      const typedWords = val.split(" ");
      if (typedWords.length >= targetWords.length && val.endsWith(" ") === false) {
        // Check if all target words match
        const allMatch = targetWords.every((tw, i) => typedWords[i] === tw);
        if (allMatch) finish(val);
      }
    }
  }, [done, started, target, mode, finish]);

  // Keyboard shortcuts on the hidden input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") { e.preventDefault(); reset(); }
    if (e.key === "Escape") { e.preventDefault(); reset(); }
  }, [reset]);

  // Auto-scroll cursor
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [input]);

  // Build character display
  const chars = useMemo(() => {
    const tChars = target.split("");
    const extra = input.length > target.length ? input.slice(target.length).split("") : [];
    return [
      ...tChars.map((ch, i) => ({
        ch, key: i,
        state: i < input.length ? (input[i] === ch ? "ok" : "err") : i === input.length ? "cursor" : "pending",
      })),
      ...extra.map((ch, i) => ({ ch, key: target.length + i, state: "extra" })),
    ];
  }, [target, input]);

  const progress = mode === "time"
    ? ((timeLimit - timeLeft) / timeLimit) * 100
    : (input.trim().split(/\s+/).filter(Boolean).length / wordLimit) * 100;

  const prevBest = typeof window !== "undefined" ? Number(localStorage.getItem("typing-prev-best") || "0") : 0;
  const isNewBest = done && wpm > prevBest && wpm > 0;
  const chartMax = Math.max(...wpmHistory, 10);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><Keyboard className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Typing Speed Test</span>
          <span className="ml-auto text-xs text-slate-600 hidden sm:block">Tab = new · Esc = reset</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Controls */}
        {(!started || done) && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Typing Speed Test</h1>
              <p className="text-slate-500 text-sm">Click the text below and start typing · Tab = new</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1">
                {(["time","words"] as Mode[]).map(m => (
                  <button key={m} onClick={() => { setMode(m); reset(category, m); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode===m?"bg-green-600 text-white":"text-slate-500 hover:text-white"}`}
                  >{m==="time"?"⏱ Time":"📝 Words"}</button>
                ))}
              </div>
              {mode==="time" && [15,30,60,120].map(t=>(
                <button key={t} onClick={()=>{setTimeLimit(t);reset(category,mode,t);}}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${timeLimit===t?"bg-green-600 border-green-600 text-white":"border-white/10 text-slate-400 hover:text-white"}`}
                >{t}s</button>
              ))}
              {mode==="words" && [10,25,50,100].map(w=>(
                <button key={w} onClick={()=>{setWordLimit(w);reset(category,mode,timeLimit,w);}}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${wordLimit===w?"bg-green-600 border-green-600 text-white":"border-white/10 text-slate-400 hover:text-white"}`}
                >{w}w</button>
              ))}
              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 ml-auto">
                {(Object.keys(POOL) as Category[]).map(c=>(
                  <button key={c} onClick={()=>{setCategory(c);reset(c,mode);}}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors capitalize ${category===c?"bg-slate-700 text-white":"text-slate-500 hover:text-white"}`}
                  >{{quotes:"Quotes",code:"Code",common:"Words"}[c]}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: mode==="time"?"Time":"Words", value: mode==="time"?`${timeLeft}s`:`${Math.min(input.trim().split(/\s+/).filter(Boolean).length,wordLimit)}/${wordLimit}`, color: mode==="time"&&timeLeft<=5&&started?"text-red-400":"text-white" },
            { label: "WPM", value: started?wpm:"—", color: "text-green-400" },
            { label: "Accuracy", value: started?`${accuracy}%`:"—", color: accuracy>=95?"text-emerald-400":accuracy>=80?"text-amber-400":"text-red-400" },
            { label: "Best", value: bestWpm||"—", color: "text-violet-400" },
          ].map(({label,value,color})=>(
            <div key={label} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-black ${color} mb-1 tabular-nums`}>{value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        {started && !done && (
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${mode==="time"&&timeLeft<=5?"bg-red-500":"bg-green-500"}`}
              animate={{width:`${Math.min(progress,100)}%`}} transition={{duration:0.3}} />
          </div>
        )}

        {/* ── Typing display — click to focus, type directly here ── */}
        <div
          ref={displayRef}
          onClick={() => hiddenRef.current?.focus()}
          className={`relative bg-slate-900 border rounded-2xl px-6 py-5 cursor-text max-h-56 overflow-y-auto scroll-smooth transition-all select-none ${focused?"border-green-500/50 ring-1 ring-green-500/10":"border-white/10 hover:border-white/20"}`}
        >
          {/* Focus hint when not started */}
          {!started && !done && !focused && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/70 z-10 pointer-events-none">
              <span className="text-slate-500 text-sm font-medium">Click here to start typing</span>
            </div>
          )}

          <p className="font-mono text-[1.15rem] leading-loose tracking-wide break-words">
            {chars.map(({ch, key, state})=>{
              if (state==="ok") return <span key={key} className="text-slate-500">{ch}</span>;
              if (state==="err") return <span key={key} className={`text-red-400 bg-red-500/20 rounded-sm${ch===" "?" border-b border-red-400":""}`}>{ch===" "?"·":ch}</span>;
              if (state==="cursor") return (
                <span key={key} className="relative">
                  <span ref={cursorRef}
                    className="absolute -left-px inset-y-1 w-0.5 bg-green-400 rounded-full"
                    style={{animation:focused?"blink 1s step-end infinite":"none"}}
                  />
                  <span className="text-white font-semibold">{ch}</span>
                </span>
              );
              if (state==="extra") return <span key={key} className="text-red-400 bg-red-500/30 rounded-sm">{ch}</span>;
              return <span key={key} className="text-slate-400">{ch}</span>;
            })}
          </p>

          {/* Hidden input — captures actual keystrokes */}
          <input
            ref={hiddenRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={done}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            className="absolute opacity-0 top-0 left-0 w-px h-px pointer-events-none"
            aria-label="Type here"
          />
        </div>

        <p className="text-xs text-slate-600 text-center">
          {focused ? (started ? "Keep typing…" : "Start typing to begin the test") : "Click the text box above to focus · Tab = new quote"}
        </p>

        {/* Live WPM chart */}
        {wpmHistory.length > 3 && !done && (
          <div className="bg-slate-900 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live WPM</span>
              </div>
              <span className="text-xs text-green-400 font-mono font-bold">{wpm} wpm</span>
            </div>
            <svg viewBox={`0 0 100 40`} preserveAspectRatio="none" width="100%" height="40">
              <polyline
                points={`0,40 ${wpmHistory.map((v,i)=>`${(i/Math.max(wpmHistory.length-1,1))*100},${40-(v/chartMax)*36}`).join(" ")} 100,40`}
                fill="rgba(34,197,94,0.08)" stroke="none"
              />
              <polyline
                points={wpmHistory.map((v,i)=>`${(i/Math.max(wpmHistory.length-1,1))*100},${40-(v/chartMax)*36}`).join(" ")}
                fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {done && (
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">{isNewBest?"🏆":"🎉"}</div>
              <h2 className="text-4xl font-black text-white mb-1 tabular-nums">
                {wpm} <span className="text-xl font-semibold text-slate-400">WPM</span>
              </h2>
              <p className="text-slate-400 text-sm mb-5">
                {accuracy}% accuracy · {isNewBest?"New personal best! 🏆":""}
              </p>
              {wpmHistory.length>3 && (
                <div className="mb-5 bg-slate-950/60 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">WPM over time</p>
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none" width="100%" height="50">
                    <polyline
                      points={wpmHistory.map((v,i)=>`${(i/Math.max(wpmHistory.length-1,1))*100},${50-(v/chartMax)*46}`).join(" ")}
                      fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={()=>reset()}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors"
                ><RotateCcw className="w-4 h-4"/>Try Again</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!done && (
          <button onClick={()=>reset()} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
            <RotateCcw className="w-4 h-4"/>New Quote (Tab)
          </button>
        )}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
