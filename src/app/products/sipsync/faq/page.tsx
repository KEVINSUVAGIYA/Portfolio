import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleQuestion, ExternalLink, BookOpen, Shield, Droplets, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQs — SipSync | Water Reminder & Tracker",
    description: "Frequently Asked Questions about SipSync water reminder Chrome extension.",
};

const faqs = [
    {
        q: "Does SipSync collect my data?",
        a: "No. Everything is stored locally on your device using Chrome's storage. No servers, no analytics, no tracking.",
    },
    {
        q: "I'm not getting OS notifications. What's wrong?",
        a: "Ensure that you have 'Allowed' notifications for Google Chrome in your operating system settings (Windows/macOS/Linux). Also, make sure 'Do Not Disturb' or 'Focus Mode' is turned off.",
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
        a: "In the main window, click the pencil icon on the Target card, type your daily ml target, and press Enter to save.",
    },
    {
        q: "Can I use both OS and popup notifications?",
        a: "Yes! You can enable both types simultaneously in Settings for extra visibility.",
    },
];

export default function SipSyncFaqPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Nav */}
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/products/sipsync"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    SipSync
                </Link>
            </div>

            {/* Header */}
            <header className="mb-16 border-b border-slate-800 pb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#51BFF2]/10 mb-6 border border-[#51BFF2]/20 mx-auto">
                    <MessageCircleQuestion size={32} className="text-[#51BFF2]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Got a question about SipSync? We've got answers.
                </p>
            </header>

            {/* FAQ List */}
            <div className="space-y-6 max-w-3xl mx-auto mb-24">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-[#51BFF2]/30 transition-all"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">
                            {faq.q}
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>

            {/* Help Hub */}
            <div className="mt-24 pt-24 border-t border-slate-800">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
                        {/* Resource Links */}
                        <div className="flex-1 p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Explore Resources</h2>
                            <div className="grid gap-4">
                                <Link
                                    href="/products/sipsync/guide"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#51BFF2]/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <BookOpen size={20} className="text-[#51BFF2]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">User Guide</h3>
                                        <p className="text-slate-500 text-sm">Step-by-step documentation</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#51BFF2] transition-colors" />
                                </Link>
                                <Link
                                    href="/products/sipsync/privacy"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Shield size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Privacy Policy</h3>
                                        <p className="text-slate-500 text-sm">Data & security details</p>
                                    </div>
                                </Link>
                                <Link
                                    href="/products/sipsync"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Droplets size={20} className="text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">SipSync Product</h3>
                                        <p className="text-slate-500 text-sm">Features & overview</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#51BFF2] transition-colors" />
                                </Link>
                                <Link
                                    href="/#products"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <LayoutGrid size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Portfolio</h3>
                                        <p className="text-slate-500 text-sm">Explore other projects</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#51BFF2] transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form Link */}
                        <div className="flex-1 p-8 md:p-12 bg-[#51BFF2]/5 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#51BFF2]/10 flex items-center justify-center mb-6">
                                <MessageCircleQuestion size={32} className="text-[#51BFF2]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
                            <p className="text-slate-400 mb-8 max-w-xs">
                                If you can't find an answer, reach out directly through my contact form.
                            </p>
                            <Link
                                href="/#contact"
                                className="w-full py-4 bg-[#51BFF2] hover:bg-[#3291D9] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#51BFF2]/20 active:scale-[0.98]"
                            >
                                Contact Me
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
