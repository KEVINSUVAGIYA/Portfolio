import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, ExternalLink, MessageCircleQuestion, BookOpen, Diamond, LayoutGrid } from "lucide-react";
import { BASE_PATH, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Privacy Policy — HeeraHisaab | Kevin Suvagiya",
    description:
        "Privacy policy for HeeraHisaab — Intelligent Diamond Tracking web app. Learn how your data is stored and protected.",
    openGraph: {
        title: "Privacy Policy — HeeraHisaab",
        description: "Learn how HeeraHisaab handles and protects your data.",
        url: `${SITE_URL}/products/heerahisaab/privacy`,
    },
};

export default function HeeraHisaabPrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Navigation */}
            <Link
                href="/products/heerahisaab"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium mb-12"
            >
                <ArrowLeft size={16} />
                HeeraHisaab
            </Link>

            {/* Product Identity */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 mb-10">
                <Image
                    src={`${BASE_PATH}/products/heerahisaab-logo.png`}
                    alt="HeeraHisaab Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                />
                <div>
                    <h2 className="text-white font-semibold">HeeraHisaab</h2>
                    <p className="text-slate-400 text-sm">Intelligent Diamond Tracking · Web App (PWA)</p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={24} className="text-[#3b82f6]" />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Privacy Policy
                    </h1>
                </div>
                <p className="text-slate-500 text-sm mt-2">
                    Effective Date: March 2026
                </p>
            </div>

            {/* Content */}
            <div className="space-y-10 text-slate-300 leading-relaxed">
                {/* Introduction */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                    <p>
                        HeeraHisaab is a web application built by Kevin Suvagiya that helps diamond workers log
                        daily work, track earnings, and monitor monthly progress. This privacy policy explains how
                        we collect, use, and protect your information.
                    </p>
                </section>

                {/* Information We Collect */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>

                    <h3 className="text-lg font-medium text-slate-200 mt-6 mb-3">2.1 Authentication Data</h3>
                    <p className="mb-4">
                        HeeraHisaab uses <strong>Google Sign-In</strong> via Firebase Authentication.
                        When you sign in, we receive:
                    </p>
                    <ul className="space-y-1 text-slate-400 list-disc list-inside mb-4">
                        <li>Google display name</li>
                        <li>Email address</li>
                        <li>Profile photo URL</li>
                    </ul>
                    <p className="text-slate-400 text-sm">
                        No passwords are stored — authentication is handled entirely by Google.
                    </p>

                    <h3 className="text-lg font-medium text-slate-200 mt-6 mb-3">2.2 App Data</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Data Type</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Purpose</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Stored Where</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Diamond work entries</td>
                                    <td className="py-3 px-4">Core tracking — dates, rates, quantities, totals</td>
                                    <td className="py-3 px-4">Firebase (Google Cloud)</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Default rate presets</td>
                                    <td className="py-3 px-4">Pre-fill entry forms</td>
                                    <td className="py-3 px-4">Firebase (Google Cloud)</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Language preference</td>
                                    <td className="py-3 px-4">Remember UI language choice</td>
                                    <td className="py-3 px-4">Browser (localStorage)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* What We Do NOT Collect */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">3. What We Do NOT Collect</h2>
                    <ul className="space-y-2 text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No device identifiers or fingerprinting</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No location data or GPS</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No contacts or phone data</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No advertising IDs or ad tracking</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No third-party analytics (no Google Analytics, no Mixpanel)</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No cookies for tracking purposes</li>
                        <li className="flex items-start gap-2"><span className="text-red-400">✕</span> No data is sold or shared with any third party</li>
                    </ul>
                </section>

                {/* How We Use Information */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">4. How We Use Your Information</h2>
                    <p>
                        All collected data is used <strong>solely for app functionality</strong>:
                    </p>
                    <ul className="space-y-1 text-slate-400 list-disc list-inside mt-3">
                        <li>Your Google profile is displayed in the settings screen for identification.</li>
                        <li>Diamond entries are stored to provide your tracking dashboard, history, and insights.</li>
                        <li>Rate presets auto-fill the entry form for faster data input.</li>
                        <li>Language preference ensures the app loads in your chosen language.</li>
                    </ul>
                </section>

                {/* Data Storage & Security */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">5. Data Storage & Security</h2>
                    <ul className="space-y-2 text-slate-400 list-disc list-inside">
                        <li>Data is stored on <strong className="text-slate-300">Google Cloud Firestore</strong> (Firebase), governed by Google Cloud&apos;s security infrastructure.</li>
                        <li>All data is transmitted over <strong className="text-slate-300">HTTPS</strong> (TLS encryption in transit).</li>
                        <li>Firestore security rules enforce <strong className="text-slate-300">user-level isolation</strong> — each user can only read/write their own data.</li>
                        <li>No sensitive financial data (bank accounts, card numbers) is ever collected.</li>
                        <li>The app does not process payments of any kind.</li>
                    </ul>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Service</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Provider</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Firebase Authentication</td>
                                    <td className="py-3 px-4">Google</td>
                                    <td className="py-3 px-4">User sign-in</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Cloud Firestore</td>
                                    <td className="py-3 px-4">Google</td>
                                    <td className="py-3 px-4">Data storage</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Firebase Hosting</td>
                                    <td className="py-3 px-4">Google</td>
                                    <td className="py-3 px-4">Serving the web app</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-slate-500 text-sm mt-3">
                        All Firebase services are governed by{" "}
                        <a
                            href="https://firebase.google.com/support/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3b82f6] hover:underline inline-flex items-center gap-1"
                        >
                            Google&apos;s Firebase Privacy Policy
                            <ExternalLink size={12} />
                        </a>
                    </p>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention & Deletion</h2>
                    <ul className="space-y-2 text-slate-400 list-disc list-inside">
                        <li>User data is retained as long as the account exists.</li>
                        <li>Individual entries can be deleted from within the app (History tab → delete button).</li>
                        <li>To delete your account and all associated data, contact the developer.</li>
                    </ul>
                </section>

                {/* Children's Privacy */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
                    <p>
                        HeeraHisaab is not directed at children under 13. No data is knowingly collected from children.
                    </p>
                </section>

                {/* Changes */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. Changes will be reflected on this page
                        with an updated effective date. Significant changes will be communicated through the app.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
                    <p>
                        For privacy questions or data deletion requests, you can reach out directly via the{" "}
                        <Link href="/#contact" className="text-[#3b82f6] hover:underline">
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
                                    href="/products/heerahisaab/faq"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-[#3b82f6]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <MessageCircleQuestion size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">FAQs</h3>
                                        <p className="text-slate-500 text-sm">Common questions & answers</p>
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
                                If you want to learn more about how to use the app or have other questions, reach out directly.
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
