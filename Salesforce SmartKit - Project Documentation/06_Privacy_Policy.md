# Privacy Policy for Salesforce SmartKit

**Last Updated: May 24, 2026**

This Privacy Policy describes how the Salesforce SmartKit Chrome Extension ("the Extension") handles your data. The core philosophy of this extension is absolute data minimization and local processing.

## 1. What Data Do We Collect?
**We collect absolutely nothing.**
The Salesforce SmartKit does not have a backend server, database, or analytics tracking mechanism. 
- We do not track your usage.
- We do not log the queries you write.
- We do not collect your personal information or your Salesforce organization's data.

## 2. How Does the Extension Work Without Collecting Data?
The extension acts solely as a local conduit between your Chrome Browser and your active Salesforce instance.

### 2.1 Session IDs (Cookies)
To make API calls on your behalf, the extension reads your active Salesforce Session ID (`sid` cookie) from your browser. 
- **Where is it stored?** This Session ID is stored exclusively in your browser's local memory (`chrome.storage.local`).
- **Where is it sent?** It is only ever sent directly to Salesforce's official API endpoints (e.g., `https://your-org.my.salesforce.com/services/data/...`). It is never transmitted to any third-party server.
- **When is it deleted?** The session data is ephemeral. When you log out of Salesforce, the session expires on Salesforce's servers, rendering the local token useless.

### 2.2 Local Storage
The extension uses `chrome.storage.local` to save your UI preferences:
- Your active Tab selection.
- Your preferred theme (if applicable).
- Draft SOQL queries you are currently writing.
This data never leaves your local machine.

## 3. Permissions Justification
When installing the extension, Chrome will warn you that it requests broad permissions. Here is why those specific permissions are required strictly for functionality:

*   **`*://*.force.com/*` & `*://*.salesforce.com/*`**: Required to make Cross-Origin (CORS) API requests to Salesforce. Without this, the extension cannot fetch data or save your inline edits.
*   **`cookies`**: Required to locate your active Salesforce Session ID so you don't have to manually log in to the extension.
*   **`storage`**: Required to save your settings and draft SOQL queries locally.
*   **`scripting` & `activeTab`**: Required to inject the floating "SmartKit" button and the "Show API Names" red text directly into the Salesforce web page you are viewing.

## 4. Third-Party Services
The extension does not embed any third-party tracking scripts. 
The extension does embed the open-source **Monaco Editor** for SOQL highlighting, but this is bundled locally within the extension files and does not "phone home" to Microsoft.

## 5. Security Recommendations for Users
Because the extension has access to your Salesforce session:
1. Ensure your physical machine is secure.
2. Only install the extension from the official Chrome Web Store.
3. If you suspect your browser is compromised, log out of Salesforce immediately, which invalidates the Session ID.

## 6. Contact
For questions regarding this privacy policy or the source code, please review the public GitHub repository associated with this project.
