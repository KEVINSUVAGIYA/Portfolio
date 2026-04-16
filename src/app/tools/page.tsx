"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Hash, FileText, QrCode, ShieldCheck, Braces, BarChart2, Timer, Globe,
  Zap, ArrowRight
} from "lucide-react";

const tools = [
  {
    id: "chat",
    title: "Instant Chat",
    description: "Real-time chat room via a shared URL. No signup, no server.",
    icon: Hash,
    href: "/tools/chat",
    color: "from-violet-500 to-indigo-600",
    glow: "rgba(139,92,246,0.3)",
    border: "group-hover:border-violet-500/40",
    tag: "Real-time",
    tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "notes",
    title: "Shared Notes",
    description: "Live-synced text pad. Share the URL and type together.",
    icon: FileText,
    href: "/tools/notes",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
    border: "group-hover:border-emerald-500/40",
    tag: "Real-time",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "poll",
    title: "Instant Poll",
    description: "Create a quick poll and share. Votes appear live.",
    icon: BarChart2,
    href: "/tools/poll",
    color: "from-fuchsia-500 to-purple-600",
    glow: "rgba(217,70,239,0.3)",
    border: "group-hover:border-fuchsia-500/40",
    tag: "Real-time",
    tagColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    id: "timer",
    title: "Shared Timer",
    description: "Countdown timer everyone on the URL sees simultaneously.",
    icon: Timer,
    href: "/tools/timer",
    color: "from-orange-500 to-red-600",
    glow: "rgba(249,115,22,0.3)",
    border: "group-hover:border-orange-500/40",
    tag: "Real-time",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "qr",
    title: "QR Generator",
    description: "Generate QR codes with custom colors. Download as PNG.",
    icon: QrCode,
    href: "/tools/qr",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.3)",
    border: "group-hover:border-sky-500/40",
    tag: "Offline",
    tagColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "password",
    title: "Password Generator",
    description: "Cryptographically secure passwords. Runs entirely in your browser.",
    icon: ShieldCheck,
    href: "/tools/password",
    color: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.3)",
    border: "group-hover:border-rose-500/40",
    tag: "Offline",
    tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  {
    id: "json",
    title: "JSON Formatter",
    description: "Format, validate, and explore JSON as an interactive tree.",
    icon: Braces,
    href: "/tools/json",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
    border: "group-hover:border-amber-500/40",
    tag: "Offline",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "timezone",
    title: "World Clock",
    description: "Live clocks across every timezone with meeting-friendly status.",
    icon: Globe,
    href: "/tools/timezone",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.3)",
    border: "group-hover:border-cyan-500/40",
    tag: "Offline",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="border-b border-white/10 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              No login · No signup · Just open and use
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Free Tools,<br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                No Strings Attached
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A collection of genuinely useful everyday tools. Real-time tools use Gun.js — fully decentralized, no server needed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} variants={cardVariants}>
                <Link href={tool.href} className="group relative flex flex-col h-full">
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${tool.glow}, transparent)` }}
                  />
                  <div className={`relative flex flex-col h-full bg-slate-900/70 border border-white/10 ${tool.border} rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-bold text-sm leading-tight">{tool.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${tool.tagColor}`}>
                        {tool.tag}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed flex-1">{tool.description}</p>
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-white transition-colors">
                      Open Tool
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-700 mt-12"
        >
          Real-time tools are powered by Gun.js (decentralized P2P) · No accounts · No servers · No tracking
        </motion.p>
      </div>
    </div>
  );
}
