"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Hash, FileText, QrCode, Braces, BarChart2, Timer, Globe,
  Zap, ArrowRight, Sparkles, Keyboard, Regex, ImageIcon, Music, Code2
} from "lucide-react";

import { SectionHeader } from "./ui/SectionHeader";

const tools = [
  {
    id: "chat",
    title: "Instant Chat",
    description: "Real-time room by URL. Share the link, start talking.",
    icon: Hash,
    href: "/tools/chat",
    gradient: "from-violet-500 to-indigo-600",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-500/40",
    beam: "from-violet-500/0 via-violet-500/30 to-violet-500/0",
    tag: "Real-time",
  },
  {
    id: "notes",
    title: "Shared Notes",
    description: "Live collaborative notepad. No account needed.",
    icon: FileText,
    href: "/tools/notes",
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/40",
    beam: "from-emerald-500/0 via-emerald-500/30 to-emerald-500/0",
    tag: "Real-time",
  },
  {
    id: "poll",
    title: "Instant Poll",
    description: "Quick vote, live results, just a shareable URL.",
    icon: BarChart2,
    href: "/tools/poll",
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "group-hover:shadow-fuchsia-500/20",
    border: "group-hover:border-fuchsia-500/40",
    beam: "from-fuchsia-500/0 via-fuchsia-500/30 to-fuchsia-500/0",
    tag: "Real-time",
  },
  {
    id: "timer",
    title: "Shared Timer",
    description: "Countdown everyone sees at once. Perfect for standups.",
    icon: Timer,
    href: "/tools/timer",
    gradient: "from-orange-500 to-red-600",
    glow: "group-hover:shadow-orange-500/20",
    border: "group-hover:border-orange-500/40",
    beam: "from-orange-500/0 via-orange-500/30 to-orange-500/0",
    tag: "Real-time",
  },
  {
    id: "qr",
    title: "QR Generator",
    description: "WiFi, vCard, Email & URL templates. Custom colors and logo.",
    icon: QrCode,
    href: "/tools/qr",
    gradient: "from-sky-500 to-blue-600",
    glow: "group-hover:shadow-sky-500/20",
    border: "group-hover:border-sky-500/40",
    beam: "from-sky-500/0 via-sky-500/30 to-sky-500/0",
    tag: "Browser",
  },
  {
    id: "json",
    title: "JSON Formatter",
    description: "Format, validate, diff two JSONs, and explore as a tree.",
    icon: Braces,
    href: "/tools/json",
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/20",
    border: "group-hover:border-amber-500/40",
    beam: "from-amber-500/0 via-amber-500/30 to-amber-500/0",
    tag: "Browser",
  },
  {
    id: "timezone",
    title: "World Clock",
    description: "Live clocks for every timezone with work-status indicators.",
    icon: Globe,
    href: "/tools/timezone",
    gradient: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/40",
    beam: "from-cyan-500/0 via-cyan-500/30 to-cyan-500/0",
    tag: "Browser",
  },
  {
    id: "typing",
    title: "Typing Speed Test",
    description: "Time & word modes, live WPM chart, Zen mode. Tab = new quote.",
    icon: Keyboard,
    href: "/tools/typing",
    gradient: "from-green-500 to-emerald-600",
    glow: "group-hover:shadow-green-500/20",
    border: "group-hover:border-green-500/40",
    beam: "from-green-500/0 via-green-500/30 to-green-500/0",
    tag: "Browser",
  },
  {
    id: "regex",
    title: "Regex Tester",
    description: "Live highlights, plain-English explainer, code export, unit tests.",
    icon: Regex,
    href: "/tools/regex",
    gradient: "from-violet-600 to-purple-700",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-500/40",
    beam: "from-violet-500/0 via-violet-500/30 to-violet-500/0",
    tag: "Dev",
  },
  {
    id: "imagecompress",
    title: "Image Compressor",
    description: "Before/after drag slider, bulk 20 images, JPEG/WebP/PNG.",
    icon: ImageIcon,
    href: "/tools/imagecompress",
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/20",
    border: "group-hover:border-amber-500/40",
    beam: "from-amber-500/0 via-amber-500/30 to-amber-500/0",
    tag: "Browser",
  },
  {
    id: "metronome",
    title: "Metronome",
    description: "Sample-accurate timing, tap tempo, subdivisions, flash mode.",
    icon: Music,
    href: "/tools/metronome",
    gradient: "from-violet-500 to-indigo-700",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-500/40",
    beam: "from-violet-500/0 via-violet-500/30 to-violet-500/0",
    tag: "Browser",
  },
  {
    id: "markdown",
    title: "Markdown Editor",
    description: "Live preview, bidirectional scroll sync, styled HTML export.",
    icon: Code2,
    href: "/tools/markdown",
    gradient: "from-indigo-500 to-violet-700",
    glow: "group-hover:shadow-indigo-500/20",
    border: "group-hover:border-indigo-500/40",
    beam: "from-indigo-500/0 via-indigo-500/30 to-indigo-500/0",
    tag: "Browser",
  },
];


export const Tools = () => {
  return (
    <section id="tools" className="py-32 relative overflow-hidden">
      {/* Background treatment — distinct from other sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/10 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_50%,rgba(99,102,241,0.06),transparent)]" />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader title="Micro Tools" watermark="TOOLBOX" alignment="center" />

        {/* Subtitle + badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center -mt-10 mb-16 gap-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            No login · No signup · Just open and use
          </div>
          <p className="text-neutral-300 text-lg max-w-2xl text-center leading-relaxed">
            Everyday tools that are actually useful — instantly. No login, no setup, just open and go.
          </p>
        </motion.div>

        {/* Tools grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tools.slice(0, 8).map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } } }}
              >
                <Link href={tool.href} className="group relative flex flex-col h-full">
                  {/* Card */}
                  <div className={`relative flex flex-col h-full bg-slate-900/60 backdrop-blur-sm border border-white/[0.07] ${tool.border} rounded-2xl p-6 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl ${tool.glow}`}>

                    {/* Shimmer beam on hover */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className={`absolute -top-px left-0 right-0 h-px bg-gradient-to-r ${tool.beam} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>

                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                        {tool.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${tool.tag === "Real-time"
                          ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                          : tool.tag === "Dev"
                            ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                            : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                        }`}>
                        {tool.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-[13px] leading-relaxed flex-1 group-hover:text-slate-300 transition-colors">
                      {tool.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-white transition-colors">
                      Open Tool
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 hover:border-indigo-500/40 transition-all duration-300 font-semibold text-sm group"
          >
            <Sparkles className="w-4 h-4" />
            Explore All Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-slate-600 text-xs mt-3">No accounts · No Tracking · No Worries</p>
        </motion.div>
      </div>
    </section>
  );
};
