import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, BookOpen, MessageCircleQuestion, ExternalLink, Droplets, LayoutGrid } from "lucide-react";
import { BASE_PATH, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Privacy Policy — SipSync | Kevin Suvagiya",
    description:
        "Privacy policy for SipSync — Water Reminder & Hydration Tracker Chrome Extension. SipSync does not collect any personal data.",
    openGraph: {
        title: "Privacy Policy — SipSync",
        description: "SipSync does not collect any personal data. Everything stays local on your device.",
        url: `${SITE_URL}/products/sipsync/privacy`,
    },
};

export default function SipSyncPrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Navigation */}
            <Link
                href="/products/sipsync"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-[#51BFF2] transition-colors text-sm font-medium mb-12"
            >
                <ArrowLeft size={16} />
                SipSync
            </Link>

            {/* Product Identity */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 mb-10">
                <Image
                    src={`${BASE_PATH}/products/sipsync-logo.png`}
                    alt="SipSync Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                />
                <div>
                    <h2 className="text-white font-semibold">SipSync</h2>
                    <p className="text-slate-400 text-sm">Water Reminder & Hydration Tracker · Chrome Extension</p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={24} className="text-[#51BFF2]" />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Privacy Policy
                    </h1>
                </div>
                <p className="text-slate-500 text-sm mt-2">
                    Effective Date: March 2026 · Version 1.0.0
                </p>
            </div>

            {/* Content */}
            <div className="space-y-10 text-slate-300 leading-relaxed">
                {/* Introduction */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                    <p>
                        SipSync is a Chrome Extension built by Kevin Suvagiya that helps you stay hydrated by
                        sending periodic reminders and tracking your daily water intake. This privacy policy explains
                        how SipSync handles your data.
                    </p>
                    <p className="mt-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                        <strong>TL;DR:</strong> SipSync does <strong>not</strong> collect any personal information. All data stays
                        on your device, and nothing is ever sent anywhere.
                    </p>
                </section>

                {/* Information We Collect */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
                    <p className="mb-4">
                        SipSync does <strong>not</strong> collect any personal information. The extension stores the following
                        data <strong>locally on your device</strong> using <code className="text-[#51BFF2] bg-slate-800 px-1.5 py-0.5 rounded text-xs">chrome.storage.sync</code>:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Data</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Reminder interval</td>
                                    <td className="py-3 px-4">How often to send reminders</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Daily water target</td>
                                    <td className="py-3 px-4">Your hydration goal in ml (max 6000ml)</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Current intake</td>
                                    <td className="py-3 px-4">Water consumed today (max 6000ml)</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Glass size</td>
                                    <td className="py-3 px-4">Your configured glass size in ml (max 1000ml)</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Notification preferences</td>
                                    <td className="py-3 px-4">OS/popup notification choice</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Sound & theme settings</td>
                                    <td className="py-3 px-4">UI preferences</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Intake history</td>
                                    <td className="py-3 px-4">Past daily hydration records for the calendar & medal system</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Last reminder time & active date</td>
                                    <td className="py-3 px-4">Timestamps for scheduling and daily reset logic</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Active reminder ID</td>
                                    <td className="py-3 px-4">Token to prevent double-counting drinks from re-opened tabs</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* What We Do NOT Collect */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">3. What We Do NOT Collect</h2>
                    <ul className="space-y-2 text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No personal information (name, email, age, location)</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No browsing history, URLs visited, or tab content</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No analytics, telemetry, or usage tracking</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No cookies or tracking pixels</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No data transmitted to any external server or third party</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No accounts, logins, or authentication</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No ads or ad-related tracking</li>
                    </ul>
                </section>

                {/* How We Use Information */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">4. How We Use Information</h2>
                    <p>
                        All stored data is used <strong>purely for app functionality</strong>: scheduling reminders at your chosen
                        interval, tracking your daily water intake, and remembering your preferences. Nothing more.
                    </p>
                </section>

                {/* Data Sharing */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">5. Data Sharing & Disclosure</h2>
                    <p>
                        <strong>We do not share any data. Period.</strong> SipSync has no server, no database and no cloud storage. Everything operates 100% locally on your device.
                    </p>
                </section>

                {/* Chrome Permissions */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">6. Chrome Permissions Explained</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Permission</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Why It&apos;s Needed</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-[#51BFF2] text-xs">storage</code></td>
                                    <td className="py-3 px-4">Saves preferences and intake data locally. No data leaves the device.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-[#51BFF2] text-xs">alarms</code></td>
                                    <td className="py-3 px-4">Schedules periodic reminder events at your chosen interval.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-[#51BFF2] text-xs">notifications</code></td>
                                    <td className="py-3 px-4">Displays native OS notifications with action buttons.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-[#51BFF2] text-xs">tabs</code></td>
                                    <td className="py-3 px-4">Manages SipSync&apos;s own popup windows only. Never reads or monitors your browsing.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Services</h2>
                    <p>
                        <strong>None.</strong> SipSync does not use any third-party services, SDKs, analytics tools,
                        crash reporters, or external APIs.
                    </p>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention & Deletion</h2>
                    <ul className="space-y-2 text-slate-400 list-disc list-inside">
                        <li>Data persists in Chrome storage as long as the extension is installed.</li>
                        <li>Daily intake resets automatically each day at midnight.</li>
                        <li>Uninstalling the extension completely removes all stored data.</li>
                    </ul>
                </section>

                {/* Changes */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
                    <p>
                        If we update this privacy policy, the changes will be reflected on this page with an updated
                        effective date. Significant changes will be communicated through the extension.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
                    <p>
                        For questions about this privacy policy, you can reach out directly via the{" "}
                        <Link href="/#contact" className="text-[#51BFF2] hover:underline">
                            portfolio contact form
                        </Link>
                        .
                    </p>
                </section>
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
                                    href="/products/sipsync/faq"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#51BFF2]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <MessageCircleQuestion size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">FAQs</h3>
                                        <p className="text-slate-500 text-sm">Common questions & answers</p>
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
                                If you want to learn more about how to use the extension or have other questions, reach out directly.
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
