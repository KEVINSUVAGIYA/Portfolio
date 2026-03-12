import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Diamond, Settings, LineChart, FileText, MessageCircleQuestion, Shield, ExternalLink, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "HeeraHisaab User Guide | Intelligent Diamond Tracking",
    description: "Step-by-step documentation on how to use HeeraHisaab to track your diamond work.",
};

export default function HeeraHisaabGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
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
            <header className="mb-16 border-b border-slate-800 pb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3b82f6]/10 mb-6 border border-[#3b82f6]/20">
                    <BookOpen size={32} className="text-[#3b82f6]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    HeeraHisaab User Guide
                </h1>
                <p className="text-xl text-slate-400">
                    Learn how to efficiently log your diamond work, set custom rates, and track your monthly earnings.
                </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-16">

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Settings size={24} className="text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">1. Initial Setup & Settings</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Before making your first entry, you should configure your default diamond rates to save time.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                        <li>Navigate to the <strong>Settings</strong> tab from the bottom navigation bar.</li>
                        <li>Find the "Default Rates" section.</li>
                        <li>Enter your most common diamond making charges (e.g., ₹5 per piece, ₹10 per piece).</li>
                        <li>Click "Save Rates". These will now automatically populate whenever you add a new entry.</li>
                        <li>You can also toggle between English and Gujarati (ગુજરાતી) from the Settings menu.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                            <Diamond size={24} className="text-sky-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">2. Adding Daily Work</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        To keep your tracking accurate, log your diamond work at the end of each shift or day.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ol className="list-decimal list-inside space-y-4">
                            <li>Tap the <strong>New Entry</strong> button (+ icon) in the navigation bar.</li>
                            <li>Select the <strong>Date</strong> for the work performed (defaults to today).</li>
                            <li>You will see rows for the default rates you configured earlier. Enter the <strong>Quantity</strong> of diamonds polished for each rate.</li>
                            <li>The app will automatically calculate the subtotal for each row and the grand total for the day.</li>
                            <li>If working on a different rate temporarily, you can manually add a new row and specify a custom rate.</li>
                            <li>Tap <strong>Save Entry</strong>. The data is secured and synced to your Google account.</li>
                        </ol>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <FileText size={24} className="text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">3. Reviewing History</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        If you need to verify an old entry, check your earnings, or delete a mistake:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Go to the <strong>History</strong> tab.</li>
                        <li>Entries are automatically grouped by month. You can filter by specific months to review your accounting.</li>
                        <li>Each entry displays the itemized breakdown, total diamonds processed, and daily earnings.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <LineChart size={24} className="text-pink-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">4. Dashboard & Analytics</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        The Dashboard is your main hub for visualizing your performance.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <p className="mb-4">It automatically tracks and calculates:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Total Expected Earnings:</strong> For the current active month.</li>
                            <li><strong>Total Diamonds:</strong> Overall piece count polished.</li>
                            <li><strong>Highlights:</strong> Callouts for your highest earning day to keep you motivated.</li>
                            <li><strong>Growth Tracker:</strong> Visual indicators comparing your current month's performance directly to the previous month.</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 mt-12 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Pro Tip: Install as App
                    </h2>
                    <p className="leading-relaxed">
                        HeeraHisaab is a Progressive Web App (PWA). For the best experience, open the web app in Chrome or Safari on your phone, tap the browser menu, and select <strong>"Add to Home Screen"</strong>. It will install like a native app and function smoothly in full-screen mode!
                    </p>
                </section>

                {/* Help Hub */}
                <div className="mt-24 pt-24 border-t border-slate-800">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
                            {/* Resource Links */}
                            <div className="flex-1 p-8 md:p-12 text-left">
                                <h2 className="text-2xl font-bold text-white mb-6">Explore Resources</h2>
                                <div className="grid gap-4">
                                    <Link
                                        href="/products/heerahisaab/faq"
                                        className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <MessageCircleQuestion size={20} className="text-[#3b82f6]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold">FAQs</h3>
                                            <p className="text-slate-500 text-sm">Common questions & answers</p>
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
                                    If your question isn't covered in this guide, reach out directly through my contact form.
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
        </div>
    );
}
