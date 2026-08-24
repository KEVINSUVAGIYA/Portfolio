"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Bell,
    Droplets,
    Trophy,
    Settings,
    Volume2,
    Shield,
    Clock,
    Smartphone,
    HelpCircle,
    ArrowLeft,
    ExternalLink,
    ChevronRight,
    MessageCircleQuestion,
    CheckCircle2,
    Sparkles,
    CalendarDays,
} from "lucide-react";
import { BASE_PATH } from "@/lib/constants";
import { TiltCard } from "@/components/ui/TiltCard";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";

const features = [
    {
        icon: Clock,
        title: "Smart Reminders",
        description:
            "Set a custom interval — every 15 minutes, every hour, whatever works for you. SipSync uses Chrome's alarms API to remind you on time, every time.",
    },
    {
        icon: Bell,
        title: "Dual Notifications",
        description:
            "Choose between OS notifications, a pop-up reminder window, or both. Each comes with 'I drank Xml' and 'Ignore' buttons — glass size is configurable.",
    },
    {
        icon: Shield,
        title: "No Notification Spam",
        description:
            "Only one reminder exists at a time. If your laptop was asleep, you won't get bombarded — just the latest single notification.",
    },
    {
        icon: Droplets,
        title: "Intake Tracker",
        description:
            "Beautiful animated water-wave progress circle showing intake and percentage. Resets automatically at midnight.",
    },
    {
        icon: Trophy,
        title: "Goal Celebrations",
        description:
            "Hit your daily target? Confetti animation, a celebration sound, and a congratulatory popup fire automatically!",
    },
    {
        icon: Volume2,
        title: "Customizable Sound Effects",
        description:
            "Choose from curated presets (General, Water Sounds, Funny & Meme), upload custom audio (up to 1MB), preview before choosing, and control sounds anytime.",
    },
    {
        icon: Settings,
        title: "Customizable",
        description:
            "Set your daily water goal, choose notification style, configure your glass size, and toggle sounds in Settings.",
    },
    {
        icon: CalendarDays,
        title: "Hydration Calendar",
        description:
            "Interactive monthly calendar with dynamic water fill animations, hover tooltips, perfect day 🏆 highlights, monthly stats overview, and all-time achievements.",
    },
    {
        icon: Smartphone,
        title: "100% Local & Private",
        description:
            "Zero data leaves your device. No servers, no accounts, no tracking. Everything stays in your browser.",
    },
];

const steps = [
    {
        step: "01",
        title: "Install & Pin",
        description: "Add SipSync to Chrome and pin it to your toolbar for instant access to your daily stats.",
        icon: <ExternalLink className="text-blue-400" />
    },
    {
        step: "02",
        title: "Configure Routine",
        description: "Set your daily goal and how often you want to be reminded. Your browser handles the rest.",
        icon: <Settings className="text-cyan-400" />
    },
    {
        step: "03",
        title: "Hydrate on Alarm",
        description: "Click 'Drink' on the notification to fill your wave. Each click logs your configured glass size automatically.",
        icon: <Bell className="text-emerald-400" />
    },
    {
        step: "04",
        title: "Celebrate Success",
        description: "Hit 100% to trigger the celebration. Watch the wave fill and the confetti fly! 🎉",
        icon: <Sparkles className="text-amber-400" />
    },
];

export function SipSyncContent() {
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
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium">All Projects</span>
                    </Link>
                </motion.div>

                {/* Hero section */}
                <section className="relative mb-32">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-10"
                        >
                            <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-3xl" />
                            <Image
                                src={`${BASE_PATH}/products/sipsync-logo.png`}
                                alt="SipSync Logo"
                                width={160}
                                height={160}
                                className="relative rounded-3xl shadow-2xl border border-blue-500/20"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                                Sip<span className="text-blue-500">Sync</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-8">
                                Water Reminder & Hydration Tracker
                            </p>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                                A beautiful, unobtrusive Chrome extension that keeps you healthy by reminding you to stay hydrated while you browse.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-3 mb-12"
                        >
                            {["Chrome Extension", "React + Vite", "100% Private"].map((tag) => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-blue-400" />
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
                                    href="https://chromewebstore.google.com/detail/ojcpfggpjpaeehhppnelbmcidmglebjl?utm_source=item-share-cb"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] flex items-center gap-3 text-lg"
                                >
                                    Get for Chrome
                                    <ExternalLink size={20} />
                                </a>
                            </MagneticWrapper>
                            <div className="flex gap-4">
                                <Link
                                    href="/products/sipsync/guide"
                                    className="px-6 py-4 bg-slate-900/40 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    User Guide
                                </Link>
                                <Link
                                    href="/products/sipsync/faq"
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
                                    <div className="h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 hover:border-blue-500/30 transition-all group backdrop-blur-sm shadow-xl">
                                        <div className={`w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-blue-500/10`}>
                                            <feature.icon size={28} className="text-blue-400" />
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
                                <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/10 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-8 rounded-3xl bg-slate-950/50 border border-slate-900 flex flex-col h-full ring-1 ring-inset ring-white/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                                            {step.icon}
                                        </div>
                                        <span className="text-3xl font-black text-slate-800 group-hover:text-blue-500/20 transition-colors">
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
                        className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-blue-600/20 via-slate-900/40 to-slate-950 border border-blue-500/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <Droplets size={200} className="text-blue-500" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Start staying hydrated today.
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                            Join other users who are already using SipSync to maintain their hydration levels effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <MagneticWrapper>
                                <a
                                    href="https://chromewebstore.google.com/detail/ojcpfggpjpaeehhppnelbmcidmglebjl?utm_source=item-share-cb"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-50 transition-all text-lg shadow-2xl shadow-white/10"
                                >
                                    Add to Chrome — Free
                                </a>
                            </MagneticWrapper>
                            <Link
                                href="/products/sipsync/privacy"
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
                        © 2026 SipSync · Built With ❤️ By Kevin Suvagiya
                    </p>
                    <div className="flex gap-8">
                        <Link href="/products/sipsync/faq" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">FAQs</Link>
                        <Link href="/products/sipsync/guide" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">User Guide</Link>
                        <Link href="/#contact" className="text-slate-500 hover:text-white transition-colors text-sm font-semibold">Support</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
