import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, BookOpen, MessageCircleQuestion, ExternalLink, Database, LayoutGrid } from "lucide-react";
import { BASE_PATH, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Privacy Policy — Salesforce SmartKit | Kevin Suvagiya",
    description:
        "Privacy policy for Salesforce SmartKit Chrome Extension. SmartKit does not collect any personal data.",
    openGraph: {
        title: "Privacy Policy — Salesforce SmartKit",
        description: "SmartKit does not collect any personal data. Everything stays local on your device.",
        url: `${SITE_URL}/products/salesforcesmartkit/privacy`,
    },
};

export default function SalesforceSmartKitPrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Navigation */}
            <Link
                href="/products/salesforcesmartkit"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium mb-12"
            >
                <ArrowLeft size={16} />
                Salesforce SmartKit
            </Link>

            {/* Product Identity */}
            <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 mb-10">
                <Image
                    src={`${BASE_PATH}/products/salesforcesmartkit-logo.png`}
                    alt="Salesforce SmartKit Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                />
                <div>
                    <h2 className="text-white font-semibold">Salesforce SmartKit</h2>
                    <p className="text-slate-400 text-sm">The Ultimate Admin Tool · Chrome Extension</p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={24} className="text-indigo-400" />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Privacy Policy
                    </h1>
                </div>
                <p className="text-slate-500 text-sm mt-2">
                    Effective Date: May 2026 · Version 1.0.0
                </p>
            </div>

            {/* Content */}
            <div className="space-y-10 text-slate-300 leading-relaxed">
                {/* Introduction */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">1. What Data Do We Collect?</h2>
                    <p className="mt-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                        <strong>We collect absolutely nothing.</strong>
                    </p>
                    <p className="mt-4">
                        The Salesforce SmartKit does not have a backend server, database, or analytics tracking mechanism. We do not track your usage, log the queries you write, or collect your personal information or your Salesforce organization's data.
                    </p>
                </section>

                {/* How Does It Work */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">2. How Does the Extension Work Without Collecting Data?</h2>
                    <p className="mb-4">
                        The extension acts solely as a local conduit between your Chrome Browser and your active Salesforce instance.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Local Data</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Mechanism</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">Session IDs (`sid` cookies)</td>
                                    <td className="py-3 px-4">To make API calls on your behalf, the extension reads your active Salesforce Session ID from your browser. This is stored exclusively in `chrome.storage.local` and only sent directly to Salesforce's official API endpoints.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4">UI Preferences & Draft SOQL</td>
                                    <td className="py-3 px-4">The extension uses `chrome.storage.local` to save your active Tab selection, theme, and draft SOQL queries. This data never leaves your local machine.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Chrome Permissions */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">3. Permissions Justification</h2>
                    <p className="mb-4">
                        When installing the extension, Chrome will warn you that it requests broad permissions. Here is why those specific permissions are required strictly for functionality:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Permission</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Why It's Needed</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-indigo-400 text-xs">*://*.force.com/* & *://*.salesforce.com/*</code></td>
                                    <td className="py-3 px-4">Required to make Cross-Origin (CORS) API requests to Salesforce. Without this, the extension cannot fetch data or save your inline edits.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-indigo-400 text-xs">cookies</code></td>
                                    <td className="py-3 px-4">Required to locate your active Salesforce Session ID so you don't have to manually log in to the extension.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-indigo-400 text-xs">storage</code></td>
                                    <td className="py-3 px-4">Required to save your settings and draft SOQL queries locally.</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-3 px-4"><code className="text-indigo-400 text-xs">scripting & activeTab</code></td>
                                    <td className="py-3 px-4">Required to inject the floating "SmartKit" button and the "Show API Names" red text directly into the Salesforce web page you are viewing.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
                    <p>
                        The extension does not embed any third-party tracking scripts. 
                        The extension does embed the open-source <strong>Monaco Editor</strong> for SOQL highlighting, but this is bundled locally within the extension files and does not "phone home" to Microsoft.
                    </p>
                </section>

                {/* Security Recommendations */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">5. Security Recommendations for Users</h2>
                    <ul className="space-y-2 text-slate-400 list-disc list-inside">
                        <li>Ensure your physical machine is secure.</li>
                        <li>Only install the extension from the official Chrome Web Store.</li>
                        <li>If you suspect your browser is compromised, log out of Salesforce immediately, which invalidates the Session ID on Salesforce's end.</li>
                    </ul>
                </section>
                
                {/* Contact */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
                    <p>
                        For questions regarding this privacy policy or the source code, please review the public GitHub repository associated with this project or contact me via my{" "}
                        <Link href="/#contact" className="text-indigo-400 hover:underline">
                            portfolio contact form
                        </Link>.
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
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                                <Link
                                    href="/products/salesforcesmartkit/faq"
                                    className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <MessageCircleQuestion size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">FAQs</h3>
                                        <p className="text-slate-500 text-sm">Common questions & answers</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
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
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
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
                                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form Link */}
                        <div className="flex-1 p-8 md:p-12 bg-indigo-500/5 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                                <MessageCircleQuestion size={32} className="text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
                            <p className="text-slate-400 mb-8 max-w-xs">
                                If you want to learn more about how to use the extension or have other questions, reach out directly.
                            </p>
                            <Link
                                href="/#contact"
                                className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
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
