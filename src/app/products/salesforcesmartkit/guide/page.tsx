import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Database, Search, Code, Shield, ExternalLink, LayoutGrid, Zap, Eye, ArrowUpFromLine, Network, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
    title: "Salesforce SmartKit User Guide | Admin Extension",
    description: "Step-by-step documentation on how to use Salesforce SmartKit to boost your productivity.",
};

export default function SalesforceSmartKitGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
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
            <header className="mb-16 border-b border-slate-800 pb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-6 border border-indigo-500/20">
                    <BookOpen size={32} className="text-indigo-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Salesforce SmartKit User Guide
                </h1>
                <p className="text-xl text-slate-400">
                    Learn how to utilize SmartKit's powerful tools to save time and work more efficiently in Salesforce.
                </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-16">

                {/* 1. Initialization */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Zap size={24} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">1. Getting Started</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        SmartKit is designed to be instantly available right where you work.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                        <li>Install the extension from the Chrome Web Store.</li>
                        <li>Log in to any Salesforce Org. SmartKit will place a small, floating avatar on your screen.</li>
                        <li>Click the avatar to pull out the full-screen SmartKit interface over your active Salesforce tab.</li>
                        <li>If you have multiple Salesforce Orgs open in different tabs, click the avatar inside SmartKit to use the <strong>User Switcher</strong> and instantly jump between your active sessions.</li>
                    </ul>
                </section>

                {/* 2. SmartView */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Eye size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">2. SmartView (Record Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Quickly inspect and edit individual records without navigating through slow page layouts.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Instant Inspection:</strong> Enter any Record ID to instantly view all its field values in a clean list.</li>
                            <li><strong>Inline Editing:</strong> Double-click editable fields to make quick changes and save them instantly.</li>
                            <li><strong>Setup Shortcuts:</strong> Click the navigate icon next to any field to jump directly to that field's configuration page in Object Manager.</li>
                        </ul>
                    </div>
                </section>

                {/* 3. SmartExport */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                            <Database size={24} className="text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">3. SmartExport (Data Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Extract and analyze data rapidly with the built-in SOQL editor.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Write Queries Faster:</strong> The editor provides auto-completion for standard SOQL commands and helps you format your query cleanly.</li>
                            <li><strong>Large Data Handling:</strong> Write your query, hit execute, and SmartKit handles gathering all the results, even for large datasets.</li>
                            <li><strong>Instant CSV Exports:</strong> Click the Export button to download your results. SmartKit automatically organizes related data (like Account Name on an Opportunity query) into clean CSV columns.</li>
                        </ul>
                    </div>
                </section>

                {/* 4. SmartImport */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <ArrowUpFromLine size={24} className="text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">4. SmartImport (Import Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Mass update or create records directly in your browser without needing bulky external desktop tools.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Easy Paste:</strong> Copy your CSV data from Excel or Google Sheets and paste it right into the tool.</li>
                            <li><strong>Simple Mapping:</strong> Select the object you want to update and ensure your column headers match the field names.</li>
                            <li><strong>Rapid Execution:</strong> SmartKit rapidly processes your rows and provides a clear success or error report for each record.</li>
                        </ul>
                    </div>
                </section>

                {/* 5. SmartSchema */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <Network size={24} className="text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">5. SmartSchema (Schema Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Understand your database structure in seconds.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Object Overview:</strong> Quickly search for any object to view a complete list of its fields.</li>
                            <li><strong>Field Details:</strong> Instantly see if a field type and get button to see it in more details in setup.</li>
                            <li><strong>Relationships:</strong> Visualize how objects are connected and quickly check cascade delete rules.</li>
                        </ul>
                    </div>
                </section>

                {/* 6. SmartSecurity */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <ShieldAlert size={24} className="text-violet-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">6. SmartSecurity (Permissions Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        Stop guessing why a user can't see a field. Audit permissions instantly.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Select the Target:</strong> Choose a permission feature (Permission set/PS group/profile/user) and select metadata to analyse that can be object, field, class, etc...</li>
                            <li><strong>View Access Matrix:</strong> SmartKit instantly displays a clear list of every Profile and Permission Set that grants Read or Edit access to that field.</li>
                        </ul>
                    </div>
                </section>

                {/* 7. SmartCode */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <Code size={24} className="text-pink-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">7. SmartCode (Dev Tab)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        A lightweight alternative to the Developer Console.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Smart Coding:</strong> Retrieve your Apex, LWC, VF Pages and Triggers to update and see them in action, directly from your browser!</li>
                            <li><strong>Error Highlighting:</strong> If your code has an error, SmartKit clearly highlights the line so you can fix it fast.</li>
                        </ul>
                    </div>
                </section>

                {/* 8. Command Palette */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <Search size={24} className="text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">8. Command Palette (Cmd+K)</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        The ultimate shortcut for navigating Salesforce.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-3">
                            <li><strong>Open Anywhere:</strong> Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) while inside the SmartKit interface.</li>
                            <li><strong>Search Everything:</strong> Type what you are looking for—like "Company Information", a User's name, or a Profile name.</li>
                            <li><strong>Jump Instantly:</strong> Hit Enter to bypass the slow Setup menu and open a new tab directly to the page you need.</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-8 mt-12 mb-16 flex gap-6 items-center flex-col md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Security First
                        </h2>
                        <p className="leading-relaxed mb-4">
                            SmartKit never stores your Salesforce password. It operates entirely by securely connecting to your active browser session.
                        </p>
                        <p className="leading-relaxed text-indigo-300 font-medium">
                            If you log out of Salesforce in your browser, SmartKit instantly loses access, ensuring absolute security for your data.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-full w-32 h-32 border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                        <Shield className="text-indigo-500 relative z-10" size={48} />
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
                                        href="/products/salesforcesmartkit/faq"
                                        className="group flex items-center p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <BookOpen size={20} className="text-indigo-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold">FAQs</h3>
                                            <p className="text-slate-500 text-sm">Frequently asked questions</p>
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
                                    <BookOpen size={32} className="text-indigo-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
                                <p className="text-slate-400 mb-8 max-w-xs">
                                    If your question isn't covered in this guide, reach out directly through my contact form.
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
        </div>
    );
}
