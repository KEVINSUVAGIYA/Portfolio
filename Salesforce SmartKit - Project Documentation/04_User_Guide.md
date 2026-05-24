# Salesforce SmartKit: The Ultimate User Guide

Welcome to the Salesforce SmartKit. This guide covers every single feature, button, dropdown, and micro-interaction available within the extension.

## 1. Getting Started & Initialization

### 1.1 How to Open the SmartKit
You can access the SmartKit in three distinct ways:
1.  **The Extension Popup:** Click the SmartKit icon in your Chrome toolbar. This opens a small window overlay.
2.  **The Chrome Side Panel:** Pin the Side Panel via Chrome's UI. This allows the SmartKit to persist vertically alongside your main browser window.
3.  **The Floating Sidebar (In-App):** If enabled in the settings, a small widget will float on the edge of your Salesforce screen. Clicking it slides out the SmartKit natively within the Salesforce window.

### 1.2 Session Discovery & Multi-Org Support
When you open SmartKit, it instantly scans your active tabs and cookies to find Salesforce sessions. 
- You will see a dropdown at the top right showing the connected Org (e.g., `company.my.salesforce.com`).
- If you have multiple Salesforce instances open (e.g., Production and Sandbox), you can seamlessly switch between them using this dropdown without needing to log in again.

## 2. The Records Tab (The "Excel" View)

The Records Tab provides a fast, tabular view of recent records for any object, with full inline editing capabilities.

### 2.1 Selecting Objects and List Views
- **Object Dropdown:** Click the Object selector to search across all standard and custom objects in your Org. It supports fuzzy search (typing "opp" will find "Opportunity").
- **List View Dropdown:** Once an object is selected, you can filter the records using any of your saved Salesforce List Views.

### 2.2 Inline Editing (SmartEdit)
SmartKit turns Salesforce into a spreadsheet.
1.  Double-click any cell in the table.
2.  The cell will transform into the appropriate input type (e.g., a Date picker for Date fields, a dropdown for Picklists, a checkbox for Booleans).
3.  Make your changes. The row will highlight to indicate unsaved changes.
4.  Click the blue **"Save Changes"** button at the top to commit all edits to Salesforce simultaneously.

### 2.3 Smart Tooltips (Hover Intelligence)
Hover your mouse over any column header. A sophisticated tooltip will appear revealing hidden metadata:
- **API Name:** The developer name of the field (e.g., `Custom_Status__c`).
- **Field Type:** e.g., String, Double, Reference.
- **Formula Definitions:** If the field is a formula, the *exact formula text* is displayed so you don't have to go into Setup to see how it's calculated.
- **Picklist Values:** If it's a picklist, all active picklist values are listed.
- **Help Text:** Any custom help text defined by the administrator.

## 3. The Data Tab (SOQL IDE)

The Data Tab features a professional-grade code editor for writing Salesforce Object Query Language (SOQL).

### 3.1 Writing Queries
- The editor supports syntax highlighting for SOQL keywords (`SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`).
- Use the **Format** button (or `Shift+Alt+F`) to automatically indent and format messy SOQL strings.

### 3.2 Executing and Exporting
- Hit **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows) to instantly execute the query.
- The results are rendered in a high-performance table below.
- Click **Export CSV** to immediately download the result set. The CSV parser perfectly handles nested JSON from relationship queries.

### 3.3 Relationship Query Flattening
If you write a query like `SELECT Id, Account.Name FROM Contact`, standard tools return complex JSON. SmartKit intelligently "flattens" this so the table displays a beautiful column labeled `Account.Name`. It also supports subqueries (`SELECT (SELECT Name FROM Contacts) FROM Account`), flattening them into comma-separated lists for easy viewing.

## 4. The Quick Setup Command Palette

The Command Palette is the fastest way to navigate the notoriously slow Salesforce Setup menu.

### 4.1 Activation
Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) while looking at the SmartKit.

### 4.2 Navigation Shortcuts
Start typing to instantly filter thousands of setup pages.
- Type `users` to jump to User Management.
- Type `profiles` to jump to Profile configuration.
- Type `flows` to open the Flow Builder.
Selecting an option will immediately open a new Chrome tab directly to that specific setup page, completely bypassing the clunky Salesforce Setup search bar.

## 5. The Content Script Actions (In-Page Magic)

These features modify the actual Salesforce screen you are looking at.

### 5.1 Inject API Names
Tired of clicking "Edit Object" to figure out the API name of a field?
Click the **"Show API Names"** action. SmartKit will scan the current Salesforce page and inject the developer API name (in red text) directly next to every label on the screen.

### 5.2 Bypass Validation Rules (Admin Only)
*(Warning: Use with caution)*
Provides a quick toggle to disable active validation rules on the current object, allowing you to force-save a record for testing purposes. (Requires "Customize Application" permission).

## 6. Security and Sessions
- SmartKit **never** stores your Salesforce password.
- It operates entirely by using the active Session ID (`sid` cookie) from your current browser session.
- If you log out of Salesforce in your browser, SmartKit instantly loses access, ensuring absolute security.
