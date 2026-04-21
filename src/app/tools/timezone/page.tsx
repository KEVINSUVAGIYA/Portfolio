"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, X, Globe, ChevronDown, ChevronUp, Clock, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import moment from "moment-timezone";

// Popular timezones with display labels shown by default
const DEFAULT_ZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
];

function getLabel(tz: string) {
  const parts = tz.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
}

function getRegion(tz: string) {
  return tz.split("/")[0].replace(/_/g, " ");
}

function getStatus(hour: number): { label: string; color: string; bg: string } {
  if (hour >= 9 && hour < 18) return { label: "Work hours", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  if (hour >= 7 && hour < 9) return { label: "Morning", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
  if (hour >= 18 && hour < 22) return { label: "Evening", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
  return { label: "Night", color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" };
}

function InteractiveTimeline({ 
  tz, refDate, onChangeTime 
}: { 
  tz: string, refDate: Date, onChangeTime: (tz: string, hour: number) => void 
}) {
  const m = moment(refDate).tz(tz);
  const hour = m.hour() + m.minute() / 60;
  const posPercent = (hour / 24) * 100;

  const bgSegments = [
    { start: 0, end: 6, color: "rgba(15,23,42,0.8)" },    // night
    { start: 6, end: 9, color: "rgba(251,191,36,0.15)" }, // morning
    { start: 9, end: 18, color: "rgba(52,211,153,0.15)" }, // work
    { start: 18, end: 21, color: "rgba(251,191,36,0.15)" }, // evening
    { start: 21, end: 24, color: "rgba(15,23,42,0.8)" },  // night
  ];

  return (
    <div className="relative h-12 w-full rounded-xl bg-slate-950 border border-white/10 overflow-hidden group">
      {/* Background segments */}
      <div className="absolute inset-0 opacity-60">
        {bgSegments.map((seg, i) => (
          <div key={i} className="absolute inset-y-0" 
            style={{ 
              left: `${(seg.start / 24) * 100}%`, 
              width: `${((seg.end - seg.start) / 24) * 100}%`, 
              backgroundColor: seg.color 
            }} 
          />
        ))}
      </div>
      
      {/* Tick Marks */}
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hr) => (
        <div key={hr} className="absolute inset-y-0 w-px bg-white/10" style={{ left: `${(hr / 24) * 100}%` }}>
           {hr !== 0 && hr !== 24 && <span className="absolute bottom-1 -translate-x-1/2 text-[10px] text-slate-500 font-mono hidden sm:block">{hr}:00</span>}
        </div>
      ))}
      
      {/* Interactive scrubber visual */}
      <motion.div 
        className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center z-10 pointer-events-none"
        animate={{ left: `${posPercent}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      >
        <div className="w-0.5 h-full bg-indigo-400" />
        <div className="absolute w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-1 h-2 rounded-[1px] bg-white/50" />
        </div>
      </motion.div>
      
      {/* Native Range Input for seamless scrubbing */}
      <input 
        type="range"
        min="0" max="24" step="0.25"
        value={hour}
        onChange={(e) => onChangeTime(tz, parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0"
        title="Drag to change time"
      />
    </div>
  );
}

function AddTZPanel({ allZones, selected, onAdd, onClose }: any) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = allZones.filter((tz: string) => {
    const q = search.toLowerCase();
    return tz.toLowerCase().includes(q) || getLabel(tz).toLowerCase().includes(q) || getRegion(tz).toLowerCase().includes(q);
  }).slice(0, 80);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="p-3 border-b border-white/10 relative">
        <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
        <input ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search city or timezone…" className="w-full bg-slate-800 border border-white/10 text-white pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-indigo-500/50" />
      </div>
      <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
        {filtered.map((tz: string) => {
          const isAdded = selected.includes(tz);
          return (
            <button key={tz} onClick={() => { if (!isAdded) { onAdd(tz); onClose(); } }} disabled={isAdded} className={`w-full px-4 py-3 text-left hover:bg-white/5 transition flex justify-between ${isAdded ? "opacity-40" : ""}`}>
              <div><span className="text-white text-sm block font-medium">{getLabel(tz)}</span><span className="text-slate-500 text-xs mt-0.5">{tz}</span></div>
              {isAdded && <span className="text-xs text-indigo-400 font-medium">Added</span>}
            </button>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No results found.</p>}
      </div>
    </motion.div>
  );
}

export default function TimezonePage() {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [zonesLoaded, setZonesLoaded] = useState(false);
  const [refDate, setRefDate] = useState(() => new Date());
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const addPanelRef = useRef<HTMLDivElement>(null);
  const allZones = moment.tz.names();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saved-timezones");
      if (saved) {
        try {
          setSelectedZones(JSON.parse(saved));
        } catch {
          setSelectedZones(DEFAULT_ZONES);
        }
      } else {
        setSelectedZones(DEFAULT_ZONES);
      }
      setZonesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (zonesLoaded && typeof window !== "undefined") {
      localStorage.setItem("saved-timezones", JSON.stringify(selectedZones));
    }
  }, [selectedZones, zonesLoaded]);

  useEffect(() => {
    if (!isCustomTime) {
      intervalRef.current = setInterval(() => setRefDate(new Date()), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isCustomTime]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (addPanelRef.current && !addPanelRef.current.contains(e.target as Node)) setShowAdd(false); };
    if (showAdd) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAdd]);

  const removeZone = (tz: string) => setSelectedZones((prev) => prev.filter((z) => z !== tz));
  
  const moveZoneUp = (idx: number) => {
    if (idx <= 0) return;
    const newZones = [...selectedZones];
    [newZones[idx - 1], newZones[idx]] = [newZones[idx], newZones[idx - 1]];
    setSelectedZones(newZones);
  };

  const moveZoneDown = (idx: number) => {
    if (idx >= selectedZones.length - 1) return;
    const newZones = [...selectedZones];
    [newZones[idx + 1], newZones[idx]] = [newZones[idx], newZones[idx + 1]];
    setSelectedZones(newZones);
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("tzIndex", idx.toString());
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDragLeave = () => setDragOverIdx(null);
  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    const sourceIdx = Number(e.dataTransfer.getData("tzIndex"));
    if (isNaN(sourceIdx) || sourceIdx === targetIdx) return;
    const newZones = [...selectedZones];
    const [moved] = newZones.splice(sourceIdx, 1);
    newZones.splice(targetIdx, 0, moved);
    setSelectedZones(newZones);
  };

  const handleTimeChange = (tz: string, setHour: number) => {
    setIsCustomTime(true);
    const m = moment.tz(refDate, tz);
    let hours = Math.floor(setHour);
    let minutes = Math.floor((setHour - hours) * 60);
    
    // Prevent dragging to exactly 24:00 which rolls over to the next day
    if (hours === 24) {
      hours = 23;
      minutes = 59;
    }
    
    m.hours(hours).minutes(minutes).seconds(0).milliseconds(0);
    setRefDate(m.toDate());
  };

  const shiftDate = (days: number) => {
    setIsCustomTime(true);
    setRefDate(new Date(refDate.getTime() + days * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Navbar Header */}
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center"><Globe className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">World Clock</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Date picker — always visible */}
            <div className="flex items-center gap-2 bg-slate-800 border border-white/10 px-3 py-2 rounded-xl">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Date:</span>
              <input
                type="date"
                value={refDate.toISOString().slice(0, 10)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  const [y, m, d] = e.target.value.split("-").map(Number);
                  const next = new Date(refDate);
                  next.setFullYear(y, m - 1, d);
                  setRefDate(next);
                  setIsCustomTime(true);
                }}
                className="bg-transparent text-white text-xs outline-none cursor-pointer [color-scheme:dark]"
              />
              {isCustomTime && (
                <button onClick={() => { setIsCustomTime(false); setRefDate(new Date()); }}
                  className="ml-1 px-2 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-bold hover:bg-indigo-400 transition-colors flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Live
                </button>
              )}
            </div>

            <div className="relative" ref={addPanelRef}>
              <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-all text-sm font-medium">
                <Plus className="w-4 h-4" /> Add <span className="hidden sm:inline">Timezone</span>
              </button>
              <AnimatePresence>{showAdd && <AddTZPanel allZones={allZones} selected={selectedZones} onAdd={(tz: string) => setSelectedZones([...selectedZones, tz])} onClose={() => setShowAdd(false)} />}</AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <p className="text-slate-400 mb-6 max-w-lg leading-relaxed">
          The ultimate timezone converter. <strong className="text-white font-medium">Drag the scrubber bar</strong> on any city below to change the time and see how it reflects across every zone.
        </p>

        {/* Quick Reorder Bar */}
        {zonesLoaded && selectedZones.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 p-3.5 bg-slate-900 border border-white/5 rounded-2xl items-center sticky top-24 z-30 shadow-xl shadow-slate-950/50 backdrop-blur-md">
            <span className="text-[10px] font-black text-slate-500 mr-2 tracking-wider">QUICK REORDER:</span>
            <AnimatePresence>
              {selectedZones.map((tz, idx) => (
                <motion.div layout key={tz} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, idx)}
                  onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, idx)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e as unknown as React.DragEvent, idx)}
                  className={`flex items-center gap-1.5 border rounded-xl pl-3 pr-2 py-1.5 text-xs font-semibold shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                    dragOverIdx === idx ? "border-amber-400 bg-amber-400/10 scale-105" : "bg-slate-950 border-white/10 text-slate-300 hover:border-white/20"
                  }`}
                >
                   <span className="mr-1">{getLabel(tz)}</span>
                   <div className="flex items-center bg-slate-900 rounded-lg border border-white/5 overflow-hidden">
                      <button onClick={() => moveZoneUp(idx)} disabled={idx===0} className="hover:bg-slate-700/80 hover:text-white disabled:opacity-20 flex-1 px-1.5 py-1 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <button onClick={() => moveZoneDown(idx)} disabled={idx===selectedZones.length-1} className="hover:bg-slate-700/80 hover:text-white disabled:opacity-20 flex-1 px-1.5 py-1 transition-colors border-l border-white/5"><ChevronRight className="w-3.5 h-3.5" /></button>
                   </div>
                   <button onClick={() => removeZone(tz)} className="ml-1 p-1 text-slate-500 hover:text-red-400 hover:bg-red-400/15 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {zonesLoaded && (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
            {selectedZones.map((tz, index) => {
              const m = moment(refDate).tz(tz);
              const hour = m.hour() + m.minute() / 60;
              const status = getStatus(hour);
              const isToday = m.format("L") === moment().tz(tz).format("L");
              
              return (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={tz}
                  className="bg-slate-900 border border-white/10 rounded-3xl p-5 md:p-6 transition-all hover:bg-slate-800/80 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    {/* Timezone Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl md:text-2xl font-black text-white">{getLabel(tz)}</h2>
                        <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-md border font-medium uppercase tracking-wider ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">{getRegion(tz)} <span className="text-slate-600 mx-1">•</span> UTC {m.format("Z")} {m.isDST() ? <span className="text-amber-500 font-bold ml-1 text-xs">DST</span> : ""}</p>
                    </div>
                    
                    {/* Digital Clock */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">
                          {m.format("HH:mm")}
                        </span>
                        <span className={`text-xl font-mono hidden sm:inline-block ${isCustomTime ? "text-slate-700" : "text-slate-500"}`}>
                          {!isCustomTime ? m.format("ss") : "--"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isToday && !isCustomTime ? "text-emerald-400" : "text-indigo-300"}`}>
                          {m.format("ddd, MMMM D")}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                          {index > 0 && <button onClick={() => moveZoneUp(index)} className="p-1.5 text-slate-500 hover:bg-white/10 hover:text-white rounded-lg transition-colors"><ChevronUp className="w-4 h-4" /></button>}
                          {index < selectedZones.length - 1 && <button onClick={() => moveZoneDown(index)} className="p-1.5 text-slate-500 hover:bg-white/10 hover:text-white rounded-lg transition-colors"><ChevronDown className="w-4 h-4" /></button>}
                          <button onClick={() => removeZone(tz)} className="p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* The Live Interactive Scrubber Timeline */}
                  <InteractiveTimeline tz={tz} refDate={refDate} onChangeTime={handleTimeChange} />
                  
                  {/* Mobile move and remove buttons */}
                  <div className="mt-3 sm:hidden flex justify-between items-center">
                    <div className="flex gap-1">
                      {index > 0 && <button onClick={() => moveZoneUp(index)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors active:scale-95"><ChevronUp className="w-4 h-4" /></button>}
                      {index < selectedZones.length - 1 && <button onClick={() => moveZoneDown(index)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors active:scale-95"><ChevronDown className="w-4 h-4" /></button>}
                    </div>
                    <button onClick={() => removeZone(tz)} className="text-xs font-semibold text-slate-500 hover:text-red-400 px-4 py-2 rounded-lg border border-transparent hover:border-red-500/20 active:bg-red-500/10 transition-all">
                      Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
