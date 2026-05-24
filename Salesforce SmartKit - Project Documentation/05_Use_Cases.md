# Salesforce SmartKit: Real-World Use Cases

The Salesforce SmartKit is designed to save administrators and developers hours of tedious clicking. This document outlines common real-world scenarios and how the SmartKit drastically accelerates them.

## Use Case 1: The "Why is this field blank?" Investigation

**The Scenario:** A user complains that the "Total Pipeline" field on an Account is blank, but it shouldn't be. 

**The Old Way (Salesforce Standard):**
1. Click the gear icon > Setup.
2. Wait for Setup to load.
3. Go to Object Manager > Account.
4. Go to Fields & Relationships.
5. Search for "Total Pipeline".
6. Click the field to see if it's a Formula or Rollup Summary.
7. Discover it's a Rollup Summary. Read the filter criteria.
8. Go back to the Account record to see why child Opportunities don't match the criteria.
*Time: ~3 minutes.*

**The SmartKit Way:**
1. Open SmartKit.
2. Go to the Records tab and view the Account.
3. Hover your mouse over the "Total Pipeline" column header.
4. The Smart Tooltip instantly appears, showing the exact Rollup Summary calculation and filter criteria.
*Time: ~5 seconds.*

## Use Case 2: Mass Updating Picklist Values Across Records

**The Scenario:** You need to change the "Lead Source" from "Web" to "Organic Search" for 50 recent Leads.

**The Old Way (Salesforce Standard):**
1. Create a new List View.
2. Filter for the 50 Leads.
3. Ensure the List View has no conflicting record types so Inline Editing works.
4. Check the boxes, double click the field, select "Update 50 selected items", and save.
*Time: ~2-4 minutes.*

**The SmartKit Way:**
1. Open SmartKit > Records Tab.
2. Select "Lead".
3. Use the built-in inline editing. Change the first row's picklist to "Organic Search".
4. Use standard Excel-like drag-to-copy (or rapidly tab through rows) to update the cells.
5. Click "Save Changes". All 50 records update instantly via the bulkified REST API.
*Time: ~30 seconds.*

## Use Case 3: Extracting Deeply Nested Relational Data

**The Scenario:** Marketing needs a CSV of all Opportunities, including the related Account Name, and the Account Owner's Email address.

**The Old Way (Salesforce Standard):**
1. Build a custom Salesforce Report.
2. Select the "Opportunities with Accounts and Users" report type (if it exists, otherwise build a Custom Report Type first).
3. Drag the columns in.
4. Run the report.
5. Click Export > Details Only > CSV.
*Time: ~5-10 minutes.*

**The SmartKit Way:**
1. Open SmartKit > Data Tab.
2. Write a quick SOQL query: 
   `SELECT Id, Name, Account.Name, Account.Owner.Email FROM Opportunity`
3. Hit `Cmd+Enter`.
4. Click "Export CSV". The SmartKit automatically flattens the `Account.Owner.Email` JSON node into a standard CSV column.
*Time: ~15 seconds.*

## Use Case 4: The "What is the API Name of this thing?" Dilemma

**The Scenario:** You are writing an Apex trigger and need the exact API names for five different fields on a complex Custom Object page layout.

**The Old Way (Salesforce Standard):**
1. Open the Setup menu in a new tab.
2. Navigate to Object Manager.
3. Find the object.
4. Find the Fields section.
5. Cross-reference the UI labels with the API names one by one.
*Time: ~2 minutes.*

**The SmartKit Way:**
1. On the Salesforce record page, click the floating SmartKit widget.
2. Click "Show API Names".
3. Red text instantly appears next to every field on the page, showing the exact `Custom_Field__c` API names directly in the UI.
*Time: ~2 seconds.*

## Use Case 5: The "Lightning Setup is Too Slow" Frustration

**The Scenario:** You need to quickly check the organization's Login IP Ranges, then immediately check a specific User's Profile permissions.

**The Old Way (Salesforce Standard):**
1. Open Setup.
2. Type "Network Access" in the slow Quick Find box. Click it.
3. Type "Profiles" in the Quick Find box. Click it.
4. Wait for the massive list of Profiles to load.
*Time: ~1-2 minutes.*

**The SmartKit Way:**
1. Hit `Cmd+Shift+P` anywhere to open the SmartKit Command Palette.
2. Type "Net". Hit Enter. (New tab opens to Network Access).
3. Hit `Cmd+Shift+P` again. Type "Prof". Hit Enter. (New tab opens to Profiles).
*Time: ~5 seconds.*
