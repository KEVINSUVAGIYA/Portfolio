import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Droplets, Bell, Target, Settings, MonitorPlay, MessageCircleQuestion, Shield, ExternalLink, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
    title: "SipSync User Guide | Water Reminder & Tracker",
    description: "Step-by-step documentation on how to set up and use SipSync in your browser.",
};

export default function SipSyncGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
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
            <header className="mb-16 border-b border-slate-800 pb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#51BFF2]/10 mb-6 border border-[#51BFF2]/20">
                    <BookOpen size={32} className="text-[#51BFF2]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    SipSync User Guide
                </h1>
                <p className="text-xl text-slate-400">
                    Learn how to set up hydration goals, configure smart intervals, and manage your progress inside Google Chrome.
                </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-16">

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <MonitorPlay size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">1. Installation & Start</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Getting started with SipSync is simple as it runs directly inside your Chrome browser.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                        <li>Visit the <a href="https://chromewebstore.google.com/detail/ojcpfggpjpaeehhppnelbmcidmglebjl?utm_source=item-share-cb" target="_blank" rel="noopener noreferrer" className="text-[#51BFF2] hover:underline inline-flex items-center gap-1 font-semibold">SipSync Chrome Web Store page <ExternalLink size={14} /></a>.</li>
                        <li>Click <strong>"Add to Chrome"</strong> to install the extension.</li>
                        <li>Once installed, click the puzzle piece icon in the top right of your Chrome toolbar.</li>
                        <li>Find SipSync in the list and click the <strong>Pin icon</strong> so it stays permanently visible for easy access.</li>
                        <li>Click the newly pinned SipSync water drop icon to open the extension dashboard.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                            <Target size={24} className="text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">2. Setting Your Daily Goal</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        To effectively track your hydration, you must set an overarching target for the day.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ol className="list-decimal list-inside space-y-4">
                            <li>Open the SipSync extension popup.</li>
                            <li>Look for the <strong>Target</strong> card below the main water wave circle.</li>
                            <li>Click the small <strong>Pencil icon</strong> to edit your daily goal.</li>
                            <li>Type in your target in milliliters (ml) — for example, <code>2500</code> for 2.5 liters.</li>
                            <li>Press Enter or click outside to save. Your progress circle will automatically adjust to this new target.</li>
                        </ol>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Bell size={24} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">3. Reminders & Intervals</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        SipSync uses Chrome's native alarm APIs to remind you. It will never spam you—if you step away from your computer, only the single most recent notification is held.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>In the extension popup, find the <strong>Interval Dropdown</strong> at the bottom.</li>
                        <li>Select how often you wish to be reminded (e.g., Every 30 minutes, Every 1 hour).</li>
                        <li>Click <strong>"Start Reminder"</strong>. The button will change to "Stop Reminder" and your timer begins.</li>
                        <li>When the timer expires, SipSync will send you a reminder.</li>
                        <li>The notification will prompt you to "Drink 200ml" or "Ignore". Clicking "Drink" immediately updates your progress circle without needing to open the popup.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <Settings size={24} className="text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">4. Personalization & Settings</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Click the <strong>Settings Cog</strong> icon in the top right of the extension to open preferences.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Notification Style:</strong> Toggle between OS-level native desktop notifications or a custom Chrome HTML popup notification for your alerts.</li>
                            <li><strong>Allow OS Notifications:</strong> If you choose OS notifications, ensure that your computer's operating system settings (macOS/Windows) allow notifications for Google Chrome.</li>
                            <li><strong>Sound Effects:</strong> SipSync features a custom sound for reminders and a victory chime when you reach 100% of your daily goal. You can toggle all sounds off here.</li>
                            <li><strong>Quotes:</strong> Toggle the motivational hydration quote displayed in your extension window.</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-8 mt-12 mb-16 flex gap-6 items-center flex-col md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Hitting Your Goal
                        </h2>
                        <p className="leading-relaxed mb-4">
                            When your progress tracker hits 100% of your daily target, SipSync will automatically trigger a confetti celebration, a victory sound, and a congratulatory popup!
                        </p>
                        <p className="leading-relaxed text-sky-300 font-medium">
                            Don't worry about manual resets—at midnight, SipSync automatically resets your progress to 0ml to cleanly start the next day.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-full w-32 h-32 border-4 border-sky-500 shadow-[0_0_30px_rgba(81,191,242,0.4)]">
                        <span className="text-3xl font-bold text-white relative z-10">100%</span>
                        <Droplets className="text-sky-500 absolute scale-150 opacity-20" size={64} />
                    </div>
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
                                        href="/products/sipsync/faq"
                                        className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#51BFF2]/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <MessageCircleQuestion size={20} className="text-[#51BFF2]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold">FAQs</h3>
                                            <p className="text-slate-500 text-sm">Frequently asked questions</p>
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
                                        <ExternalLink size={16} className="text-slate-600 group-hover:text-[#51BFF2] transition-colors" />
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
                                    If your question isn't covered in this guide, reach out directly through my contact form.
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
        </div>
    );
}
