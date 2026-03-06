import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { BASE_PATH, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "SipSync — Water Reminder & Hydration Tracker | Kevin Suvagiya",
    description:
        "A beautiful Chrome Extension that reminds you to stay hydrated with smart notifications, daily water tracking, and goal celebrations.",
    openGraph: {
        title: "SipSync — Water Reminder & Hydration Tracker",
        description:
            "Stay hydrated while you browse. Smart reminders, daily tracking, and goal celebrations.",
        url: `${SITE_URL}/products/sipsync`,
        images: [{ url: `${BASE_PATH}/products/sipsync-logo.png` }],
    },
};

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
            "Choose between OS notifications, a pop-up reminder window, or both. Each comes with 'Drink 200ml' and 'Ignore' buttons.",
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
        title: "Sound Effects",
        description:
            "Optional sound on reminders and celebrations. Toggle on or off from Settings.",
    },
    {
        icon: Settings,
        title: "Customizable",
        description:
            "Set your daily water goal, choose notification style, toggle sounds, and enjoy motivational quotes in Settings.",
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
        step: "1",
        title: "Install & Open",
        description: "Install SipSync from the Chrome Web Store, then click the extension icon in your toolbar.",
    },
    {
        step: "2",
        title: "Set Interval",
        description: "Choose how often you want reminders (e.g., every 30 minutes) and click 'Start Reminder'.",
    },
    {
        step: "3",
        title: "Stay Hydrated",
        description: "When a reminder pops up, click 'Drink 200ml' to log your intake, or 'Ignore' to skip.",
    },
    {
        step: "4",
        title: "Track & Celebrate",
        description: "Watch your progress fill up. When you hit your daily goal — confetti time! 🎉",
    },
];

const faqs = [
    {
        q: "Does SipSync collect my data?",
        a: "No. Everything is stored locally on your device using Chrome's storage. No servers, no analytics, no tracking.",
    },
    {
        q: "Will I get spammed with notifications?",
        a: "No. Only one reminder notification exists at a time. If you were away, only the latest single notification is shown — no bursts.",
    },
    {
        q: "Does it work when my laptop is closed?",
        a: "Reminders are scheduled but only delivered when Chrome is running. No notification spam on wake.",
    },
    {
        q: "How do I change my water target?",
        a: "Click the pencil icon on the Target card in the main screen, type your daily ml target, and press Enter.",
    },
    {
        q: "Can I use both OS and popup notifications?",
        a: "Yes! Enable both in Settings and you'll get both types simultaneously.",
    },
];

export default function SipSyncPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Hero */}
            <section className="text-center mb-24">
                <div className="inline-block mb-8">
                    <Image
                        src={`${BASE_PATH}/products/sipsync-logo.png`}
                        alt="SipSync Logo"
                        width={120}
                        height={120}
                        className="rounded-2xl shadow-2xl shadow-[#51BFF2]/20"
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    SipSync
                </h1>
                <p className="text-xl text-[#51BFF2] font-medium mb-4">
                    Water Reminder & Hydration Tracker
                </p>
                <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    A beautiful, unobtrusive daily water tracker that reminds you to stay hydrated and healthy while you browse.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        Chrome Extension · Manifest V3
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        React 18 + Vite
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        100% Offline & Private
                    </span>
                </div>
            </section>

            {/* Features */}
            <section className="mb-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#51BFF2]/30 transition-colors duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#51BFF2]/10 flex items-center justify-center flex-shrink-0">
                                        <Icon size={20} className="text-[#51BFF2]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => (
                        <div
                            key={step.step}
                            className="relative p-6 rounded-xl bg-slate-900/60 border border-slate-800"
                        >
                            <span className="text-4xl font-black text-[#51BFF2]/20 absolute top-4 right-4">
                                {step.step}
                            </span>
                            <h3 className="text-white font-semibold mb-2 text-lg">
                                {step.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="mb-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.q}
                            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800"
                        >
                            <div className="flex items-start gap-3">
                                <HelpCircle
                                    size={18}
                                    className="text-[#51BFF2] flex-shrink-0 mt-0.5"
                                />
                                <div>
                                    <h3 className="text-white font-medium mb-2">
                                        {faq.q}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Links */}
            <section className="border-t border-slate-800 pt-12 pb-8">
                <div className="flex flex-wrap items-center gap-6">
                    <Link
                        href="/#products"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Portfolio
                    </Link>
                    <Link
                        href="/products/sipsync/privacy"
                        className="flex items-center gap-2 text-slate-400 hover:text-[#51BFF2] transition-colors text-sm font-medium"
                    >
                        <Shield size={16} />
                        Privacy Policy
                        <ChevronRight size={14} />
                    </Link>
                </div>
                <p className="text-slate-600 text-xs mt-8">
                    Built with ❤️ by Kevin Suvagiya · v1.0.0
                </p>
            </section>
        </div>
    );
}
