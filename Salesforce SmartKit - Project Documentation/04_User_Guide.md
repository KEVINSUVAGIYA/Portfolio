# Salesforce SmartKit — Complete User Guide & FAQs Manual

> **Version 1.0.13** — Official Product & User Documentation  
> **Official Website:** [Salesforce SmartKit](https://www.kevinsuvagiya.me/products/salesforcesmartkit)

---

## 📖 Table of Contents
1. [Overview & Access Modes](#1-overview--access-modes)
2. [Installation & Session Setup](#2-installation--session-setup)
3. [Master Navigation & Keyboard Shortcuts](#3-master-navigation--keyboard-shortcuts)
4. [Detailed Tool Feature Manuals](#4-detailed-tool-feature-manuals)
   - [4.1 SmartView (Record Inspector)](#41-smartview-record-inspector)
   - [4.2 SmartExport (SOQL Query IDE)](#42-smartexport-soql-query-ide)
   - [4.3 SmartImport (Data Loader)](#43-smartimport-data-loader)
   - [4.4 SmartSchema (Metadata Browser)](#44-smartschema-metadata-browser)
   - [4.5 SmartSecurity (Access Analyzer)](#45-smartsecurity-access-analyzer)
   - [4.6 SmartCode (Web IDE)](#46-smartcode-web-ide)
   - [4.7 SmartLimits (Governor Limits Monitor)](#47-smartlimits-governor-limits-monitor)
   - [4.8 SmartMatch (Deduplication & Compare)](#48-smartmatch-deduplication--compare)
   - [4.9 SmartMetadata (Deployment Engine — BETA)](#49-smartmetadata-deployment-engine--beta)
5. [In-Page Salesforce Page Tools](#5-in-page-salesforce-page-tools)
6. [Exhaustive Frequently Asked Questions (FAQs)](#6-exhaustive-frequently-asked-questions-faqs)

---

## 1. Overview & Access Modes

Salesforce SmartKit is an all-in-one productivity command center built for Salesforce Administrators, Developers, Architects, and Consultants. It integrates directly into your browser workflow to eliminate setup search fatigue, speed up data operations, and streamline code execution.

### Three Flexible Access Modes:
1. **In-Page Floating Sidebar Drawer:** Glides open natively on any Salesforce tab (`*.lightning.force.com`, `*.my.salesforce.com`, `*.salesforce-setup.com`) by clicking the pull-string widget or pressing `⌘ + Shift + K` / `Ctrl + Shift + K`.
2. **Chrome Side Panel:** Pins vertically alongside your main browser window for non-intrusive, side-by-side multitasking.
3. **Full Extension Application Tab:** Renders in a full-screen application window (`chrome-extension://.../index.html`) featuring full Monaco editor capabilities and multi-tab workspaces.

---

## 2. Installation & Session Setup

### 2.1 Installation
* **Chrome Web Store:** Search for **Salesforce SmartKit** and click **Add to Chrome**.
* **Developer Unpacked Mode:**
  1. Open `chrome://extensions/` in Google Chrome.
  2. Enable **Developer mode** (toggle top-right).
  3. Click **Load unpacked** and select the extension build folder (`dist/`).

### 2.2 Instant 0ms Session Connection
SmartKit uses zero-configuration **Session Token Extraction**. You do not need to configure OAuth apps, connected apps, or security tokens.
1. Log into your Salesforce org in any standard Chrome tab.
2. Open SmartKit (via toolbar icon, sidebar pull-string, or shortcut).
3. **0ms Instant Load:** SmartKit instantly extracts your active session cookie (`sid`), hydrates your user profile and org info on frame 1 (0 ms delay), and bypasses any loading spinners.
4. Background discovery (`triggerDiscovery`) populates multi-org session options quietly in the user menu.

### 2.3 Multi-Org Account Switcher
Click your profile avatar in the top-right header to open the Multi-Org Switcher. SmartKit automatically detects all active Salesforce tabs open across your browser windows (Production, Sandboxes, Developer Orgs). Clicking any account switches the active context instantly without a page reload.

---

## 3. Master Navigation & Keyboard Shortcuts

SmartKit features a 2-level keyboard navigation system designed for maximum hands-on-keyboard speed.

### Global & App Keyboard Shortcuts

| Shortcut | Action | Scope | Description |
| :--- | :--- | :--- | :--- |
| `⌘ + K` / `Ctrl + K` | Open SmartSearch Command Palette | Global | Instant search across metadata, objects, setup links, and records. |
| `⌘ + Shift + K` / `Ctrl + Shift + K` | Toggle SmartKit Sidebar | Salesforce Tab | Opens or closes the floating in-page sidebar drawer. |
| `⌘ + Shift + ← / →` / `Ctrl + Shift + ← / →` | Level 1: Master App Navigation | App / Sidebar | Cycles through master tabs (`SmartView` ↔ `SmartExport` ↔ `SmartImport` ↔ `SmartSchema` ↔ `SmartSecurity` ↔ `SmartCode` ↔ `SmartLimits` ↔ `SmartMatch` ↔ `SmartMetadata`). |
| `⌘ + Option + Shift + ← / →` / `Ctrl + Alt + Shift + ← / →` | Level 2: In-Tab Sub-Navigation | SmartView / SmartExport | Cycles through open record sub-tabs in SmartView or open query sub-tabs in SmartExport. |
| `⌘ + S` / `Ctrl + S` | Save Record Edits | SmartView | Commits all modified inline fields to Salesforce via REST API. |
| `⌘ + Enter` / `Ctrl + Enter` | Run Query / Run Apex | SmartExport / SmartCode | Executes the active SOQL query or Anonymous Apex script. |
| `Double-Click` | Quick-edit Cell / Tab Title | SmartView / SmartExport | Unlocks inline cell editing or renames a sub-query tab. |
| `Esc` | Hierarchical Dismissal | Global | 1st `Esc` closes active modal/dialog (e.g. Shortcuts modal / User Menu); 2nd `Esc` closes sidebar drawer. |

---

## 4. Detailed Tool Feature Manuals

### 4.1 SmartView (Record Inspector)
* **Tab Theme Color:** Rose Coral (`#f43f5e`)
* **Purpose:** Inspect and edit any Salesforce record on the fly bypassing Lightning page layouts.
* **Key Features:**
  * **Multi-Tab Record Sessions:** Open multiple records simultaneously in separate sub-tabs. Switch tabs using `⌘ + Option + Shift + ← / →`. Active sub-tabs feature `#f43f5e` indicators and auto `scrollIntoView`.
  * **Inline Editing (SmartEdit):** Double-click any field value to edit. Picklists render custom lookup pickers with fuzzy search.
  * **Field Filter Chips:** Filter record fields by *All Fields*, *Custom Fields (`__c`)*, *Populated Only*, *System Fields*, or *Edited Fields*.
  * **Hover Intelligence:** Hover field labels to inspect developer API names, field types, formula expressions, and custom help text.
  * **Object Manager Setup Link:** Gear icon opens the exact field definition in Salesforce Setup Object Manager.

### 4.2 SmartExport (SOQL Query IDE)
* **Tab Theme Color:** Emerald Green (`#10b981`)
* **Purpose:** Professional SOQL query editor and data execution environment.
* **Key Features:**
  * **Monaco SOQL Editor:** Syntax highlighting, auto-formatting, and intelligent autocomplete for `SELECT`, `FROM`, standard keywords, Object API Names, and Field API Names.
  * **Multi-Tab Query Workspaces:** Manage multiple queries in separate sub-tabs (`Query 1`, `Query 2`). Rename tabs with a double-click. Level 2 keyboard navigation (`⌘ + Option + Shift + ← / →`) automatically scrolls active sub-tabs into view smoothly (`scrollIntoView`).
  * **Composite API Chunking:** Automatically handles queries returning over 2,000+ records via Composite API batching without hitting browser memory limits.
  * **Export to CSV / Excel:** One-click data export with automatic flattening of parent relationship queries (e.g., `Account.Owner.Name`).
  * **Query History & Bookmarks:** Automatically logs executed queries and lets you bookmark favorite SOQL snippets.

### 4.3 SmartImport (Data Loader)
* **Tab Theme Color:** Amber Orange (`#f59e0b`)
* **Purpose:** Client-side bulk data loader for CSV, XLSX, and JSON files without Data Loader installation.
* **Key Features:**
  * **Smart Mapping:** Automatically matches file headers against target object field API names and labels.
  * **Operations Supported:** `INSERT`, `UPDATE`, `UPSERT`, and `DELETE`.
  * **High-Speed Batching:** Uses SObject Collections REST API (`/composite/sobjects`), processing up to 200 records per HTTP payload.
  * **Error Reporting:** Generates downloadable row-by-row error logs showing specific validation rule failures.

### 4.4 SmartSchema (Metadata Browser)
* **Tab Theme Color:** Cyan (`#06b6d4`)
* **Purpose:** Browse sObjects, custom fields, picklists, and child relationships without loading slow Setup pages.
* **Key Features:**
  * **Instant Filter:** Search across all Standard, Custom, Custom Metadata, and Big Objects.
  * **Relationship Inspector:** View Lookup, Master-Detail, and Child Relationships with cascade deletion rules.
  * **1-Click Query Generation:** Select field checkboxes to auto-generate a `SELECT` query and open it directly in SmartExport.

### 4.5 SmartSecurity (Access Analyzer)
* **Tab Theme Color:** Purple (`#8b5cf6`)
* **Purpose:** Audit Effective Access across Profiles and Permission Sets.
* **Key Features:**
  * **Permission Matrix:** Evaluated Object and Field-Level Security (FLS) permissions (Read, Edit, Create, Delete).
  * **Permission Set Breakdown:** Identifies exact Permission Sets and Profiles granting specific access.
  * **User Access Trace:** Resolves assigned users for any Permission Set or Profile.

### 4.6 SmartCode (Web IDE)
* **Tab Theme Color:** Indigo (`#6366f1`)
* **Purpose:** Lightweight development environment for server-side code execution and tooling.
* **Key Features:**
  * **Anonymous Apex Console:** Execute raw Apex code with inline compilation error highlighting (line/column) and debug log viewer.
  * **File Inspection & Editing:** Open Apex Classes, Triggers, LWCs, and Visualforce pages directly from search or sidebar without VS Code setup.
  * **Log Inspector:** Query and view recent `ApexLog` records with level filtering.

### 4.7 SmartLimits (Governor Limits Monitor)
* **Tab Theme Color:** Sky Blue (`#0ea5e9`)
* **Purpose:** Monitor Salesforce API limits, storage usage, and system governor quotas in real time with visual gauge bars.

### 4.8 SmartMatch (Deduplication Tool)
* **Tab Theme Color:** Deep Rose (`#be185d`)
* **Purpose:** Detect duplicate records using matching rules, compare field values side-by-side, and initiate record deduplication.

### 4.9 SmartMetadata (Deployment Engine — BETA)
* **Tab Theme Color:** Orange (`#f97316`)
* **Purpose:** Inter-org metadata packaging and deployment utility.
* **Key Features:**
  * **Dry-Run Validation:** Validate deployment packages against target orgs before committing changes.
  * **Apex Permission Handling:** Deploys field permissions via Apex Anonymous execution, eliminating profile label mismatches.
  * **Auto-Backup & Rollback:** Creates automatic pre-deployment backups for safe rollbacks.

---

## 5. In-Page Salesforce Page Tools

When navigating standard Salesforce pages in Chrome, SmartKit injects helper tools directly into the page:

1. **Inject API Names Overlay:** Scans the active Lightning page and displays small blue badges (`[Custom_Field__c]`) next to visible field labels on the screen.
2. **Setup QuickFind Navigation:** Command Palette (`⌘ + K`) deep-links directly to Setup items (e.g., *Company Info*, *Flows*, *Users*, *Profiles*), bypassing the native Setup search bar.

---

## 6. Exhaustive Frequently Asked Questions (FAQs)

### General & Security

**Q1: Does SmartKit store my Salesforce data on external servers?**  
**A:** No. SmartKit operates 100% locally within your Chrome browser. Your session tokens, queries, and record data are transported directly between your machine and Salesforce's official servers. Zero data is sent to third-party servers.

**Q2: How does SmartKit authenticate into my Salesforce org?**  
**A:** SmartKit uses Session Token Extraction (`sid` cookie). When you log into Salesforce in Chrome, SmartKit securely captures the active session cookie to make authorized REST/Tooling API calls on your behalf. No passwords or OAuth keys are stored.

**Q3: What happens when my Salesforce session expires?**  
**A:** If your Salesforce session times out due to inactivity, API requests will return 401 Unauthorized. Simply refresh your Salesforce browser tab or log back in to renew the active session.

---

### Navigation & Shortcuts

**Q4: How do I open the floating sidebar drawer on a Salesforce page?**  
**A:** Press `⌘ + Shift + K` (Mac) or `Ctrl + Shift + K` (Windows), or click the pull-string widget floating on the right edge of the screen.

**Q5: How do I switch master tabs using keyboard shortcuts?**  
**A:** Use **Level 1 Navigation**: `⌘ + Shift + ←` or `⌘ + Shift + →` (`Ctrl + Shift + ← / →` on Windows) to cycle sequentially through master tabs (`SmartView` ↔ `SmartExport` ↔ `SmartImport` ↔ `SmartSchema` ↔ `SmartSecurity` ↔ `SmartCode` ↔ `SmartLimits` ↔ `SmartMatch` ↔ `SmartMetadata`).

**Q6: How do I cycle through open record tabs or query sub-tabs?**  
**A:** Use **Level 2 Navigation**: `⌘ + Option + Shift + ← / →` (`Ctrl + Alt + Shift + ← / →` on Windows). Active sub-tabs automatically scroll into view smoothly (`scrollIntoView`).

**Q7: How does the `Escape` (`Esc`) key work when multiple windows or modals are open?**  
**A:** SmartKit uses hierarchical `Esc` key handling:
* **1st `Esc` Press:** Closes the active open modal overlay (e.g. Keyboard Shortcuts modal, User Menu popup) FIRST.
* **2nd `Esc` Press:** Closes the sidebar drawer.

---

### Data & Query Operations

**Q8: Why does SmartExport flatten relationship queries like `SELECT Account.Name FROM Contact`?**  
**A:** Standard Salesforce API responses return nested JSON objects for parent fields. SmartExport flattens these into clean tabular columns (e.g., `Account.Name`) so data can be viewed and exported to CSV/Excel cleanly without JSON formatting clutter.

**Q9: Can I edit system fields like `CreatedDate` or Formula fields in SmartView?**  
**A:** No. Fields flagged as `updateable: false` by Salesforce's API (Formulas, System Dates, Auto-Numbers) are locked permanently in the UI to prevent API DML errors.

**Q10: How do I switch between connected Salesforce org accounts?**  
**A:** Click your profile picture avatar in the top-right header to open the Multi-Org Account Switcher. Select any active connected org tab to switch contexts instantly in 0 milliseconds.

---
**Salesforce SmartKit v1.0.13** — Built with ❤️ for the Salesforce Community.  
Official Product Page: [https://www.kevinsuvagiya.me/products/salesforcesmartkit](https://www.kevinsuvagiya.me/products/salesforcesmartkit)
