"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    Sidebar,
    Sparkles,
    Send,
    Loader2,
    X,
    Gauge,
    GitCompare,
    Boxes,
    Command,
    Zap,
    Layout,
    PanelRightClose,
    Layers,
    SlidersHorizontal,
    Rocket,
    Smile,
    TableProperties,
    LockKeyhole,
    Pin,
    Flame,
    Quote,
} from "lucide-react";
import { BASE_PATH } from "@/lib/constants";
import { TiltCard } from "@/components/ui/TiltCard";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
    {
        icon: Eye,
        title: "SmartView (Record Inspector)",
        color: "#f43f5e",
        description:
            "Multi-tab record sessions with SmartEdit inline editing, picklist search, field filter chips, hover API names/formulas, and Setup links.",
    },
    {
        icon: Database,
        title: "SmartExport (SOQL Query IDE)",
        color: "#10b981",
        description:
            "Monaco editor with intellisense, multi-tab query workspaces, Composite API chunking for 2,000+ records, and parent relationship CSV flattening.",
    },
    {
        icon: ArrowUpFromLine,
        title: "SmartImport (Data Loader)",
        color: "#f59e0b",
        description:
            "Client-side bulk data loader supporting INSERT, UPDATE, UPSERT, DELETE via SObject Collections API (up to 200/payload) with error logs.",
    },
    {
        icon: Network,
        title: "SmartSchema (Metadata Browser)",
        color: "#06b6d4",
        description:
            "Browse sObjects, custom fields, picklists, and child relationships with cascade delete rules and 1-click SOQL query generation.",
    },
    {
        icon: ShieldAlert,
        title: "SmartSecurity (Access Analyzer)",
        color: "#8b5cf6",
        description:
            "Audit Effective FLS & Object permissions (Read, Edit, Create, Delete), Permission Set/Profile matrix breakdown, and user access trace.",
    },
    {
        icon: Code,
        title: "SmartCode (Web IDE)",
        color: "#6366f1",
        description:
            "Execute Anonymous Apex with inline compilation error highlighting (line/column), edit Apex/LWC/VF pages, and inspect live Debug Logs.",
    },
    {
        icon: Gauge,
        title: "SmartLimits (Limits Monitor)",
        color: "#0ea5e9",
        description:
            "Monitor real-time Salesforce API call limits, storage usage, and system governor quotas with visual gauge bars.",
    },
    {
        icon: GitCompare,
        title: "SmartMatch (Deduplication Tool)",
        color: "#be185d",
        description:
            "Detect duplicate records using matching rules, compare field values side-by-side, and initiate record deduplication.",
    },
    {
        icon: Boxes,
        title: "SmartMetadata (Deployment Engine)",
        color: "#f97316",
        description:
            "Inter-org metadata packaging and deployment (BETA) with dry-run validations, Apex permission handling, and pre-deployment backups.",
    },
];

const standoutUseCases = [
    {
        badge: "SmartExport",
        tagline: "Warp-Speed SOQL Exports",
        question: "Data export takes forever in standard tools?",
        answer: "Our SOQL engine fetches data at maximum speed via Composite API chunking so you don't waste half your day staring at spinners. Don't believe it? Time it yourself!",
        color: "#10b981",
        icon: Rocket,
    },
    {
        badge: "SmartExport & SmartView",
        tagline: "Zero Parent-Child Export Stress",
        question: "Often feel stressed reviewing child records in data exports?",
        answer: "Standard data exports cram child records into the same row with messy duplicate columns—reviewing it is painful. We built a simplified parent-child hierarchy view so you can review and happily enjoy child records for each parent record at a glance!",
        color: "#f43f5e",
        icon: Smile,
    },
    {
        badge: "SmartImport",
        tagline: "Import Without Excel Sheets",
        question: "Want to import just 5 records without making an Excel sheet?",
        answer: "Why move mountains for a quick record import? Create grid tables right inside the extension, paste rows, edit cells inline, and hit insert. We've got you covered!",
        color: "#f59e0b",
        icon: TableProperties,
    },
    {
        badge: "SmartSecurity",
        tagline: "The 182 Permission Sets Mystery",
        question: "Who gave this user Edit access across 182 PS, 20 PS Groups & Profile?!",
        answer: "Stop playing detective across 182 Permission Sets and 20 PS Groups! SmartSecurity traces effective access in 1 click and exposes the exact culprit instantly.",
        color: "#8b5cf6",
        icon: LockKeyhole,
    },
    {
        badge: "SmartLimits",
        tagline: "Pin Your Limits, Commander",
        question: "Tired of hunting through Setup just to check an org limit?",
        answer: "Pin your favorite limits right to the top! SmartKit fetches them instantly from any universe and brings them front and center, Commander.",
        color: "#0ea5e9",
        icon: Pin,
    },
    {
        badge: "SmartMetadata",
        tagline: "Multi-Object Field Deployments",
        question: "Creating the same field on 3 objects giving you a heart attack?",
        answer: "Become smart and use SmartKit! Deploy custom fields across multiple objects simultaneously—complete with FLS permissions and zero headache.",
        color: "#f97316",
        icon: Flame,
    },
];

