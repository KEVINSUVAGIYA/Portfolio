import type { Metadata } from "next";
import { SalesforceSmartKitPage } from "./SalesforceSmartKitPage";

export const metadata: Metadata = {
    title: "Salesforce SmartKit — The Ultimate Admin Extension",
    description: "Turn Salesforce into a state-of-the-art workspace with a SOQL IDE, SmartEdit, and Command Palette with Salesforce SmartKit.",
    keywords: ["Salesforce", "SmartKit", "Chrome Extension", "Admin", "SOQL IDE", "SmartEdit"],
    openGraph: {
        title: "Salesforce SmartKit — The Ultimate Admin Extension",
        description: "Turn Salesforce into a state-of-the-art workspace with a SOQL IDE, SmartEdit, and Command Palette with Salesforce SmartKit.",
        type: "website",
    }
};

export default function page() {
    return <SalesforceSmartKitPage />;
}
