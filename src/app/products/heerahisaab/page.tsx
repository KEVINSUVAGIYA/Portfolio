import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Settings,
    Smartphone,
    Languages,
    Shield,
    TrendingUp,
    HelpCircle,
    ArrowLeft,
    ExternalLink,
    ChevronRight,
    LogIn,
} from "lucide-react";
import { BASE_PATH, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "HeeraHisaab — Intelligent Diamond Tracking | Kevin Suvagiya",
    description:
        "A premium accounting and daily tracking dashboard for diamond workers. Log work, track earnings, and monitor monthly progress in English & Gujarati.",
    openGraph: {
        title: "HeeraHisaab — Intelligent Diamond Tracking",
        description:
            "Premium diamond tracking dashboard for workers. Log daily work, track earnings, monitor growth.",
        url: `${SITE_URL}/products/heerahisaab`,
        images: [{ url: `${BASE_PATH}/products/heerahisaab-logo.png` }],
    },
};

const features = [
    {
        icon: LogIn,
        title: "Secure Google Sign-In",
        description:
            "One-tap Google authentication. No passwords to remember. Each user's data is fully isolated and private.",
    },
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
        icon: Settings,
        title: "Customizable Defaults",
        description:
            "Manage preset rates (₹5, ₹10, ₹15...) that auto-fill the new entry form, saving time on repetitive entries.",
    },
    {
        icon: TrendingUp,
        title: "Growth Insights",
        description:
            "Compare monthly performance with clear growth indicators — green for up, red for down. Track your best and worst days.",
    },
    {
        icon: Smartphone,
        title: "Install as App (PWA)",
        description:
            "Install on your phone's home screen for a native app experience. Works offline after first load.",
    },
    {
        icon: Languages,
        title: "English & Gujarati",
        description:
            "Full bilingual UI. Switch between English and ગુજરાતી anytime — your preference is remembered permanently.",
    },
];

const steps = [
    {
        step: "1",
        title: "Sign In",
        description: "Open heerahisaab.web.app and sign in with your Google account. Choose your preferred language.",
    },
    {
        step: "2",
        title: "Set Your Rates",
        description: "Go to Settings and add your default diamond rates (e.g., ₹5, ₹10). These will auto-fill new entries.",
    },
    {
        step: "3",
        title: "Log Daily Work",
        description: "Switch to the New Entry tab, pick the date, adjust quantities per rate, and save. Totals are calculated automatically.",
    },
    {
        step: "4",
        title: "Track Progress",
        description: "View your Dashboard for monthly earnings, historical insights, and growth trends over time.",
    },
];

const faqs = [
    {
        q: "Is my data safe?",
        a: "Yes. Your data is stored securely on Google Cloud (Firebase) and is accessible only to your Google account. No one else can see your entries.",
    },
    {
        q: "Can I use it on my phone?",
        a: "Absolutely! HeeraHisaab is a PWA — install it on your phone's home screen via your browser's 'Add to Home Screen' option for a full app experience.",
    },
    {
        q: "Does it work offline?",
        a: "The app caches assets for offline use. New entries require internet to sync to the database, but you can browse previously loaded data offline.",
    },
    {
        q: "How do I delete an entry?",
        a: "Go to the History tab, find the entry, and click the delete button. A confirmation dialog will appear before deletion.",
    },
    {
        q: "How do I switch languages?",
        a: "Toggle between English and Gujarati on the login screen or anytime in Settings. Your choice is saved permanently.",
    },
    {
        q: "Is there a cost?",
        a: "HeeraHisaab is completely free to use.",
    },
];

export default function HeeraHisaabPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Hero */}
            <section className="text-center mb-24">
                <div className="inline-block mb-8">
                    <Image
                        src={`${BASE_PATH}/products/heerahisaab-logo.png`}
                        alt="HeeraHisaab Logo"
                        width={120}
                        height={120}
                        className="rounded-2xl shadow-2xl shadow-[#3b82f6]/20"
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    HeeraHisaab
                </h1>
                <p className="text-xl text-[#3b82f6] font-medium mb-2">
                    Intelligent Diamond Tracking
                </p>
                <p className="text-slate-500 text-sm mb-4">
                    હીરાહિસાબ — ડાયમંડ ટ્રેકિંગ
                </p>
                <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    A premium, secure accounting and daily tracking dashboard designed for diamond workers. Keep precise logs, track rates, and monitor monthly progress.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        Progressive Web App
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        React 19 + Firebase
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        English & ગુજરાતી
                    </span>
                </div>

                <a
                    href="https://heerahisaab.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl transition-colors"
                >
                    Open App
                    <ExternalLink size={16} />
                </a>
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
                                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#3b82f6]/30 transition-colors duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                                        <Icon size={20} className="text-[#3b82f6]" />
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
                            <span className="text-4xl font-black text-[#3b82f6]/20 absolute top-4 right-4">
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
                                    className="text-[#3b82f6] flex-shrink-0 mt-0.5"
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
                    <a
                        href="https://heerahisaab.web.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#3b82f6] hover:text-[#60a5fa] transition-colors text-sm font-medium"
                    >
                        <ExternalLink size={16} />
                        Open HeeraHisaab
                    </a>
                    <Link
                        href="/products/heerahisaab/privacy"
                        className="flex items-center gap-2 text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium"
                    >
                        <Shield size={16} />
                        Privacy Policy
                        <ChevronRight size={14} />
                    </Link>
                </div>
                <p className="text-slate-600 text-xs mt-8">
                    Built with ❤️ by Kevin Suvagiya
                </p>
            </section>
        </div>
    );
}
