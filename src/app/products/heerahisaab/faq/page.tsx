import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleQuestion, ExternalLink, BookOpen, Shield, Diamond, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQs — HeeraHisaab | Intelligent Diamond Tracking",
    description: "Frequently Asked Questions about HeeraHisaab diamond tracking web application.",
};

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

export default function HeeraHisaabFaqPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Nav */}
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/products/heerahisaab"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    HeeraHisaab
                </Link>
            </div>

            {/* Header */}
            <header className="mb-16 border-b border-slate-800 pb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3b82f6]/10 mb-6 border border-[#3b82f6]/20 mx-auto">
                    <MessageCircleQuestion size={32} className="text-[#3b82f6]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Everything you need to know about tracking your work with HeeraHisaab.
                </p>
            </header>

            {/* FAQ List */}
            <div className="space-y-6 max-w-3xl mx-auto mb-24">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-[#3b82f6]/30 transition-all"
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
                        <div className="flex-1 p-8 md:p-12 text-left">
                            <h2 className="text-2xl font-bold text-white mb-6">Explore Resources</h2>
                            <div className="grid gap-4">
                                <Link
                                    href="/products/heerahisaab/guide"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <BookOpen size={20} className="text-[#3b82f6]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">User Guide</h3>
                                        <p className="text-slate-500 text-sm">Step-by-step documentation</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#3b82f6] transition-colors" />
                                </Link>
                                <Link
                                    href="/products/heerahisaab/privacy"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Shield size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Privacy Policy</h3>
                                        <p className="text-slate-500 text-sm">Data & security details</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#3b82f6] transition-colors" />
                                </Link>
                                <Link
                                    href="/products/heerahisaab"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <Diamond size={20} className="text-sky-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">HeeraHisaab Product</h3>
                                        <p className="text-slate-500 text-sm">Features & overview</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#3b82f6] transition-colors" />
                                </Link>
                                <Link
                                    href="/#products"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <LayoutGrid size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">Portfolio</h3>
                                        <p className="text-slate-500 text-sm">Explore other projects</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-[#3b82f6] transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form Link */}
                        <div className="flex-1 p-8 md:p-12 bg-[#3b82f6]/5 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mb-6">
                                <MessageCircleQuestion size={32} className="text-[#3b82f6]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
                            <p className="text-slate-400 mb-8 max-w-xs">
                                If you can't find an answer here, reach out directly through my contact form.
                            </p>
                            <Link
                                href="/#contact"
                                className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20 active:scale-[0.98]"
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
