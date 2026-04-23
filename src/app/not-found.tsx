"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home, Wrench, Gamepad2, Briefcase, Mail,
  ArrowLeft, ArrowRight, Star, Layers
} from "lucide-react";

/* ── Starfield canvas ─────────────────────────────────────── */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STARS = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.18 + 0.04,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() / 1000;
      for (const s of STARS) {
        s.twinkle += 0.015;
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height + 2) {
          s.y = -2;
          s.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── Glitch text ──────────────────────────────────────────── */
function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const schedule = () => {
      const delay = 2500 + Math.random() * 4000;
      setTimeout(() => {
        setGlitching(true);
        setTimeout(() => { setGlitching(false); schedule(); }, 350);
      }, delay);
    };
    schedule();
  }, []);

  return (
    <div className="relative select-none inline-block">
      {/* Main text */}
      <span className="relative z-10 text-[clamp(100px,22vw,200px)] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
        {text}
      </span>
      {/* Glitch layer 1 — red/left */}
      <span
        className="absolute inset-0 text-[clamp(100px,22vw,200px)] font-black leading-none tracking-tighter text-red-400/60 transition-none"
        style={{
          clipPath: glitching ? "inset(20% 0 50% 0)" : "inset(50% 0 50% 0)",
          transform: glitching ? "translate(-4px, 2px)" : "none",
          transition: "none",
        }}
        aria-hidden
      >{text}</span>
      {/* Glitch layer 2 — cyan/right */}
      <span
        className="absolute inset-0 text-[clamp(100px,22vw,200px)] font-black leading-none tracking-tighter text-cyan-400/60 transition-none"
        style={{
          clipPath: glitching ? "inset(55% 0 20% 0)" : "inset(50% 0 50% 0)",
          transform: glitching ? "translate(4px, -2px)" : "none",
          transition: "none",
        }}
        aria-hidden
      >{text}</span>
    </div>
  );
}

/* ── Quick links ──────────────────────────────────────────── */
const LINKS = [
  {
    href: "/",
    label: "Homepage",
    sub: "Back to the main portfolio",
    icon: Home,
    gradient: "from-violet-500 to-indigo-600",
    glow: "rgba(139,92,246,0.35)",
    primary: true,
  },
  {
    href: "/tools",
    label: "Free Tools",
    sub: "18 browser utilities",
    icon: Wrench,
    gradient: "from-cyan-500 to-sky-600",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    href: "/products",
    label: "Products",
    sub: "Apps I've shipped",
    icon: Layers,
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.3)",
  },
  {
    href: "/playground",
    label: "Playground",
    sub: "Interactive experiments",
    icon: Gamepad2,
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    href: "/#projects",
    label: "Projects",
    sub: "Portfolio work",
    icon: Briefcase,
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    href: "/#contact",
    label: "Contact",
    sub: "Get in touch",
    icon: Mail,
    gradient: "from-rose-500 to-red-600",
    glow: "rgba(239,68,68,0.3)",
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      {/* Starfield */}
      <Starfield />

      {/* Radial glow behind 404 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-2"
        >
          <GlitchText text="404" />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-medium mb-4">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            Lost in the void
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            This page doesn&apos;t exist
          </h1>
          <p className="text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
            You may have followed a broken link, mistyped a URL, or the page has moved. Here are some places to explore instead.
          </p>
        </motion.div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"
        />

        {/* Quick links grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full"
        >
          {LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
              >
                <Link href={link.href}
                  className={`group relative flex flex-col items-start gap-2 rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden ${
                    link.primary
                      ? "bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border-violet-500/30 hover:border-violet-400/50"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 30% 50%, ${link.glow}, transparent 70%)` }}
                  />
                  <div className={`relative z-10 w-9 h-9 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="relative z-10 text-left">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-sm ${link.primary ? "text-white" : "text-slate-200"}`}>
                        {link.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 group-hover:text-slate-400 transition-colors">{link.sub}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors mt-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Go back to previous page
        </motion.button>
      </div>
    </div>
  );
}
