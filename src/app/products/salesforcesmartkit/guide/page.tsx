import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    Database,
    Search,
    Code,
    Shield,
    ExternalLink,
    LayoutGrid,
    Zap,
    Eye,
    ArrowUpFromLine,
    Network,
    ShieldAlert,
    Gauge,
    GitCompare,
    Boxes,
    Command,
    PanelRightClose,
    Layout,
    KeyRound,
    Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Salesforce SmartKit User Guide | Ultimate Admin & Developer Manual",
    description: "Complete user manual, tool guides, keyboard shortcuts, and setup instructions for Salesforce SmartKit v1.0.13.",
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
                    <BookOpen size={32} className="text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Salesforce SmartKit User Guide
                </h1>
                <p className="text-xl text-slate-400">
                    Official Product Manual & Documentation (v1.0.13). Learn how to master all 9 integrated tools and keyboard shortcuts.
                </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-16">

                {/* 1. Overview & Access Modes */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Layout size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">1. Overview & 3 Access Modes</h2>
                    </div>
                    <p className="leading-relaxed mb-6">
                        Salesforce SmartKit is an all-in-one productivity command center built for Salesforce Administrators, Developers, Architects, and Consultants. It integrates directly into your browser workflow to eliminate setup search fatigue, speed up data operations, and streamline code execution.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                                <PanelRightClose size={20} />
                            </div>
                            <h3 className="text-white font-bold mb-2">1. In-Page Sidebar Drawer</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Glides open natively on any Salesforce tab (<code className="text-indigo-300">*.lightning.force.com</code>) via pull-string widget or <code className="text-indigo-300">⌘ + Shift + K</code>.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                                <Layout size={20} />
                            </div>
                            <h3 className="text-white font-bold mb-2">2. Chrome Side Panel</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Pins vertically alongside your main browser window for non-intrusive, side-by-side multitasking.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                                <Code size={20} />
                            </div>
                            <h3 className="text-white font-bold mb-2">3. Full App Tab</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Full-screen application tab featuring full Monaco editor capabilities and multi-tab workspaces.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Installation & Session Setup */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Zap size={24} className="text-amber-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">2. Installation & 0ms Session Setup</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        SmartKit uses zero-configuration <strong>Session Token Extraction</strong> (`sid` cookie). You do not need to configure OAuth apps, connected apps, or security tokens.
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
                        <ol className="list-decimal list-inside space-y-3">
                            <li>Install <strong>Salesforce SmartKit</strong> from the Chrome Web Store (or load unpacked build folder in Developer mode).</li>
                            <li>Log into any Salesforce Org in a standard Chrome tab.</li>
                            <li>Open SmartKit. It extracts your active session cookie (`sid`) on frame 1 with <strong>0ms delay</strong>, loading your profile instantly without spinners.</li>
                            <li><strong>Multi-Org Account Switcher:</strong> Click your profile avatar in the top-right header to instantly detect and switch between all active Salesforce tabs (Production, Sandboxes, Developer Orgs) open across your browser windows.</li>
                        </ol>
                    </div>
                </section>

                {/* 3. Master Navigation & Shortcuts */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <Command size={24} className="text-violet-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">3. Master Navigation & Keyboard Shortcuts</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        SmartKit features a 2-level keyboard navigation system designed for maximum hands-on-keyboard speed:
                    </p>
                    <div className="overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="py-2 px-3">Shortcut</th>
                                    <th className="py-2 px-3">Action</th>
                                    <th className="py-2 px-3">Scope</th>
                                    <th className="py-2 px-3">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + K / Ctrl + K</td>
                                    <td className="py-2.5 px-3 font-medium">Command Palette</td>
                                    <td className="py-2.5 px-3 text-slate-400">Global</td>
                                    <td className="py-2.5 px-3 text-slate-400">Instant search across metadata, sObjects, setup links, and records.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + Shift + K</td>
                                    <td className="py-2.5 px-3 font-medium">Toggle Sidebar</td>
                                    <td className="py-2.5 px-3 text-slate-400">Salesforce Tab</td>
                                    <td className="py-2.5 px-3 text-slate-400">Opens or closes the in-page floating sidebar drawer.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + Shift + ← / →</td>
                                    <td className="py-2.5 px-3 font-medium">Level 1 Master Navigation</td>
                                    <td className="py-2.5 px-3 text-slate-400">App / Sidebar</td>
                                    <td className="py-2.5 px-3 text-slate-400">Cycles sequentially through all 9 master tool tabs.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + Option + Shift + ← / →</td>
                                    <td className="py-2.5 px-3 font-medium">Level 2 Sub-Tab Nav</td>
                                    <td className="py-2.5 px-3 text-slate-400">SmartView / Export</td>
                                    <td className="py-2.5 px-3 text-slate-400">Cycles open record sub-tabs or query sub-tabs with auto-scroll.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + S / Ctrl + S</td>
                                    <td className="py-2.5 px-3 font-medium">Save Record Edits</td>
                                    <td className="py-2.5 px-3 text-slate-400">SmartView</td>
                                    <td className="py-2.5 px-3 text-slate-400">Commits modified inline fields to Salesforce via REST API.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">⌘ + Enter / Ctrl + Enter</td>
                                    <td className="py-2.5 px-3 font-medium">Run Query / Apex</td>
                                    <td className="py-2.5 px-3 text-slate-400">Export / Code</td>
                                    <td className="py-2.5 px-3 text-slate-400">Executes active SOQL query or Anonymous Apex script.</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">Esc</td>
                                    <td className="py-2.5 px-3 font-medium">Hierarchical Dismissal</td>
                                    <td className="py-2.5 px-3 text-slate-400">Global</td>
                                    <td className="py-2.5 px-3 text-slate-400">1st Esc closes active modal/overlay; 2nd Esc closes sidebar drawer.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Detailed 9 Tool Feature Manuals */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
                        4. Detailed Tool Feature Manuals
                    </h2>

                    <div className="space-y-10">

                        {/* 4.1 SmartView */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Eye size={22} className="text-[#f43f5e]" /> 4.1 SmartView (Record Inspector)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Inspect and edit any Salesforce record on the fly, bypassing slow Lightning page layouts.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Multi-Tab Record Sessions:</strong> Open multiple records simultaneously in sub-tabs with <code className="text-slate-200">#f43f5e</code> tab indicators.</li>
                                <li><strong>Inline Editing (SmartEdit):</strong> Double-click any field to edit. Picklists feature custom fuzzy search pickers.</li>
                                <li><strong>Field Filter Chips:</strong> Filter record fields by <em>All Fields</em>, <em>Custom Fields (`__c`)</em>, <em>Populated Only</em>, <em>System Fields</em>, or <em>Edited Fields</em>.</li>
                                <li><strong>Hover Intelligence:</strong> Hover field labels to inspect developer API names, field types, formula expressions, and help text.</li>
                                <li><strong>Object Manager Link:</strong> Gear icon opens exact field definitions directly in Salesforce Setup Object Manager.</li>
                            </ul>
                        </div>

                        {/* 4.2 SmartExport */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Database size={22} className="text-[#10b981]" /> 4.2 SmartExport (SOQL Query IDE)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Professional SOQL query editor and data execution environment powered by Monaco Editor.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Monaco SOQL Editor:</strong> Syntax highlighting, auto-formatting, and intelligent autocomplete for standard keywords, Object API Names, and Field API Names.</li>
                                <li><strong>Multi-Tab Query Workspaces:</strong> Manage multiple query tabs (<code className="text-slate-200">Query 1</code>, <code className="text-slate-200">Query 2</code>). Double-click to rename.</li>
                                <li><strong>Composite API Chunking:</strong> Handles large queries returning over 2,000+ records via Composite API batching without browser crashes.</li>
                                <li><strong>Export to CSV / Excel:</strong> One-click export with automatic flattening of parent relationship queries (e.g., <code className="text-emerald-300">Account.Owner.Name</code>).</li>
                                <li><strong>Query History & Bookmarks:</strong> Automatically logs executed queries and bookmarks favorite SOQL snippets.</li>
                            </ul>
                        </div>

                        {/* 4.3 SmartImport */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ArrowUpFromLine size={22} className="text-[#f59e0b]" /> 4.3 SmartImport (Data Loader)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Client-side bulk data loader for CSV, XLSX, and JSON files directly inside the browser.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Smart Mapping:</strong> Matches file headers against target object field API names and labels automatically.</li>
                                <li><strong>Operations Supported:</strong> <code className="text-amber-300">INSERT</code>, <code className="text-amber-300">UPDATE</code>, <code className="text-amber-300">UPSERT</code>, and <code className="text-amber-300">DELETE</code>.</li>
                                <li><strong>High-Speed Batching:</strong> Uses SObject Collections REST API (<code className="text-amber-300">/composite/sobjects</code>), processing up to 200 records per payload.</li>
                                <li><strong>Error Reporting:</strong> Generates downloadable row-by-row error logs highlighting specific validation rule failures.</li>
                            </ul>
                        </div>

                        {/* 4.4 SmartSchema */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Network size={22} className="text-[#06b6d4]" /> 4.4 SmartSchema (Metadata Browser)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Browse sObjects, custom fields, picklists, and child relationships without loading slow Setup pages.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Instant Filter:</strong> Search across Standard, Custom, Custom Metadata, and Big Objects in real time.</li>
                                <li><strong>Relationship Inspector:</strong> View Lookup, Master-Detail, and Child Relationships with cascade deletion rules.</li>
                                <li><strong>1-Click Query Generation:</strong> Select field checkboxes to auto-generate a <code className="text-cyan-300">SELECT</code> query and open it directly in SmartExport.</li>
                            </ul>
                        </div>

                        {/* 4.5 SmartSecurity */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShieldAlert size={22} className="text-[#8b5cf6]" /> 4.5 SmartSecurity (Access Analyzer)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Audit Effective Access across Profiles and Permission Sets to verify field and object visibility.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Permission Matrix:</strong> Evaluated Object & Field-Level Security (FLS) permissions (Read, Edit, Create, Delete).</li>
                                <li><strong>Permission Set Breakdown:</strong> Identifies exact Permission Sets and Profiles granting specific access.</li>
                                <li><strong>User Access Trace:</strong> Resolves assigned users for any Permission Set or Profile.</li>
                            </ul>
                        </div>

                        {/* 4.6 SmartCode */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Code size={22} className="text-[#6366f1]" /> 4.6 SmartCode (Web IDE)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Lightweight development environment for server-side code execution and Apex tooling.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                                <li><strong>Anonymous Apex Console:</strong> Execute raw Apex code with inline compilation error highlighting (line/column) and debug log viewer.</li>
                                <li><strong>File Inspection & Editing:</strong> Open Apex Classes, Triggers, LWCs, and Visualforce pages directly from search without VS Code setup.</li>
                                <li><strong>Log Inspector:</strong> Query and view recent <code className="text-indigo-300">ApexLog</code> records with level filtering.</li>
                            </ul>
                        </div>

                        {/* 4.7 SmartLimits */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Gauge size={22} className="text-[#0ea5e9]" /> 4.7 SmartLimits (Governor Limits Monitor)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Monitor Salesforce API call limits, storage usage, and system governor quotas in real time with visual gauge bars.
                            </p>
                        </div>

                        {/* 4.8 SmartMatch */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <GitCompare size={22} className="text-[#be185d]" /> 4.8 SmartMatch (Deduplication Tool)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Detect duplicate records using matching rules, compare field values side-by-side, and initiate record deduplication.
                            </p>
                        </div>

                        {/* 4.9 SmartMetadata */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Boxes size={22} className="text-[#f97316]" /> 4.9 SmartMetadata (Deployment Engine — BETA)
                                </h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Inter-org metadata packaging and deployment engine with dry-run validation, Apex permission handling, and pre-deployment auto-backups.
                            </p>
                        </div>

                    </div>
                </section>

                {/* 5. In-Page Salesforce Page Tools */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                            <Sparkles size={24} className="text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">5. In-Page Salesforce Page Tools</h2>
                    </div>
                    <p className="leading-relaxed mb-4">
                        When navigating standard Salesforce pages in Chrome, SmartKit injects helper tools directly into the Lightning interface:
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <ul className="list-disc list-inside space-y-4">
                            <li><strong>Inject API Names Overlay:</strong> Scans the active Lightning page and displays small blue badges (<code className="text-cyan-300">[Custom_Field__c]</code>) next to visible field labels on the screen.</li>
                            <li><strong>Setup QuickFind Navigation:</strong> Command Palette (<code className="text-cyan-300">⌘ + K</code>) deep-links directly to Setup items (e.g., <em>Company Info</em>, <em>Flows</em>, <em>Users</em>, <em>Profiles</em>), bypassing the native Setup search bar.</li>
                        </ul>
                    </div>
                </section>

                {/* 6. Security First */}
                <section className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-8 mt-12 mb-16 flex gap-6 items-center flex-col md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            6. Security First & 100% Local Privacy
                        </h2>
                        <p className="leading-relaxed mb-4">
                            SmartKit operates 100% locally within your Chrome browser. Your session tokens, queries, and record data are transported directly between your machine and Salesforce&apos;s official REST/Tooling APIs. Zero data is sent to third-party servers.
                        </p>
                        <p className="leading-relaxed text-indigo-300 font-medium">
                            If your Salesforce session times out or you log out, SmartKit instantly loses access, ensuring complete local security for your org.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-full w-32 h-32 border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] shrink-0">
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
                                    If your question isn&apos;t covered in this guide, reach out directly through my contact form.
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
