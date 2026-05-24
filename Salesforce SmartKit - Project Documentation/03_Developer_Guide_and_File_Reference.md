# Salesforce SmartKit: Developer Guide & File Reference

This document serves as the comprehensive onboarding guide for developers contributing to the Salesforce SmartKit project. It provides an exhaustive breakdown of the React component tree, the complex logic contained within the core files, and instructions for extending the application.

## 1. Development Environment Setup

### 1.1 Prerequisites
- **Node.js**: v18+ recommended.
- **Package Manager**: npm or yarn.
- **Salesforce Environment**: Access to at least one Salesforce sandbox or scratch org for testing.

### 1.2 Local Development Workflow
Because this is a Manifest V3 extension, you cannot simply run `npm start` and view it in a standard browser tab. It relies heavily on Chrome Extension APIs (`chrome.runtime`, `chrome.storage`, `chrome.cookies`).

1.  Run `npm run build:watch` (or equivalent Vite watch script).
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode**.
4.  Click **Load unpacked** and select the `/dist` directory.
5.  To test, navigate to any Salesforce instance in Chrome. The extension icon will activate, and the content scripts will inject.

## 2. Exhaustive File & Component Reference

### 2.1 The Root Structure
*   **`manifest.json`**: The Chrome Extension manifest. Crucial configurations include:
    *   `permissions`: `storage`, `cookies`, `scripting`, `sidePanel`.
    *   `host_permissions`: `*://*.force.com/*`, `*://*.salesforce.com/*` (Required to bypass CORS).
    *   `background.service_worker`: Points to the compiled `background.ts`.
*   **`index.html`**: The single HTML entry point for the React application. Used for both the Popup and the Full App view.

### 2.2 Background Services (`src/background.ts`)
This is the heart of the extension. Refer to the Technical Architecture document for the deep dive on message passing.
**Key Responsibilities:**
- Managing the `chrome.sidePanel` behavior.
- Executing `chrome.scripting.executeScript` to steal the `sid` cookie upon icon click.
- Routing all `fetch` requests via `sfApiFetch`.

### 2.3 The React Application (`src/App.tsx`)
The entry point of the UI.
**State Management:**
- `sessions`: An array of discovered Salesforce environments.
- `activeSession`: The currently selected session object (`sid`, `instanceUrl`, `orgName`).
- `activeTab`: The current route (e.g., `'records'`, `'data'`, `'import'`).

**Flow:**
On mount, `App.tsx` sends `{ action: 'getSession' }` to `background.ts`. It renders a full-page `.sk-spinner-full-page` while waiting. Once resolved, it mounts the navigation header and the active tab component.

### 2.4 The Record View (`src/components/RecordTab.tsx`)
This component provides an Excel-like view of recent records and allows for inline editing.

**Key Complexity: Dynamic Describe Injection**
When records are fetched, Salesforce only returns the raw data. To render this safely, `RecordTab.tsx` must:
1.  Fetch the describe metadata for the object using the Composite API.
2.  Map every field in the raw data to its corresponding describe object.
3.  Store this in `schemaMap`.

**Key Complexity: Inline Editing (`editedCells`)**
The table supports Excel-like inline editing. State is managed via an `editedCells` object:
```typescript
type EditedCells = {
  [recordId: string]: {
    [fieldName: string]: any // The new value
  }
}
```
When a user edits a cell, the row is marked dirty. Clicking "Save Changes" iterates through `editedCells` and sends an HTTP PATCH request to `/services/data/v60.0/sobjects/{ObjectName}/{Id}` for each dirty record.

**React Portals for Tooltips:**
To prevent CSS `overflow: hidden` issues from clipping the complex field tooltips (which show formula definitions and picklist values), `RecordTab.tsx` utilizes React Portals to render the tooltips directly to `document.body`.

### 2.5 The Data Explorer (`src/components/DataTab.tsx`)
This component is a full-fledged SOQL IDE built directly into the extension.

**Monaco Editor Integration:**
The Data Tab embeds the Microsoft Monaco Editor (the editor that powers VS Code).
- **Custom Language Registration:** The component registers a custom `soql` language definition within Monaco to provide syntax highlighting for keywords like `SELECT`, `FROM`, `WHERE`, `LIMIT`.
- **Worker Configuration:** It requires setting `window.MonacoEnvironment` to route the web worker correctly within the Chrome Extension sandbox context (`monaco-worker.ts`).

**Flattening Complex Results (`getParsedHeaders`):**
SOQL queries often contain nested relationship queries:
`SELECT Id, Account.Name, (SELECT Contact.LastName FROM Contacts) FROM Opportunity`

Salesforce returns this as a deeply nested JSON object. `DataTab.tsx` includes complex recursive functions (`flattenRecord`, `resolveRelationshipDesc`) to parse this JSON tree and flatten it into a 2D array suitable for rendering in an HTML `<table>`.

### 2.6 The Smart UI Injector (`src/content/index.tsx`)
This script is injected directly into the Salesforce DOM.

**The Floating Sidebar:**
It creates a shadow DOM (to prevent CSS collisions with Salesforce's SLDS) and mounts a floating button. Clicking this button expands an `iframe` pointing to `chrome.runtime.getURL('index.html')`.

**Smart "Inject API Names" Feature:**
This is one of the most complex features. When triggered, the content script:
1.  Walks the Salesforce DOM looking for standard `<label>` elements.
2.  Cross-references the inner text of these labels against the object describe metadata fetched by the background worker.
3.  Injects a small red `<span>` containing the exact API name (e.g., `Custom_Field__c`) directly into the Salesforce UI, saving administrators from navigating to the Setup menu.

## 3. Extending the Application

### Adding a New Tab
1.  Define a new semantic color and CSS class in `index.css` (e.g., `.tab-btn.active.tab-newfeature`).
2.  Add a button to the `.tab-navigation` container in `App.tsx`.
3.  Create a new React component in `src/components/NewFeatureTab.tsx`.
4.  Add a `case 'newfeature': return <NewFeatureTab />` to the switch statement in `App.tsx`.

### Adding a New Salesforce API Method
1.  Open `src/api/salesforce.ts`.
2.  Define the method interface.
3.  Use the `sfFetch` wrapper. Ensure you handle both standard REST endpoints (`/services/data/...`) and Tooling API endpoints (`/services/data/v60.0/tooling/...`) appropriately.
4.  Salesforce limits bulk composite requests to 25 sub-requests. If you need to fetch more, you must implement chunking logic (see `getRecordsWithDetails` for an example of chunking).