const accessModes = [
    {
        icon: PanelRightClose,
        title: "Floating Sidebar Drawer",
        description: "Glides open natively on any Salesforce tab via pull-string widget or ⌘ + Shift + K.",
    },
    {
        icon: Layout,
        title: "Chrome Side Panel",
        description: "Pins vertically alongside your browser window for side-by-side multitasking.",
    },
    {
        icon: MonitorPlay,
        title: "Full Extension App Tab",
        description: "Full-screen workspace featuring Monaco IDE capabilities and multi-tab sessions.",
    },
];

const shortcuts = [
    { key: "⌘ + K", action: "Open Command Palette (Search metadata, objects, setup pages)" },
    { key: "⌘ + Shift + K", action: "Toggle Floating Sidebar Drawer on Salesforce tabs" },
    { key: "⌘ + Shift + ← / →", action: "Level 1: Cycle 9 Master App Tabs" },
    { key: "⌘ + Option + Shift + ← / →", action: "Level 2: Cycle Record & Query Sub-Tabs" },
    { key: "⌘ + S", action: "Save Record Edits in SmartView" },
    { key: "⌘ + Enter", action: "Execute SOQL Query or Anonymous Apex Script" },
];

const steps = [
    {
        step: "01",
        title: "Install & Pin",
        description: "Add Salesforce SmartKit to Chrome and pin to your toolbar or launch inside Salesforce.",
        icon: <ExternalLink className="text-indigo-400" />
    },
    {
        step: "02",
        title: "0ms Session Auto-Connect",
        description: "Instant session token extraction (`sid`) connects without connected apps, tokens, or loading spinners.",
        icon: <Zap className="text-amber-400" />
    },
    {
        step: "03",
        title: "Access 9 Smart Tools",
        description: "Switch seamlessly between SmartView, SmartExport, SmartImport, SmartSchema, SmartSecurity, SmartCode, SmartLimits, SmartMatch, & SmartMetadata.",
        icon: <Database className="text-emerald-400" />
    },
    {
        step: "04",
        title: "Master Keyboard Speed",
        description: "Use ⌘+K Command Palette, 2-level tab shortcuts, and Multi-Org switcher to boost productivity 10x.",
        icon: <Command className="text-violet-400" />
    },
];

