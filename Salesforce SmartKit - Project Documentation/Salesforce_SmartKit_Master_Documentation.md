# Salesforce SmartKit - Master Technical Documentation

This document serves as the exhaustive, single source of truth for the **Salesforce SmartKit** Chrome Extension project. It is designed to be accessible to a new developer taking over the project while providing deep technical details about architecture, data flow, component structures, API interactions, and user interface features. 

---

## 1. Project Overview & Architecture

### High-Level Summary
Salesforce SmartKit is a Chrome Extension (Manifest V3) designed to significantly boost the productivity of Salesforce Administrators, Developers, and Consultants. It bridges the gap between the standard Salesforce UI and advanced metadata/API tools by injecting a sidebar directly into Salesforce tabs and providing a full-screen application view.

### Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS + inline styles (minimal external dependencies, ensuring isolation)
- **Icons:** `lucide-react`
- **Code Editor:** Monaco Editor (used in the SOQL `DataTab` and Apex `DevTab`)
- **Extension Architecture:** Manifest V3 (Service Worker, Content Script, Side Panel, Standalone Page)

### Core Extension Architecture

The extension is composed of three primary runtimes:

1. **Background Service Worker (`src/background.ts`)**
   - **Responsibility:** Session discovery, API request proxying, tab management.
   - **Session Discovery (`getSalesforceSession`):** It dynamically finds active Salesforce sessions by intercepting the `sid` cookie. It converts varying Lightning/Visualforce domains (e.g., `org.lightning.force.com`) to their My Domain API equivalents (`org.my.salesforce.com`) using `toApiDomain`. 
   - **API Proxy (`sfApiFetch`):** Acts as a CORS bypass. Content scripts and the standalone App cannot make direct XHR requests to Salesforce APIs due to CORS. They send `sfApiFetch` messages to the background script, which attaches the `Authorization: Bearer <sid>` header and executes `fetch()`. It gracefully parses Salesforce JSON error arrays.
   - **Tab Management (`openFullApp`):** Ensures that clicking "Open Full App" reuses an existing tab if the user/org matches, rather than spawning duplicates.

2. **Content Script (`src/content/index.tsx`)**
   - **Responsibility:** Injects the SmartKit sidebar and "pull-string" toggle into all `.force.com` and `.salesforce.com` web pages.
   - **UI Injection:** Creates a shadow DOM (or isolated div) with `z-index: 2147483646` to float above Salesforce's UI.
   - **Feature - API Names Overlay (`injectApiNames`):** A DOM polling function (`setInterval` every 1500ms) that scans the Salesforce DOM for field labels and injects a small blue badge (e.g., `[Custom_Field__c]`). It maps visible UI labels against the object's `describe` metadata fetched via the API.
   - **User Session Switcher:** Reads the current page's `sid` cookie and matches it against all discovered sessions to determine the active user context. It provides a UI to switch between orgs/users.

3. **Standalone App / Side Panel (`src/App.tsx`)**
   - **Responsibility:** Renders the primary interface containing the 6 major feature tabs.
   - **Routing:** Uses URL Hash fragments (`#tab=records&recordId=...`) instead of React Router to persist state. 
   - **Session Context:** Retrieves the active session from `sessionStorage` or `chrome.storage.local`. If lost, it requests session discovery from the background script.

---

## 2. Deep Dive: Core Features & Components

### 2.1 SmartView (Record Tab)
**File:** `src/components/RecordTab.tsx`
- **Purpose:** A powerful, developer-centric interface for viewing, editing, and analyzing a specific Salesforce record.
- **Initialization:** Extracts `initialRecordId` and `initialRecordObject`. If only ID is provided, it attempts to resolve the object prefix (first 3 characters of the ID) by querying global `describe` metadata.
- **Data Fetching:** Fetches the full record layout via standard REST API (`/sobjects/{objectName}/{id}`). Parallelly fetches the object's `describe` metadata to understand field types, picklist values, and labels.
- **Editing Mechanics:**
  - Standard fields render text inputs; booleans render checkboxes; picklists render custom components (`CustomPicklist` / `CustomMultiPicklist` from `src/components/Picklists.tsx`).
  - Read-only fields (e.g., formulas, auto-numbers, system fields like `CreatedDate`) are locked.
  - Updates are batched in a `recordData` state object and saved via a single `PATCH` request (`api.updateRecord`).
