import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleQuestion, ExternalLink, BookOpen, Shield, Database, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQs — Salesforce SmartKit | Ultimate Admin & Developer Extension",
    description: "Exhaustive Frequently Asked Questions about Salesforce SmartKit Chrome extension.",
};

const faqs = [
    {
        q: "Does SmartKit store my Salesforce data on external servers?",
        a: "No. SmartKit operates 100% locally within your Chrome browser. Your session tokens, queries, and record data are transported directly between your machine and Salesforce's official servers. Zero data is sent to third-party servers.",
    },
    {
        q: "How does SmartKit authenticate into my Salesforce org?",
        a: "SmartKit uses 0ms Session Token Extraction (`sid` cookie). When you log into Salesforce in Chrome, SmartKit securely captures the active session cookie to make authorized REST/Tooling API calls on your behalf. No passwords or OAuth keys are stored.",
    },
    {
        q: "What happens when my Salesforce session expires?",
        a: "If your Salesforce session times out due to inactivity, API requests will return 401 Unauthorized. Simply refresh your Salesforce browser tab or log back in to renew the active session.",
    },
    {
        q: "How do I open the floating sidebar drawer on a Salesforce page?",
        a: "Press ⌘ + Shift + K (Mac) or Ctrl + Shift + K (Windows), or click the pull-string widget floating on the right edge of any Salesforce screen.",
    },
    {
        q: "How do I switch master tabs using keyboard shortcuts?",
        a: "Use Level 1 Navigation: ⌘ + Shift + ← or ⌘ + Shift + → (Ctrl + Shift + ← / → on Windows) to cycle sequentially through all 9 master tabs (SmartView ↔ SmartExport ↔ SmartImport ↔ SmartSchema ↔ SmartSecurity ↔ SmartCode ↔ SmartLimits ↔ SmartMatch ↔ SmartMetadata).",
    },
    {
        q: "How do I cycle through open record tabs or query sub-tabs?",
        a: "Use Level 2 Navigation: ⌘ + Option + Shift + ← / → (Ctrl + Alt + Shift + ← / → on Windows). Active sub-tabs automatically scroll into view smoothly.",
    },
    {
        q: "How does the Escape (Esc) key work when multiple windows or modals are open?",
        a: "SmartKit uses hierarchical Esc key handling: 1st Esc press closes the active open modal overlay (e.g. Keyboard Shortcuts modal, User Menu); 2nd Esc press closes the sidebar drawer.",
    },
    {
        q: "Why does SmartExport flatten relationship queries like SELECT Account.Name FROM Contact?",
        a: "Standard Salesforce API responses return nested JSON objects for parent fields. SmartExport flattens these into clean tabular columns (e.g. Account.Name) so data can be viewed and exported to CSV/Excel cleanly without JSON formatting clutter.",
    },
    {
        q: "Can I edit system fields like CreatedDate or Formula fields in SmartView?",
        a: "No. Fields flagged as updateable: false by Salesforce's API (Formulas, System Dates, Auto-Numbers) are locked permanently in the UI to prevent API DML errors.",
    },
    {
        q: "How do I switch between connected Salesforce org accounts?",
        a: "Click your profile picture avatar in the top-right header to open the Multi-Org Account Switcher. Select any active connected org tab to switch contexts instantly in 0 milliseconds.",
    },
];

export default function SalesforceSmartKitFaqPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Nav */}
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/products/salesforcesmartkit"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Salesforce SmartKit
                </Link>
            </div>

            {/* Header */}
            <header className="mb-16 border-b border-slate-800 pb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-6 border border-indigo-500/20 mx-auto">
                    <MessageCircleQuestion size={32} className="text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Exhaustive guide to security, authentication, shortcuts, and data operations in Salesforce SmartKit.
                </p>
            </header>

            {/* FAQ List */}
            <div className="space-y-6 max-w-3xl mx-auto mb-24">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all"
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
                                    href="/products/salesforcesmartkit/guide"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <BookOpen size={20} className="text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">User Guide</h3>
                                        <p className="text-slate-500 text-sm">Step-by-step documentation</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                                <Link
                                    href="/products/salesforcesmartkit/privacy"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Shield size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Privacy Policy</h3>
                                        <p className="text-slate-500 text-sm">Data & security details</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                                <Link
                                    href="/products/salesforcesmartkit"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Database size={20} className="text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">SmartKit Product</h3>
                                        <p className="text-slate-500 text-sm">Features & overview</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                                <Link
                                    href="/#products"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <LayoutGrid size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Portfolio</h3>
                                        <p className="text-slate-500 text-sm">Explore other projects</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form Link */}
                        <div className="flex-1 p-8 md:p-12 bg-indigo-500/5 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                                <MessageCircleQuestion size={32} className="text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
                            <p className="text-slate-400 mb-8 max-w-xs">
                                If you can&apos;t find an answer, reach out directly through my contact form.
                            </p>
                            <Link
                                href="/#contact"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
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

