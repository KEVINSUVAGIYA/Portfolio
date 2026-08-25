import type { Metadata } from "next";
import { SalesforceSmartKitPage } from "./SalesforceSmartKitPage";
import { BASE_PATH } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Salesforce SmartKit — The Ultimate Admin Extension",
    description: "Turn Salesforce into a state-of-the-art workspace with a SOQL IDE, SmartEdit, and Command Palette with Salesforce SmartKit.",
    keywords: ["Salesforce", "SmartKit", "Chrome Extension", "Admin", "SOQL IDE", "SmartEdit"],
    openGraph: {
        title: "Salesforce SmartKit — The Ultimate Admin Extension",
        description: "Turn Salesforce into a state-of-the-art workspace with a SOQL IDE, SmartEdit, and Command Palette with Salesforce SmartKit.",
        url: "/products/salesforcesmartkit",
        type: "website",
        images: [
            {
                url: `${BASE_PATH}/products/salesforcesmartkit-logo.png`,
                alt: "Salesforce SmartKit Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Salesforce SmartKit — The Ultimate Admin Extension",
        description: "Turn Salesforce into a state-of-the-art workspace with a SOQL IDE, SmartEdit, and Command Palette with Salesforce SmartKit.",
        images: [`${BASE_PATH}/products/salesforcesmartkit-logo.png`],
    },
};

export default function page() {
    return <SalesforceSmartKitPage />;
}

