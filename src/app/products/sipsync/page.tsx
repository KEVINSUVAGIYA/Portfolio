import type { Metadata } from "next";
import { SipSyncContent } from "./SipSyncPage";
import { BASE_PATH } from "@/lib/constants";

export const metadata: Metadata = {
    title: "SipSync — Water Reminder & Hydration Tracker",
    description: "Stay hydrated with SipSync, a beautiful Chrome Extension that reminds you to drink water with smart notifications and celebrates your goals.",
    keywords: ["SipSync", "Water Reminder", "Hydration Tracker", "Chrome Extension", "Health App", "Productivity Tool"],
    openGraph: {
        title: "SipSync — Water Reminder & Hydration Tracker",
        description: "Stay hydrated with SipSync, a beautiful Chrome Extension that reminds you to drink water with smart notifications.",
        url: "/products/sipsync",
        type: "website",
        images: [
            {
                url: `${BASE_PATH}/products/sipsync-logo.png`,
                alt: "SipSync Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "SipSync — Water Reminder & Hydration Tracker",
        description: "Stay hydrated with SipSync, a beautiful Chrome Extension that reminds you to drink water with smart notifications.",
        images: [`${BASE_PATH}/products/sipsync-logo.png`],
    },
};

export default function page() {
    return <SipSyncContent />;
}
