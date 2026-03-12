import type { Metadata } from "next";
import { SipSyncContent } from "./SipSyncPage";

export const metadata: Metadata = {
    title: "SipSync — Water Reminder & Hydration Tracker",
    description: "Stay hydrated with SipSync, a beautiful Chrome Extension that reminds you to drink water with smart notifications and celebrates your goals.",
    keywords: ["SipSync", "Water Reminder", "Hydration Tracker", "Chrome Extension", "Health App", "Productivity Tool"],
    openGraph: {
        title: "SipSync — Water Reminder & Hydration Tracker",
        description: "Stay hydrated with SipSync, a beautiful Chrome Extension that reminds you to drink water with smart notifications.",
        type: "website",
    }
};

export default function page() {
    return <SipSyncContent />;
}
