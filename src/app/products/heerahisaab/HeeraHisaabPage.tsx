"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Settings,
    Smartphone,
    Languages,
    Shield,
    TrendingUp,
    ArrowLeft,
    ExternalLink,
    MessageCircleQuestion,
    CheckCircle2,
    Sparkles,
    Diamond,
} from "lucide-react";
import { BASE_PATH } from "@/lib/constants";
import { TiltCard } from "@/components/ui/TiltCard";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
    {
        icon: LayoutDashboard,
        title: "Smart Dashboard",
        description:
            "At-a-glance monthly earnings, total diamonds processed, highest/lowest earning days, and growth comparison vs previous month.",
    },
    {
        icon: PlusCircle,
        title: "Quick Entries",
        description:
            "Add new entries with auto-populating default rates, dynamic rows, auto-calculated subtotals and grand total.",
    },
    {
        icon: History,
        title: "Full History",
        description:
            "Browse entries by month with sorting options. Each entry shows itemized breakdown with date, diamond count, and totals.",
    },
    {
        icon: TrendingUp,
        title: "Growth Insights",
        description:
            "Compare monthly performance with clear growth indicators — green for up, red for down. Track your best and worst days.",
    },
    {
        icon: Settings,
        title: "Customizable Defaults",
        description:
            "Manage preset rates (₹5, ₹10, ₹15...) that auto-fill the new entry form, saving time on repetitive entries.",
    },
    {
        icon: Languages,
        title: "English & Gujarati",
        description:
            "Full bilingual UI. Switch between English and ગુજરાતી anytime — your preference is remembered permanently.",
    },
    {
        icon: Smartphone,
        title: "Install as App (PWA)",
        description:
            "Install on your phone's home screen for a native app experience. Works offline after first load.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description:
            "One-tap Google authentication. All data is encrypted and tied to your personal Google account securely.",
    },
];

const steps = [
    {
        step: "01",
        title: "Secure Sign In",
        description: "Login with your Google account to keep your data synced and accessible from any device.",
        icon: <ExternalLink className="text-[#3b82f6]" />
    },
    {
        step: "02",
        title: "Set Your Rates",
        description: "Visit Settings to configure your default diamond rates. These will auto-fill for speed.",
        icon: <Settings className="text-sky-400" />
    },
    {
        step: "03",
        title: "Log Your Work",
        description: "Add daily entries in seconds. Subtotals and totals are calculated automatically as you type.",
        icon: <PlusCircle className="text-blue-400" />
    },
    {
        step: "04",
        title: "Analyze Growth",
        description: "Watch your dashboard update in real-time. Compare monthly performance and hit new records! 📈",
        icon: <TrendingUp className="text-emerald-400" />
    },
];

export function HeeraHisaabContent() {
    return (
        <div className="relative min-h-screen bg-[#020617] overflow-x-hidden">
            <Spotlight />

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/#products"
                        className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-[#3b82f6]/50 group-hover:bg-[#3b82f6]/10 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium">All Projects</span>
                    </Link>
                </motion.div>

                {/* Hero section */}
                <section className="relative mb-32 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#3b82f6]/10 blur-[120px] rounded-full -z-10" />

                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-10"
                        >
                            <div className="absolute inset-0 bg-[#3b82f6]/20 blur-2xl rounded-3xl" />
                            <Image
                                src={`${BASE_PATH}/products/heerahisaab-logo.png`}
                                alt="HeeraHisaab Logo"
                                width={160}
                                height={160}
                                className="relative rounded-3xl shadow-2xl border border-[#3b82f6]/20"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
                                Heera<span className="text-[#3b82f6]">Hisaab</span>
                            </h1>
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <p className="text-2xl md:text-3xl text-slate-300 font-medium">
                                    Intelligent Diamond Tracking
                                </p>
                                <p className="text-slate-500 text-lg font-gujarati">
                                    હીરાહસાબ — ડાયમંડ ટ્રેકિંગ
                                </p>
                            </div>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                                A premium, high-performance web dashboard designed for diamond workers to track their daily logs, rates, and historical performance with ease.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-12"
                        >
                            {["Progressive Web App", "React 19 + Firebase", "Bilingual Support"].map((tag) => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#3b82f6]" />
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://heerahisaab.web.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-3 text-lg"
                                >
                                    Launch Application
                                    <ExternalLink size={20} />
                                </a>
                            </MagneticWrapper>
                            <div className="flex gap-4">
                                <Link
                                    href="/products/heerahisaab/guide"
                                    className="px-6 py-4 bg-slate-900/40 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    User Guide
                                </Link>
                                <Link
                                    href="/products/heerahisaab/faq"
                                    className="px-6 py-4 bg-slate-900/40 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    FAQs
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mb-40">
                    <SectionHeader title="Powerful Capabilities" watermark="FEATURES" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <TiltCard className="h-full">
                                    <div className="h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 hover:border-[#3b82f6]/30 transition-all group backdrop-blur-sm shadow-xl">
                                        <div className={`w-14 h-14 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-[#3b82f6]/10`}>
                                            <feature.icon size={28} className="text-[#3b82f6]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className="mb-40">
                    <SectionHeader title="Getting Started" watermark="GUIDE" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-b from-[#3b82f6]/10 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl bg-slate-950/50 border border-slate-900 flex flex-col h-full ring-1 ring-inset ring-white/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                                            {step.icon}
                                        </div>
                                        <span className="text-3xl font-black text-slate-800 group-hover:text-[#3b82f6]/20 transition-colors">
                                            {step.step}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Call to Action Bottom */}
                <section className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-[#3b82f6]/20 via-slate-900/40 to-slate-950 border border-[#3b82f6]/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <Diamond size={200} className="text-[#3b82f6]" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ready to track your growth?
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                            Join workers who are simplifying their daily accounts with HeeraHisaab. Secure, free, and bilingual.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://heerahisaab.web.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-sky-50 transition-all text-lg shadow-2xl shadow-white/10"
                                >
                                    Open HeeraHisaab
                                </a>
                            </MagneticWrapper>
                            <Link
                                href="/products/heerahisaab/privacy"
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
                            >
                                <Shield size={18} />
                                View Privacy Policy
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Simplified Footer */}
                <footer className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-900 gap-6">
                    <p className="text-slate-500 text-sm font-medium font-gujarati">
                        © 2026 HeeraHisaab · Built With ❤️ By Kevin Suvagiya
                    </p>
                    <div className="flex gap-8">
                        <Link href="/products/heerahisaab/faq" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">FAQs</Link>
                        <Link href="/products/heerahisaab/guide" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">User Guide</Link>
                        <Link href="/#contact" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">Support</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
