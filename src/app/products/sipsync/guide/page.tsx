import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Droplets, Bell, Target, Settings, MonitorPlay, MessageCircleQuestion, Shield, ExternalLink, LayoutGrid, BarChart3 } from "lucide-react";

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
                        To effectively track your hydration, you must set an overarching target for the day. You can set a maximum daily goal of <strong>6000ml</strong>.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ol className="list-decimal list-inside space-y-4">
                            <li>Open the SipSync extension popup.</li>
                            <li>Look for the <strong>Target</strong> card below the main water wave circle.</li>
                            <li>Click the small <strong>Pencil icon</strong> to edit your daily goal.</li>
                            <li>Type in your target in milliliters (ml) — for example, <code>2500</code> for 2.5 liters (max 6000ml).</li>
                            <li>Press <strong>Enter</strong> or click the <strong>check icon</strong> to save. Your progress circle will automatically adjust to this new target.</li>
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
                        SipSync uses Chrome&apos;s native alarm APIs to remind you. It will never spam you — if your laptop was asleep or Chrome was closed, only the single most recent notification is shown. No notification bursts.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>In the extension popup, find the <strong>Reminder Interval</strong> input at the bottom.</li>
                        <li>Set how often you wish to be reminded (e.g., every 15 minutes, every 1 hour). If the field is left empty or invalid, it automatically defaults to <strong>45 minutes</strong>.</li>
                        <li>Click <strong>&quot;Start Reminder&quot;</strong>. The button will change to &quot;Stop Reminder&quot; and your timer begins.</li>
                        <li>To change the interval while a reminder is active, update the value and click <strong>&quot;Save&quot;</strong>.</li>
                        <li>When the timer expires, SipSync sends you a reminder via your chosen notification method.</li>
                        <li>The notification will prompt you to <strong>&quot;I drank Xml&quot;</strong> (where X is your configured glass size) or <strong>&quot;Ignore&quot;</strong>. Clicking &quot;Drink&quot; immediately updates your progress circle.</li>
                        <li><strong>Note:</strong> Clicking &quot;Drink&quot; from the main extension popup resets the reminder timer. Clicking from OS notifications or the reminder popup does <em>not</em> reset the timer — they continue on their regular schedule.</li>
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
                            <li><strong>Reminder Delivery:</strong> Toggle OS Notifications and/or Reminder Pop-up on or off. You can enable <strong>one or both</strong> simultaneously.</li>
                            <li><strong>Sound Effects:</strong> SipSync features a custom sound for reminders and a special celebration sound when you reach 100% of your daily goal. Toggle all sounds on or off here.</li>
                            <li><strong>Glass Size:</strong> Configure your glass size (default: 200ml, max: 1000ml). All &quot;Drink&quot; buttons across the extension — including notifications — will use this value.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <BarChart3 size={24} className="text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">5. Hydration Calendar & Statistics</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Track your hydration progress over time with the built-in statistics page, accessible via the <strong>chart icon</strong> on the main homepage (beside the settings gear).
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-3">
                            <li><strong>Monthly Calendar View:</strong> Displays a full month grid with day numbers. Navigate between months using the Previous/Next buttons.</li>
                            <li><strong>Dynamic Water Fill:</strong> Each day cell fills with blue water visually from bottom to top based on the percentage of your daily goal reached (e.g., reaching 1500ml of a 3000ml goal fills the cell halfway).</li>
                            <li><strong>Hover Tooltips:</strong> Hover over any tracked day to see exact intake details (e.g., &quot;1800ml / 3000ml (60%)&quot;).</li>
                            <li><strong>Perfect Days:</strong> Days where you hit 100% of your goal are highlighted with a golden fill and a 🏆 icon.</li>
                            <li><strong>Monthly Overview:</strong> A stats panel below the calendar shows your total consumed, active days (excluding days with 0 intake), and average daily intake for the selected month — along with a motivational message.</li>
                            <li><strong>All-Time Achievements:</strong> A summary card showing lifetime metrics:
                                <ul className="list-none space-y-1 mt-2 ml-6">
                                    <li>🏆 <strong>Perfect Days</strong> — Total count of days you hit 100% of your goal.</li>
                                    <li>💧 <strong>Monthly Avg</strong> — Average water consumed per active month across all time.</li>
                                    <li>🌱 <strong>Active Days</strong> — Total count of days where you tracked at least some water.</li>
                                </ul>
                            </li>
                            <li><strong>Real-Time Updates:</strong> Today&apos;s calendar tile dynamically fills in real-time as you drink water throughout the day.</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-8 mt-12 mb-16 flex gap-6 items-center flex-col md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Hitting Your Goal
                        </h2>
                        <p className="leading-relaxed mb-4">
                            When your intake reaches your daily target, SipSync celebrates! If the extension popup is open, confetti fires directly inside the popup. If triggered from a notification, a separate celebration popup opens with confetti, a congratulatory message, and a special celebration sound. An OS &quot;🎉 Goal Complete!&quot; notification is also displayed.
                        </p>
                        <p className="leading-relaxed text-sky-300 font-medium">
                            Don&apos;t worry about manual resets — at midnight, SipSync automatically resets your progress to 0ml to cleanly start the next day. Your total daily intake is capped at <strong>6000ml</strong> across all entry points.
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