export function SalesforceSmartKitPage() {
    const [showEarlyAccess, setShowEarlyAccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        try {
            const res = await fetch("https://formsubmit.co/ajax/9d64015e0bad35be133b67c8bf0227a8", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data),
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <div className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-[38px]" />
                            <Image
                                src={`${BASE_PATH}/products/salesforcesmartkit-logo.png`}
                                alt="Salesforce SmartKit Logo"
                                width={160}
                                height={160}
                                className="relative rounded-[38px] shadow-2xl border border-indigo-500/30"
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
                                Ultimate Admin & Developer Command Center
                            </p>
                            <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
                                A premium, glassmorphic Chrome Extension providing 9 major tools—SmartView, SmartExport, SmartImport, SmartSchema, SmartSecurity, SmartCode, SmartLimits, SmartMatch, and SmartMetadata—with 0ms instant session connect.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-12"
                        >
                            {["Chrome Extension v1.0.13", "0ms Instant Load", "9 Integrated Tools", "100% Local & Private"].map((tag) => (
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
                                    href="https://chrome.google.com/webstore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] flex items-center gap-3 text-lg"
                                >
                                    Chrome Web Store (Coming Soon)
                                    <ExternalLink size={20} />
                                </a>
                            </MagneticWrapper>
                            <MagneticWrapper strength={20}>
                                <button
                                    onClick={() => setShowEarlyAccess(true)}
                                    className="cursor-pointer px-10 py-5 bg-slate-900 border border-indigo-500/30 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center gap-3 text-lg"
                                >
                                    Request Early Access
                                    <Sparkles size={20} className="text-indigo-400" />
                                </button>
                            </MagneticWrapper>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-4 mt-8"
                        >
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
                        </motion.div>
                    </div>
                </section>

                {/* Standout Features / Real-World Superpowers */}
                <section id="superpowers" className="mb-32">
                    <SectionHeader title="Real-World Superpowers" watermark="SOLUTIONS" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {standoutUseCases.map((uc, idx) => (
                            <motion.div
                                key={uc.tagline}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <TiltCard className="h-full">
                                    <div className="h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/40 transition-all group backdrop-blur-md shadow-2xl flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                                            <uc.icon size={120} style={{ color: uc.color }} />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <span
                                                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border"
                                                    style={{
                                                        backgroundColor: `${uc.color}15`,
                                                        borderColor: `${uc.color}35`,
                                                        color: uc.color,
                                                    }}
                                                >
                                                    {uc.badge}
                                                </span>
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                                                    style={{
                                                        backgroundColor: `${uc.color}15`,
                                                        borderColor: `${uc.color}30`,
                                                    }}
                                                >
                                                    <uc.icon size={20} style={{ color: uc.color }} />
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-3">
                                                {uc.tagline}
                                            </h3>

                                            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/60 mb-4">
                                                <p className="text-sm text-indigo-300 font-semibold italic flex items-start gap-2">
                                                    <Quote size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                                                    "{uc.question}"
                                                </p>
                                            </div>

                                            <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                                {uc.answer}
                                            </p>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mb-32">
                    <SectionHeader title="9 Integrated Power Tools" watermark="FEATURES" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <TiltCard className="h-full">
                                    <div className="h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 hover:border-indigo-500/30 transition-all group backdrop-blur-sm shadow-xl">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border"
                                            style={{
                                                backgroundColor: `${feature.color}15`,
                                                borderColor: `${feature.color}30`,
                                            }}
                                        >
                                            <feature.icon size={28} style={{ color: feature.color }} />
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

                {/* Access Modes & Keyboard Shortcuts */}
                <section className="mb-32">
                    <SectionHeader title="Access Modes & Shortcuts" watermark="NAVIGATE" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Access Modes */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Layout className="text-indigo-400" size={24} />
                                3 Flexible Access Modes
                            </h3>
                            <div className="space-y-4">
                                {accessModes.map((mode) => (
                                    <div key={mode.title} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                                            <mode.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{mode.title}</h4>
                                            <p className="text-slate-400 text-sm">{mode.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Keyboard Shortcuts */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Command className="text-violet-400" size={24} />
                                Master Keyboard Speed
                            </h3>
                            <div className="space-y-3">
                                {shortcuts.map((sc) => (
                                    <div key={sc.key} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-4">
                                        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shrink-0">
                                            {sc.key}
                                        </span>
                                        <span className="text-slate-300 text-xs md:text-sm text-right font-medium">
                                            {sc.action}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
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

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                            <MagneticWrapper>
                                <a
                                    href="https://chrome.google.com/webstore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-indigo-50 transition-all text-lg shadow-2xl shadow-white/10"
                                >
                                    Chrome Web Store (Coming Soon)
                                </a>
                            </MagneticWrapper>
                            <MagneticWrapper>
                                <button
                                    onClick={() => setShowEarlyAccess(true)}
                                    className="cursor-pointer px-12 py-5 bg-indigo-900/40 border border-indigo-500/30 hover:bg-indigo-900/60 text-white font-black rounded-2xl transition-all text-lg shadow-2xl flex items-center gap-3"
                                >
                                    Request Early Access
                                    <Sparkles size={20} className="text-indigo-400" />
                                </button>
                            </MagneticWrapper>
                        </div>
                        <div className="flex justify-center">
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

            <AnimatePresence>
                {showEarlyAccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setShowEarlyAccess(false)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {submitted ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                                    <p className="text-slate-400">Thanks for your interest. We'll be in touch soon with your early access invite.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6 pr-8">
                                        <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Request Early Access</h3>
                                            <p className="text-sm text-slate-400">Join the exclusive beta program.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input type="hidden" name="_subject" value="✨ Salesforce SmartKit Early Access Request!" />
                                        <input type="hidden" name="_template" value="table" />
                                        <input type="hidden" name="_captcha" value="false" />
                                        <input type="hidden" name="source" value="SmartKit Page" />

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Name <span className="text-indigo-400">*</span></label>
                                            <input required type="text" name="name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Email <span className="text-indigo-400">*</span></label>
                                            <input required type="email" name="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Expectations / Comments <span className="text-indigo-400">*</span></label>
                                            <textarea required name="comments" rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="What are you most excited about?"></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                        >
                                            {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Requesting...</> : <><Send size={18} /> Send Request</>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
