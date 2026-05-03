"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Hash, FileText, QrCode, Braces, BarChart2, Timer, Globe,
  Zap, ArrowRight, ArrowLeft, Keyboard, Pipette, Regex, FileCode,
  ImageIcon, Shuffle, Music, Calculator,
  Map, Pencil, Code2
} from "lucide-react";

const tools = [
  // Real-time
  {
    id: "chat", title: "Instant Chat",
    description: "Real-time chat room via a shared URL. No signup, no server.",
    icon: Hash, href: "/tools/chat",
    color: "from-violet-500 to-indigo-600", glow: "rgba(139,92,246,0.3)",
    border: "group-hover:border-violet-500/40", tag: "Real-time",
    tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "notes", title: "Shared Notes",
    description: "Live-synced text pad. Share the URL and type together in real-time.",
    icon: FileText, href: "/tools/notes",
    color: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.3)",
    border: "group-hover:border-emerald-500/40", tag: "Real-time",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "poll", title: "Instant Poll",
    description: "Create a quick poll and share. Votes appear live across all devices.",
    icon: BarChart2, href: "/tools/poll",
    color: "from-fuchsia-500 to-purple-600", glow: "rgba(217,70,239,0.3)",
    border: "group-hover:border-fuchsia-500/40", tag: "Real-time",
    tagColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    id: "timer", title: "Shared Timer",
    description: "Countdown timer everyone on the same URL sees simultaneously.",
    icon: Timer, href: "/tools/timer",
    color: "from-orange-500 to-red-600", glow: "rgba(249,115,22,0.3)",
    border: "group-hover:border-orange-500/40", tag: "Real-time",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  // Browser tools
  {
    id: "qr", title: "QR Generator",
    description: "5 templates: URL, WiFi (WPA/open), vCard contact, Email. Custom colors, logo, dot styles.",
    icon: QrCode, href: "/tools/qr",
    color: "from-sky-500 to-blue-600", glow: "rgba(14,165,233,0.3)",
    border: "group-hover:border-sky-500/40", tag: "Browser",
    tagColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "json", title: "JSON Formatter",
    description: "Format, minify, validate, diff two JSONs side-by-side, search keys/values, interactive tree.",
    icon: Braces, href: "/tools/json",
    color: "from-amber-500 to-orange-600", glow: "rgba(245,158,11,0.3)",
    border: "group-hover:border-amber-500/40", tag: "Browser",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "timezone", title: "World Clock",
    description: "Live clocks across every timezone. Pin zones, drag to reorder.",
    icon: Globe, href: "/tools/timezone",
    color: "from-cyan-500 to-blue-600", glow: "rgba(6,182,212,0.3)",
    border: "group-hover:border-cyan-500/40", tag: "Browser",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "typing", title: "Typing Speed Test",
    description: "Time & word modes, live WPM chart, color-coded character display, Zen mode. Tab = new quote.",
    icon: Keyboard, href: "/tools/typing",
    color: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.3)",
    border: "group-hover:border-green-500/40", tag: "Browser",
    tagColor: "text-green-400 bg-green-500/10 border-green-500/20",
  },
  {
    id: "palette", title: "Color Palette",
    description: "Generate palettes, WCAG contrast checker (AAA/AA/Fail), colorblind simulator, CSS vars copy.",
    icon: Pipette, href: "/tools/palette",
    color: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.3)",
    border: "group-hover:border-pink-500/40", tag: "Browser",
    tagColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  {
    id: "regex", title: "Regex Tester",
    description: "Live highlights, plain-English explainer, JS/Python/Go/Java code export, unit tests.",
    icon: Regex, href: "/tools/regex",
    color: "from-violet-600 to-purple-700", glow: "rgba(139,92,246,0.3)",
    border: "group-hover:border-violet-500/40", tag: "Dev",
    tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "encoder", title: "Encoder / Decoder",
    description: "Base64, URL, JWT inspector with signature verify — fully client-side.",
    icon: FileCode, href: "/tools/encoder",
    color: "from-cyan-500 to-blue-700", glow: "rgba(6,182,212,0.3)",
    border: "group-hover:border-cyan-500/40", tag: "Dev",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "imagecompress", title: "Image Compressor",
    description: "Before/after drag slider, bulk up to 20 images, JPEG/WebP/PNG — nothing uploaded.",
    icon: ImageIcon, href: "/tools/imagecompress",
    color: "from-amber-500 to-orange-600", glow: "rgba(245,158,11,0.3)",
    border: "group-hover:border-amber-500/40", tag: "Browser",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "spinner", title: "Decision Spinner",
    description: "Spin with ticking sounds & confetti. Auto-remove winners. CSV import.",
    icon: Shuffle, href: "/tools/spinner",
    color: "from-fuchsia-500 to-violet-700", glow: "rgba(217,70,239,0.3)",
    border: "group-hover:border-fuchsia-500/40", tag: "Fun",
    tagColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    id: "metronome", title: "Metronome",
    description: "Sample-accurate Web Audio timing, tap tempo, subdivisions (8th/triplet/16th), flash & volume.",
    icon: Music, href: "/tools/metronome",
    color: "from-violet-500 to-indigo-700", glow: "rgba(99,102,241,0.3)",
    border: "group-hover:border-violet-500/40", tag: "Browser",
    tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "calc", title: "Programmer Calc",
    description: "HEX/DEC/OCT/BIN, 8/16/32/64-bit word sizes, ROL/ROR shifts, ASCII lookup, bit viewer.",
    icon: Calculator, href: "/tools/calc",
    color: "from-slate-500 to-slate-700", glow: "rgba(100,116,139,0.3)",
    border: "group-hover:border-slate-500/40", tag: "Dev",
    tagColor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  },
  {
    id: "meeting", title: "Meeting Planner",
    description: "Visual 24h overlap grid across timezones. Find the perfect meeting slot instantly.",
    icon: Map, href: "/tools/meeting",
    color: "from-sky-500 to-cyan-700", glow: "rgba(14,165,233,0.3)",
    border: "group-hover:border-sky-500/40", tag: "Browser",
    tagColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "whiteboard", title: "Whiteboard",
    description: "Draw, add text, shapes, arrows. Keyboard shortcuts. Undo. Export PNG.",
    icon: Pencil, href: "/tools/whiteboard",
    color: "from-orange-500 to-red-700", glow: "rgba(249,115,22,0.3)",
    border: "group-hover:border-orange-500/40", tag: "Real-time",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "markdown", title: "Markdown Editor",
    description: "Live preview, bidirectional scroll sync, reading time estimate, full-CSS HTML export.",
    icon: Code2, href: "/tools/markdown",
    color: "from-indigo-500 to-violet-700", glow: "rgba(99,102,241,0.3)",
    border: "group-hover:border-indigo-500/40", tag: "Browser",
    tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
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
      {/* Top Nav */}
      <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Portfolio
          </Link>
        </div>
      </div>

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
              18 genuinely useful everyday tools. All run client-side — nothing uploaded, no account needed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
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

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-700 mt-12"
        >
          No accounts · No Tracking · No Worries
        </motion.p>
      </div>
    </div>
  );
}