- **Metadata Context:** Each field row displays the API name. Clicking the "Setup" gear icon navigates to the field in Object Manager. Since custom fields require an internal `00N` ID for Setup navigation, this is resolved via `src/utils/redirection.ts` (`fetchFieldIds`).

### 2.2 SmartExport (Data Tab)
**File:** `src/components/DataTab.tsx`
- **Purpose:** A full-featured SOQL editor and data execution environment.
- **Editor:** Uses `@monaco-editor/react`. Implements a custom Monaco language provider specifically for SOQL.
- **Intellisense:** Upon loading, it fetches the global schema. As the user types, it offers auto-completion for `SELECT`, `FROM`, standard SOQL keywords, Object API Names, and Field API Names (if an object is identified in the query).
- **Execution & Chunking:** Sends queries to `api.query()`. If a query exceeds standard REST batch limits (e.g., 2000 records) and returns `nextRecordsUrl`, `api.query()` automatically generates composite batch requests to rapidly fetch the remaining chunks and assemble the full dataset.
- **Export:** Results are flattened (JSON objects un-nested) and can be exported instantly to CSV.

### 2.3 SmartImport (Import Tab)
**File:** `src/components/ImportTab.tsx`
- **Purpose:** Fast, client-side CSV parsing and data insertion without needing external tools like Data Loader.
- **Parsing:** Implements raw CSV string parsing. Maps CSV headers directly to SObject fields.
- **Validation:** Allows the user to select the target object. Highlights invalid fields.
- **Execution:** Uses `api.bulkOperation()`. For POST/PATCH operations, it utilizes the SObject Collections API (`/composite/sobjects`), batching up to 200 records per HTTP request to optimize limits.
- **Results:** Generates an error report if specific rows fail validation or trigger validation rules.

### 2.4 SmartSchema (Schema Tab)
**File:** `src/components/SchemaTab.tsx`
- **Purpose:** Inspect database architecture without navigating through the slow Salesforce Setup UI.
- **Listing:** Fetches all SObjects (Standard, Custom, Custom Settings, Platform Events) via `describeGlobal()`.
- **Detail View:** Uses `describeObject()` to list all fields. Shows properties: Custom, Required, External ID, Unique, Formula.
- **Visualisation:** Render relationships (Lookup, Master-Detail) showing child relationships and cascade delete rules.
- **Navigation Shortcuts:** Deep links directly to the Object Manager page, Page Layouts, or Validation Rules for the selected object.

### 2.5 SmartSecurity (Permissions Tab)
**File:** `src/components/PermissionsTab.tsx`
- **Purpose:** Rapidly audit "Who has access to what?" across Profiles and Permission Sets.
- **Logic Flow:** 
  - User selects an Object and a Field.
  - Extension runs complex SOQL queries against `FieldPermissions` and `ObjectPermissions`.
  - It cross-references `Parent.ProfileId` and `Parent.IsCustom` to build a matrix showing EXACTLY which Profiles have Read/Edit access, and which Permission Sets grant additional access.
  - Resolves assigned users for specific Permission Sets to show exactly who is granted the permission.

### 2.6 SmartCode (Dev Tab)
**File:** `src/components/DevTab.tsx`
- **Purpose:** Developer console alternative for quick script execution.
- **Execute Anonymous Apex:** Monaco editor environment. Sends raw Apex to `/services/data/v60.0/tooling/executeAnonymous/`. Parses and renders compiler errors (line/column numbers) or runtime exceptions.
- **Debug Logs:** Queries the `ApexLog` object to show recent execution logs.

---

## 3. Global Utilities & Services

### 3.1 SmartSearch (`src/hooks/useSmartSearch.ts`)
A powerful, debounced, multi-faceted search engine used in both the sidebar and the `CommandPalette`.
- **Static Search:** Instantly matches against `QUICKFIND_ITEMS` (e.g., "Company Information", "Users") and `SMARTKIT_TOOLS` defined in `src/constants.ts`.
- **Live Metadata Search:** If an active session exists, it performs parallel API calls:
  - SOQL: Queries `User`, `Profile`, `PermissionSet`, `Group`, `LightningComponentBundle`, and `EntityDefinition`.
  - SOSL: Queries `/tooling/search` to find `ApexClass`, `ApexTrigger`, and `ApexPage`.
