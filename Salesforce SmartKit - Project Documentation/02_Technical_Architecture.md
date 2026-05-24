# Salesforce SmartKit: Technical Architecture & Core Flow

This document outlines the low-level architecture of the Salesforce SmartKit extension. It is built as a Manifest V3 Chrome Extension and utilizes React, TypeScript, and Vite.

## 1. Top-Level Architecture (Manifest V3)

Due to Chrome's Manifest V3 security requirements, extensions cannot easily make Cross-Origin Resource Sharing (CORS) requests directly from Content Scripts or the Extension Popup. Furthermore, Salesforce actively blocks embedding via `X-Frame-Options` and strict Content Security Policies (CSP).

To solve this, SmartKit employs a **Hub-and-Spoke Messaging Architecture**:
*   **The Hub:** `background.ts` (Service Worker). This is the only context permitted to read `.salesforce.com` cookies and execute raw `fetch()` calls to the Salesforce REST API without CORS restrictions.
*   **The Spokes:** `index.html` (Popup/Side Panel) and `content/index.tsx` (Injected UI). These contexts cannot speak to Salesforce directly; they must format their requests and send them to the Hub via `chrome.runtime.sendMessage`.

## 2. Session Hydration & Domain Normalization

Salesforce environments are notoriously complex, utilizing dozens of domain formats (e.g., `*.lightning.force.com`, `*.my.salesforce.com`, `*.sandbox.lightning.force.com`, custom domains).

The logic for finding and normalizing active sessions lives in `background.ts` within the `getSalesforceSession()` and `toApiDomain()` functions.

### 2.1 The Domain Normalizer (`toApiDomain`)

All API calls must be routed to the `.my.salesforce.com` endpoint, regardless of what URL the user is currently looking at.

```typescript
function toApiDomain(host: string): string {
  // Matches: {org}[.{env}].(lightning|visualforce).force.com
  // Captures optional env segment (sandbox/develop/scratch) 
  // and converts to .my.salesforce.com
  return host.replace(
    /^(.+?)(?:\.(sandbox|develop|scratch|trailblaze|trailhead|government|mil|appexchange|visualforce))?(?:\.(lightning|visualforce))?\.force\.com$/,
    (_, org, env) => env ? `${org}.${env}.my.salesforce.com` : `${org}.my.salesforce.com`
  );
}
```

### 2.2 Discovery Flow (`getSalesforceSession`)
When a React component boots up (e.g., `App.tsx`), it requests the current session:

1.  **Page Context Priority:** If the request came from the Content Script, it provides its `pageHost` and `pageSid`. This is the highest priority because it handles custom/vanity domains perfectly.
2.  **Storage Fallback:** If opened via the Extension Icon, `background.ts` executes a script on the active tab to extract `document.cookie` (`sid=...`), saves it to `chrome.storage.local` under `targetSfHost` / `targetSfSid`, and then opens the panel.
3.  **Cookie Scanning:** Finally, the Service Worker queries `chrome.cookies.getAll({ name: 'sid' })`. To prevent returning obsolete sessions, it actively filters these cookies against the domains of currently open Chrome tabs (`chrome.tabs.query`). It strips generic suffixes (`isOrgSpecificApiDomain`) to isolate the actual Org prefix.

## 3. The Central Nervous System: `sfApiFetch`

All data operations flow through a single listener in `background.ts`: `message.action === 'sfApiFetch'`.

```typescript
// From background.ts
if (message.action === 'sfApiFetch') {
    const runFetch = async (sessions: any[]) => {
      // Iterates through discovered sessions until one succeeds
      // ...
      const result = await fetch(url, { 
        headers: { 'Authorization': `Bearer ${session.sid}`, ...message.headers },
        method: message.method || 'GET',
        body: message.body
      });
      // ... Parses JSON response or extracts Salesforce error arrays
    }
}
```

This endpoint handles JSON parsing, Auth header injection, and crucially, **Salesforce Error Unwrapping**. Salesforce REST APIs often return errors as arrays of objects (e.g., `[{ "errorCode": "INVALID_FIELD", "message": "..." }]`). `background.ts` catches non-200 responses and normalizes these into a single string to throw back to the React UI.

## 4. The React API Wrapper (`src/api/salesforce.ts`)

To make development ergonomic, the raw `chrome.runtime.sendMessage` calls are abstracted behind a typed TypeScript class (`SalesforceApi`), exposing methods for CRUD operations, SOQL queries, and Metadata describes.

### 4.1 The Core Wrapper (`sfFetch`)
```typescript
const sfFetch = async <T>(url: string, options?: any, session?: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'sfApiFetch', url, method: options?.method, body: options?.body, session },
      (res) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (res && res.error) return reject(new Error(res.error));
        resolve(res.data as T);
      }
    );
  });
};
```

### 4.2 Composite API for Bulk Metadata (`getRecordsWithDetails`)
Fetching records via SOQL only returns the raw values. To provide a rich UI, SmartKit needs the field metadata (Label, Type, Picklist Values, Inline Help Text). 

Instead of making 100 separate describe calls, the `SalesforceApi` leverages the **Salesforce Composite API** to batch up to 25 `/services/data/v60.0/sobjects/ObjectName/describe` requests into a single HTTP POST.

### 4.3 Identity API Fallback
The standard Salesforce REST API doesn't have an endpoint specifically designed to just say "Who am I and what org is this?". The standard Identity API URL is returned dynamically upon login, but SmartKit connects via hijacked Session IDs, meaning it doesn't know the Identity URL.

To get the Org Name and User details, the API wrapper uses a clever workaround: querying the Chatter Users API (`/services/data/v60.0/chatter/users/me`), which provides robust user context without needing the formal Identity URL.

## 5. UI State Management (`App.tsx`)

The root `App.tsx` component is responsible for orchestrating the overall state. It handles:
1.  **Bootstrapping:** Calling `chrome.runtime.sendMessage({ action: 'getSession' })`.
2.  **Context Management:** Storing the `activeSession`, `sessions` (for multi-org switching), and the `activeTab` (Records, Data, Import, etc.).
3.  **Cross-Tab Persistence:** State is preserved when navigating between tabs. For example, the SOQL query in the Data Tab is not lost when switching to the Records Tab, because the state is hoisted to the component level or persisted via `chrome.storage.local`.

## 6. Context Switching: The "Open Full App" Protocol

When a user is viewing SmartKit in the Side Panel or the floating Content Script UI, they may want more screen real estate. The extension allows "popping out" into a full tab.

The protocol (`openFullApp` in `background.ts`) is highly sophisticated to prevent opening multiple redundant tabs:
1.  It queries all Chrome tabs to find existing `index.html` extension pages.
2.  It uses `chrome.tabs.sendMessage(t.id, { action: 'getActiveSession' })` to interrogate existing tabs about which Org they are currently logged into.
3.  If an existing tab matches the **same Chrome Window**, **same Host**, and **same Session ID**, it focuses that tab.
4.  Otherwise, it saves the desired context to `chrome.storage.local` and creates a new tab, ensuring the new tab boots up connected to the correct org.
