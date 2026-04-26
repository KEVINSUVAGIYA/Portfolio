"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, X, Globe, Clock } from "lucide-react";
import Link from "next/link";
import moment from "moment-timezone";

function getLabel(tz: string) {
  return tz.split("/").pop()?.replace(/_/g, " ") || tz;
}

function getWorkScore(hour: number): { label: string; color: string; bg: string } {
  if (hour < 6 || hour >= 23) return { label: "Sleeping", color: "text-slate-500", bg: "bg-slate-800" };
  if (hour < 8) return { label: "Early", color: "text-blue-400", bg: "bg-blue-500/10" };
  if (hour < 9) return { label: "Waking up", color: "text-yellow-400", bg: "bg-yellow-500/10" };
  if (hour >= 9 && hour < 12) return { label: "Peak AM", color: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (hour >= 12 && hour < 14) return { label: "Lunch", color: "text-amber-400", bg: "bg-amber-500/10" };
  if (hour >= 14 && hour < 18) return { label: "Afternoon", color: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (hour >= 18 && hour < 20) return { label: "Evening", color: "text-orange-400", bg: "bg-orange-500/10" };
  if (hour >= 20 && hour < 23) return { label: "Late", color: "text-red-400", bg: "bg-red-500/10" };
  return { label: "Asleep", color: "text-slate-500", bg: "bg-slate-800" };
}

// Full timezone list from moment-timezone
const ALL_ZONES = moment.tz.names();

const POPULAR_ZONES = [
  "America/New_York", "America/Los_Angeles", "America/Chicago", "America/Denver",
  "America/Toronto", "America/Vancouver", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "Europe/Madrid", "Asia/Dubai", "Asia/Kolkata",
  "Asia/Singapore", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney",
  "Pacific/Auckland", "Africa/Johannesburg", "America/Sao_Paulo", "Asia/Seoul",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CELL_W = 32; // px per cell

export default function MeetingPlannerPage() {
  const [zones, setZones] = useState(["America/New_York", "Europe/London", "Asia/Kolkata"]);
  const [baseZone, setBaseZone] = useState("America/New_York");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAdding(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addZone = (tz: string) => {
    if (!zones.includes(tz) && zones.length < 10) setZones(z => [...z, tz]);
    setAdding(false); setSearch("");
  };

  const removeZone = (tz: string) => {
    setZones(z => z.filter(x => x !== tz));
    if (baseZone === tz) setBaseZone(zones.find(z => z !== tz) || "UTC");
  };

  // Find best overlap hours (all zones 9–17)
  const goodHours = HOURS.filter(h => {
    const baseTime = moment().tz(baseZone).startOf("day").add(h, "hours");
    return zones.every(tz => {
      const localHour = moment(baseTime).tz(tz).hour();
      return localHour >= 9 && localHour < 18;
    });
  });

  // Search across ALL timezones (not just popular)
  const filtered = (search
    ? ALL_ZONES.filter(z =>
        z.toLowerCase().includes(search.toLowerCase()) ||
        getLabel(z).toLowerCase().includes(search.toLowerCase())
      )
    : POPULAR_ZONES
  ).filter(z => !zones.includes(z)).slice(0, 20);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-700 flex items-center justify-center"><Globe className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Meeting Planner</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-white mb-1">Meeting Time Planner</h1>
            <p className="text-slate-400 text-sm">Find the best overlap window across multiple timezones.</p>
          </motion.div>
          <div className="flex gap-3 items-center">
            <label className="text-xs text-slate-500">Base zone:</label>
            <select value={baseZone} onChange={e => setBaseZone(e.target.value)}
              className="bg-slate-800 border border-white/10 text-white px-3 py-2 rounded-xl text-xs outline-none"
            >
              {zones.map(z => <option key={z} value={z}>{getLabel(z)}</option>)}
            </select>
          </div>
        </div>

        {/* Best times banner */}
        {goodHours.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mr-2">✅ Optimal windows:</span>
            {goodHours.map(h => {
              const baseTime = moment().tz(baseZone).startOf("day").add(h, "hours");
              return (
                <button key={h} onClick={() => setSelectedHour(h === selectedHour ? null : h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${selectedHour === h ? "bg-emerald-500 text-white" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"}`}
                >
                  {baseTime.format("h:mm A")}
                </button>
              );
            })}
          </div>
        )}
        {goodHours.length === 0 && zones.length >= 2 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-red-400 text-sm font-semibold">⚠️ No overlapping business hours found. Consider async communication or an early/late call.</p>
          </div>
        )}

        {/* Hour heatmap grid */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 overflow-x-auto">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">24-hour overlap grid (base: {getLabel(baseZone)})</p>
          <div className="space-y-2 min-w-max">
            {zones.map(tz => {
              const label = getLabel(tz);
              return (
                <div key={tz} className="flex items-center gap-2">
                  <div className="w-28 text-right text-xs text-slate-400 font-semibold pr-2 truncate">{label}</div>
                  <div className="flex gap-0.5">
                    {HOURS.map(h => {
                      const baseTime = moment().tz(baseZone).startOf("day").add(h, "hours");
                      const localTime = moment(baseTime).tz(tz);
                      const localHour = localTime.hour();
                      const status = getWorkScore(localHour);
                      const isSelected = selectedHour === h;
                      return (
                        <button key={h} onClick={() => setSelectedHour(h === selectedHour ? null : h)}
                          className={`w-8 h-8 rounded text-[10px] font-bold transition-all border ${isSelected ? "border-sky-400 scale-110 z-10 relative" : "border-transparent"} ${status.bg} ${status.color} hover:scale-110`}
                          title={`${localTime.format("h:mm A")}`}
                        >
                          {localHour}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Hour labels — fixed math (no string arithmetic) */}
            <div className="flex items-center gap-2">
              <div className="w-28" />
              <div className="flex">
                {HOURS.map(h => (
                  <div key={h} className="text-[9px] text-slate-700 text-center" style={{ width: CELL_W + 2, marginRight: h % 3 === 2 ? CELL_W * 2 + 4 : 0 }}>
                    {h % 3 === 0 ? `${h}h` : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5 text-[10px]">
            {[{ bg:"bg-emerald-500/10", color:"text-emerald-400", label:"Business hours" }, { bg:"bg-amber-500/10", color:"text-amber-400", label:"Lunch/Evening" }, { bg:"bg-red-500/10", color:"text-red-400", label:"Late night" }, { bg:"bg-slate-800", color:"text-slate-500", label:"Sleeping" }].map(({ bg, color, label }) => (
              <span key={label} className={`flex items-center gap-1.5 ${color}`}><span className={`w-3 h-3 rounded ${bg} inline-block`} />{label}</span>
            ))}
          </div>
        </div>

        {/* Selected hour detail */}
        <AnimatePresence>
          {selectedHour !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-sky-400 font-bold text-sm">{selectedHour}:00 in {getLabel(baseZone)}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {zones.map(tz => {
                  const baseTime = moment().tz(baseZone).startOf("day").add(selectedHour, "hours");
                  const localTime = moment(baseTime).tz(tz);
                  const status = getWorkScore(localTime.hour());
                  return (
                    <div key={tz} className={`border rounded-xl p-3 ${status.bg} border-white/5`}>
                      <div className="text-xs text-slate-500 mb-1">{getLabel(tz)}</div>
                      <div className="text-white font-bold font-mono">{localTime.format("h:mm A")}</div>
                      <div className={`text-[11px] font-semibold mt-1 ${status.color}`}>{status.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {zones.map(tz => (
            <div key={tz} className="flex items-center gap-1.5 bg-slate-800 border border-white/10 rounded-full pl-3 pr-1.5 py-1">
              <span className="text-xs text-slate-300 font-semibold">{getLabel(tz)}</span>
              <button onClick={() => removeZone(tz)} className="text-slate-600 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {zones.length < 10 && (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-white/20 text-slate-500 hover:text-white text-xs transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add zone
              </button>
              <AnimatePresence>
                {adding && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full mt-2 left-0 w-72 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search any timezone..."
                      className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none border-b border-white/10 placeholder:text-slate-600"
                    />
                    <div className="max-h-52 overflow-y-auto">
                      {filtered.map(z => (
                        <button key={z} onClick={() => addZone(z)} className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/5 transition-colors flex justify-between">
                          <span>{getLabel(z)}</span><span className="text-slate-600 text-xs">{z.split("/")[0]}</span>
                        </button>
                      ))}
                      {filtered.length === 0 && <p className="px-4 py-3 text-slate-600 text-sm">No matching timezones</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
