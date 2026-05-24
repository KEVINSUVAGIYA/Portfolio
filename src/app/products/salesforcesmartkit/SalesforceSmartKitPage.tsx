"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Database,
    Code,
    Search,
    MonitorPlay,
    Shield,
    ExternalLink,
    ArrowLeft,
    CheckCircle2,
    Eye,
    ArrowUpFromLine,
    Network,
    ShieldAlert,
    Sidebar
} from "lucide-react";
import { BASE_PATH } from "@/lib/constants";
import { TiltCard } from "@/components/ui/TiltCard";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
    {
        icon: Eye,
        title: "SmartView (Records)",
        description:
            "A powerful interface to view, edit, and analyze specific Salesforce records. Instantly navigate to fields in Object Manager.",
    },
    {
        icon: Database,
        title: "SmartExport (Data)",
        description:
            "A professional SOQL editor with Monaco. Features intellisense, batch limit processing, and instant CSV exports of flattened relationship data.",
    },
    {
        icon: ArrowUpFromLine,
        title: "SmartImport",
        description:
            "Fast, client-side CSV parsing and data insertion. Bulkify your record creation and updates directly from the browser.",
    },
    {
        icon: Network,
        title: "SmartSchema",
        description:
            "Inspect database architecture instantly. View fields, evaluate Master-Detail relationships, and deep link into Object Manager.",
    },
    {
        icon: ShieldAlert,
        title: "SmartSecurity",
        description:
            "Rapidly audit field access across Profiles and Permission Sets to see EXACTLY who has access to what data.",
    },
    {
        icon: Code,
        title: "SmartCode",
        description:
            "Developer console alternative. Execute Anonymous Apex in a clean editor environment and view recent Debug Logs instantly.",
    },
    {
        icon: Search,
        title: "SmartSearch (Cmd+K)",
        description:
            "Hit Cmd+K to launch the Command Palette. Search metadata, Setup pages, or tools, and navigate 10x faster.",
    },
    {
        icon: Sidebar,
        title: "Native Injection",
        description:
            "A non-intrusive 'pull-string' sidebar toggle injected directly into Salesforce UI. Operates totally locally via your active session ID.",
    },
];

const steps = [
    {
        step: "01",
        title: "Install Extension",
        description: "Add Salesforce SmartKit to Chrome and log into any Org.",
        icon: <ExternalLink className="text-indigo-400" />
    },
    {
        step: "02",
        title: "Pull The Toggle",
        description: "Click the floating avatar injected into Salesforce to reveal the SmartKit side panel.",
        icon: <Sidebar className="text-blue-400" />
    },
    {
        step: "03",
        title: "Choose a Tool",
        description: "Select from 6 powerful 'Smart' tabs including Data, Import, Schema, and Security.",
        icon: <Database className="text-emerald-400" />
    },
    {
        step: "04",
        title: "Navigate Faster",
        description: "Press Cmd+K anytime to open the Command Palette and bypass the slow Lightning UI.",
        icon: <Search className="text-violet-400" />
    },
];

export function SalesforceSmartKitPage() {
    return (
        <div className="relative min-h-screen bg-[#0a0e1a] overflow-x-hidden">
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
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium">All Projects</span>
                    </Link>
                </motion.div>

                {/* Hero section */}
                <section className="relative mb-32">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-10"
                        >
                            <div className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-3xl" />
                            <Image
                                src={`${BASE_PATH}/products/salesforcesmartkit-logo.png`}
                                alt="Salesforce SmartKit Logo"
                                width={160}
                                height={160}
                                className="relative rounded-3xl shadow-2xl border border-indigo-500/20"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                                Salesforce <span className="text-indigo-500">SmartKit</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-8">
                                The Ultimate Admin Extension
                            </p>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                                A premium, glassmorphic Chrome Extension providing 6 major tools—SmartView, SmartExport, SmartImport, SmartSchema, SmartSecurity, and SmartCode—injected directly into your Salesforce session.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-12"
                        >
                            {["Chrome Extension", "React + Vite", "100% Local & Private"].map((tag) => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-indigo-400" />
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
                                    href="#"
                                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] flex items-center gap-3 text-lg"
                                >
                                    Get for Chrome
                                    <ExternalLink size={20} />
                                </a>
                            </MagneticWrapper>
                            <div className="flex gap-4">
                                <Link
                                    href="/products/salesforcesmartkit/guide"
                                    className="px-6 py-4 bg-slate-900/40 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    User Guide
                                </Link>
                                <Link
                                    href="/products/salesforcesmartkit/faq"
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
                    <SectionHeader title="Everything you need" watermark="FEATURES" />

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
                                    <div className="h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 hover:border-indigo-500/30 transition-all group backdrop-blur-sm shadow-xl">
                                        <div className={`w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-indigo-500/10`}>
                                            <feature.icon size={28} className="text-indigo-400" />
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

                {/* How it works - Visual Cards */}
                <section className="mb-40">
                    <SectionHeader title="Simple Workflow" watermark="PROCESS" />

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
                                <div className="absolute -inset-2 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl bg-slate-950/50 border border-slate-900 flex flex-col h-full ring-1 ring-inset ring-white/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                                            {step.icon}
                                        </div>
                                        <span className="text-3xl font-black text-slate-800 group-hover:text-indigo-500/20 transition-colors">
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
                        className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-indigo-600/20 via-slate-900/40 to-slate-950 border border-indigo-500/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <MonitorPlay size={200} className="text-indigo-500" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Start working smarter today.
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                            Join other Salesforce Administrators and Developers who are saving hours every week with the SmartKit.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <MagneticWrapper>
                                <a
                                    href="#"
                                    className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-indigo-50 transition-all text-lg shadow-2xl shadow-white/10"
                                >
                                    Add to Chrome — Free
                                </a>
                            </MagneticWrapper>
                            <Link
                                href="/products/salesforcesmartkit/privacy"
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
                    <p className="text-slate-500 text-sm font-medium">
                        © 2026 Salesforce SmartKit · Built With ❤️ By Kevin Suvagiya
                    </p>
                    <div className="flex gap-8">
                        <Link href="/products/salesforcesmartkit/faq" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">FAQs</Link>
                        <Link href="/products/salesforcesmartkit/guide" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">User Guide</Link>
                        <Link href="/#contact" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">Support</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
