import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleQuestion, ExternalLink, BookOpen, Shield, Database, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQs — Salesforce SmartKit | Ultimate Admin Extension",
    description: "Frequently Asked Questions about Salesforce SmartKit Chrome extension.",
};

const faqs = [
    {
        q: "How do I extract relationship data (like an Account Owner's Email)?",
        a: "Use the SmartExport (Data) Tab. When you run a query that includes related fields, SmartKit will automatically format the data so you can export a clean, organized CSV instantly.",
    },
    {
        q: "Can I mass import data without using external tools?",
        a: "Yes! Use the SmartImport Tab. Just paste your CSV data directly in the browser, select your object, and SmartKit will rapidly create or update the records for you, providing a clear success and error report.",
    },
    {
        q: "How can I check who has access to a specific field?",
        a: "Navigate to the SmartSecurity (Permissions) Tab. Select the Object and the Field, and SmartKit will instantly show you a clear list of all Profiles, Permission Sets, and specific Users who have access to that field.",
    },
    {
        q: "How do I execute quick Apex scripts?",
        a: "Open the SmartCode (Dev) Tab. You can write and run Apex scripts in a clean interface and immediately view your recent Debug Logs without having to open the slow Developer Console.",
    },
    {
        q: "How to navigate the Salesforce Setup menu faster?",
        a: "Hit Cmd+K (or Ctrl+K) anywhere inside SmartKit to open the Command Palette. Instantly search for Setup pages, Users, or Profiles, and hit Enter to jump right to them.",
    },
    {
        q: "Does Salesforce SmartKit collect my data?",
        a: "No. Everything operates locally using your browser's active session. SmartKit does not have a backend server, database, or analytics tracking mechanism. We do not track your usage, queries, or personal information.",
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
                    Common use cases and questions about using Salesforce SmartKit to boost productivity.
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
                                If you can't find an answer, reach out directly through my contact form.
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