- **Result Formatting:** Merges and normalizes all results into a single list with deep-links (e.g., "Login As User" links, or deep links to Object Manager).

### 3.2 API Interface (`src/api/salesforce.ts`)
The `SalesforceAPI` class abstracts all REST operations.
- `fetch()`: The core method sending messages to the background script.
- `query()`: Executes SOQL. Handles pagination via Composite API batches.
- `getRecord()`, `updateRecord()`, `createRecord()`, `deleteRecord()`: Standard SObject REST methods.
- `executeAnonymous()`: Tooling API execution.
- `identity()`: Multi-fallback identity resolution (Oauth endpoint -> Chatter endpoint -> SOQL query) to ensure the current username and photo are always retrieved.

### 3.3 Redirection Utilities (`src/utils/redirection.ts`)
Salesforce Object Manager URLs require internal IDs, not API names (e.g., `00N...` instead of `Custom_Field__c`).
- `fetchFieldIds(api, objectName)`: Queries `FieldDefinition` and `CustomField` via Tooling API to map API names to internal `DurableId`.
- `openFieldInObjectManager()`: Dynamically resolves the ID and opens a new tab pointing to the exact field in Setup.

---

## 4. UI/UX Elements and Navigation

### The "Pull Toggle" (Sidebar)
- Rendered by `content/index.tsx`. 
- Features a highly customized, absolute-positioned SVG "person" pulling a rope.
- State machine: `idle` -> `hover` -> `surge` (when clicked) -> `tired` (after returning).
- Location parameters (`toggleY` and `showPersonAnimation`) are customizable and saved to `chrome.storage.local` via the `UserMenuPopup` settings.

### User Switcher (`src/components/UserMenuPopup.tsx`)
- Appears when clicking the avatar profile picture.
- Shows current Org ID, User ID (with 1-click copy/navigate).
- Lists all discovered active sessions (`availableSessions`). Clicking a session swaps `sessionStorage` and global states, immediately switching the user context without requiring a page reload.

### Command Palette (`src/components/CommandPalette.tsx`)
- Triggered via `Cmd+K` or `Ctrl+K`.
- Floating glassmorphic modal mimicking MacOS Spotlight.
- Fully keyboard accessible (Arrow Up/Down, Enter to navigate, Escape to close).

---

## 5. Developer Guide: How to Add Features

### Adding a New Quick Find Item
1. Open `src/constants.ts`.
2. Locate the `QUICKFIND_ITEMS` array.
3. Add a new `Q(label, url_path, category, icon, color, keywords)` entry.

### Adding a New SmartKit Tool Tab
1. Add the tool definition to `SMARTKIT_TOOLS` in `src/constants.ts` and define its `TAB_THEME_COLORS`.
2. Create `src/components/YourNewTab.tsx` accepting `api: SalesforceAPI` as props.
3. Update `src/App.tsx`:
   - Add a new tab button in the `<nav className="tab-navigation">`.
   - Add the component in the `<main>` area wrapped in a display toggle (`display: activeTab === 'newTab' ? 'flex' : 'none'`).
   - Add routing handling in `applyHashParams` if necessary.

---

## 6. Permissions and Manifest (`manifest.json` Context)
- **Host Permissions:** `*://*.salesforce.com/*`, `*://*.force.com/*`
- **Permissions:** `storage`, `cookies`, `scripting`, `activeTab`, `sidePanel`
- **Background:** Defined as a service worker (`background.ts`).
- **Content Scripts:** Injected into `*://*.salesforce.com/*` and `*://*.force.com/*`.

---

## 7. Known Edge Cases and Limitations
1. **Classic vs Lightning:** The extension heavily prioritizes Lightning domains. Redirections are optimized for `/lightning/setup/...`.
2. **Composite API Limits:** While `api.query` batches requests, massive SOQL queries (>50k records) may still hit Salesforce REST API limits or cause client-side memory constraints when flattening to CSV.
3. **Session Expiry:** Background fetch relies on the `sid` cookie. If the token expires, API requests fail with 401s. The UI falls back to the "Disconnected" state, prompting the user to refresh their Salesforce tab.
4. **Tooling API Access:** Certain operations in `SmartCode` or `SmartSchema` require the "View Setup and Configuration" and "API Enabled" permissions on the active user profile.
